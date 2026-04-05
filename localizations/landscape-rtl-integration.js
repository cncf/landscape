/**
 * RTL Support Integration for CNCF Landscape Page
 * 
 * This script provides RTL (Right-to-Left) support for the Landscape page.
 * It handles language detection, localization loading, and dynamic RTL styling.
 * 
 * Usage:
 * 1. Include this script in your Landscape page
 * 2. Call initRTLSupport() on page load
 * 3. Ensure landscape-rtl.css is included in your page
 */

class LandscapeRTL {
  constructor() {
    this.currentLanguage = 'en';
    this.localization = null;
    this.localizationCache = {};
  }

  /**
   * Initialize RTL support
   */
  async init() {
    // Detect language from URL, localStorage, or browser
    this.currentLanguage = this.detectLanguage();
    
    // Load localization
    await this.loadLocalization(this.currentLanguage);
    
    // Apply RTL if needed
    if (this.localization && this.localization.metadata.dir === 'rtl') {
      this.applyRTL();
    }
    
    // Translate headings
    this.translateHeadings();
  }

  /**
   * Detect user's language preference
   */
  detectLanguage() {
    // Check URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang) return urlLang;
    
    // Check localStorage
    const storedLang = localStorage.getItem('landscape-language');
    if (storedLang) return storedLang;
    
    // Check HTML lang attribute
    const htmlLang = document.documentElement.lang;
    if (htmlLang && htmlLang !== 'en-US') return htmlLang.split('-')[0];
    
    // Check HTML dir attribute (if dir="rtl", likely Persian)
    const htmlDir = document.documentElement.dir;
    if (htmlDir === 'rtl') return 'fa';
    
    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang) {
      return browserLang.split('-')[0]; // Get 'fa' from 'fa-IR'
    }
    
    return 'en'; // Default to English
  }

  /**
   * Load localization file
   */
  async loadLocalization(lang) {
    // Check cache first
    if (this.localizationCache[lang]) {
      this.localization = this.localizationCache[lang];
      return;
    }
    
    // Load from server
    try {
      const response = await fetch(`/localizations/${lang}.json`);
      if (!response.ok) {
        console.warn(`Localization file for ${lang} not found, falling back to English`);
        if (lang !== 'en') {
          return this.loadLocalization('en');
        }
        return;
      }
      
      const data = await response.json();
      this.localizationCache[lang] = data;
      this.localization = data;
    } catch (error) {
      console.error(`Error loading localization for ${lang}:`, error);
    }
  }

  /**
   * Apply RTL styling to the page
   */
  applyRTL() {
    if (!this.localization) return;
    
    const { dir, textAlign, language } = this.localization.metadata;
    
    // Set document direction and language
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    
    // Add RTL class to body
    if (dir === 'rtl') {
      document.body.classList.add('rtl-layout');
    }
    
    // Load RTL CSS if not already loaded
    this.loadRTLStylesheet();
  }

  /**
   * Load RTL stylesheet dynamically
   */
  loadRTLStylesheet() {
    // Check if already loaded
    if (document.querySelector('link[href*="landscape-rtl.css"]')) {
      return;
    }
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/localizations/landscape-rtl.css';
    document.head.appendChild(link);
  }

  /**
   * Translate all headings on the page
   */
  translateHeadings() {
    if (!this.localization) return;
    
    // Translate category headings
    this.translateElements('h2[data-category]', 'categories');
    this.translateElements('.category-heading[data-category]', 'categories');
    
    // Translate subcategory headings
    this.translateElements('h3[data-subcategory]', 'subcategories');
    this.translateElements('.subcategory-heading[data-subcategory]', 'subcategories');
    
    // Translate all headings without data attributes (fallback)
    this.translateHeadingsWithoutAttributes();
    
    // Translate landscape title
    const titleElement = document.querySelector('.landscape-title, h1.landscape, h1');
    if (titleElement && this.localization.metadata.dir === 'rtl') {
      // Only translate if it contains "Landscape" or "CNCF"
      if (titleElement.textContent.includes('Landscape') || titleElement.textContent.includes('CNCF')) {
        titleElement.textContent = 'چشم‌انداز ابری بومی CNCF'; // CNCF Cloud Native Landscape in Persian
      }
    }
  }

  /**
   * Translate headings without data attributes (fallback method)
   */
  translateHeadingsWithoutAttributes() {
    if (!this.localization) return;
    
    // Try to match heading text with category names
    const allHeadings = document.querySelectorAll('h2, h3, .category-heading, .subcategory-heading');
    
    allHeadings.forEach(heading => {
      // Skip if already has data attribute
      if (heading.dataset.category || heading.dataset.subcategory) return;
      
      const text = heading.textContent.trim();
      
      // Check categories
      if (this.localization.categories[text]) {
        heading.textContent = this.localization.categories[text].name;
        heading.dir = this.localization.metadata.dir;
        heading.style.textAlign = this.localization.metadata.textAlign;
        heading.style.unicodeBidi = 'isolate';
        return;
      }
      
      // Check subcategories
      if (this.localization.subcategories[text]) {
        heading.textContent = this.localization.subcategories[text].name;
        heading.dir = this.localization.metadata.dir;
        heading.style.textAlign = this.localization.metadata.textAlign;
        heading.style.unicodeBidi = 'isolate';
      }
    });
  }

  /**
   * Translate elements with data attributes
   */
  translateElements(selector, translationType) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
      const key = element.dataset.category || element.dataset.subcategory;
      if (!key) return;
      
      const translation = this.localization[translationType][key];
      if (translation && translation.name) {
        element.textContent = translation.name;
        element.dir = translation.dir || this.localization.metadata.dir;
        element.style.textAlign = this.localization.metadata.textAlign;
        element.style.unicodeBidi = 'isolate';
      }
    });
  }

  /**
   * Switch language
   */
  async switchLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('landscape-language', lang);
    
    await this.loadLocalization(lang);
    
    // Remove RTL class if switching to LTR
    if (this.localization.metadata.dir === 'ltr') {
      document.body.classList.remove('rtl-layout');
      document.documentElement.dir = 'ltr';
    } else {
      this.applyRTL();
    }
    
    this.translateHeadings();
  }

  /**
   * Get translated text for a category
   */
  getCategoryTranslation(categoryName) {
    if (!this.localization || !this.localization.categories[categoryName]) {
      return categoryName;
    }
    return this.localization.categories[categoryName].name;
  }

  /**
   * Get translated text for a subcategory
   */
  getSubcategoryTranslation(subcategoryName) {
    if (!this.localization || !this.localization.subcategories[subcategoryName]) {
      return subcategoryName;
    }
    return this.localization.subcategories[subcategoryName].name;
  }
}

// Global instance
const landscapeRTL = new LandscapeRTL();

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => landscapeRTL.init());
} else {
  landscapeRTL.init();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LandscapeRTL;
}
