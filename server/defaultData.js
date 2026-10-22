export const defaultDatabase = {
  siteSettings: {
    coupleNames: "Elena Vance & Julian Sterling",
    shortNames: "Elena & Julian",
    heroEyebrow: "✦ Autumn Twilight Celebration • Till Death Do Us Party ✦",
    weddingDate: "2027-10-23T17:00:00",
    weddingDateDisplay: "Saturday, October 23, 2027",
    locationSummary: "Tarrytown • Hudson Valley, New York",
    rsvpDeadline: "September 15, 2027",
    hashtag: "#TillDeathDoUsParty2027",
    theme: "cathedral-roses",
    customColors: {
      enabled: false,
      bgPrimary: "#090608",
      bgSecondary: "#120b10",
      bgCard: "#180f15",
      accentPrimary: "#9e1b32",
      accentSecondary: "#c89d66",
      textPrimary: "#f5ebe6"
    },
    adminPasscode: "wedding2026",
    heroBannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1800&q=85",
    heroBannerCrop: { x: 50, y: 40, zoom: 1 },
    heroTagline: "Beneath pointed cathedral archways, dark Baccara roses, and the October moon, we invite you to celebrate our union.",
    topBarText: "Wedding Celebration",
    weddingPartyBtnText: "Wedding Party Portal",
    footerText: "Forever & Always Beneath the October Moon",
    bigTabs: [
      {
        id: "about",
        step: "01 • Kindred Spirits",
        title: "About Us",
        subtitle: "Our autumn story, portraits & wedding party",
        icon: "Heart",
        visible: true
      },
      {
        id: "ceremony",
        step: "02 • Twilight Vows",
        title: "Ceremony",
        subtitle: "Candlelit manor gardens, attire & shuttles",
        icon: "Sparkles",
        visible: true
      },
      {
        id: "reception",
        step: "03 • The Feast",
        title: "Reception",
        subtitle: "Conservatory banquet, apothecary bar & hotels",
        icon: "Wine",
        visible: true
      },
      {
        id: "rsvp",
        step: "04 • Respond",
        title: "QR Code RSVP",
        subtitle: "Scan your invitation QR or enter your code",
        icon: "QrCode",
        visible: true
      }
    ]
  },
  aboutUs: {
    kicker: "01 • About The Couple",
    headline: "Our Story & Kindred Spirits",
    subheadline: "Seven autumns of midnight coffee, rain-slicked cobblestones, vintage vinyl, and one forever ahead.",
    divider: "✦ 🍂 ✦",
    showBottomBanner: true,
    bottomBannerTitle: "Join Us Under the October Moon",
    bottomBannerSubtitle: "Explore our candlelit ceremony details, autumn feast menu, or scan your invitation QR code to RSVP.",
    bottomBannerPrimaryText: "View Twilight Ceremony",
    bottomBannerPrimaryTab: "ceremony",
    bottomBannerSecondaryText: "Open QR Code RSVP",
    bottomBannerSecondaryTab: "rsvp",
    blocks: [
      {
        id: "block-quote-countdown",
        type: "quote_countdown",
        title: "Romantic Quote & Live Countdown",
        visible: true,
        settings: {
          noteLabel: "A NOTE FROM ELENA & JULIAN",
          quote: "Whatever our souls are made of, yours and mine are the same.",
          subtext: "Join us beneath the October moon as we begin our next chapter.",
          showCountdown: true
        }
      },
      {
        id: "block-couple-profiles",
        type: "couple_profiles",
        kicker: "The Couple",
        title: "Bride & Groom Portraits",
        visible: true,
        settings: {
          frameStyle: "gothic-arch",
          columns: 2
        },
        items: [
          {
            id: "partner-1",
            name: "Elena Marie Vance",
            role: "The Bride",
            photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
            bio: "A historic architectural preservationist with a love for Victorian greenhouses, dark roast espresso, antique velvet, and crisp October road trips. Elena fell for Julian the night they got locked inside a rare bookshop during an autumn thunderstorm.",
            funFact: "Collected over 80 vintage brass candlesticks for our reception tables."
          },
          {
            id: "partner-2",
            name: "Julian Arthur Sterling",
            role: "The Groom",
            photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
            bio: "An acoustic luthier, vinyl collector, and amateur smokehouse chef. Julian spent five months secretly crafting a custom heirloom ring box from reclaimed black walnut before proposing beneath the redwoods at twilight.",
            funFact: "Arranged a string quartet cover of our favorite post-punk ballad for the processional."
          }
        ]
      },
      {
        id: "block-story-timeline",
        type: "timeline",
        kicker: "How We Got Here",
        title: "Chapters of Our Story",
        subtitle: "Every milestone that led us to Ravenswood Manor",
        visible: true,
        settings: {
          alternating: true
        },
        items: [
          {
            id: "st-1",
            year: "October 2020",
            title: "A Stormy Night at the Rare Bookshop",
            location: "Salem, MA",
            description: "We reached for the same leather-bound volume of Edgar Allan Poe during an October downpour and spent the next four hours talking over spiced cider by a fireplace.",
            image: "https://images.unsplash.com/photo-1507842229356-51c61504d3ab?auto=format&fit=crop&w=900&q=80"
          },
          {
            id: "st-2",
            year: "November 2022",
            title: "Our First Brownstone & Adopting Poe",
            location: "Beacon Hill, Boston",
            description: "We moved into a historic third-floor walkup with creaky mahogany floors and adopted Poe, our jet-black rescue hound who immediately claimed the velvet armchair.",
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80"
          },
          {
            id: "st-3",
            year: "October 2025",
            title: "A Twilight Proposal in the Misty Woods",
            location: "Hudson Valley, NY",
            description: "Surrounded by peak crimson and amber autumn foliage, lantern light, and distant church bells at dusk, Julian got down on one knee on an old stone bridge.",
            image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80"
          },
          {
            id: "st-4",
            year: "October 23, 2027",
            title: "Till Death Do Us Party at Ravenswood Manor",
            location: "Tarrytown, NY",
            description: "Now we gather with our favorite people on earth to exchange vows by candlelight beneath ancient weeping oaks and dance until the witching hour.",
            image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80"
          }
        ]
      },
      {
        id: "block-wedding-party",
        type: "wedding_party",
        kicker: "Standing By Our Side",
        title: "The Wedding Party",
        subtitle: "Our dearest friends and siblings",
        visible: true,
        settings: {
          columns: 4
        },
        items: [
          {
            id: "wp-1",
            name: "Camille Vance",
            role: "Maid of Honor",
            relation: "Sister of the Bride",
            bio: "Elena's younger sister, keeper of all secrets, and fellow lover of autumn ghost tours and dark chocolate.",
            photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
          },
          {
            id: "wp-2",
            name: "Marcus Chen",
            role: "Best Man",
            relation: "Bandmate & Confidant",
            bio: "Julian's longtime friend and vinyl hunting partner who helped stage the lantern-lit proposal in the woods.",
            photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
          },
          {
            id: "wp-3",
            name: "Sophia Alverez",
            role: "Bridesmaid",
            relation: "Studio Partner",
            bio: "Met Elena on day one of architecture school and helped source every dark calla lily and burgundy dahlia for tonight.",
            photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
          },
          {
            id: "wp-4",
            name: "Devon Sterling",
            role: "Groomsman",
            relation: "Brother of the Groom",
            bio: "Julian's older brother, craft bourbon aficionado, and guaranteed to keep the dance floor alive until midnight.",
            photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80"
          }
        ]
      },
      {
        id: "block-gallery",
        type: "gallery",
        kicker: "Captured Moments",
        title: "Autumn Engagement Gallery",
        subtitle: "A glimpse into our October session in Sleepy Hollow",
        visible: true,
        settings: {
          columns: 4,
          aspectRatio: "landscape"
        },
        items: [
          {
            id: "gal-1",
            url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80",
            caption: "Autumn twilight engagement session in Sleepy Hollow"
          },
          {
            id: "gal-2",
            url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
            caption: "Wrought-iron gates at Ravenswood Estate"
          },
          {
            id: "gal-3",
            url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80",
            caption: "October leaves & velvet attire"
          },
          {
            id: "gal-4",
            url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
            caption: "Candlelight menu tasting evening"
          }
        ]
      }
    ]
  },
  ceremony: {
    kicker: "02 • The Vow Exchange",
    headline: "The Twilight Ceremony",
    subheadline: "A candlelit autumn vow exchange beneath the stone gothic arches and crimson oaks",
    divider: "✦ 🥀 ✦",
    blocks: [
      {
        id: "block-ceremony-venue",
        type: "venue_showcase",
        title: "Ceremony Venue Showcase",
        visible: true,
        settings: {
          badge: "Ceremony Venue",
          venueName: "Ravenswood Manor & Stone Abbey Gardens",
          venueAddress: "440 Old Sleepy Hollow Road, Tarrytown, NY 10591",
          heroImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=85",
          imagePosition: "left",
          mapUrl: "https://maps.google.com/?q=Tarrytown+NY+10591",
          ctaText: "See Reception Details",
          ctaTargetTab: "reception",
          highlights: [
            { label: "Date", value: "Saturday, October 23, 2027" },
            { label: "Gates Open", value: "4:30 PM (Dusk)" },
            { label: "Processional", value: "5:00 PM Sharp" },
            { label: "Officiant", value: "Rev. Clara Hawthorne" }
          ]
        }
      },
      {
        id: "block-ceremony-order",
        type: "order_cards",
        kicker: "Timeline of Vows",
        title: "Ceremony Order of Events",
        subtitle: "From hot spiced cider at dusk to our lantern-lit recessional",
        visible: true,
        settings: {
          columns: 3
        },
        items: [
          {
            id: "ce-1",
            badge: "4:30 PM",
            title: "Hot Spiced Cider & Cello Prelude",
            description: "Arrive as the sun dips below the Hudson River to enjoy mulled pear cider, black fig canapés, and hauntingly romantic strings."
          },
          {
            id: "ce-2",
            badge: "5:00 PM",
            title: "Candlelit Processional & Vows",
            description: "Beneath the ivy-draped stone arch surrounded by 300 flickering pillar candles and autumn foliage."
          },
          {
            id: "ce-3",
            badge: "5:35 PM",
            title: "Ring Exchange & Rose Petal Exit",
            description: "Toss burgundy & black baccara rose petals as we walk back down the lantern-lit aisle as husband and wife!"
          }
        ]
      },
      {
        id: "block-ceremony-details",
        type: "feature_grid",
        kicker: "Guest Guidance",
        title: "Attire, Etiquette & Arrival",
        visible: true,
        settings: {
          columns: 3
        },
        items: [
          {
            id: "fg-1",
            icon: "Sparkles",
            kicker: "Attire Guidance",
            title: "Autumn Goth & Moody Black-Tie",
            description: "Embrace the romance of dark autumn! We encourage velvet, satin, lace, and tailored suiting in obsidian black, oxblood burgundy, deep plum, emerald, or burnished copper."
          },
          {
            id: "fg-2",
            icon: "CameraOff",
            kicker: "Be Present With Us",
            title: "Unplugged Twilight Ceremony",
            description: "As the lanterns are lit and the cello prelude begins, we ask that you tuck away all phones and cameras so you can be fully in the magic of the dusk with us."
          },
          {
            id: "fg-3",
            icon: "Car",
            kicker: "Arrival & Valet",
            title: "Manor Valet & Trolley Shuttles",
            description: "Complimentary valet service awaits at the wrought-iron manor gates. Vintage trolley shuttles also depart from The Castle Hotel and The Abbey Inn at 4:00 PM sharp."
          }
        ]
      },
      {
        id: "block-ceremony-faq",
        type: "faq_grid",
        kicker: "Good To Know",
        title: "Ceremony Questions & Answers",
        visible: true,
        settings: {
          columns: 3
        },
        items: [
          {
            id: "faq-1",
            question: "How chilly will the October twilight ceremony be?",
            answer: "Late October dusk in the Hudson Valley typically rests in the mid-50s°F. The stone courtyard features cast-iron fire braziers and black cashmere pashminas."
          },
          {
            id: "faq-2",
            question: "Can we lean into the Fall Goth aesthetic with our outfits?",
            answer: "Wholeheartedly YES! Velvet dinner jackets, dark floral gowns, dramatic lace sleeves, antique brooches, and dark formalwear are deeply encouraged."
          },
          {
            id: "faq-3",
            question: "Are children invited to the celebration?",
            answer: "Our ceremony and candlelit reception will be an adults-only evening. Check your personalized QR RSVP card for the exact guests included in your party."
          }
        ]
      }
    ]
  },
  reception: {
    kicker: "03 • Dinner, Wine & Dancing",
    headline: "The Candlelit Conservatory Feast",
    subheadline: "An autumn banquet of dark botanicals, smoked cocktails, and dancing under the glass dome",
    divider: "✦ 🕯️ ✦",
    menuOptions: [
      {
        id: "meal-filet",
        name: "Blackberry-Port Braised Short Rib & Filet Duo",
        tag: "Beef • Gluten-Free",
        description: "Served over roasted garlic parsnip purée, charred broccolini, caramelized cipollini onions, and cabernet-thyme reduction."
      },
      {
        id: "meal-halibut",
        name: "Cider-Glazed Atlantic Black Cod",
        tag: "Seafood • Gluten-Free",
        description: "Served with forbidden black heirloom rice, roasted honeynut squash, crispy sage, and brown butter hazelnut emulsion."
      },
      {
        id: "meal-risotto",
        name: "Foraged Black Trumpet & Truffle Risotto",
        tag: "Vegetarian / Vegan Option",
        description: "Creamy Acquerello rice simmered with wild autumn mushrooms, aged parmigiano (or smoked cashew crema), and charred herb oil."
      }
    ],
    blocks: [
      {
        id: "block-reception-venue",
        type: "venue_showcase",
        title: "Reception Venue Showcase",
        visible: true,
        settings: {
          badge: "Evening Celebration",
          venueName: "The Victorian Ironwood Conservatory",
          venueAddress: "440 Old Sleepy Hollow Road (North Manor Wing), Tarrytown, NY 10591",
          heroImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=85",
          imagePosition: "right",
          mapUrl: "https://maps.google.com/?q=Tarrytown+NY+10591",
          ctaText: "Select Your Entrée on the QR RSVP Page",
          ctaTargetTab: "rsvp",
          highlights: [
            { label: "Cocktail Hour", value: "5:45 PM – 7:00 PM" },
            { label: "Candlelit Feast", value: "7:00 PM – 9:00 PM" },
            { label: "Band & Dancing", value: "9:00 PM – Midnight" },
            { label: "Grand Finale", value: "12:00 AM Sparkler Exit" }
          ]
        }
      },
      {
        id: "block-reception-menu",
        type: "dinner_menu",
        kicker: "Chef's Autumn Table",
        title: "Plated Dinner Entrée Selections",
        subtitle: "All entrées are preceded by Roasted Butternut Squash & Crispy Sage Bisque and warm Black Garlic Brioche. Reordering or editing entrées here automatically updates the QR RSVP form!",
        visible: true,
        settings: {
          columns: 3
        },
        items: [
          {
            id: "meal-filet",
            name: "Blackberry-Port Braised Short Rib & Filet Duo",
            tag: "Beef • Gluten-Free",
            description: "Served over roasted garlic parsnip purée, charred broccolini, caramelized cipollini onions, and cabernet-thyme reduction."
          },
          {
            id: "meal-halibut",
            name: "Cider-Glazed Atlantic Black Cod",
            tag: "Seafood • Gluten-Free",
            description: "Served with forbidden black heirloom rice, roasted honeynut squash, crispy sage, and brown butter hazelnut emulsion."
          },
          {
            id: "meal-risotto",
            name: "Foraged Black Trumpet & Truffle Risotto",
            tag: "Vegetarian / Vegan Option",
            description: "Creamy Acquerello rice simmered with wild autumn mushrooms, aged parmigiano (or smoked cashew crema), and charred herb oil."
          }
        ]
      },
      {
        id: "block-reception-vibes",
        type: "feature_grid",
        kicker: "Atmosphere & Libations",
        title: "Music, Tarot Lounge & Apothecary Bar",
        visible: true,
        settings: {
          columns: 2
        },
        items: [
          {
            id: "rv-1",
            icon: "Music",
            kicker: "Live Music & Tarot Lounge",
            title: "Soundtrack of the Night",
            description: "Chamber string quartet during cocktail hour, followed by The Midnight Velvet 8-piece dark-soul, classic rock & synth-wave band, plus tarot card readers in the library lounge."
          },
          {
            id: "rv-2",
            icon: "Wine",
            kicker: "Smoked Cocktails & Reserve Wines",
            title: "From the Apothecary Bar",
            description: "Full open bar featuring Smoked Blackberry Bourbon Smash, Blood Orange & Rosemary Gin Fizz, Hudson Valley reserve reds, and zero-proof Pomegranate Smoke elixirs."
          }
        ]
      },
      {
        id: "block-reception-schedule",
        type: "schedule_list",
        kicker: "Order of the Evening",
        title: "Reception Timeline",
        visible: true,
        settings: {},
        items: [
          {
            id: "rec-1",
            time: "5:45 PM",
            title: "Apothecary Cocktail Hour & Library Lounge",
            description: "Raw bar, artisanal aged cheeses, charcuterie, smoked cocktails, and live tarot readings by the manor hearth."
          },
          {
            id: "rec-2",
            time: "7:00 PM",
            title: "Grand Entrance & Candlelit Banquet",
            description: "Three-course autumn feast beneath the conservatory glass dome, preceded by roasted butternut & sage bisque."
          },
          {
            id: "rec-3",
            time: "8:45 PM",
            title: "Spiced Fig & Dark Chocolate Cake Cutting",
            description: "Four-tier black cocoa, blackberry, and salted caramel cake cutting followed by our first dance."
          },
          {
            id: "rec-4",
            time: "9:15 PM",
            title: "Dancing Under the Moon & Warm Cider Donuts",
            description: "Hit the dance floor with The Midnight Velvet! Warm apple cider donuts and espresso martinis served at 10:45 PM."
          },
          {
            id: "rec-5",
            time: "12:00 AM",
            title: "Witching Hour Sparkler Send-Off",
            description: "Send us off through a tunnel of gold sparklers! Return shuttles depart at 10:30 PM, 11:30 PM, and 12:15 AM."
          }
        ]
      },
      {
        id: "block-reception-hotels",
        type: "accommodations",
        kicker: "Where to Stay",
        title: "Hotel Room Blocks & Shuttles",
        subtitle: "Preferred group rates at historic Hudson Valley properties",
        visible: true,
        settings: {
          columns: 2
        },
        items: [
          {
            id: "hotel-1",
            name: "The Castle Hotel & Spa Tarrytown",
            distance: "6 minutes from Manor (Shuttle Stop #1)",
            rate: "$295 / night (Group Block Rate)",
            bookingCode: "VANCESTERLING27",
            phone: "(914) 555-0142",
            notes: "A turn-of-the-century Norman-style stone castle overlooking the Hudson River foliage. Book by September 1, 2027."
          },
          {
            id: "hotel-2",
            name: "The Abbey Inn & Spa",
            distance: "12 minutes from Manor (Shuttle Stop #2)",
            rate: "$245 / night (Group Block Rate)",
            bookingCode: "AUTUMNWEDDING",
            phone: "(914) 555-0198",
            notes: "A restored 19th-century convent perched on the Hudson highlands with sweeping autumn views."
          }
        ]
      }
    ]
  },
  weddingPartyPage: {
    kicker: "05 • Inner Circle & Bridal Party Portal",
    headline: "Wedding Party Exclusive Dossier",
    subheadline: "Private rehearsal dinner details, hair & makeup call times, portrait schedules, attire notes, and day-of contacts exclusively for our wedding party.",
    divider: "✦ 🥀 ✦",
    blocks: [
      {
        id: "block-wp-rehearsal",
        type: "venue_showcase",
        title: "Rehearsal Walk-Through & Candlelit Cellar Dinner",
        visible: true,
        settings: {
          badge: "Friday Evening • Day Before the Wedding",
          venueName: "The Wine Vaults at Sleepy Hollow Tavern",
          ceremonyTime: "4:30 PM Ceremony Rehearsal • 6:30 PM Rehearsal Dinner",
          doorsOpen: "Meet at Manor Cloister Archway at 4:15 PM sharp",
          address: "74 Old Post Road, Tarrytown, NY 10591",
          attire: "Cocktail Gothic / Dark Autumn Smart Casual",
          attireNote: "We will walk through the ceremony processional at 4:30 PM at the Manor, then head 5 minutes down the road for wood-fired fare, local vintages, and toasts.",
          parking: "Complimentary private shuttle from Castle Hotel departs at 3:55 PM.",
          accessibility: "Private cellar dining room reserved exclusively for the Wedding Party & Immediate Family.",
          mapUrl: "https://maps.google.com/?q=Tarrytown+NY",
          venueImageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
          venueImageCrop: { x: 50, y: 50, zoom: 1 },
          imagePosition: "left",
          highlights: [
            { label: "Rehearsal Call Time", value: "4:15 PM at Manor" },
            { label: "Rehearsal Dinner", value: "6:30 PM at Wine Vaults" },
            { label: "Who Is Invited", value: "Wedding Party + Dates & Immediate Family" },
            { label: "Toasts & Roasts", value: "Open Mic After Dinner" }
          ]
        }
      },
      {
        id: "block-wp-schedule",
        type: "schedule_list",
        kicker: "Wedding Day Call Sheet",
        title: "Behind-the-Scenes Wedding Party Timeline",
        subtitle: "Please arrive on time to the suites—breakfast, espresso, and champagne will be waiting!",
        visible: true,
        items: [
          {
            id: "wps-1",
            time: "9:30 AM",
            title: "Bridal Suite Opens • Hair, Makeup & Mimosa Breakfast",
            description: "North Tower Conservatory Suite (Room 402). Please arrive with clean, dry hair and a button-down or robe."
          },
          {
            id: "wps-2",
            time: "11:30 AM",
            title: "Groom's Parlor Opens • Espresso, Whiskey & Suit Steaming",
            description: "The Library Lounge (Ground Floor). Barber touch-ups, boutonniere pinning, and lunch."
          },
          {
            id: "wps-3",
            time: "2:15 PM",
            title: "All Wedding Party Fully Dressed for Portraits",
            description: "Meet in the Stone Courtyard with bouquets and boutonnieres for Wedding Party & Immediate Family portraits."
          },
          {
            id: "wps-4",
            time: "4:15 PM",
            title: "Wedding Party Tucked Away & Lineup Refreshments",
            description: "Guests begin arriving at 4:30 PM. We will relax in the Cloister Parlor for final touch-ups before the 5:00 PM processional."
          },
          {
            id: "wps-5",
            time: "6:30 PM",
            title: "Grand Entrance into the Glasshouse Conservatory",
            description: "Line up by pairs with our coordinator for the reception entrance song!"
          }
        ]
      },
      {
        id: "block-wp-details",
        type: "feature_grid",
        kicker: "Essentials & Prep",
        title: "Attire, Florals & Day-Of Logistics",
        subtitle: "Everything you need to know before packing your weekend bags.",
        visible: true,
        settings: {
          columns: 3
        },
        items: [
          {
            id: "wpd-1",
            icon: "Sparkles",
            kicker: "Attire & Steaming",
            title: "Velvet, Black Tie & Footwear",
            description: "Two professional garment steamers will be in both suites. Bring comfortable flats or loafers for dancing after portraits!"
          },
          {
            id: "wpd-2",
            icon: "Heart",
            kicker: "Bouquets & Boutonnieres",
            title: "Delivered to Suites at 1:30 PM",
            description: "Our florist will deliver all dark Baccara rose bouquets and magnetic boutonnieres directly to the getting-ready suites."
          },
          {
            id: "wpd-3",
            icon: "Car",
            kicker: "Personal Belongings",
            title: "Locked Suite Storage",
            description: "Both getting-ready suites remain locked and reserved for us all night, so your bags and change of shoes stay safe until 11:30 PM."
          }
        ]
      },
      {
        id: "block-wp-contacts",
        type: "order_cards",
        kicker: "Who to Text",
        title: "Key Day-Of Contacts & Suite Numbers",
        subtitle: "Save these numbers in your phone for wedding weekend.",
        visible: true,
        settings: {
          columns: 3
        },
        items: [
          {
            id: "wpc-1",
            badge: "Lead Coordinator",
            title: "Genevieve Thorne (Day-Of Planner)",
            description: "(914) 555-0199 • Text for any timing, shuttle, attire emergency, or vendor questions."
          },
          {
            id: "wpc-2",
            badge: "Maid of Honor",
            title: "Clara Vance • Suite 402",
            description: "(917) 555-0144 • Point of contact for Bridal Suite, hair/makeup schedule, and bustle help."
          },
          {
            id: "wpc-3",
            badge: "Best Man",
            title: "Marcus Sterling • Library Parlor",
            description: "(646) 555-0181 • Point of contact for Groom's Parlor, rings, and rehearsal transportation."
          }
        ]
      }
    ]
  },
  rsvpPage: {
    kicker: "04 • Personalized QR Invitation",
    headline: "Respond to Your Invitation",
    subheadline: "Scan the unique QR code included with your wedding invitation—or enter your personal invitation code below—to unlock your household’s RSVP card.",
    divider: "✦ 🌙 ✦",
    scannerBadge: "Instant QR Code Access",
    scannerTitle: "Have Your Wedding QR Card?",
    scannerSubtitle: "Point your phone’s camera at the QR code on your paper invitation to open your RSVP automatically, use our built-in camera scanner, or type your personal invitation code.",
    cameraBtnText: "Scan QR with Camera",
    uploadBtnText: "Upload QR Image",
    codeInputLabel: "Enter Unique Invitation Code",
    codeInputPlaceholder: "e.g. ROSE-4829",
    unlockBtnText: "Unlock RSVP",
    codeInputHint: "Your unique code is printed directly below the QR square on your physical RSVP insert card.",
    showSampleTray: true,
    sampleTrayTitle: "Interactive Guest QR Code Preview Tray",
    sampleTraySubtitle: "Scan any QR below with your phone camera or click a guest card to test their personalized RSVP view:",
    blocks: []
  },
  guests: [
    {
      id: "guest-1",
      code: "ROSE-4829",
      householdName: "The Anderson Family",
      category: "Immediate Family",
      isWeddingParty: true,
      email: "claire.anderson@example.com",
      phone: "(415) 555-0182",
      tableNumber: "Table 3 • Black Baccara",
      personalNote: "Claire & David — We are so thrilled to celebrate with you both under the October moon! Your QR code also unlocks the Wedding Party Portal.",
      rsvpStatus: "responded",
      respondedAt: "2026-10-18T19:20:00.000Z",
      dietaryNotes: "No shellfish for David, please.",
      songRequest: "Lovesong - The Cure",
      messageToCouple: "We already have our dark velvet outfits picked out! Counting down the days!",
      members: [
        {
          id: "m-101",
          name: "Claire Anderson",
          attending: true,
          mealChoice: "Cider-Glazed Atlantic Black Cod",
          dietary: "None"
        },
        {
          id: "m-102",
          name: "David Anderson",
          attending: true,
          mealChoice: "Blackberry-Port Braised Short Rib & Filet Duo",
          dietary: "Shellfish allergy"
        }
      ]
    },
    {
      id: "guest-2",
      code: "OLIVE-7712",
      householdName: "Dr. Maya Lin & Plus One",
      category: "Friend",
      isWeddingParty: true,
      plusOnesAllowed: 1,
      email: "maya.lin@example.com",
      phone: "(206) 555-0149",
      tableNumber: "Table 5 • Nightshade",
      personalNote: "Maya! From rainy bookstore coffee runs to standing by our side—we reserved a +1 spot for you and unlocked your Wedding Party schedule!",
      rsvpStatus: "pending",
      respondedAt: null,
      dietaryNotes: "",
      songRequest: "",
      messageToCouple: "",
      members: [
        {
          id: "m-201",
          name: "Dr. Maya Lin",
          isPlusOne: false,
          attending: null,
          mealChoice: "",
          dietary: ""
        },
        {
          id: "m-202",
          name: "",
          isPlusOne: true,
          attending: null,
          mealChoice: "",
          dietary: ""
        }
      ]
    },
    {
      id: "guest-3",
      code: "CHAMP-1045",
      householdName: "The Bennett Household",
      category: "Family",
      isWeddingParty: false,
      email: "liam.bennett@example.com",
      phone: "(310) 555-0123",
      tableNumber: "Table 2 • Crimson Oak",
      personalNote: "Liam, Hannah & Eleanor — Having the whole Bennett crew with us in Sleepy Hollow means everything!",
      rsvpStatus: "pending",
      respondedAt: null,
      dietaryNotes: "",
      songRequest: "",
      messageToCouple: "",
      members: [
        {
          id: "m-301",
          name: "Liam Bennett",
          attending: null,
          mealChoice: "",
          dietary: ""
        },
        {
          id: "m-302",
          name: "Hannah Bennett",
          attending: null,
          mealChoice: "",
          dietary: ""
        },
        {
          id: "m-303",
          name: "Eleanor Bennett",
          attending: null,
          mealChoice: "",
          dietary: ""
        }
      ]
    },
    {
      id: "guest-4",
      code: "VELVET-9310",
      householdName: "Jordan & Taylor Brooks",
      category: "Friend",
      isWeddingParty: false,
      email: "jordan.brooks@example.com",
      phone: "(650) 555-0191",
      tableNumber: "Table 4 • Ironwood",
      personalNote: "Jordan & Taylor — Meet us at the apothecary bar for smoked blackberry bourbon smashes!",
      rsvpStatus: "responded",
      respondedAt: "2026-10-19T14:05:00.000Z",
      dietaryNotes: "Vegan risotto for Taylor",
      songRequest: "Dreams - Fleetwood Mac",
      messageToCouple: "Obsessed with the Fall Goth theme!! Castle hotel is booked!",
      members: [
        {
          id: "m-401",
          name: "Jordan Brooks",
          attending: true,
          mealChoice: "Blackberry-Port Braised Short Rib & Filet Duo",
          dietary: ""
        },
        {
          id: "m-402",
          name: "Taylor Brooks",
          attending: true,
          mealChoice: "Foraged Black Trumpet & Truffle Risotto",
          dietary: "Vegan preparation please"
        }
      ]
    },
    {
      id: "guest-5",
      code: "GARDEN-5581",
      householdName: "Arthur & Beatrice Montgomery",
      category: "Immediate Family",
      isWeddingParty: false,
      email: "amontgomery@example.com",
      phone: "(212) 555-0174",
      tableNumber: "Table 1 • Manor Hearth",
      personalNote: "Uncle Arthur & Aunt Beatrice — Thank you for all your love and wisdom over the years.",
      rsvpStatus: "responded",
      respondedAt: "2026-10-20T11:30:00.000Z",
      dietaryNotes: "",
      songRequest: "Spellbound - Siouxsie and the Banshees",
      messageToCouple: "With all our love! Sadly Beatrice is recovering from knee surgery that week, so Arthur will represent us both!",
      members: [
        {
          id: "m-501",
          name: "Arthur Montgomery",
          attending: true,
          mealChoice: "Cider-Glazed Atlantic Black Cod",
          dietary: "Low sodium"
        },
        {
          id: "m-502",
          name: "Beatrice Montgomery",
          attending: false,
          mealChoice: "",
          dietary: ""
        }
      ]
    }
  ],
  revisions: [
    {
      id: "rev-init",
      timestamp: "2026-10-21T23:35:00.000Z",
      section: "system",
      summary: "Initialized Drag-and-Drop Visual Block CMS & Fall Goth Wedding Theme"
    }
  ]
};
