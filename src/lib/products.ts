// ─── Mitti Art Product Data ───
// From the original index.html — authentic product information

export interface Product {
  id: string;
  name: string;
  hindiName: string;
  slug: string;
  image: string;
  category: string;
  medium: string;
  price: number;
  description: string;
  story: string;
  dimensions: string;
  featured: boolean;
  sold?: boolean;
  year?: number;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "0",
    name: "Kamal Vatika",
    hindiName: "कमल वाटिका",
    slug: "kamal-vatika",
    image: "/images/kamal-vatika.jpg",
    category: "Folk Art",
    medium: "Madhubani Painting",
    price: 8500,
    description:
      "A breathtaking Madhubani painting of a lotus garden — sacred geometry meets folk tradition.",
    story:
      "Inspired by the lotus pond near Samuya's childhood home in Madhubani, this painting captures the sacred geometry of the lotus — a symbol of purity, resilience, and rebirth. Every petal is hand-drawn with a fine bamboo nib, using natural pigments ground from local minerals and plants.",
    dimensions: '24" × 36"',
    featured: true,
    sold: true,
    inStock: false,
    year: 2024,
  },
  {
    id: "1",
    name: "Surya Om Mandala",
    hindiName: "सूर्य ओम मंडल",
    slug: "surya-om-mandala",
    image: "/images/surya-om-mandala.jpg",
    category: "Painted Metal",
    medium: "Painted Metal Wall Art",
    price: 12000,
    description:
      "A luminous painted metal mandala radiating the sacred Om symbol, accented with gold leaf.",
    story:
      "A luminous meditation on sound and light. The Om symbol radiates at the center of a painted metal mandala, surrounded by concentric rings of hand-applied gold leaf and sun motifs. The metal surface is treated with a traditional rust-patina process before being painted.",
    dimensions: '30" × 30"',
    featured: true,
    inStock: true,
    year: 2024,
  },
  {
    id: "2",
    name: "Shanti Padma",
    hindiName: "शांति पद्म",
    slug: "shanti-padma",
    image: "/images/shanti-padma.jpg",
    category: "Carved Panel",
    medium: "Carved White Wall Panel",
    price: 18000,
    description:
      "A serene bas-relief lotus panel carved from white marble dust composite — stillness in stone.",
    story:
      "Carved from a single block of white marble dust composite, this bas-relief lotus panel embodies stillness. Samuya spent three weeks hand-chiseling each petal to create depth through shadow alone — no pigment, no glaze.",
    dimensions: '36" × 24"',
    featured: true,
    inStock: true,
    year: 2024,
  },
  {
    id: "3",
    name: "Prakriti",
    hindiName: "प्रकृति",
    slug: "prakriti",
    image: "/images/prakriti.jpg",
    category: "Resin Art",
    medium: "Resin Art with Botanicals",
    price: 6500,
    description:
      "Nature preserved in crystal-clear resin — dried flowers and ferns from the Aravalli hills.",
    story:
      "Nature preserved in crystal-clear resin. Samuya foraged dried flowers, ferns, and grasses from the Aravalli hills and layered them in a slow-pour resin process that captures each botanical specimen in suspended animation.",
    dimensions: '12" × 12"',
    featured: false,
    sold: true,
    inStock: false,
    year: 2024,
  },
  {
    id: "4",
    name: "Surya Kiran",
    hindiName: "सूर्य किरण",
    slug: "surya-kiran",
    image: "/images/surya-kiran.jpg",
    category: "Mosaic",
    medium: "Mirror Mosaic Bottle",
    price: 9500,
    description:
      "An upcycled glass bottle transformed into a radiant sunburst mosaic object d'art.",
    story:
      "An upcycled glass bottle transformed into a radiant object d'art. Samuya has applied thousands of hand-cut mirror shards in a sunburst pattern, each piece individually placed and grouted over four days.",
    dimensions: '8" × 12"',
    featured: false,
    inStock: true,
    year: 2024,
  },
  {
    id: "5",
    name: "Ganesha Darshan",
    hindiName: "गणेश दर्शन",
    slug: "ganesha-darshan",
    image: "/images/ganesha-darshan.jpg",
    category: "Ceramic",
    medium: "Hand-painted Ceramic Set",
    price: 15000,
    description:
      "A set of three hand-thrown ceramic Ganapati idols, each in a different sacred mudra.",
    story:
      "A set of three hand-thrown ceramic Ganapati idols, each in a different mudra (gesture). The terracotta clay is sourced from the Banas River basin, fired in a traditional wood kiln, and painted with natural ochre and indigo.",
    dimensions: "Set of 3 | Various sizes",
    featured: true,
    inStock: true,
    year: 2024,
  },
  {
    id: "6",
    name: "Gul-e-Nasturtium",
    hindiName: "گل ناسٹرٹیم",
    slug: "gul-e-nasturtium",
    image: "/images/gul-e-nasturtium.jpg",
    category: "Watercolor",
    medium: "Botanical Watercolor",
    price: 4500,
    description:
      "A delicate botanical watercolor study of nasturtium blooms from the artist's kitchen garden.",
    story:
      "Delicate watercolor study of nasturtium blooms from Samuya's kitchen garden. Painted on handmade cotton rag paper with pigments extracted from marigold, indigo, and pomegranate rind — a practice in patience and observation.",
    dimensions: '12" × 16"',
    featured: false,
    inStock: true,
    year: 2024,
  },
  {
    id: "7",
    name: "Suvarna Patra",
    hindiName: "सुवर्ण पत्र",
    slug: "suvarna-patra",
    image: "/images/suvarna-patra.jpg",
    category: "Resin Art",
    medium: "Resin Art Coaster Set",
    price: 3500,
    description:
      "A set of four resin coasters, each preserving a sacred leaf from India's heritage trees.",
    story:
      "A set of four coasters, each encapsulating a different leaf from the sacred trees of India — peepal, neem, banyan, and tulsi. Preserved in UV-stabilized resin with a gold mica accent.",
    dimensions: "Set of 4 | 4\" each",
    featured: false,
    sold: true,
    inStock: false,
    year: 2024,
  },
  {
    id: "8",
    name: "Ekadanta",
    hindiName: "एकदंत",
    slug: "ekadanta",
    image: "/images/ekadanta.jpg",
    category: "Folk Art",
    medium: "Modern Madhubani Ganesha",
    price: 11000,
    description:
      "Ganesha as Ekadanta — a modern Madhubani interpretation on hand-loomed cotton canvas.",
    story:
      "Ganesha as Ekadanta — the one-tusked one. This modern Madhubani interpretation uses the traditional line-and-dot technique but on a canvas of hand-loomed cotton with natural dyes. The elephant god's form emerges from intricate geometric patterns.",
    dimensions: '30" × 40"',
    featured: true,
    inStock: true,
    year: 2024,
  },
  {
    id: "9",
    name: "Alankara Gaja",
    hindiName: "अलंकार गज",
    slug: "alankara-gaja",
    image: "/images/alankara-gaja.jpg",
    category: "Miniature",
    medium: "Rajasthani Miniature",
    price: 14000,
    description:
      "A ceremonial elephant in full bridal adornment, painted in the Kishangarh miniature tradition.",
    story:
      "A ceremonial elephant in full bridal adornment, painted in the Kishangarh school of Rajasthani miniature painting. Samuya uses traditional wasli paper, ground lapis lazuli for the blue, and 22k gold leaf for the ornaments.",
    dimensions: '12" × 16"',
    featured: false,
    inStock: true,
    year: 2024,
  },
  {
    id: "10",
    name: "Padma Mandala",
    hindiName: "पद्म मंडल",
    slug: "padma-mandala",
    image: "/images/padma-mandala.jpg",
    category: "Mixed Media",
    medium: "Mixed Media Mandala",
    price: 16000,
    description:
      "A large-format mandala combining acrylic, natural pigments, gold leaf, and hand-embroidery.",
    story:
      "A large-format mandala combining acrylic, natural pigments, gold leaf, and hand-embroidery on canvas. The lotus at the center is stitched with silk thread by Samuya herself — referencing both the Madhubani and the Phulkari traditions.",
    dimensions: '36" × 36"',
    featured: true,
    sold: true,
    inStock: false,
    year: 2024,
  },
  {
    id: "11",
    name: "Surya Pushp",
    hindiName: "सूर्य पुष्प",
    slug: "surya-pushp",
    image: "/images/surya-pushp.jpg",
    category: "Botanical",
    medium: "Botanical Illustration",
    price: 4000,
    description:
      "A sunflower rendered in fine pen and ink with delicate watercolor wash.",
    story:
      "The sunflower (Surya Pushp — sun flower) rendered in fine pen and ink with watercolor wash. A celebration of heliotropism — the flower's daily journey following the sun across the sky.",
    dimensions: '9" × 12"',
    featured: false,
    inStock: true,
    year: 2024,
  },
  {
    id: "12",
    name: "Sukhi Phool",
    hindiName: "सुखी फूल",
    slug: "sukhi-phool",
    image: "/images/sukhi-phool.jpg",
    category: "Resin Art",
    medium: "Resin Preservation Art",
    price: 5500,
    description:
      "Eternal flowers — marigold, rose, and jasmine — preserved in a luminous resin sphere.",
    story:
      "Eternal flowers — marigold, rose, and jasmine — preserved in a resin sphere. Sukhi Phool means 'happy flower' in Hindi, and each piece is made with flowers from Samuya's own garden, picked at full bloom and dried naturally.",
    dimensions: '5" sphere',
    featured: false,
    inStock: true,
    year: 2024,
  },
];

export const categories = Array.from(
  new Set(products.map((p) => p.category))
);

export const priceRange = {
  min: Math.min(...products.map((p) => p.price)),
  max: Math.max(...products.map((p) => p.price)),
};
