"""Browser behaviour tests (Chromium). Prints PASS/FAIL per check; exit 1 on any failure."""
import pathlib, sys
from playwright.sync_api import sync_playwright
url = (pathlib.Path.cwd() / "index.html").as_uri(); res = []
def chk(name, ok, extra=""): res.append(ok); print(("PASS " if ok else "FAIL ") + name, extra)
cur = lambda pg: pg.evaluate("Deck.nav.current()+1")
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1280, "height": 720}); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    pg.goto(url); pg.wait_for_timeout(400)
    chk("starts on slide 1, counter 01 / 13", cur(pg) == 1 and pg.inner_text("#counter").replace("\n", "") .strip() == "01 / 13")
    pg.keyboard.press("ArrowRight"); pg.wait_for_timeout(100); chk("ArrowRight -> 2", cur(pg) == 2)
    pg.keyboard.press("ArrowLeft"); pg.wait_for_timeout(100); chk("ArrowLeft -> 1", cur(pg) == 1)
    pg.keyboard.press("End"); chk("End -> 13", cur(pg) == 13); pg.keyboard.press("Home"); chk("Home -> 1", cur(pg) == 1)
    pg.keyboard.press("ArrowLeft"); chk("no wrap past first slide", cur(pg) == 1)
    for _ in range(5): pg.keyboard.press("ArrowRight")                      # rapid presses: must not skip
    chk("5 rapid presses -> exactly slide 6", cur(pg) == 6)
    pg.keyboard.press("PageUp"); chk("PageUp -> 5", cur(pg) == 5)
    pg.evaluate("Deck.nav.go(12)"); pg.wait_for_timeout(700); pg.click("#annot-t"); pg.keyboard.type("hello"); pg.keyboard.press("ArrowLeft"); pg.keyboard.press("Home")
    chk("typing in textarea does not navigate", cur(pg) == 13 and pg.input_value("#annot-t") == "hello")
    pg.evaluate("document.activeElement.blur()"); pg.evaluate("Deck.nav.go(1)"); pg.wait_for_timeout(700)
    pg.click('#slide-2 a[data-go="8"]'); pg.wait_for_timeout(300); chk("index link 06 -> slide 8 (Amenities)", cur(pg) == 8 and pg.evaluate("location.hash") == "#8")
    pg.keyboard.press("o"); pg.wait_for_timeout(400); chk("overview opens (o)", pg.is_visible("#overview") and pg.get_attribute("#btn-overview", "aria-expanded") == "true")
    pg.keyboard.press("Escape"); pg.wait_for_timeout(450); chk("Esc closes overview", not pg.is_visible("#overview"))
    pg.click("#btn-overview"); pg.wait_for_timeout(350); pg.click('.ov-item[data-go="11"]'); pg.wait_for_timeout(500)
    chk("overview item -> slide 11 and drawer closes", cur(pg) == 11 and not pg.is_visible("#overview"))
    chk("aria-current marks slide 11", pg.get_attribute('.ov-item[data-go="11"]', "aria-current") == "true")
    chk("progress bar tracks position", abs(float(pg.evaluate("getComputedStyle(document.querySelector('.progress i')).transform.split(',')[0].replace('matrix(','')")) - 10/12) < .02)
    chk("inactive slides inert + aria-hidden", pg.evaluate("[...document.querySelectorAll('.slide:not(.is-active):not(.is-leaving)')].every(s=>s.inert&&s.getAttribute('aria-hidden')==='true')"))
    pg.click("#btn-home"); pg.wait_for_timeout(200); chk("restart button -> cover", cur(pg) == 1)
    pg.goto(url + "#7"); pg.reload(); pg.wait_for_timeout(300); chk("deep link #7 opens slide 7", cur(pg) == 7)
    # entrance replay on revisit
    pg.evaluate("Deck.nav.go(2)"); pg.wait_for_timeout(1200); o1 = pg.evaluate("getComputedStyle(document.querySelector('#slide-3 [data-r]')).opacity")
    pg.evaluate("Deck.nav.go(5)"); pg.wait_for_timeout(1200); pg.evaluate("Deck.nav.go(2)"); pg.wait_for_timeout(1200)
    chk("revisit shows content (opacity 1)", o1 == "1" and pg.evaluate("getComputedStyle(document.querySelector('#slide-3 [data-r]')).opacity") == "1")
    chk("exactly one active slide", pg.evaluate("document.querySelectorAll('.slide.is-active').length") == 1)
    # swipe via touch events on a mobile context
    m = b.new_context(viewport={"width": 390, "height": 780}, has_touch=True, is_mobile=True); mp = m.new_page(); mp.goto(url); mp.wait_for_timeout(300)
    mp.evaluate("""()=>{const d=document.getElementById('deck');const mk=(t,x)=>new TouchEvent(t,{bubbles:true,changedTouches:[new Touch({identifier:1,target:d,clientX:x,clientY:300})],touches:t==='touchend'?[]:[new Touch({identifier:1,target:d,clientX:x,clientY:300})]});d.dispatchEvent(mk('touchstart',300));d.dispatchEvent(mk('touchend',120));}""")
    mp.wait_for_timeout(200); chk("swipe left -> next slide (touch)", cur(mp) == 2)
    chk("mobile: no horizontal page scroll", mp.evaluate("document.documentElement.scrollWidth<=window.innerWidth+1"))
    m.close()
    # reduced motion
    r = b.new_context(viewport={"width": 1280, "height": 720}, reduced_motion="reduce"); rp = r.new_page(); rp.goto(url); rp.wait_for_timeout(300); rp.keyboard.press("ArrowRight"); rp.wait_for_timeout(400)
    chk("reduced motion: no transform on slide, content visible", rp.evaluate("getComputedStyle(document.querySelector('#slide-2')).transform")=="none" and rp.evaluate("getComputedStyle(document.querySelector('#slide-2 [data-r]')).opacity")=="1")
    r.close()
    # keyboard focus visible
    pg.goto(url); pg.wait_for_timeout(300); pg.keyboard.press("Tab"); pg.keyboard.press("Tab")
    chk("focus indicator is drawn on tabbed control", "3px" in pg.evaluate("getComputedStyle(document.activeElement).outlineWidth") )
    # print layout clip check
    pg.emulate_media(media="print"); pg.wait_for_timeout(200)
    bad = pg.evaluate("[...document.querySelectorAll('.slide')].map(s=>[s.dataset.n,s.scrollHeight,s.clientHeight]).filter(a=>a[1]>a[2]+1)")
    chk("print: no slide content clipped at 7.5in", not bad, str(bad))
    chk("no JS/console errors", not errs, str(errs)); b.close()
sys.exit(0 if all(res) else 1)
