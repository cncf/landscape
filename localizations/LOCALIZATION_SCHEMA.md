# Localization Configuration Schema

This file describes the schema for localization files in the CNCF Cloud Native Landscape.

## File Structure

Each localization file should be named with the language code (e.g., `fa.json` for Persian, `es.json` for Spanish) and placed in the `localizations/` directory.

## JSON Schema

```json
{
  "metadata": {
    "language": "string (ISO 639-1 code, e.g., 'fa', 'es', 'de')",
    "languageName": "string (human-readable language name)",
    "dir": "string ('ltr' for left-to-right or 'rtl' for right-to-left)",
    "textAlign": "string ('left' for LTR or 'right' for RTL)",
    "version": "string (semantic version)",
    "description": "string (description of the localization)"
  },
  "categories": {
    "Category Name": {
      "name": "string (translated category name)",
      "dir": "string ('rtl' or 'ltr')"
    }
  },
  "subcategories": {
    "Subcategory Name": {
      "name": "string (translated subcategory name)",
      "dir": "string ('rtl' or 'ltr')"
    }
  }
}
```

## Properties

### metadata
- `language`: ISO 639-1 language code (required)
- `languageName`: Descriptive name of the language in English (required)
- `dir`: Text direction - either "rtl" (right-to-left) or "ltr" (left-to-right) (required)
- `textAlign`: CSS text-align value - "right" for RTL or "left" for LTR (required)
- `version`: Version of the localization file following semantic versioning (required)
- `description`: Brief description of what this localization provides (required)

### categories
Each key is the English category name from `landscape.yml`, and the value contains:
- `name`: The translated name of the category
- `dir`: Inherits from metadata but can be overridden per category if needed

### subcategories
Each key is the English subcategory name from `landscape.yml`, and the value contains:
- `name`: The translated name of the subcategory
- `dir`: Inherits from metadata but can be overridden per subcategory if needed

## RTL Support

For right-to-left languages, the rendering system should:

1. **Set the HTML `dir` attribute** to "rtl" when displaying content in RTL languages
2. **Apply right-aligned styling** to headings and text blocks
3. **Mirror layout** where appropriate (e.g., navigation, sidebars)
4. **Flip spacing and margins** for proper visual alignment in RTL mode

### CSS Classes for RTL Support

The following CSS classes should be applied when `dir="rtl"`:

```css
/* Headings (Categories and Subcategories) */
h1[dir="rtl"], h2[dir="rtl"], h3[dir="rtl"] {
  text-align: right;
  direction: rtl;
  unicode-bidi: isolate;
}

/* Paragraphs and text content */
p[dir="rtl"], span[dir="rtl"] {
  text-align: right;
  direction: rtl;
  unicode-bidi: isolate;
}

/* Additional layout adjustments */
[dir="rtl"] {
  margin-right: auto;
  margin-left: 0;
  padding-right: 1em;
  padding-left: 0;
}
```

## Currently Supported Languages

- **Persian (fa)**: Full RTL support with comprehensive category and subcategory translations

## Adding a New Language

To add support for a new language:

1. Create a new JSON file in `localizations/` directory with the language code (e.g., `es.json` for Spanish)
2. Include the required metadata fields
3. Translate all category names from the main categories in `landscape.yml`
4. Translate all subcategory names
5. Set the `dir` property to "rtl" for right-to-left languages, "ltr" for left-to-right
6. Set `version` to "1.0.0"
7. Submit a pull request with the new localization file

## Translation Guidelines

### Categories
- Keep translations concise and clear
- Use standard technical terminology in the target language
- Maintain the intent and meaning of the original English category name

### Subcategories
- Consistency: Use the same translated terms across different subcategories
- Context: Consider how the subcategory appears in the landscape hierarchy
- Clarity: Ensure target vocabulary clearly conveys the technical concept

### RTL Language Considerations
- For Persian: Use standard Persian technical terms
- Avoid English acronyms where possible, but if necessary, keep them as-is (they will be rendered in correct reading order with proper bidirectional text)
- Numbers and numeric values should follow standard conventions of the target language
- Symbols: Use culturally appropriate symbols and punctuation

## Usage in Rendering

When rendering the landscape in a specific language:

1. Load the corresponding localization file from `localizations/{lang}.json`
2. Replace English category/subcategory names with translated names from the localization file
3. Apply `dir="rtl"` attribute to the HTML root or appropriate containers if `metadata.dir` is "rtl"
4. Apply CSS classes to ensure proper text alignment and layout mirroring

### Example Implementation

```javascript
// Pseudo-code for rendering with localization
function renderLandscape(language) {
  const localization = loadLocalization(`localizations/${language}.json`);
  const { metadata, categories, subcategories } = localization;
  
  // Set document direction
  document.documentElement.dir = metadata.dir;
  document.documentElement.lang = metadata.language;
  
  // Render category
  categories.forEach(category => {
    const translatedName = categories[category.name]?.name || category.name;
    renderCategory(translatedName, metadata.dir);
  });
  
  // Render subcategory
  subcategories.forEach(subcategory => {
    const translatedName = subcategories[subcategory.name]?.name || subcategory.name;
    renderSubcategory(translatedName, metadata.dir);
  });
}
```

## File Format Guidelines

- Use UTF-8 encoding for all localization files
- Ensure valid JSON with proper escaping
- Include comments explaining any special translation decisions
- Provide a PR description including any notes on translation choices

