// =============================================
// SEO TEMPLATES FOR ESIM MYANMAR
// English + Burmese (Myanmar) Support
// =============================================

export const SEO_TEMPLATES = {
  // === HOME PAGE === 
  home: {
    en: {
      title: "eSIM Myanmar - Instant Mobile Data Plans | Travel & Local Coverage",
      description: "Get instant eSIM for Myanmar with nationwide coverage. No physical SIM needed. Activate in minutes with 4G/5G data plans for travelers and locals. Best rates guaranteed.",
      keywords: "eSIM Myanmar, Myanmar mobile data, travel SIM, digital SIM Myanmar, mobile internet Myanmar, 4G 5G Myanmar"
    },
    my: {
      title: "eSIM မြန်မာ - ချက်ချင်းလိုင်းဖွင့်နိုင်သော မိုဘိုင်းဒေတာ | ခရီးသွားနှင့် ပြည်တွင်းအသုံး",
      description: "မြန်မာနိုင်ငံတစ်ဝှမ်းလုံး အသုံးပြုနိုင်သော eSIM ရယူပါ။ ရုပ်ခန့ဲ SIM မလိုပါ။ မိနစ်ပိုင်းအတွင်း 4G/5G ဒေတာပလန်များဖြင့် အသုံးပြုနိုင်သည်။",
      keywords: "eSIM မြန်မာ, မြန်မာမိုဘိုင်းဒေတာ, ခရီးသွားSIM, ဒစ်ဂျစ်တယ်SIM"
    }
  },

  // === STORE PAGE ===
  store: {
    en: {
      title: "eSIM Plans & Packages - Myanmar Mobile Data Store",
      description: "Browse our complete range of eSIM data plans for Myanmar. Daily, weekly, monthly packages with unlimited options. Compare prices and choose the perfect plan for your needs.",
      keywords: "eSIM plans Myanmar, data packages Myanmar, mobile plans Myanmar, unlimited data eSIM"
    },
    my: {
      title: "eSIM ပလန်များနှင့် ပက်ကေ့ဂျ်များ - မြန်မာ မိုဘိုင်းဒေတာ စတိုး",
      description: "မြန်မာအတွက် eSIM ဒေတာပလန် အမျိုးမျိုးကို ရှာဖွေပါ။ နေ့စဉ်၊ အပတ်စဉ်၊ လစဉ် ပက်ကေ့ဂျ်များနှင့် အကန့်အသတ်မရှိ ရွေးချယ်စရာများ။",
      keywords: "eSIM ပလန် မြန်မာ, ဒေတာပက်ကေ့ဂျ် မြန်မာ, မိုဘိုင်းပလန် မြန်မာ"
    }
  },

  // === PRODUCT PAGE ===
  product: {
    en: {
      title: "{planName} - {dataAmount} eSIM Plan for Myanmar | {price}",
      description: "Get the {planName} eSIM plan with {dataAmount} data valid for {duration}. Perfect for {userType}. Instant activation, nationwide coverage, and {speed} speeds.",
      keywords: "{planName}, {dataAmount} eSIM Myanmar, {duration} data plan Myanmar"
    },
    my: {
      title: "{planName} - {dataAmount} မြန်မာ eSIM ပလန် | {price}",
      description: "{planName} eSIM ပလန်ဖြင့် {dataAmount} ဒေတာကို {duration} အသုံးပြုနိုင်သည်။ {userType} အတွက် သင့်လျော်သည်။",
      keywords: "{planName}, {dataAmount} eSIM မြန်မာ, {duration} ဒေတာပလန် မြန်မာ"
    }
  },

  // === BLOG PAGE ===
  blog: {
    en: {
      title: "eSIM Myanmar Blog - Travel Tips, Tech Updates & Mobile Guides",
      description: "Stay updated with the latest eSIM technology, Myanmar travel tips, mobile connectivity guides, and tech news. Expert insights for smart travelers and locals.",
      keywords: "eSIM blog, Myanmar travel tips, mobile technology, connectivity guides, travel tech Myanmar"
    },
    my: {
      title: "eSIM မြန်မာ ဘလော့ - ခရီးသွားအကြံပြုချက်များ၊ နည်းပညာသတင်းများ",
      description: "နောက်ဆုံးပေါ် eSIM နည်းပညာ၊ မြန်မာခရီးသွားအကြံပြုချက်များ၊ မိုဘိုင်းချိတ်ဆက်မှုလမ်းညွှန်များကို လေ့လာပါ။",
      keywords: "eSIM ဘလော့, မြန်မာခရီးသွားအကြံပြုချက်, မိုဘိုင်းနည်းပညာ"
    }
  },

  // === BLOG POST TEMPLATE ===
  blogPost: {
    en: {
      title: "{postTitle} | eSIM Myanmar Blog",
      description: "{postExcerpt}",
      keywords: "{postKeywords}, eSIM Myanmar, mobile connectivity"
    },
    my: {
      title: "{postTitle} | eSIM မြန်မာ ဘလော့",
      description: "{postExcerpt}",
      keywords: "{postKeywords}, eSIM မြန်မာ, မိုဘိုင်းချိတ်ဆက်မှု"
    }
  }
};

