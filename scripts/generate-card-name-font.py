"""Generate self-contained SVG glyphs. Requires fonttools; font license sits beside the TTF."""
import json
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

root = Path(__file__).resolve().parents[1]
font = TTFont(root / 'public/fonts/chakra-petch/ChakraPetch-SemiBold.ttf')
glyph_set = font.getGlyphSet()
glyphs = {}
for code, name in sorted(font.getBestCmap().items()):
    char = chr(code)
    if not (32 <= code <= 90 or (char.isupper() and (code < 0x250 or 0x1E00 <= code <= 0x1EFF))):
        continue
    pen = SVGPathPen(glyph_set)
    glyph_set[name].draw(pen)
    glyphs[char] = {'advance': font['hmtx'][name][0], 'path': pen.getCommands()}
result = {'font': 'Chakra Petch SemiBold', 'unitsPerEm': font['head'].unitsPerEm, 'glyphs': glyphs}
(root / 'src/shared/assets/card-name-glyphs.json').write_text(json.dumps(result, ensure_ascii=False, separators=(',', ':')) + '\n')
print(f'Generated {len(glyphs)} glyphs')
