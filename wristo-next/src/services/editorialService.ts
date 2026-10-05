import { EditorialArticle, ArticleWithProducts } from '@/types/editorial';
import { PRODUCTS } from '@/data/products';

const MASTER_ARTICLES: EditorialArticle[] = [
  {
    id: 'art-01',
    slug: 'architecture-of-automatic-calibers',
    title: 'The Architecture of Automatic Calibers: How Mechanical Hearts Beat',
    subtitle: 'From oscillating tungsten rotors to jewel escapements—the living mechanics behind kinetic self-winding movements.',
    excerpt: 'An automatic watch is fundamentally a kinetic organism. Every movement of your wrist winds the mainspring through an engineered oscillating weight, converting human motion into continuous horological poetry.',
    category: 'Technical Calibers',
    author: {
      name: 'Adrien de Beauharnais',
      role: 'Master Horologist & Restoration Specialist',
      avatar: '/assets/brand/curator-avatar.png',
      bio: 'Trained in the Vallée de Joux, Adrien has restored 18th-century minute repeaters and oversees WRISTO’s technical authenticity archives.'
    },
    publishedAt: 'October 1, 2026',
    readTime: '6 min read',
    coverImage: '/assets/products/watch-31.png',
    tags: ['Automatic Movement', 'Watchmaking Calibers', 'Tungsten Rotors', 'Escapements'],
    featuredProductIds: ['WRT-031', 'WRT-005', 'WRT-015'],
    contentSections: [
      {
        heading: 'The Kinetic Organism on the Wrist',
        paragraphs: [
          'In an era dominated by microprocessors and digital silicon, mechanical watchmaking endures because it accomplishes an improbable feat: it records the passage of the universe using only spring tension, interlocking gears, and inertial physics.',
          'Unlike battery-powered quartz movements that rely on the resonant oscillation of a synthetic tuning fork, an automatic watch is fundamentally a kinetic organism. It draws its lifeblood directly from the wearer. When you lift a coffee cup, sign an acquisition contract, or walk down a city boulevard, an off-center weighted rotor pivots on a jeweled ball bearing, winding the mainspring coiled within the barrel.'
        ],
        quote: {
          text: 'A mechanical watch does not tell you what the time is; it reminds you of what time means when crafted by human hands.',
          attribution: 'Adrien de Beauharnais, Master Horologist'
        }
      },
      {
        heading: 'The Escapement: Slicing Time into 21,600 Slices',
        paragraphs: [
          'If the mainspring is the engine, the escapement is the throttle. Left unchecked, the coiled spring would unwind in a violent, fraction-of-a-second blur. The Swiss anchor escapement prevents this catastrophe by meting out energy in microscopic increments.',
          'Operating typically at 21,600 or 28,800 vibrations per hour (vph), the balance wheel oscillates back and forth. With each swing, synthetic ruby pallet jewels lock and release the escape wheel teeth. That mechanical heartbeat is what produces the beloved, near-continuous sweep of a luxury automatic second hand.'
        ],
        callout: 'Did you know? Synthetic corundum (ruby) bearings are chosen not for ostentation, but because their friction coefficient against polished steel pivots is virtually zero, ensuring decades of accurate operation with microscopic lubricant decay.'
      },
      {
        heading: 'Rotor Metallurgy and Inertial Efficiency',
        paragraphs: [
          'To generate sufficient winding torque from minimal wrist movement, modern automatic rotors must balance mass against thickness. High-density metals such as heavy tungsten alloy or 21-karat gold are frequently employed along the outer perimeter of the rotor.',
          'This perimeter weighting maximizes the moment of inertia, ensuring that even sedentary desk work provides adequate power reserve—typically between 40 to 72 hours of autonomy when laid on your nightstand.'
        ]
      }
    ]
  },
  {
    id: 'art-02',
    slug: 'surgical-316l-vs-titanium-case-metallurgy',
    title: 'Surgical 316L vs. Titanium: Choosing Your Case Metallurgy',
    subtitle: 'A metallurgical breakdown of tensile strength, surface patination, hypoallergenic properties, and wrist presence.',
    excerpt: 'Selecting the metal of your watch case defines not merely how the timepiece looks, but how it feels over decades of daily wear. We analyze the tactile distinction between 316L surgical stainless steel and Grade 5 aerospace titanium.',
    category: 'Design & Metallurgy',
    author: {
      name: 'Kavita Singhania',
      role: 'Director of Materials & Horological Curation',
      avatar: '/assets/brand/curator-avatar.png',
      bio: 'With a degree in metallurgical engineering from Imperial College London, Kavita analyzes casing alloys, ceramic sintering, and physical vapor deposition coatings for WRISTO.'
    },
    publishedAt: 'September 24, 2026',
    readTime: '5 min read',
    coverImage: '/assets/products/watch-22.png',
    tags: ['316L Stainless Steel', 'Titanium Grade 5', 'Case Metallurgy', 'Ergonomics'],
    featuredProductIds: ['WRT-022', 'WRT-001', 'WRT-010'],
    contentSections: [
      {
        heading: 'The Foundation of Case Architecture',
        paragraphs: [
          'When an artisan designs a luxury watch, the case serves as both an armored bastion protecting a delicate micromechanical movement and a sculpted sculpture resting against human skin.',
          'For over a century, stainless steel has reigned as the quintessential horological metal. However, the rise of aerospace-grade titanium has introduced an intriguing debate for modern collectors: should you seek the reassuring substantial heft of cold-worked 316L, or the featherweight warmth of titanium?'
        ]
      },
      {
        heading: 'Surgical 316L: The Luster of Classical Durability',
        paragraphs: [
          'Surgical-grade 316L stainless steel contains high concentrations of chromium, nickel, and molybdenum. This chemical composition forms an invisible, self-healing chromium oxide passivation layer that makes it nearly impervious to seawater corrosion and human perspiration.',
          'Crucially, 316L steel possesses superior machineability and surface hardness. It accepts dramatic mirror-polishing (anglage) alongside satin-brushed chamfers, creating the high-contrast light play that distinguishes fine luxury watches across a candlelit dining room.'
        ],
        quote: {
          text: 'The weight of 316L steel on the wrist provides a subconscious psychological grounding. You never forget you are wearing an instrument of consequence.',
          attribution: 'Kavita Singhania'
        }
      },
      {
        heading: 'Grade 5 Titanium: Aerospace Performance and Thermal Neutrality',
        paragraphs: [
          'Grade 5 titanium (Ti-6Al-4V) is alloyed with 6% aluminum and 4% vanadium. It delivers an astonishing strength-to-weight ratio: approximately 45% lighter than steel while boasting higher tensile resilience.',
          'Equally notable is its thermal conductivity. While steel initially feels icy against the skin on a winter morning, titanium rapidly acclimates to body temperature. Furthermore, it is 100% hypoallergenic, making it the definitive choice for sensitive skin.'
        ],
        callout: 'Collector Verdict: Choose 316L stainless steel for formal boardroom and gala elegance where razor-sharp light reflections matter. Opt for titanium for expeditions, aviator chronographs, and daily sport horology.'
      }
    ]
  },
  {
    id: 'art-03',
    slug: 'collectors-guide-to-chronographs',
    title: 'A Collector’s Guide to Chronograph Sub-Dials and Tachymeter Scales',
    subtitle: 'Deciphering the dials of horology’s most celebrated complication—from split-seconds to motorsport velocity calculations.',
    excerpt: 'The chronograph is the quintessential functional complication. Born on racetracks and flight decks, its twin pushers and sub-registers transform a passive clock into an active instrument of athletic precision.',
    category: 'Collector Guide',
    author: {
      name: 'Adrien de Beauharnais',
      role: 'Master Horologist & Restoration Specialist',
      avatar: '/assets/brand/curator-avatar.png',
      bio: 'Trained in the Vallée de Joux, Adrien has restored 18th-century minute repeaters and oversees WRISTO’s technical authenticity archives.'
    },
    publishedAt: 'September 15, 2026',
    readTime: '7 min read',
    coverImage: '/assets/products/watch-11.png',
    tags: ['Chronographs', 'Tachymeter Scale', 'Sub-Dials', 'Motorsport Timing'],
    featuredProductIds: ['WRT-011', 'WRT-012', 'WRT-014'],
    contentSections: [
      {
        heading: 'The Instrument of Measured Seconds',
        paragraphs: [
          'No horological complication is as deeply intertwined with adrenaline, speed, and aviation as the chronograph. While a standard three-hand watch is passive—simply displaying the unrelenting flow of time—a chronograph invites human intervention.',
          'With a crisp click of the 2 o’clock pusher, you command time to start. With another click, you freeze the second hand in place. Through this tactile interface, the watch transforms from an ornament into an active scientific stopwatch.'
        ]
      },
      {
        heading: 'Deconstructing the Tri-Compax Sub-Dial Dial Layout',
        paragraphs: [
          'Collectors frequently encounter the term "Compax"—originating from vintage mid-century designs. A classic three-register chronograph typically delegates responsibilities across its dial landscape:',
          '1. The Running Seconds Register (usually at 9 o’clock): Unlike a standard watch, the central seconds hand stays parked at 12 o’clock until activated. Running time is monitored via this miniature sub-dial.',
          '2. The 30-Minute Totalizer (typically at 3 o’clock): Accumulates elapsed chronograph minutes in crisp single-minute jumps.',
          '3. The 12-Hour Counter (positioned at 6 o’clock): Tracks extended timing intervals for endurance races and intercontinental flight legs.'
        ],
        quote: {
          text: 'The symmetry of a tri-compax dial is an exercise in graphic balance. It must convey high-density telemetry without sacrificing instantaneous legibility.',
          attribution: 'Adrien de Beauharnais'
        }
      },
      {
        heading: 'How to Actually Use the Tachymeter Bezel',
        paragraphs: [
          'Most chronograph owners admire the numeric markings engraved around the outer bezel without ever calculating a single velocity. Yet using a tachymeter is disarmingly simple:',
          'Start the chronograph when passing a highway kilometer milestone. When you pass the next kilometer milestone exactly one kilometer later, stop the chronograph. The central chronograph seconds hand points directly to your average speed in kilometers per hour on the bezel scale.'
        ]
      }
    ]
  },
  {
    id: 'art-04',
    slug: 'resurgence-of-the-dress-watch',
    title: 'The Resurgence of the Dress Watch: Why 38mm is the New Standard',
    subtitle: 'After two decades of oversized steel tool watches, horological connoisseurship is celebrating mid-century restraint.',
    excerpt: 'The pendulum of luxury horology is swinging back toward quiet discretion. We explore why collectors worldwide are setting aside 45mm divers in favor of svelte 38mm dress watches with unblemished enamel dials and calfskin straps.',
    category: 'Horological Heritage',
    author: {
      name: 'Julian Thorne',
      role: 'Horological Journalist & Style Critic',
      avatar: '/assets/brand/curator-avatar.png',
      bio: 'Former editor at Geneva Horology Quarterly, Julian writes extensively on luxury silhouettes, bespoke tailoring, and vintage watch trends.'
    },
    publishedAt: 'September 08, 2026',
    readTime: '5 min read',
    coverImage: '/assets/products/watch-02.png',
    tags: ['Dress Watches', '38mm Case Size', 'Quiet Luxury', 'Mid-Century Style'],
    featuredProductIds: ['WRT-002', 'WRT-003', 'WRT-001'],
    contentSections: [
      {
        heading: 'The Fatigue of the Wrist Behemoth',
        paragraphs: [
          'For the past twenty years, horological marketing was dominated by an arms race of sheer mass. Oversized 44mm to 48mm dive watches with helium escape valves and multi-pound steel bracelets were worn with business suits, forcing tailored shirtmakers to widen cuffs.',
          'Today, that era of ostentation has hit saturation. A sophisticated counter-revolution has taken root—one driven by the philosophy of "Quiet Luxury" and an appreciation for harmonic human anatomy.'
        ],
        quote: {
          text: 'Elegance is not about being noticed; it is about being remembered with reverence.',
          attribution: 'Julian Thorne'
        }
      },
      {
        heading: 'The 38mm Sweet Spot: Universal Proportionality',
        paragraphs: [
          'Why has 38mm emerged as the undisputed sweet spot? It satisfies both vintage sensibility and contemporary taste. While vintage dress pieces of the 1950s measured 33mm to 35mm—which can appear diminutive on modern wrists—38mm provides sufficient dial real estate while remaining virtually flush against the wrist bone.',
          'At 38mm, an unadorned silver or sunburst dial commands the gaze not through aggressive diameter, but through the perfection of its typography, the depth of its rhodium-plated faceted hands, and the supple drape of an unpadded leather strap.'
        ]
      }
    ]
  },
  {
    id: 'art-05',
    slug: 'sapphire-crystal-vs-mineral-glass',
    title: 'Sapphire Crystal vs. Mineral Glass: What Protects Your Timepiece',
    subtitle: 'From synthetic Verneuil flame fusion to Mohs 9 scratch resistance—why sapphire crystal is non-negotiable for luxury timekeeping.',
    excerpt: 'The transparent window through which you observe the mechanical ballet is often taken for granted. We examine the atomic crystallography of synthetic sapphire versus mineral glass and acrylic crystals.',
    category: 'Technical Calibers',
    author: {
      name: 'Kavita Singhania',
      role: 'Director of Materials & Horological Curation',
      avatar: '/assets/brand/curator-avatar.png',
      bio: 'With a degree in metallurgical engineering from Imperial College London, Kavita analyzes casing alloys, ceramic sintering, and physical vapor deposition coatings for WRISTO.'
    },
    publishedAt: 'August 28, 2026',
    readTime: '4 min read',
    coverImage: '/assets/products/watch-25.png',
    tags: ['Sapphire Crystal', 'Mohs Hardness', 'Anti-Reflective Coating', 'Mineral Glass'],
    featuredProductIds: ['WRT-025', 'WRT-028', 'WRT-030'],
    contentSections: [
      {
        heading: 'The Vulnerable Horizon of Horology',
        paragraphs: [
          'A watch dial is a delicate micromechanical stage. The hands, indices, and applied numerals must be protected from dust, humidity, and physical impact without distorting optical clarity.',
          'Throughout horological history, three materials have dominated watch crystals: polymethyl methacrylate (acrylic/Hesalite), hardened mineral glass, and synthetic monocrystalline sapphire.'
        ]
      },
      {
        heading: 'The Science of Synthetic Corundum',
        paragraphs: [
          'Synthetic sapphire is not glass at all. It is pure aluminum oxide (Al2O3) crystallized at over 2,000°C via the Verneuil flame fusion process. In terms of physical hardness on the Mohs scale, synthetic sapphire registers at 9—surpassed only by diamond (Mohs 10).',
          'In everyday life, car keys, door handles, brick walls, and concrete corners will instantly scratch mineral glass or acrylic. But against synthetic sapphire, these common hazards glance off harmlessly without leaving a single blemish.'
        ],
        quote: {
          text: 'A scratched crystal ruins the soul of a luxury watch dial. With double-domed anti-reflective sapphire, the crystal effectively vanishes.',
          attribution: 'Kavita Singhania'
        }
      },
      {
        heading: 'Anti-Reflective Vapor Coatings',
        paragraphs: [
          'Because sapphire possesses a high refractive index (1.77), untreated crystals produce glaring reflections that obscure the dial in direct sunlight. Luxury watchmakers solve this by applying microscopic layers of metal oxides in a vacuum chamber.',
          'Double-sided anti-reflective (AR) coatings eliminate up to 99% of surface glare, giving the astonishing impression that you could reach out and touch the hands directly with your fingers.'
        ]
      }
    ]
  },
  {
    id: 'art-06',
    slug: 'art-of-the-open-heart-skeleton-horology',
    title: 'The Art of the Open Heart: Skeleton Horology Demystified',
    subtitle: 'Peering into the pulsating escapement—how master artisans carve away baseplates to celebrate mechanical kinetic sculpture.',
    excerpt: 'Skeletonization is the ultimate celebration of transparency in mechanical horology. By removing all superfluous metal from bridges and mainplates, watchmakers expose the intricate dance of balance wheels, hairsprings, and winding gears.',
    category: 'Horological Heritage',
    author: {
      name: 'Adrien de Beauharnais',
      role: 'Master Horologist & Restoration Specialist',
      avatar: '/assets/brand/curator-avatar.png',
      bio: 'Trained in the Vallée de Joux, Adrien has restored 18th-century minute repeaters and oversees WRISTO’s technical authenticity archives.'
    },
    publishedAt: 'August 14, 2026',
    readTime: '6 min read',
    coverImage: '/assets/products/watch-35.png',
    tags: ['Skeleton Watches', 'Open Heart', 'Geneva Stripes', 'Kinetic Sculpture'],
    featuredProductIds: ['WRT-035', 'WRT-036', 'WRT-037'],
    contentSections: [
      {
        heading: 'The Elimination of Superfluous Matter',
        paragraphs: [
          'Traditional watchmaking conceals its mechanical heart beneath an opaque dial. Skeletonization reverses this convention entirely: it turns the caliber itself into the dial.',
          'Originating in 18th-century France under master watchmaker André-Charles Caron, skeletonization requires an artisan to carefully saw, mill, and file away the non-structural metal of the mainplate and bridges while preserving absolute structural rigidity.'
        ]
      },
      {
        heading: 'The Open-Heart vs. Full Skeleton Distinction',
        paragraphs: [
          'Connoisseurs draw an important distinction between an "Open Heart" timepiece and a "Full Skeleton":',
          'An Open-Heart watch features a solid, beautifully textured dial with a circular aperture precisely positioned over the balance wheel—allowing the wearer to observe the frantic 21,600 vph flutter of the escapement without losing the clean legibility of an hour track.',
          'A Full Skeleton, by contrast, eliminates the dial entirely. Every gear train tooth, sliding pinion, and mainspring coil is exposed from both the dial side and through an exhibition sapphire exhibition caseback.'
        ],
        quote: {
          text: 'A skeleton watch is poetry in motion. You do not just check the hour; you witness the continuous, miraculous expenditure of kinetic life.',
          attribution: 'Adrien de Beauharnais'
        }
      }
    ]
  }
];