// === JSON-LD STRUCTURED DATA TEMPLATES ===
export const STRUCTURED_DATA = {
  // Organization Schema
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "eSIM Myanmar",
    "alternateName": "eSIM မြန်မာ",
    "url": "https://esim-myanmar.com",
    "logo": "https://esim-myanmar.com/logo.png",
    "description": {
      "en": "Leading eSIM provider for Myanmar with instant activation and nationwide coverage",
      "my": "မြန်မာနိုင်ငံအတွက် ထိပ်တန်း eSIM ပေးသောကုမ္ပဏီ"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Yangon Tech Hub",
      "addressLocality": "Yangon", 
      "addressRegion": "Yangon Region",
      "addressCountry": "MM"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+95-9-XXX-XXX-XXX",
      "contactType": "Customer Service",
      "availableLanguage": ["English", "Myanmar"]
    },
    "sameAs": [
      "https://facebook.com/eSIMMyanmar",
      "https://twitter.com/eSIMMyanmar"
    ]
  },

  // Website Schema
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "eSIM Myanmar",
    "alternateName": "eSIM မြန်မာ",
    "url": "https://esim-myanmar.com",
    "description": {
      "en": "Instant eSIM activation for Myanmar with nationwide 4G/5G coverage",
      "my": "မြန်မာနိုင်ငံအတွက် ချက်ချင်း eSIM အသုံးပြုနိုင်သော ဝန်ဆောင်မှု"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://esim-myanmar.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "inLanguage": ["en", "my"]
  },

  // Product Schema Template
  product: (product) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "alternateName": product.nameMyanmar,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "eSIM Myanmar"
    },
    "category": "Telecommunications",
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString(),
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      "seller": {
        "@type": "Organization",
        "name": "eSIM Myanmar"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "156",
      "bestRating": "5",
      "worstRating": "1"
    }
  }),

  // Blog Article Schema Template
  blogPost: (post) => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featuredImage,
    "author": {
      "@type": "Person",
      "name": post.author || "eSIM Myanmar Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "eSIM Myanmar",
      "logo": {
        "@type": "ImageObject",
        "url": "https://esim-myanmar.com/logo.png"
      }
    },
    "datePublished": post.publishedDate,
    "dateModified": post.modifiedDate || post.publishedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://esim-myanmar.com/blog/${post.slug}`
    },
    "articleSection": post.category,
    "keywords": post.keywords,
    "inLanguage": post.language || "en"
  }),

  // FAQ Schema Template
  faq: (faqs) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }),

  // Local Business Schema
  localBusiness: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "eSIM Myanmar",
    "image": "https://esim-myanmar.com/storefront.jpg",
    "description": "Leading eSIM provider in Myanmar with instant activation and nationwide coverage",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Yangon Tech Hub, Sanchaung",
      "addressLocality": "Yangon",
      "addressRegion": "Yangon Region",
      "postalCode": "11111",
      "addressCountry": "MM"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 16.8409,
      "longitude": 96.1735
    },
    "telephone": "+95-9-XXX-XXX-XXX",
    "openingHours": "Mo-Su 24:00",
    "priceRange": "$5-$50",
    "currenciesAccepted": "USD, MMK",
    "paymentAccepted": "Cash, Credit Card, PayPal, Mobile Payment"
  }
};

// === META TAG GENERATOR FUNCTIONS ===
export const generateMetaTags = (pageType, data = {}, language = 'en') => {
  const template = SEO_TEMPLATES[pageType]?.[language];
  if (!template) return {};

  // Replace template variables with actual data
  const title = template.title.replace(/{(\w+)}/g, (match, key) => data[key] || match);
  const description = template.description.replace(/{(\w+)}/g, (match, key) => data[key] || match);
  const keywords = template.keywords.replace(/{(\w+)}/g, (match, key) => data[key] || match);

  return {
    title,
    description,
    keywords,
    'og:title': title,
    'og:description': description,
    'og:type': pageType === 'home' ? 'website' : 'article',
    'og:url': data.url || '',
    'og:image': data.image || 'https://esim-myanmar.com/og-image.jpg',
    'og:site_name': language === 'my' ? 'eSIM မြန်မာ' : 'eSIM Myanmar',
    'og:locale': language === 'my' ? 'my_MM' : 'en_US',
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': data.image || 'https://esim-myanmar.com/twitter-image.jpg'
  };
};

// === HREFLANG GENERATOR ===
export const generateHreflangTags = (currentPath) => {
  return [
    { rel: 'alternate', hreflang: 'en', href: `https://esim-myanmar.com${currentPath}` },
    { rel: 'alternate', hreflang: 'my', href: `https://esim-myanmar.com/my${currentPath}` },
    { rel: 'alternate', hreflang: 'x-default', href: `https://esim-myanmar.com${currentPath}` }
  ];
};