# Localizations - RTL Language Support

This directory contains all localization files and documentation for the CNCF Cloud Native Landscape, with comprehensive support for right-to-left (RTL) languages.

## Overview

The landscape now supports full localization with RTL (right-to-left) language support, including:
- **Multiple languages**: English, Persian, and extensible framework for more languages
- **Category translations**: Translated category names in localized languages
- **Subcategory translations**: Translated subcategory names matching the English landscape
- **RTL headings**: Proper text alignment and display for RTL languages
- **CSS styling**: Complete RTL stylesheet for proper layout and text rendering
- **Bidirectional text**: Proper handling of mixed LTR/RTL content

## Directory Structure

```
localizations/
├── README.md                          # This file
├── fa.json                           # Persian localization (RTL)
├── LOCALIZATION_SCHEMA.md            # JSON schema and structure documentation
├── RTL_IMPLEMENTATION_GUIDE.md       # Detailed RTL implementation guide
├── rtl-styles.css                    # Complete RTL CSS stylesheet
├── example-rtl-template.html         # Example HTML template with localization
└── [other language files]             # (future: es.json, ar.json, he.json, etc.)
```

## Files Description

### fa.json (Persian Localization)

**Status**: ✅ Complete  
**Language**: Persian (فارسی)  
**Script**: Farsi (Persian Arabic Script)  
**Direction**: RTL (Right-to-Left)

Contains:
- Metadata: Language configuration, direction, alignment settings
- Categories: Translations for all 11 CNCF landscape categories
- Subcategories: Translations for all landscape subcategories

**Example**:
```json
{
  "metadata": {
    "language": "fa",
    "languageName": "Persian",
    "dir": "rtl",
    "textAlign": "right",
    "version": "1.0.0"
  },
  "categories": {
    "Provisioning": {
      "name": "تهیه و فراهم‌سازی",
      "dir": "rtl"
    }
  },
  "subcategories": {
    "Automation & Configuration": {
      "name": "اتوماسیون و پیکربندی",
      "dir": "rtl"
    }
  }
}
```

### LOCALIZATION_SCHEMA.md

Comprehensive documentation of:
- JSON schema structure and format
- Required and optional fields
- Translation guidelines
- RTL language considerations
- Implementation examples
- Contributing guidelines for new languages

**Use this file when**:
- Adding support for a new language
- Understanding the localization data structure
- Reviewing localization quality

### RTL_IMPLEMENTATION_GUIDE.md

Complete implementation guide for developers, including:
- **Overview**: What RTL support includes
- **Key changes**: Configuration and structure modifications
- **Implementation steps**: Backend and frontend code examples
- **Heading rendering**: Specific guidance for translating and aligning headings
- **CSS stylesheet**: How to apply RTL styling
- **Adding new languages**: Step-by-step guide
- **Testing procedures**: How to verify RTL implementation
- **Common issues**: Troubleshooting RTL problems
- **Performance considerations**: Optimization tips
- **Accessibility**: Making RTL content accessible
- **References**: Links to W3C and Unicode standards

**Use this file when**:
- Implementing RTL support in the landscape rendering system
- Understanding how to handle bidirectional text
- Debugging RTL display issues

### rtl-styles.css

Complete CSS stylesheet with:
- **Base RTL styling**: Document and layout RTL support
- **Heading alignment**: Right-aligned headings with proper bidirectional handling
- **Text content**: Paragraph and semantic element RTL styling
- **Lists**: Proper list marker positioning for RTL
- **Layout components**: Navigation, sidebar, grid, flex adjustments
- **UI controls**: Buttons, forms, search, filters
- **Tables**: Table cell alignment for RTL
- **Responsive design**: Mobile RTL adjustments
- **Typography**: Font selection for RTL languages
- **Utilities**: Helper classes for RTL styling
- **Animations**: Transition support for RTL
- **Dark mode**: Theme support for RTL
- **Print styles**: Print-friendly RTL styling

**Use this file by**:
- Including in your HTML: `<link rel="stylesheet" href="localizations/rtl-styles.css">`
- Utilizing provided CSS classes
- Extending for additional RTL needs

### example-rtl-template.html

Interactive example showing:
- Language selector dropdown
- Landscape data rendering with localization
- Real-time RTL mode switching
- Metadata display (language, direction, code)
- Proper heading alignment with `dir` attribute
- CSS class application for RTL
- JavaScript implementation for localization loading and rendering
- Sample landscape categories and subcategories

**Use this file to**:
- Understand how to implement localization in HTML/JavaScript
- Test RTL functionality locally
- Learn proper handling of the `dir` attribute
- See examples of heading translation and alignment

## Currently Supported Languages

| Language | Code | Direction | File | Status |
|----------|------|-----------|------|--------|
| English | en | LTR | Built-in | ✅ |
| Persian | fa | RTL | fa.json | ✅ |

## Quick Start

### For Users (Testing RTL)

1. **Load the landscape page** with language selector set to Persian
2. **Observe** category and subcategory headings are right-aligned
3. **Check** that layout elements are mirrored appropriately
4. **Verify** text content flows from right to left

### For Developers (Implementing RTL)

1. **Load localization**:
   ```javascript
   const response = await fetch('localizations/fa.json');
   const localization = await response.json();
   ```

2. **Set document direction**:
   ```javascript
   document.documentElement.dir = localization.metadata.dir;  // 'rtl'
   ```

3. **Translate headings**:
   ```javascript
   const translatedName = localization.categories['Provisioning'].name;
   ```

4. **Apply heading styling**:
   ```html
   <h1 dir="rtl" style="text-align: right;">{{ translatedName }}</h1>
   ```

5. **Include RTL stylesheet**:
   ```html
   <link rel="stylesheet" href="localizations/rtl-styles.css">
   ```