function getMergedArticles(): EditorialArticle[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('wristo_admin_articles');
      if (stored) {
        const adminArticles = JSON.parse(stored);
        // Map any admin articles into EditorialArticle shape if published
        const publishedCustom: EditorialArticle[] = adminArticles
          .filter((a: any) => a.published)
          .map((a: any) => ({
            id: a.id,
            slug: a.slug,
            title: a.title,
            subtitle: a.excerpt,
            excerpt: a.excerpt,
            category: a.category === 'COLLECTING' ? 'Collector Guide' :
                      a.category === 'SAVOIR-FAIRE' ? 'Horological Heritage' :
                      a.category === 'INDUSTRY' ? 'Design & Metallurgy' : 'Technical Calibers',
            author: {
              name: a.authorName || 'WRISTO Editorial Guild',
              role: a.authorRole || 'Horological Curator',
              avatar: '/assets/brand/curator-avatar.png',
              bio: 'Senior editorial contributor for the WRISTO Horological Journal.'
            },
            publishedAt: a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently Published',
            readTime: a.readTime || '5 min read',
            coverImage: a.coverImage || '/assets/products/watch-31.png',
            tags: ['Horology', 'Luxury Watchmaking', a.category],
            featuredProductIds: ['WRT-031', 'WRT-005', 'WRT-015'],
            contentSections: [
              {
                heading: 'Editorial Insights',
                paragraphs: [
                  a.content || a.excerpt,
                  'Every precision timepiece represented within this chronicle has undergone rigorous verification under the WRISTO horological standard.'
                ]
              }
            ]
          }));

        // Filter out duplicates with master articles
        const customSlugs = new Set(publishedCustom.map(c => c.slug));
        const filteredMaster = MASTER_ARTICLES.filter(m => !customSlugs.has(m.slug));
        return [...publishedCustom, ...filteredMaster];
      }
    } catch {
      // Fallback to MASTER_ARTICLES
    }
  }
  return MASTER_ARTICLES;
}

