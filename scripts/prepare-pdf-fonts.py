"""Regenerate committed print font instances: pip install fonttools brotli."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parent.parent / 'static' / 'fonts'
for source, weight, target in [
    ('dm-sans', 400, 'dm-sans-print-regular'),
    ('dm-sans', 700, 'dm-sans-print-bold'),
    ('manrope', 700, 'manrope-print-bold'),
]:
    font = TTFont(root / (source + '.woff2'))
    if 'fvar' in font:
        axes = {axis.axisTag: weight if axis.axisTag == 'wght' else axis.defaultValue
                for axis in font['fvar'].axes}
        font = instantiateVariableFont(font, axes, inplace=True)
    font.flavor = None
    font.save(root / (target + '.ttf'))
