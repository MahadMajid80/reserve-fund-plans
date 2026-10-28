"""Redraw the Reserve Fund Plans logo (live site, RFP-WA-Logo-5-Oct-2018.png, 825x316) as an SVG with outlined text.
# Usage: python3 scripts/make-logo.py public/rfp-logo.svg   (then: node scripts/make-assets.mjs)
Fonts: TeX Gyre Pagella (Palatino clone) and TeX Gyre Bonum (Bookman clone), GUST Font Licence."""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

FD = "/usr/share/texmf/fonts/opentype/public/tex-gyre/"
fonts = {k: TTFont(FD + f) for k, f in {
    "pb": "texgyrepagella-bold.otf", "pr": "texgyrepagella-regular.otf", "bb": "texgyrebonum-bold.otf"}.items()}


def glyphs_for(font, text, smallcaps):
    cmap = font.getBestCmap(); order = set(font.getGlyphOrder()); out = []
    for ch in text:
        g = cmap.get(ord(ch))
        if g is None: out.append(None); continue
        if smallcaps and ch.islower():
            for cand in (g + ".sc", g + ".smcp", g.upper() + ".sc"):
                if cand in order: g = cand; break
            else: raise SystemExit(f"no small cap for {ch}")
        out.append(g)
    return out


def layout(fkey, text, size, tracking=0.0, smallcaps=False):
    font = fonts[fkey]; gs = font.getGlyphSet(); upm = font["head"].unitsPerEm; s = size / upm
    names = glyphs_for(font, text, smallcaps); x = 0.0; items = []
    for ch, g in zip(text, names):
        if g is None: continue
        items.append((g, x)); x += gs[g].width * s + tracking
    return items, x - tracking, s, gs


def text_path(fkey, text, size, cx, baseline, width=None, smallcaps=False):
    items, w, s, gs = layout(fkey, text, size, 0, smallcaps)
    tracking = 0.0
    if width is not None and len(items) > 1:
        tracking = (width - w) / (len(items) - 1)
        items, w, s, gs = layout(fkey, text, size, tracking, smallcaps)
    x0 = cx - w / 2; pen = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
    for g, x in items:
        gs[g].draw(TransformPen(pen, (s, 0, 0, -s, x0 + x, baseline)))
    return pen.getCommands()


# A black swan facing left, drawn in a 54 x 48 box: head and beak on top of a tall S-shaped neck, body with raised wing feathers.
SWAN_NECK = "M7.5 9 C10 1.6 23.4 1.4 23.2 11.4 C23 18.6 13.6 22.4 13.4 31"
SWAN_BODY = ("M10.4 31 C12.6 26 20 27.4 25.8 28.4 L28.8 18.4 L32 26.4 L35.2 15.2 L38.2 25.4 L42.2 13.6 L44.2 25.2 "
             "L49.4 16.8 L48.4 28 L53.6 25.6 C52.6 38.4 44.2 46.4 30.4 46.4 C18 46.4 9.4 40.4 10.4 31 Z")
SWAN_HEAD = "M3.2 9.6 A4.6 4.6 0 1 1 11.6 12.2 L6.6 12.6 L0 15.2 Z"


def swan(x, y, h):
    sc = h / 48
    return (f'<g transform="translate({x:.2f} {y:.2f}) scale({sc:.4f})" fill="#000">'
            f'<path d="{SWAN_NECK}" fill="none" stroke="#000" stroke-width="5.6" stroke-linecap="round"/>'
            f'<path d="{SWAN_BODY}"/><path d="{SWAN_HEAD}"/></g>')


Y = "#FFFF00"
W, H = 825, 316
parts = [
    f'<rect width="{W}" height="{H}" fill="#fff"/>',
    f'<rect x="4" y="4" width="{W-8}" height="248" fill="#000"/>',
    f'<path fill="{Y}" d="{text_path("pb", "Reserve Fund Plans", 82, W/2, 76, width=788, smallcaps=True)}" stroke="{Y}" stroke-width="1.6" stroke-linejoin="round"/>',
    f'<rect x="6" y="96" width="{W-12}" height="62" fill="{Y}"/>',
    swan(13, 101, 52), swan(W - 13 - 54 * 52 / 48, 101, 52),
    f'<path fill="#000" d="{text_path("pr", "Western Australia", 52, W/2, 146, width=486, smallcaps=True)}"/>',
    f'<path fill="{Y}" d="{text_path("bb", "1300 55 18 30", 70, W/2, 227, width=630)}"/>',
    f'<path fill="#000" d="{text_path("pr", "Specialists in Strata", 44, W/2, 299, width=668)}"/>',
]
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" '
       f'aria-label="Reserve Fund Plans, Western Australia, 1300 55 18 30, Specialists in Strata">'
       f'<title>Reserve Fund Plans</title>' + "".join(parts) + "</svg>\n")
open(sys.argv[1], "w").write(svg)
print(len(svg), "bytes")