export async function getArticles(category?: string): Promise<EditorialArticle[]> {
  const articles = getMergedArticles();
  if (!category || category === 'All Stories') {
    return articles;
  }
  return articles.filter(a => a.category.toLowerCase() === category.toLowerCase());
}

export async function getFeaturedLeadArticle(): Promise<EditorialArticle> {
  const articles = getMergedArticles();
  return articles[0] || MASTER_ARTICLES[0];
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithProducts | null> {
  const articles = getMergedArticles();
  const index = articles.findIndex(a => a.slug === slug);
  if (index === -1) return null;

  const article = articles[index];
  const featuredProducts = PRODUCTS.filter(p => article.featuredProductIds.includes(p.id));

  const prevArticle = index > 0
    ? { slug: articles[index - 1].slug, title: articles[index - 1].title }
    : undefined;

  const nextArticle = index < articles.length - 1
    ? { slug: articles[index + 1].slug, title: articles[index + 1].title }
    : undefined;

  return {
    ...article,
    featuredProducts,
    prevArticle,
    nextArticle
  };
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const articles = getMergedArticles();
  return articles.map(a => a.slug);
}

export function getCategories(): string[] {
  return [
    'All Stories',
    'Horological Heritage',
    'Technical Calibers',
    'Collector Guide',
    'Design & Metallurgy'
  ];
}

