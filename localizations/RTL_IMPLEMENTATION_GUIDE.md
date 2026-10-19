# RTL and Localization Implementation Guide

This guide explains how to implement right-to-left (RTL) support and full localization for the CNCF Cloud Native Landscape.

## Overview

The landscape now supports:
- **Multiple languages**: Arabic, Persian, Hebrew, and other RTL languages
- **Right-to-left (RTL) text direction**: Proper display of RTL language content
- **Translatable headings**: Category and subcategory names in localized languages
- **CSS-based styling**: Proper text alignment and layout mirroring for RTL

## Key Changes

### 1. Localization Configuration in landscape.yml

The `landscape.yml` file now includes a `localization` section that:
- Enables/disables localization features
- Defines supported languages
- Specifies RTL configuration options
- Points to localization files

```yaml
localization:
  enabled: true
  defaultLanguage: en
  languages:
    - code: en
      name: English
      dir: ltr
      textAlign: left
      enabled: true
    - code: fa
      name: Persian
      dir: rtl
      textAlign: right
      enabled: true
      localizationFile: localizations/fa.json
  rtl:
    enabled: true
    alignHeadings: true
    rtlClass: rtl-layout
    appliedElements:
      - category_headings
      - subcategory_headings
      - filter_labels
```

### 2. Localization Files

Localization files are JSON files stored in the `localizations/` directory. Each file corresponds to a specific language and includes:
- Metadata (language code, text direction, etc.)
- Translated category names
- Translated subcategory names

**Example**: `localizations/fa.json` (Persian)

### 3. Headings with RTL Support

All headings (categories and subcategories) should:
1. Use the `dir` attribute set to "rtl" or "ltr" based on language
2. Apply text-align CSS to align headings properly:
   - `text-align: right` for RTL languages
   - `text-align: left` for LTR languages
3. Include the `unicode-bidi: isolate` CSS property for proper bidirectional text handling

## Implementation Steps

### Backend/Server-side Implementation

1. **Load Localization File**:
   ```python
   import json
   
   def load_localization(language_code):
       with open(f'localizations/{language_code}.json', 'r', encoding='utf-8') as f:
           return json.load(f)
   ```

2. **Get Metadata**:
   ```python
   localization = load_localization('fa')
   is_rtl = localization['metadata']['dir'] == 'rtl'
   language_name = localization['metadata']['languageName']
   ```

3. **Translate Categories**:
   ```python
   def translate_category(english_name, localization):
       return localization['categories'].get(english_name, {}).get('name', english_name)
   
   translated = translate_category('Provisioning', localization)
   # Returns: "تهیه و فراهم‌سازی" for Persian
   ```

### Frontend/Template Implementation

1. **Set Document Direction**:
   ```html
   <html dir="rtl" lang="fa">
     <!-- For RTL languages -->
   </html>
   ```

2. **Apply RTL Styling to Headings**:
   ```html
   <h1 dir="rtl" class="rtl-heading">{{ translated_category_name }}</h1>
   <h2 dir="rtl" class="rtl-subheading">{{ translated_subcategory_name }}</h2>
   ```

3. **Use RTL CSS Classes**:
   ```css
   /* Base RTL styling */
   [dir="rtl"] {
     direction: rtl;
     text-align: right;
   }
   
   /* Headings */
   .rtl-heading, .rtl-subheading {
     text-align: right;
     direction: rtl;
     unicode-bidi: isolate;
   }
   
   /* Alignment adjustments */
   [dir="rtl"] .sidebar {
     margin-left: 0;
     margin-right: 2rem;
   }
   
   [dir="rtl"] .navigation {
     flex-direction: row-reverse;
   }
   ```

## Rendering Headings with RTL Support

### Important: Heading Translation and Alignment

When rendering category and subcategory headings:

1. **Load the user's language preference**:
   ```javascript
   const userLanguage = getUserLanguage(); // e.g., 'fa', 'en'
   ```

2. **Load the localization for that language**:
   ```javascript
   const localization = await fetch(`/localizations/${userLanguage}.json`);
   const translations = await localization.json();
   ```

3. **Get the metadata to determine direction**:
   ```javascript
   const { dir, textAlign } = translations.metadata;
   ```

4. **For each category, translate the name and apply RTL styling**:
   ```javascript
   // Pseudo-code
   categories.forEach(category => {
       const translatedName = translations.categories[category.name]?.name || category.name;
       const heading = `<h1 dir="${dir}" style="text-align: ${textAlign};">${translatedName}</h1>`;
       container.appendChild(heading);
   });
   ```

5. **For each subcategory, do the same**:
   ```javascript
   subcategories.forEach(subcategory => {
       const translatedName = translations.subcategories[subcategory.name]?.name || subcategory.name;
       const heading = `<h2 dir="${dir}" style="text-align: ${textAlign};">${translatedName}</h2>`;
       container.appendChild(heading);
   });
   ```

