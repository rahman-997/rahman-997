# RTL and accessibility · multilingual QA field checklist

[Back to profile](../README.md) · [Reviewer guide](./REVIEWER_START_HERE.md)

**Scope:** practical manual review guidance, not an accessibility certification. [Mizan Finance](https://github.com/rahman-997/mizan-finance) provides an English/Arabic RTL example. Persian samples here are review exercises; they do **not** imply the project ships in Persian.

## Language samples

- **العربية:** واجهة واضحة، أزرار مقروءة، وأرقام تظهر بالاتجاه الصحيح.
- **فارسی:** رابط کاربری خوانا، با چینش درست اعداد و نویسه‌های فارسی.
- **Türkçe:** Anlaşılır başlıklar, doğal metin ve erişilebilir etkileşimler.
- **English:** Labels should describe what an action actually does.

Persian-specific letters matter: **ی** and **ک** should not silently be replaced by Arabic lookalikes. Always inspect rendered glyph joining and punctuation, not just source text.

## Direction and mixed content

- [ ] Use a correct `lang` and `dir` for each passage; test mixed Arabic/Persian and English snippets.
- [ ] Keep code, URLs, dates, order numbers and currency amounts legible when adjacent to RTL text.
- [ ] Verify punctuation, brackets and negative numbers at the start and end of lines.
- [ ] Inspect truncation and line wrapping on narrow screens, especially 320px and 390px.
- [ ] Check fonts support both Arabic and Persian without disconnected glyphs or missing squares.

## Keyboard and assistive technology

- [ ] All interactive controls can be reached by keyboard in a predictable order.
- [ ] Focus remains visible after a dialog opens, after validation fails, and after navigation.
- [ ] Icon-only controls have meaningful accessible names in the active language.
- [ ] Inline errors are identified to the user, not conveyed only by color.
- [ ] Zoom and reduced-motion preferences are respected when feasible.
- [ ] Test with at least one real screen reader and keyboard; screenshot inspection alone cannot demonstrate support.

## Sample acceptance checks

**Budget form:** Given an Arabic interface, when a user enters an invalid amount, the field and error description should remain readable and keyboard accessible. Given a Persian paragraph next to `2026/10/29`, the date should remain in the intended order.

**Responsive header:** Given a narrow viewport, navigation and project cards should not force horizontal scrolling. Given zoomed text, links should still have discernible labels and usable focus.

Record a screenshot, viewport width, browser, language selection, issue and reproducible steps for every failure. For related source, see [Mizan Finance](https://github.com/rahman-997/mizan-finance) and the [project field guides](./PROJECT_FIELD_GUIDES.md).
