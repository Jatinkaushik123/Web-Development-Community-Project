/**
 * MausamCrop — client-side prototype.
 * Handles mock crop data, weather state, bilingual UI, geolocation, and page views.
 */
(function () {
  "use strict";

  const STORAGE_LANG = "mc-lang";
  const STORAGE_WEATHER = "mc-weather";
  const STORAGE_CROP = "mc-crop";

  /** Default snapshot used until the grower sets a city. */
  const DEFAULT_WEATHER = {
    location: "Delhi, India",
    locationHi: "दिल्ली, भारत",
    temp: 31,
    humidity: 42,
    rainfall: "Low",
    rainfallHi: "कम",
    condition: "Clear · Warm",
    conditionHi: "साफ़ · गर्म",
  };

  /**
   * Mock city catalogue. Keys are lowercase English names.
   * Used for search fallback and coarse GPS mapping.
   */
  const CITIES = {
    delhi: {
      location: "Delhi, India",
      locationHi: "दिल्ली, भारत",
      temp: 31,
      humidity: 42,
      rainfall: "Low",
      rainfallHi: "कम",
      condition: "Clear · Warm",
      conditionHi: "साफ़ · गर्म",
    },
    lucknow: {
      location: "Lucknow, India",
      locationHi: "लखनऊ, भारत",
      temp: 33,
      humidity: 55,
      rainfall: "Moderate",
      rainfallHi: "मध्यम",
      condition: "Hazy · Hot",
      conditionHi: "धुंध · गर्म",
    },
    pune: {
      location: "Pune, India",
      locationHi: "पुणे, भारत",
      temp: 27,
      humidity: 58,
      rainfall: "Low",
      rainfallHi: "कम",
      condition: "Partly cloudy",
      conditionHi: "आंशिक बादल",
    },
    bengaluru: {
      location: "Bengaluru, India",
      locationHi: "बेंगलुरु, भारत",
      temp: 24,
      humidity: 70,
      rainfall: "Moderate",
      rainfallHi: "मध्यम",
      condition: "Overcast",
      conditionHi: "बादल छाए",
    },
    bangalore: null, // alias filled below
    jaipur: {
      location: "Jaipur, India",
      locationHi: "जयपुर, भारत",
      temp: 35,
      humidity: 28,
      rainfall: "None",
      rainfallHi: "नहीं",
      condition: "Sunny · Dry",
      conditionHi: "धूप · शुष्क",
    },
    kolkata: {
      location: "Kolkata, India",
      locationHi: "कोलकाता, भारत",
      temp: 30,
      humidity: 78,
      rainfall: "High",
      rainfallHi: "अधिक",
      condition: "Humid · Showers",
      conditionHi: "नम · बौछार",
    },
    chennai: {
      location: "Chennai, India",
      locationHi: "चेन्नई, भारत",
      temp: 34,
      humidity: 72,
      rainfall: "Low",
      rainfallHi: "कम",
      condition: "Hot · Humid",
      conditionHi: "गर्म · आर्द्र",
    },
    shimla: {
      location: "Shimla, India",
      locationHi: "शिमला, भारत",
      temp: 16,
      humidity: 61,
      rainfall: "Moderate",
      rainfallHi: "मध्यम",
      condition: "Cool · Breeze",
      conditionHi: "ठंडा · हवा",
    },
  };
  CITIES.bangalore = CITIES.bengaluru;

  /**
   * Prototype crop set (minimum six). Ideal ranges drive temperature matching.
   */
  const CROPS = [
    {
      id: "tomatoes",
      name: "Tomatoes",
      nameHi: "टमाटर",
      category: "warm",
      tags: ["Warm-Season"],
      tagsHi: ["गर्म मौसम"],
      tempMin: 18,
      tempMax: 32,
      water: "moderate",
      harvestDays: "70–85 days",
      harvestDaysHi: "70–85 दिन",
      color: "#c45c4a",
      guide: {
        soil: {
          en: "Loosen well-drained loam and mix in compost. Keep pH near 6.0–6.8. Stake rows before transplanting so roots are not disturbed later.",
          hi: "अच्छी निकासी वाली दोमट मिट्टी को भुरभुरा करें और कंपोस्ट मिलाएँ। pH 6.0–6.8 रखें। रोपाई से पहले सहारा लगा दें।",
        },
        sow: {
          en: "Start seeds in trays, then transplant 4–5 week seedlings 45 cm apart after the last cool spell. Mulch to keep soil evenly moist.",
          hi: "बीज ट्रे में बोएँ, 4–5 सप्ताह के पौधे 45 सेमी की दूरी पर लगाएँ। मिट्टी की नमी बनाए रखने के लिए मल्च करें।",
        },
        water: {
          en: "Deep water 2–3 times a week. Avoid wetting leaves in the evening to reduce blight. Increase slightly during fruit set.",
          hi: "सप्ताह में 2–3 बार गहरा पानी दें। झुलसा से बचने शाम को पत्तियाँ न भिगोएँ। फल लगने पर थोड़ा बढ़ाएँ।",
        },
        harvest: {
          en: "Pick when fruit is fully coloured but still firm. Harvest every 2–3 days to keep plants producing.",
          hi: "जब फल पूरा रंग ले ले और अभी सख्त हो, तो तोड़ें। उत्पादन बनाए रखने के लिए हर 2–3 दिन में चुनें।",
        },
      },
    },
    {
      id: "spinach",
      name: "Spinach",
      nameHi: "पालक",
      category: "leafy",
      tags: ["Cool-Season", "Leafy Green"],
      tagsHi: ["ठंडा मौसम", "पत्तेदार"],
      tempMin: 10,
      tempMax: 22,
      water: "high",
      harvestDays: "40–50 days",
      harvestDaysHi: "40–50 दिन",
      color: "#3d7a3a",
      guide: {
        soil: {
          en: "Rich, moist soil with plenty of organic matter. Avoid waterlogged beds. A light nitrogen boost helps leaf growth.",
          hi: "जैविक पदार्थ वाली नम, उपजाऊ मिट्टी चुनें। जलभराव से बचें। हल्की नाइट्रोजन पत्ती वृद्धि में मदद करती है।",
        },
        sow: {
          en: "Sow seed 1 cm deep in rows 20 cm apart. Thin seedlings to 8–10 cm. Successive sowings every 2 weeks extend harvest.",
          hi: "बीज 1 सेमी गहरा, पंक्तियाँ 20 सेमी दूर। पौधों को 8–10 सेमी पर छँटाएँ। हर 2 सप्ताह नई बुवाई से कटाई लंबी होती है।",
        },
        water: {
          en: "Keep the bed consistently moist. Light daily watering in dry spells prevents bitterness and bolting.",
          hi: "क्यारी हमेशा नम रखें। सूखे में हल्का रोज़ पानी कड़वाहट और फूल आने से रोकता है।",
        },
        harvest: {
          en: "Cut outer leaves when 10–12 cm long, or harvest the whole plant. Cool mornings keep leaves crisp.",
          hi: "बाहरी पत्तियाँ 10–12 सेमी पर काटें, या पूरा पौधा लें। सुबह की ठंडक पत्तियों को कुरकुरा रखती है।",
        },
      },
    },
    {
      id: "okra",
      name: "Okra",
      nameHi: "भिंडी",
      category: "warm",
      tags: ["Warm-Season"],
      tagsHi: ["गर्म मौसम"],
      tempMin: 24,
      tempMax: 35,
      water: "moderate",
      harvestDays: "50–65 days",
      harvestDaysHi: "50–65 दिन",
      color: "#589e33",
      guide: {
        soil: {
          en: "Sandy loam that warms quickly. Work in well-rotted manure. Okra dislikes cold, compacted ground.",
          hi: "जल्दी गर्म होने वाली बलुई दोमट। सड़ी गोबर मिलाएँ। ठंडी, दबी मिट्टी भिंडी को पसंद नहीं।",
        },
        sow: {
          en: "Soak seed overnight and sow 2 cm deep, 30 cm apart, after nights stay above 18°C.",
          hi: "बीज रात भर भिगोएँ और 2 सेमी गहरा, 30 सेमी दूरी पर बोएँ जब रातें 18°C से ऊपर रहें।",
        },
        water: {
          en: "Water deeply once or twice a week. Do not let pods sit in soggy soil during flowering.",
          hi: "सप्ताह में एक-दो बार गहरा पानी। फूल आने पर फल गीली मिट्टी में न रहें।",
        },
        harvest: {
          en: "Pick tender pods at 6–8 cm every other day. Older pods turn fibrous quickly.",
          hi: "कोमल फल 6–8 सेमी पर हर दूसरे दिन तोड़ें। पुराने फल जल्दी रेशेदार हो जाते हैं।",
        },
      },
    },
    {
      id: "carrots",
      name: "Carrots",
      nameHi: "गाजर",
      category: "root",
      tags: ["Cool-Season", "Root Crop"],
      tagsHi: ["ठंडा मौसम", "जड़ फसल"],
      tempMin: 15,
      tempMax: 24,
      water: "moderate",
      harvestDays: "70–80 days",
      harvestDaysHi: "70–80 दिन",
      color: "#d97706",
      guide: {
        soil: {
          en: "Deep, stone-free sandy loam. Skip fresh manure — it forks roots. Rake the bed fine before sowing.",
          hi: "गहरी, बिना कंकड़ वाली बलुई दोमट। ताज़ी गोबर से जड़ें फटती हैं। बुवाई से पहले क्यारी बारीक करें।",
        },
        sow: {
          en: "Sow thinly 0.5 cm deep. Keep the surface damp until germination (10–21 days). Thin to 4–5 cm.",
          hi: "0.5 सेमी गहरा पतला बोएँ। अंकुरण तक सतह नम रखें। 4–5 सेमी पर छँटाई करें।",
        },
        water: {
          en: "Even moisture prevents splitting. Reduce slightly in the last two weeks to concentrate flavour.",
          hi: "समान नमी फटने से बचाती है। स्वाद गाढ़ा करने के लिए अंतिम दो सप्ताह पानी थोड़ा कम करें।",
        },
        harvest: {
          en: "Lift when shoulders are 2 cm wide. Loosen soil with a fork to avoid breaking taproots.",
          hi: "कंधे 2 सेमी चौड़े हों तब निकालें। जड़ न टूटे, इसके लिए काँटे से मिट्टी ढीली करें।",
        },
      },
    },
    {
      id: "chillies",
      name: "Green Chillies",
      nameHi: "हरी मिर्च",
      category: "warm",
      tags: ["Warm-Season"],
      tagsHi: ["गर्म मौसम"],
      tempMin: 20,
      tempMax: 32,
      water: "moderate",
      harvestDays: "60–80 days",
      harvestDaysHi: "60–80 दिन",
      color: "#3f7d2a",
      guide: {
        soil: {
          en: "Fertile loam with good drainage. Mix compost and a handful of wood ash for potassium.",
          hi: "अच्छी निकासी वाली उपजाऊ दोमट। कंपोस्ट और मुट्ठी भर राख (पोटाश) मिलाएँ।",
        },
        sow: {
          en: "Transplant sturdy seedlings 40 cm apart in full sun. Pinch early flowers if plants are still small.",
          hi: "मजबूत पौधे 40 सेमी दूरी पर धूप में लगाएँ। छोटा पौधा हो तो शुरुआती फूल नोच दें।",
        },
        water: {
          en: "Moderate, regular watering. Let the top centimetre dry between sessions. Overwatering drops flowers.",
          hi: "नियमित मध्यम पानी। ऊपर की परत सूखने दें। अधिक पानी से फूल झड़ते हैं।",
        },
        harvest: {
          en: "Snip green fruit with scissors when firm and glossy. Frequent picking encourages more pods.",
          hi: "कड़े, चमकदार हरे फल कैंची से काटें। बार-बार चुनने से और फल लगते हैं।",
        },
      },
    },
    {
      id: "radish",
      name: "Radish",
      nameHi: "मूली",
      category: "root",
      tags: ["Cool-Season", "Root Crop"],
      tagsHi: ["ठंडा मौसम", "जड़ फसल"],
      tempMin: 10,
      tempMax: 22,
      water: "high",
      harvestDays: "25–40 days",
      harvestDaysHi: "25–40 दिन",
      color: "#b91c1c",
      guide: {
        soil: {
          en: "Light, loose soil. Heavy clay makes roots woody. A shallow bed is enough for salad types.",
          hi: "हल्की, भुरभुरी मिट्टी। भारी चिकनी मिट्टी जड़ को कठोर करती है। सलाद किस्मों के लिए उथली क्यारी काफी है।",
        },
        sow: {
          en: "Sow 1 cm deep, 5 cm apart. Fast crop — sow a short row every 10 days for a continuous supply.",
          hi: "1 सेमी गहरा, 5 सेमी दूरी। तेज़ फसल — लगातार आपूर्ति के लिए हर 10 दिन छोटी पंक्ति बोएँ।",
        },
        water: {
          en: "Never let the bed dry out. Uneven watering causes pithy, spicy roots.",
          hi: "क्यारी सूखने न दें। असमान पानी से जड़ खोखली और तीखी हो जाती है।",
        },
        harvest: {
          en: "Pull as soon as roots size up. Leaving them in heat makes them pithy and overly hot.",
          hi: "जड़ आकार लेते ही निकालें। गर्मी में छोड़ने से गूदा सूखता है और तीखापन बढ़ता है।",
        },
      },
    },
  ];

  const I18N = {
    en: {
      skip: "Skip to content",
      navHome: "Home",
      navFind: "Find Crops",
      navGuide: "Cultivation Guide",
      heroEyebrow: "Phase 1 · Weather-smart farming",
      heroTitle: "Grow the right crop for today’s weather.",
      heroCopy:
        "MausamCrop matches local temperature, humidity, and rainfall with vegetables that thrive in your district — then walks you through soil prep, sowing, watering, and harvest.",
      ctaFind: "Find matching crops",
      ctaGuide: "Open cultivation guide",
      statCrops: "Prototype crops",
      statLang: "Bilingual interface",
      statSteps: "Care stages per crop",
      weatherTitle: "Weather snapshot",
      humidity: "Humidity",
      rainfall: "Rainfall",
      featuredEyebrow: "Featured for this climate",
      featuredTitle: "Crops that fit the current temperature",
      featuredLead: "Cards update from mock weather. Set your district to refine matches.",
      viewAll: "View all crops",
      howTitle: "How MausamCrop works",
      how1Title: "Share location",
      how1Body: "Allow GPS or search your city. We simulate a weather snapshot for the prototype.",
      how2Title: "Match crops",
      how2Body: "Ideal temperature bands and water needs filter the recommendation grid.",
      how3Title: "Follow the guide",
      how3Body: "Soil prep, sowing, watering, and harvest steps in one bilingual timeline.",
      how4Title: "Plan the season",
      how4Body: "Harvest-duration badges help you pick short-cycle or longer vegetables.",
      footerTag: "College Phase 1 prototype",
      footerNote: "Mock weather only — not a substitute for local agronomy advice.",
      locEyebrow: "Location",
      locTitle: "Where are you growing?",
      locLead:
        "Allow browser geolocation for a simulated district match, or search a city if GPS is denied. Weather values are prototype data for evaluation.",
      gpsTitle: "Use device location",
      gpsBody: "We only store a mock city name and weather snapshot in this browser.",
      gpsCta: "Detect my location",
      searchTitle: "Search district or city",
      searchHint: "Try Delhi, Lucknow, Pune, Bengaluru, Jaipur, Kolkata, Chennai, or Shimla.",
      cityLabel: "City name",
      searchCta: "Apply city weather",
      resultsEyebrow: "Recommendations",
      resultsTitle: "Crops for your weather",
      resultsLead:
        "Filter by season and water need. A Match badge means the crop’s ideal temperature includes the current snapshot.",
      filterSeason: "Season / category",
      filterWater: "Water need",
      filterMatch: "Temperature fit",
      filterAll: "All",
      filterWarm: "Warm-Season",
      filterCool: "Cool-Season",
      filterLeafy: "Leafy Green",
      filterRoot: "Root Crop",
      waterLow: "Low",
      waterMod: "Moderate",
      waterHigh: "High",
      filterMatched: "Matching now",
      emptyCrops: "No crops match these filters. Try All, or pick another city.",
      guideEyebrow: "Care timeline",
      guideTitle: "Cultivation guide",
      guideLead: "Choose a crop, then move through soil prep, sowing, watering, and harvest.",
      cropSelect: "Crop",
      stageSoil: "Soil Prep",
      stageSow: "Sowing",
      stageWater: "Watering Schedule",
      stageHarvest: "Harvesting",
      viewGuide: "View Care Guide",
      match: "Match",
      harvest: "Harvest",
      gpsOk: "Location estimated. Opening crop matches…",
      gpsDenied: "Location blocked. Search a city instead.",
      gpsUnsupported: "Geolocation is not available in this browser. Use city search.",
      cityOk: "Weather applied. Opening recommendations…",
      cityMiss: "City not in the prototype list. Try a suggested name.",
    },
    hi: {
      skip: "मुख्य सामग्री पर जाएँ",
      navHome: "होम",
      navFind: "फसल खोजें",
      navGuide: "खेती गाइड",
      heroEyebrow: "चरण 1 · मौसम-आधारित खेती",
      heroTitle: "आज के मौसम के हिसाब से सही फसल उगाएँ।",
      heroCopy:
        "मौसमक्रॉप आपके जिले के तापमान, नमी और वर्षा से मेल खाती सब्जियाँ सुझाता है — फिर मिट्टी, बुवाई, सिंचाई और कटाई के चरण बताता है।",
      ctaFind: "मैचिंग फसलें खोजें",
      ctaGuide: "खेती गाइड खोलें",
      statCrops: "प्रोटोटाइप फसलें",
      statLang: "द्विभाषी इंटरफ़ेस",
      statSteps: "प्रति फसल देखभाल चरण",
      weatherTitle: "मौसम झलक",
      humidity: "नमी",
      rainfall: "वर्षा",
      featuredEyebrow: "इस जलवायु के लिए चयन",
      featuredTitle: "वर्तमान तापमान से मेल खाती फसलें",
      featuredLead: "कार्ड नकली मौसम से अपडेट होते हैं। जिले से मिलान और सटीक होगा।",
      viewAll: "सभी फसलें देखें",
      howTitle: "मौसमक्रॉप कैसे काम करता है",
      how1Title: "स्थान बताएँ",
      how1Body: "GPS अनुमति दें या शहर खोजें। प्रोटोटाइप में मौसम सिम्युलेटेड है।",
      how2Title: "फसल मैच",
      how2Body: "आदर्श तापमान और पानी की जरूरत से ग्रिड छनता है।",
      how3Title: "गाइड अपनाएँ",
      how3Body: "मिट्टी, बुवाई, सिंचाई और कटाई एक द्विभाषी टाइमलाइन में।",
      how4Title: "मौसम की योजना",
      how4Body: "कटाई अवधि बैज छोटी या लंबी फसल चुनने में मदद करते हैं।",
      footerTag: "कॉलेज चरण 1 प्रोटोटाइप",
      footerNote: "केवल नकली मौसम — स्थानीय कृषि सलाह का विकल्प नहीं।",
      locEyebrow: "स्थान",
      locTitle: "आप कहाँ खेती कर रहे हैं?",
      locLead:
        "सिम्युलेटेड जिले के लिए ब्राउज़र लोकेशन दें, या GPS बंद हो तो शहर खोजें। मौसम आँकड़े मूल्यांकन के लिए हैं।",
      gpsTitle: "डिवाइस लोकेशन",
      gpsBody: "हम केवल नकली शहर नाम और मौसम इस ब्राउज़र में रखते हैं।",
      gpsCta: "मेरा स्थान पता करें",
      searchTitle: "जिला या शहर खोजें",
      searchHint: "दिल्ली, लखनऊ, पुणे, बेंगलुरु, जयपुर, कोलकाता, चेन्नई या शिमला आज़माएँ।",
      cityLabel: "शहर का नाम",
      searchCta: "शहर का मौसम लागू करें",
      resultsEyebrow: "सिफारिशें",
      resultsTitle: "आपके मौसम की फसलें",
      resultsLead:
        "मौसम और पानी से छानें। मैच बैज का मतलब है वर्तमान तापमान फसल की आदर्श सीमा में है।",
      filterSeason: "मौसम / श्रेणी",
      filterWater: "पानी की जरूरत",
      filterMatch: "तापमान फिट",
      filterAll: "सभी",
      filterWarm: "गर्म मौसम",
      filterCool: "ठंडा मौसम",
      filterLeafy: "पत्तेदार",
      filterRoot: "जड़ फसल",
      waterLow: "कम",
      waterMod: "मध्यम",
      waterHigh: "अधिक",
      filterMatched: "अभी मैच",
      emptyCrops: "इन फ़िल्टर से कोई फसल नहीं मिली। सभी चुनें या दूसरा शहर लें।",
      guideEyebrow: "देखभाल टाइमलाइन",
      guideTitle: "खेती गाइड",
      guideLead: "फसल चुनें, फिर मिट्टी, बुवाई, सिंचाई और कटाई देखें।",
      cropSelect: "फसल",
      stageSoil: "मिट्टी तैयारी",
      stageSow: "बुवाई",
      stageWater: "सिंचाई कार्यक्रम",
      stageHarvest: "कटाई",
      viewGuide: "देखभाल गाइड देखें",
      match: "मैच",
      harvest: "कटाई",
      gpsOk: "स्थान अनुमानित। फसल मैच खुल रहे हैं…",
      gpsDenied: "स्थान अवरुद्ध है। शहर खोजें।",
      gpsUnsupported: "इस ब्राउज़र में जियोलोकेशन नहीं है। शहर खोजें।",
      cityOk: "मौसम लागू। सिफारिशें खुल रही हैं…",
      cityMiss: "यह शहर सूची में नहीं। सुझाया नाम आज़माएँ।",
    },
  };

  const STAGE_ORDER = ["soil", "sow", "water", "harvest"];
  const STAGE_LABEL = {
    soil: { en: "Soil Prep", hi: "मिट्टी तैयारी" },
    sow: { en: "Sowing", hi: "बुवाई" },
    water: { en: "Watering Schedule", hi: "सिंचाई कार्यक्रम" },
    harvest: { en: "Harvesting", hi: "कटाई" },
  };

  let lang = localStorage.getItem(STORAGE_LANG) === "hi" ? "hi" : "en";
  let weather = loadWeather();
  let guideStage = "soil";

  function loadWeather() {
    try {
      const raw = localStorage.getItem(STORAGE_WEATHER);
      if (!raw) return { ...DEFAULT_WEATHER };
      return { ...DEFAULT_WEATHER, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULT_WEATHER };
    }
  }

  function saveWeather(next) {
    weather = next;
    localStorage.setItem(STORAGE_WEATHER, JSON.stringify(next));
    paintWeather();
  }

  function t(key) {
    return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
  }

  function isMatch(crop) {
    return weather.temp >= crop.tempMin && weather.temp <= crop.tempMax;
  }

  function applyI18n() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      const value = t(key);
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.setAttribute("placeholder", value);
      } else {
        el.textContent = value;
      }
    });
    document.querySelectorAll(".lang-switch [data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === lang));
    });
    paintWeather();
  }

  function paintWeather() {
    document.querySelectorAll("[data-weather]").forEach(function (el) {
      const field = el.getAttribute("data-weather");
      if (field === "location") {
        el.textContent = lang === "hi" ? weather.locationHi : weather.location;
      } else if (field === "condition") {
        el.textContent = lang === "hi" ? weather.conditionHi : weather.condition;
      } else if (field === "rainfall") {
        el.textContent = lang === "hi" ? weather.rainfallHi : weather.rainfall;
      } else if (field === "temp" || field === "humidity") {
        el.textContent = String(weather[field]);
      }
    });
  }

  function cropIcon(crop) {
    return (
      '<svg viewBox="0 0 64 64" role="img" aria-label="' +
      crop.name +
      '"><circle cx="32" cy="32" r="28" fill="' +
      crop.color +
      '" opacity="0.18"/><circle cx="32" cy="28" r="14" fill="' +
      crop.color +
      '"/><path d="M32 42v10" stroke="#1B4D1B" stroke-width="3" stroke-linecap="round"/></svg>'
    );
  }

  function cropCardHtml(crop) {
    const tags = lang === "hi" ? crop.tagsHi : crop.tags;
    const harvest = lang === "hi" ? crop.harvestDaysHi : crop.harvestDays;
    const matchBadge = isMatch(crop)
      ? '<span class="badge badge--match">' + t("match") + "</span>"
      : "";
    return (
      '<article class="crop-card">' +
      '<div class="crop-card__media">' +
      cropIcon(crop) +
      "</div>" +
      '<div class="crop-card__body">' +
      "<h3>" +
      crop.name +
      "</h3>" +
      '<p class="crop-hi">' +
      crop.nameHi +
      "</p>" +
      '<div class="card-meta">' +
      tags.map(function (tag) {
        return '<span class="badge">' + tag + "</span>";
      }).join("") +
      '<span class="badge">' +
      t("harvest") +
      ": " +
      harvest +
      "</span>" +
      matchBadge +
      "</div>" +
      '<a class="btn btn--primary" href="guide.html?crop=' +
      encodeURIComponent(crop.id) +
      '">' +
      t("viewGuide") +
      "</a>" +
      "</div></article>"
    );
  }

  function renderFeatured() {
    const grid = document.getElementById("featured-grid");
    if (!grid) return;
    const matched = CROPS.filter(isMatch);
    const list = (matched.length ? matched : CROPS).slice(0, 3);
    grid.innerHTML = list.map(cropCardHtml).join("");
  }

  function cropPassesFilters(crop, season, water, matchMode) {
    if (water !== "all" && crop.water !== water) return false;
    if (matchMode === "match" && !isMatch(crop)) return false;
    if (season === "all") return true;
    if (season === "cool") {
      return crop.tags.some(function (tag) {
        return tag.indexOf("Cool") !== -1;
      });
    }
    return crop.category === season;
  }

  function renderResults() {
    const grid = document.getElementById("results-grid");
    const empty = document.getElementById("results-empty");
    if (!grid) return;
    const season = (document.getElementById("filter-season") || {}).value || "all";
    const water = (document.getElementById("filter-water") || {}).value || "all";
    const matchMode = (document.getElementById("filter-match") || {}).value || "all";
    const list = CROPS.filter(function (crop) {
      return cropPassesFilters(crop, season, water, matchMode);
    });
    grid.innerHTML = list.map(cropCardHtml).join("");
    if (empty) empty.classList.toggle("hidden", list.length > 0);
  }

  function cityFromCoords(lat, lon) {
    /* Coarse India bounding boxes for the prototype — not real reverse geocoding. */
    if (lat > 30.5 && lon > 76.5 && lon < 78.5) return CITIES.shimla;
    if (lat > 28 && lat < 29.2 && lon > 76.8 && lon < 77.6) return CITIES.delhi;
    if (lat > 26.5 && lat < 27.2 && lon > 80.7 && lon < 81.2) return CITIES.lucknow;
    if (lat > 26.7 && lat < 27.1 && lon > 75.5 && lon < 76) return CITIES.jaipur;
    if (lat > 22.3 && lat < 22.8 && lon > 88.2 && lon < 88.5) return CITIES.kolkata;
    if (lat > 18.3 && lat < 18.7 && lon > 73.7 && lon < 74) return CITIES.pune;
    if (lat > 12.8 && lat < 13.2 && lon > 77.4 && lon < 77.8) return CITIES.bengaluru;
    if (lat > 12.9 && lat < 13.2 && lon > 80.1 && lon < 80.4) return CITIES.chennai;
    if (lat >= 20) return CITIES.delhi;
    return CITIES.bengaluru;
  }

  function lookupCity(query) {
    const key = String(query || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");
    if (!key) return null;
    if (CITIES[key]) return CITIES[key];
    const names = Object.keys(CITIES);
    for (let i = 0; i < names.length; i += 1) {
      const city = CITIES[names[i]];
      if (!city) continue;
      if (city.location.toLowerCase().indexOf(key) !== -1) return city;
      if (city.locationHi.indexOf(query.trim()) !== -1) return city;
    }
    return null;
  }

  function goToResultsSoon() {
    window.setTimeout(function () {
      window.location.href = "results.html";
    }, 650);
  }

  function bindLocationPage() {
    const geoBtn = document.getElementById("geo-btn");
    const geoStatus = document.getElementById("geo-status");
    const form = document.getElementById("city-form");
    const cityStatus = document.getElementById("city-status");
    if (geoBtn) {
      geoBtn.addEventListener("click", function () {
        if (!navigator.geolocation) {
          geoStatus.textContent = t("gpsUnsupported");
          geoStatus.setAttribute("data-tone", "warn");
          return;
        }
        geoStatus.textContent = lang === "hi" ? "पता लगाया जा रहा है…" : "Detecting…";
        geoStatus.removeAttribute("data-tone");
        navigator.geolocation.getCurrentPosition(
          function (pos) {
            const next = cityFromCoords(pos.coords.latitude, pos.coords.longitude);
            saveWeather({ ...next });
            geoStatus.textContent = t("gpsOk");
            geoStatus.setAttribute("data-tone", "ok");
            goToResultsSoon();
          },
          function () {
            geoStatus.textContent = t("gpsDenied");
            geoStatus.setAttribute("data-tone", "warn");
          },
          { enableHighAccuracy: false, timeout: 8000 }
        );
      });
    }
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        const input = document.getElementById("city-input");
        const found = lookupCity(input.value);
        if (!found) {
          cityStatus.textContent = t("cityMiss");
          cityStatus.setAttribute("data-tone", "warn");
          return;
        }
        saveWeather({ ...found });
        cityStatus.textContent = t("cityOk");
        cityStatus.setAttribute("data-tone", "ok");
        goToResultsSoon();
      });
    }
  }

  function selectedCropId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("crop") || localStorage.getItem(STORAGE_CROP) || CROPS[0].id;
  }

  function renderGuide() {
    const select = document.getElementById("crop-select");
    const timeline = document.getElementById("guide-timeline");
    const meta = document.getElementById("guide-meta");
    if (!select || !timeline) return;

    if (!select.options.length) {
      CROPS.forEach(function (crop) {
        const opt = document.createElement("option");
        opt.value = crop.id;
        opt.textContent = crop.name + " / " + crop.nameHi;
        select.appendChild(opt);
      });
    }

    const desired = selectedCropId();
    if (
      CROPS.some(function (item) {
        return item.id === desired;
      })
    ) {
      select.value = desired;
    }
    const crop =
      CROPS.find(function (item) {
        return item.id === select.value;
      }) || CROPS[0];
    localStorage.setItem(STORAGE_CROP, crop.id);

    const tags = lang === "hi" ? crop.tagsHi : crop.tags;
    const harvest = lang === "hi" ? crop.harvestDaysHi : crop.harvestDays;
    meta.innerHTML =
      tags.map(function (tag) {
        return '<span class="badge">' + tag + "</span>";
      }).join("") +
      '<span class="badge">' +
      t("harvest") +
      ": " +
      harvest +
      "</span>" +
      (isMatch(crop) ? '<span class="badge badge--match">' + t("match") + "</span>" : "");

    timeline.innerHTML = STAGE_ORDER.map(function (stage) {
      const n = STAGE_ORDER.indexOf(stage) + 1;
      const title = STAGE_LABEL[stage][lang];
      const body = crop.guide[stage][lang];
      const active = stage === guideStage ? " is-active" : "";
      return (
        '<article class="timeline-item' +
        active +
        '" id="stage-' +
        stage +
        '">' +
        '<div class="timeline-marker" aria-hidden="true">' +
        n +
        "</div>" +
        '<div class="timeline-body"><h3>' +
        title +
        "</h3><p>" +
        body +
        "</p></div></article>"
      );
    }).join("");
  }

  function bindGuidePage() {
    const select = document.getElementById("crop-select");
    const tabs = document.getElementById("guide-tabs");
    if (!select) return;
    select.addEventListener("change", function () {
      localStorage.setItem(STORAGE_CROP, select.value);
      const url = new URL(window.location.href);
      url.searchParams.set("crop", select.value);
      window.history.replaceState({}, "", url);
      renderGuide();
    });
    if (tabs) {
      tabs.addEventListener("click", function (event) {
        const btn = event.target.closest("[data-stage]");
        if (!btn) return;
        guideStage = btn.getAttribute("data-stage");
        tabs.querySelectorAll("[data-stage]").forEach(function (el) {
          el.setAttribute("aria-selected", String(el === btn));
        });
        renderGuide();
        const target = document.getElementById("stage-" + guideStage);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }
    renderGuide();
  }

  function bindChrome() {
    document.querySelectorAll(".lang-switch [data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        lang = btn.getAttribute("data-lang");
        localStorage.setItem(STORAGE_LANG, lang);
        applyI18n();
        renderFeatured();
        renderResults();
        renderGuide();
      });
    });

    const toggle = document.querySelector(".menu-toggle");
    const nav = document.getElementById("primary-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        const open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      });
    }

    const filters = document.getElementById("filter-form");
    if (filters) {
      filters.addEventListener("change", renderResults);
    }
  }

  bindChrome();
  applyI18n();
  renderFeatured();
  renderResults();
  bindLocationPage();
  bindGuidePage();
})();