## CSS Stylesheet for RTL Support

A complete RTL stylesheet is provided in `localizations/rtl-styles.css`. Key styles:

```css
/* Document and layout */
html[dir="rtl"],
body[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

/* Headings and semantic elements */
h1[dir="rtl"],
h2[dir="rtl"],
h3[dir="rtl"],
h4[dir="rtl"],
h5[dir="rtl"],
h6[dir="rtl"] {
  text-align: right;
  direction: rtl;
  unicode-bidi: isolate;
}

/* Text content */
p[dir="rtl"],
span[dir="rtl"],
div[dir="rtl"] {
  text-align: right;
  direction: rtl;
}

/* Layout adjustments */
[dir="rtl"] {
  margin-left: 0;
  margin-right: auto;
}

/* Navigation and UI elements */
[dir="rtl"] ul,
[dir="rtl"] ol {
  padding-left: 0;
  padding-right: 2rem;
}

[dir="rtl"] li {
  text-align: right;
}
```

## Adding Support for New Languages

To add a new RTL or LTR language:

1. **Create the localization file**:
   - Create `localizations/{lang_code}.json`
   - Follow the schema in `LOCALIZATION_SCHEMA.md`
   - Set `dir` to "rtl" or "ltr" based on the language

2. **Update landscape.yml**:
   - Add the new language to the `localization.languages` section

3. **Translate all categories and subcategories**:
   - Include entries for all categories and subcategories in the JSON file

4. **Test RTL rendering**:
   - Verify headings are right-aligned
   - Test with browser DevTools: `document.documentElement.dir = 'rtl'`
   - Check navbar, sidebars, and layout in RTL mode

## Testing RTL Implementation

### In Browser Console

```javascript
// Test RTL
document.documentElement.dir = 'rtl';
document.documentElement.lang = 'fa';

// Test heading alignment
const heading = document.querySelector('h1');
heading.dir = 'rtl';
heading.style.textAlign = 'right';
heading.style.direction = 'rtl';
heading.style.unicodeBidi = 'isolate';

// Check if headings are properly aligned
console.log(window.getComputedStyle(heading).textAlign); // Should be 'right'
```

### Visual Verification

1. Load the landscape page
2. Select a language with RTL support (e.g., Persian)
3. Verify:
   - Category headings are right-aligned
   - Subcategory headings are right-aligned
   - Text content follows the heading direction
   - Navigation and layout are mirrored appropriately
   - No text overflow or wrapping issues

## Unicode and Bidirectional Text Handling

For proper bidirectional text (mixing LTR and RTL), use:
- `unicode-bidi: isolate` for isolated bidirectional content
- `unicode-bidi: bidi-override` for forcing directionality (use sparingly)
- HTML5 `dir` attribute for semantic direction

**Example**:
```html
<!-- Persian heading with proper bidirectional handling -->
<h1 dir="rtl" style="unicode-bidi: isolate;">تهیه و فراهم‌سازی</h1>

<!-- If the heading contains English words/acronyms -->
<h2 dir="rtl" style="unicode-bidi: isolate;">
  امنیت و انطباق (Security & Compliance)
</h2>
```

## Common Issues and Solutions

### Issue: Headings not right-aligned

**Solution**: Ensure the heading has both:
- `dir="rtl"` attribute
- `text-align: right` CSS style
- `unicode-bidi: isolate` for proper text handling

### Issue: English text within RTL headings appears backwards

**Solution**: Use `<bdo>` tag or ensure proper Unicode bidirectional algorithm handling:
```html
<h2 dir="rtl">
  امنیت
  <bdo dir="ltr">API Gateway</bdo>
  درگاه
</h2>
```

### Issue: Layout elements not mirrored

**Solution**: Apply CSS for layout reversal:
```css
[dir="rtl"] .layout {
  flex-direction: row-reverse;
  margin-left: 0;
  margin-right: auto;
}
```

## Performance Considerations

1. **Lazy load localization files**: Only load translations for activated languages
2. **Cache translations**: Store loaded localization files in browser storage
3. **Minimal CSS**: Use CSS variables for RTL adjustments to reduce file size
4. **Efficient DOM updates**: Batch heading translations to minimize reflows

## Accessibility (a11y)

- Always set the `lang` attribute: `<html lang="fa">`
- Use `dir` attribute semantically, not just for styling
- Ensure screen readers announce text direction correctly
- Test with accessibility tools (WAVE, Axe, etc.)

## References

- [W3C: Structural markup and right-to-left text in HTML](https://www.w3.org/International/questions/qa-html-dir)
- [MDN: CSS Direction](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)
- [Unicode Bidirectional Algorithm](https://www.unicode.org/reports/tr9/)
- [CLDR: Arabic and other RTL languages](https://cldr.unicode.org/)

