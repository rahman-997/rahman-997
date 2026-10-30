"""Tests for the stdlib SVG validator, using deliberately bad examples."""

import importlib.util
from pathlib import Path
import unittest

module_path = Path(__file__).resolve().parent.parent / 'scripts' / 'verify-svg.py'
spec = importlib.util.spec_from_file_location('verify_svg', module_path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def svg(body='', attrs='aria-label="Example" viewBox="0 0 300 150"'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" {attrs}>{body}</svg>'


class SvgValidatorTests(unittest.TestCase):
    def test_valid_accessible_illustration(self):
        module.validate_svg_content(svg('<rect width="20" height="20"/>'))

    def test_missing_accessible_label_rejected(self):
        with self.assertRaisesRegex(ValueError, 'accessible label'):
            module.validate_svg_content(svg(attrs='viewBox="0 0 300 150"'))

    def test_external_resource_rejected(self):
        with self.assertRaisesRegex(ValueError, 'external'):
            module.validate_svg_content(svg('<image href="https://example.com/tracker.png" />'))

    def test_inline_script_rejected(self):
        with self.assertRaisesRegex(ValueError, 'Unsafe SVG'):
            module.validate_svg_content(svg('<script>0</script>'))

    def test_invalid_xml_rejected(self):
        with self.assertRaisesRegex(ValueError, 'well-formed'):
            module.validate_svg_content('<svg>')

    def test_external_css_url_rejected(self):
        with self.assertRaisesRegex(ValueError, 'external'):
            module.validate_svg_content(svg('<rect style="fill:url(https://example.com/x.svg)" />'))

    def test_external_stylesheet_import_rejected(self):
        with self.assertRaisesRegex(ValueError, 'external'):
            module.validate_svg_content(svg('<style>@import url(https://example.com/x.css);</style>'))

    def test_local_gradient_reference_permitted(self):
        module.validate_svg_content(svg('<defs><linearGradient id="local-gradient" /></defs><rect fill="url(#local-gradient)" />'))

    def test_missing_local_gradient_target_rejected(self):
        with self.assertRaisesRegex(ValueError, 'missing resource'):
            module.validate_svg_content(svg('<rect fill="url(#not-defined)" />'))

    def test_duplicate_svg_ids_rejected(self):
        with self.assertRaisesRegex(ValueError, 'Duplicate'):
            module.validate_svg_content(svg('<defs><linearGradient id="shared" /><linearGradient id="shared" /></defs>'))

    def test_invalid_accessible_description_target_rejected(self):
        with self.assertRaisesRegex(ValueError, 'labelledby'):
            module.validate_svg_content(svg(attrs='viewBox="0 0 300 150" aria-labelledby="missing"'))

    def test_nan_viewbox_rejected(self):
        with self.assertRaisesRegex(ValueError, 'finite'):
            module.validate_svg_content(svg(attrs='aria-label="Invalid" viewBox="0 0 NaN 150"'))

    def test_infinite_viewbox_rejected(self):
        with self.assertRaisesRegex(ValueError, 'finite'):
            module.validate_svg_content(svg(attrs='aria-label="Invalid" viewBox="0 0 inf 150"'))

    def test_infinite_viewbox_origin_rejected(self):
        with self.assertRaisesRegex(ValueError, 'finite'):
            module.validate_svg_content(svg(attrs='aria-label="Invalid" viewBox="inf 0 300 150"'))

    def test_non_numeric_viewbox_origin_rejected(self):
        with self.assertRaisesRegex(ValueError, 'finite'):
            module.validate_svg_content(svg(attrs='aria-label="Invalid" viewBox="NaN 0 300 150"'))

    def test_all_shipped_svgs_pass(self):
        files = list((module.ROOT / 'assets').glob('*.svg'))
        expected = {'hero.svg', 'hero-mobile.svg', 'architecture.svg', 'delivery.svg',
                    'quality-gates.svg', 'inclusive-ux.svg'}
        self.assertTrue(expected.issubset({file.name for file in files}))
        self.assertGreaterEqual(len(files), len(expected))
        for path in files:
            with self.subTest(path=path.name):
                module.validate_svg_content(path.read_text(encoding='utf-8'))


if __name__ == '__main__':
    unittest.main()
