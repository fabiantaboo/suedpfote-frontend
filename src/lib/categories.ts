export type CategoryDefinition = {
  slug: string;
  label: string;
  emoji: string;
  description: string;
  keywords: string[];
};

export const CATEGORIES: CategoryDefinition[] = [
  {
    slug: 'schreibwaren',
    label: 'Schreibwaren',
    emoji: '✍️',
    description: 'Füller, Tintenroller, Kugelschreiber und Bleistifte – ergonomisch geformt für die linke Hand.',
    keywords: ['füller', 'fueller', 'füllfeder', 'kugelschreiber', 'tintenroller', 'schreiblernbleistift', 'schreiblernheft', 'bleistift', 'druckbleistift', 'marker', 'textmarker', 'radierer', 'wachsmal', 'füllhalter', 'fuellhalter'],
  },
  {
    slug: 'scheren',
    label: 'Scheren',
    emoji: '✂️',
    description: 'Linkshänder-Scheren für Erwachsene und Kinder – saubere Schnitte, endlich ohne Frust.',
    keywords: ['schere', 'scissors', 'bastelschere', 'kinderschere'],
  },
  {
    slug: 'messer-schneidwerkzeuge',
    label: 'Messer & Schneidwerkzeuge',
    emoji: '🔪',
    description: 'Brotmesser, Küchenmesser und Pizzaschneider mit linksseitigem Schliff.',
    keywords: ['brotmesser', 'küchenmesser', 'kuechenmesser', 'pizzaschneider', 'schneidwerkzeug'],
  },
  {
    slug: 'kuechenhelfer',
    label: 'Küchenhelfer',
    emoji: '🍳',
    description: 'Schäler, Kellen, Dosenöffner, Korkenzieher und mehr – Kochen ohne Umdenken.',
    keywords: ['schäler', 'schaeler', 'kartoffelschäler', 'spargelschäler', 'gemüsehobel', 'dosenöffner', 'dosenoeffner', 'korkenzieher', 'suppenkelle', 'schöpfkelle', 'pfannenwender', 'eisportionierer', 'knoblauchpresse', 'vierkantreibe', 'wok', 'ofenhandschuh', 'backofenhandschuh', 'messbecher'],
  },
  {
    slug: 'schulbedarf',
    label: 'Schulbedarf',
    emoji: '📐',
    description: 'Lineale, Geodreiecke, Hefte, Anspitzer und Collegeblöcke für linkshändige Schüler.',
    keywords: ['lineal', 'spitzer', 'anspitzer', 'heft', 'schreiblernheft', 'geodreieck', 'geometrie', 'zirkel', 'collegeblock', 'mappe', 'buntstifte', 'buntstift', 'easycolors', 'groove'],
  },
  {
    slug: 'sport-freizeit',
    label: 'Sport & Freizeit',
    emoji: '⚾',
    description: 'Bumerangs, Baseballhandschuhe und Sportartikel für Linkshänder.',
    keywords: ['bumerang', 'baseballhandschuh', 'baseball'],
  },
  {
    slug: 'haushalt-accessoires',
    label: 'Haushalt & Accessoires',
    emoji: '🏠',
    description: 'Geldbörsen, Messbecher und praktische Alltagshelfer für Linkshänder.',
    keywords: ['geldbörse', 'geldboerse', 'portemonnaie'],
  },
];

export const ALL_CATEGORY = {
  slug: 'alle',
  label: 'Alle Produkte',
  emoji: '🤚',
};

type ProductLike = {
  title?: string;
  name?: string;
  description?: string;
  handle?: string;
  tags?: { value: string }[];
};

/**
 * Categorize a product by matching keywords against title, description, and tags.
 * Returns an array of category slugs. If nothing matches, returns empty array.
 */
export function categorizeProduct(product: ProductLike): string[] {
  const categories: string[] = [];
  const title = (product.title || product.name || '').toLowerCase();
  const handle = (product.handle || '').toLowerCase();
  // Only match on title + handle to avoid false positives from long descriptions
  const text = `${title} ${handle}`;

  // Check tags first
  const tagValues = (product.tags || []).map((t) => t.value.toLowerCase());

  for (const cat of CATEGORIES) {
    const matchesTag = tagValues.some((tag) =>
      cat.keywords.some((kw) => tag.includes(kw))
    );
    const matchesText = cat.keywords.some((kw) => text.includes(kw));

    if (matchesTag || matchesText) {
      categories.push(cat.slug);
    }
  }

  return categories;
}

/**
 * Get a category definition by slug.
 */
export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
