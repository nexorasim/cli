// SEO Title/Description Templates (English + Burmese)
const seoTemplates = {
  home: {
    en: {
      title: "eSIM Myanmar - Instant Mobile Data Plans | No Physical SIM Required",
      description: "Get instant mobile data in Myanmar with eSIM technology. Fast activation, flexible plans, and nationwide coverage. Perfect for travelers and locals."
    },
    my: {
      title: "eSIM Myanmar - ချက်ချင်းမိုဘိုင်းဒေတာ | ရုပ်ပိုင်းဆိမ်မလိုအပ်",
      description: "eSIM နည်းပညာဖြင့် မြန်မာနိုင်ငံတွင် ချက်ချင်းမိုဘိုင်းဒေတာရယူပါ။ မြန်ဆန်သောအသုံးပြုခြင်း၊ ပြောင်းလွယ်သောအစီအစဉ်များ။"
    }
  },
  store: {
    en: {
      title: "eSIM Plans Myanmar - Choose Your Perfect Data Package",
      description: "Browse our eSIM data plans for Myanmar. Daily, weekly, and monthly packages with high-speed internet and reliable coverage nationwide."
    },
    my: {
      title: "eSIM အစီအစဉ်များ မြန်မာ - သင့်အတွက်အကောင်းဆုံးဒေတာပက်ကေ့ချ်ရွေးချယ်ပါ",
      description: "မြန်မာနိုင်ငံအတွက် ကျွန်ုပ်တို့၏ eSIM ဒေတာအစီအစဉ်များကို ကြည့်ရှုပါ။ နေ့စဉ်၊ အပတ်စဉ်နှင့် လစဉ်ပက်ကေ့ချ်များ။"
    }
  },
  product: {
    en: {
      title: "{planName} - {dataAmount} eSIM Plan Myanmar | {price}",
      description: "Get {dataAmount} of high-speed data for {duration} in Myanmar. Instant activation, no roaming charges. Perfect for {useCase}."
    },
    my: {
      title: "{planName} - {dataAmount} eSIM အစီအစဉ် မြန်မာ | {price}",
      description: "မြန်မာနိုင်ငံတွင် {duration} အတွက် {dataAmount} မြန်ဆန်သောဒေတာရယူပါ။ ချက်ချင်းအသုံးပြုနိုင်သည်။"
    }
  },
  blog: {
    en: {
      title: "eSIM Myanmar Blog - Travel Tips & Mobile Data Guides",
      description: "Latest news, travel tips, and guides about using eSIM in Myanmar. Stay connected with the best mobile data solutions."
    },
    my: {
      title: "eSIM Myanmar ဘလော့ဂ် - ခရီးသွားအကြံပြုချက်များနှင့် မိုဘိုင်းဒေတာလမ်းညွှန်များ",
      description: "မြန်မာနိုင်ငံတွင် eSIM အသုံးပြုခြင်းအကြောင်း နောက်ဆုံးသတင်းများ၊ ခရီးသွားအကြံပြုချက်များ။"
    }
  }
};

// JSON-LD Structured Data
const structuredData = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "eSIM Myanmar",
    "url": "https://esim-myanmar.com",
    "logo": "https://esim-myanmar.com/logo.png",
    "sameAs": [
      "https://facebook.com/esimmyanmar",
      "https://twitter.com/esimmyanmar"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+95-1-234-5678",
      "contactType": "customer service",
      "availableLanguage": ["English", "Myanmar"]
    }
  },
  
  product: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "{planName}",
    "description": "{description}",
    "brand": {
      "@type": "Brand",
      "name": "eSIM Myanmar"
    },
    "offers": {
      "@type": "Offer",
      "price": "{price}",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": "{validFrom}",
      "validThrough": "{validThrough}"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "{rating}",
      "reviewCount": "{reviewCount}"
    }
  },
  
  breadcrumb: {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://esim-myanmar.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Store",
        "item": "https://esim-myanmar.com/store"
      }
    ]
  }
};

module.exports = { seoTemplates, structuredData };