## Adding a New Language

### 1. Create Localization File

Create a file named `{lang_code}.json` (e.g., `ar.json` for Arabic):

```json
{
  "metadata": {
    "language": "ar",
    "languageName": "Arabic",
    "dir": "rtl",
    "textAlign": "right",
    "version": "1.0.0",
    "description": "Arabic localization for CNCF Cloud Native Landscape"
  },
  "categories": {
    "Provisioning": {
      "name": "[Arabic translation]",
      "dir": "rtl"
    }
    // ... more categories
  },
  "subcategories": {
    "Automation & Configuration": {
      "name": "[Arabic translation]",
      "dir": "rtl"
    }
    // ... more subcategories
  }
}
```

### 2. Update landscape.yml

Add the language to the `localization.languages` section:

```yaml
localization:
  languages:
    - code: ar
      name: Arabic
      dir: rtl
      textAlign: right
      enabled: true
      localizationFile: localizations/ar.json
```

### 3. Translate Content

Ensure all entries in the JSON file are translated (see LOCALIZATION_SCHEMA.md for complete list).

### 4. Test

Use the example template or your rendering system to verify:
- Headings are right-aligned
- Text flows properly
- No layout issues

### 5. Submit PR

Include:
- New localization file (`XX.json`)
- Updated `landscape.yml` with language entry
- PR description with translation notes

## RTL Implementation Checklist

- [ ] Localization file created (`XX.json`)
- [ ] Metadata correctly specifies `dir: rtl` and `textAlign: right`
- [ ] All categories translated
- [ ] All subcategories translated
- [ ] landscape.yml updated with language entry
- [ ] HTML includes `dir="rtl"` on headings
- [ ] CSS stylesheet included (rtl-styles.css)
- [ ] Headings have `text-align: right` style
- [ ] Headings have `unicode-bidi: isolate` for proper text handling
- [ ] Tested in browser with RTL mode enabled
- [ ] No layout shifts or overflow issues
- [ ] Elements properly mirrored (borders, margins, etc.)

## Heading Translation and Alignment - Key Points

### Critical for Proper RTL Display

1. **HTML Attribute**: `dir="rtl"` must be set on each heading
2. **CSS Alignment**: `text-align: right` for right alignment
3. **CSS Direction**: `direction: rtl` for proper text direction
4. **Bidirectional Handling**: `unicode-bidi: isolate` for mixed LTR/RTL
5. **Localization**: Use translated text from localization file

### Example

```html
<!-- English (LTR) -->
<h1 dir="ltr" style="text-align: left;">Provisioning</h1>

<!-- Persian (RTL) -->
<h1 dir="rtl" style="text-align: right;">تهیه و فراهم‌سازی</h1>
```

## Performance Tips

1. **Lazy load** localization files only for active languages
2. **Cache** translations in browser storage
3. **Minimize CSS** - use CSS variables for RTL adjustments
4. **Batch DOM updates** when translating multiple headings
5. **Use CSS transforms** instead of layout changes where possible

## Accessibility (a11y)

- Always set `lang` attribute on `<html>`
- Use `dir` attribute semantically (not just for styling)
- Test with screen readers
- Ensure sufficient color contrast in RTL mode
- Include ARIA labels where appropriate

## Testing RTL Functionality

### Browser DevTools

```javascript
// Quick RTL test in console
document.documentElement.dir = 'rtl';
document.documentElement.lang = 'fa';
```

### Automated Testing

Check that headings have:
- `dir="rtl"` attribute ✓
- `text-align: right` CSS ✓
- Visible on page ✓
- Proper alignment (not cut off) ✓

### Visual Testing

- Load landscape page with Persian language
- Scroll through all categories (Provisioning, Runtime, Platform, etc.)
- Verify each heading is right-aligned
- Check for text overflow or layout issues
- Test on mobile and desktop

## Common Issues

| Issue | Solution |
|-------|----------|
| Headings not right-aligned | Ensure `text-align: right` CSS is applied |
| Line breaks in headings | Add `unicode-bidi: isolate` |
| Layout not mirrored | Include `rtl-styles.css` or add RTL CSS rules |
| English mixed with Persian not displaying correctly | Use `unicode-bidi: isolate` |
| Numbers appear backwards | Add `unicode-bidi: bidi-override` or use `<bdo>` tag |

## Contributing Translations

We welcome translations for additional RTL and LTR languages!

### Requirements

- Native or fluent speaker of the target language
- Familiarity with cloud-native terminology
- Valid JSON format
- All categories and subcategories translated
- Testing in a browser to verify RTL display

### Process

1. Fork the repository
2. Create a new localization file
3. Update landscape.yml
4. Test thoroughly
5. Submit a pull request with:
   - Description of translations
   - Any notes on terminology choices
   - Screenshots of RTL display (for RTL languages)

## References

- [W3C: Structural markup and right-to-left text in HTML](https://www.w3.org/International/questions/qa-html-dir)
- [MDN: HTML `dir` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir)
- [MDN: CSS `direction` property](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)
- [Unicode Bidirectional Algorithm](https://www.unicode.org/reports/tr9/)
- [CLDR: Plurals and Direction](https://cldr.unicode.org/)

## Support

For questions or issues related to localization and RTL support:

1. Check this README and linked documentation
2. See RTL_IMPLEMENTATION_GUIDE.md for detailed guidance
3. Review LOCALIZATION_SCHEMA.md for structure
4. Test using example-rtl-template.html
5. Open an issue in the repository

## License

All localization files and documentation are provided under the same license as the CNCF Landscape project.

---

**Last Updated**: March 2026  
**Persian Localization**: Complete (v1.0.0)  
**RTL Support**: Fully implemented  
