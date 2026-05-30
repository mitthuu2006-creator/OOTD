import { BlogPost, Category } from '../types';

export const BLOG_CATEGORIES: Category[] = [
  'Casual',
  'Street Style',
  'Party Wear',
  'Ethnic',
  'Summer Fits',
  'Winter Fits'
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Our daily dose of classy, trendy, and effortlessly stylish outfit inspiration.',
    slug: 'our-daily-dose-of-classy-trendy-and-effortlessly-stylish-outfit-inspiration',
    category: 'Casual',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    excerpt: 'The modern minimalist wardrobe relies not on loud labels, but on fine rib-knits, structured wool drapes, and the soft poetry of custom dye pigments. Let’s dissect the perfect café uniform.',
    content: `In the transient world of fashion trends, quiet luxury has stabilized as a structural design standard rather than a fleeting seasonal wave. Stripping away heavy embellishments and conspicuous logos forces the focus back onto what truly matters: drape, texture, and light reflection.

A monochrome cream outfit instantly commands attention because it projects an air of intentional preparation. This OOTD pairs an organic cotton-viscose rib mockneck midi with matching warm cream knitted trousers. The key to making monochromatic outfits succeed lies entirely in mixing textures. If both pieces have the exact same weave density, the silhouette bleeds together into an amorphous column. By pairing a closely ribbed mockneck with a slightly heavier brushed wool or boucle cardigan, you introduce shadow lines that establish human geometry.

For footwear, bypass harsh contrast. A flat retro trainer in off-white calfskin keeps the look grounded and approachable, making it the perfect café uniform or weekend gallery layout. Add a structured canvas tote with tan leather strap trims to tie the earthy palette together.`,
    publishedAt: 'May 24, 2026',
    readTime: '3 min read',
    author: {
      name: 'Sinclair Shanks',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      role: 'Editorial Director'
    },
    likes: 128,
    saves: 45,
    comments: [
      { id: 'c-1', userName: 'Leah Vance', text: 'This subtle color coordination is exactly what my spring wardrobe is missing.', createdAt: 'May 25, 2026' },
      { id: 'c-2', userName: 'Devon K.', text: 'The idea of mixing cardigans with rib mocknecks is fantastic. Trying this tomorrow.', createdAt: 'May 26, 2026' }
    ],
    isFeatured: true,
    isTrending: false,
    outfitDetails: [
      'Tailored Knit Rib Mockneck Midi (Ecru)',
      'Brushed Merino Wool Lounge Trousers (Oatmeal)',
      'Calfskin Court Retro Trainers (Off-White)',
      'Canvas Tote Bag with Tan Leather Saddlery'
    ]
  },
  {
    id: 'blog-2',
    title: 'TriBeCa Utility: Technical Tailoring on Distressed Leather',
    slug: 'tribeca-utility-technical-tailoring-leather',
    category: 'Street Style',
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800',
    excerpt: 'How vintage leather biker silhouettes collide with sleek matte-black cargo trousers. Adapting technical modularity for NYC pavements.',
    content: `Streetwear is no longer defined by screen-printed cotton hoodies; it has matured into a complex conversation about technical resilience and classical vintage counterpoints. The modern youth is seeking garments that perform in MTA transitions while carrying the historical patina of rebellious youth culture.

We start with the centerpiece: a heavily distressed, matte-black cowhide biker jacket. Finding one with organic creases and silver hardware details adds a lived-in texture that grounds the entire look. Underneath, a heavyweight, vintage-washed charcoal graphic tee provides structural stability with its boxy crop.

The trouser choice is key—we look to minimalist modular cargo pants compiled from water-repellent ripstop fabrics. These cargos don't bulge; they sit flat until utilized. Ankles are finished with elastic toggles, allowing you to pinch them into narrow cuffs to spotlight retro trainers, or let them fall wide over heavy combat boots. A matte black wool watchcap finishes the assembly, creating a sleek, mysterious silhouette tailored for New York nights.`,
    publishedAt: 'May 27, 2026',
    readTime: '4 min read',
    author: {
      name: 'Marcus DeVoro',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      role: 'Senior Trend Analyst'
    },
    likes: 342,
    saves: 112,
    comments: [
      { id: 'c-3', userName: 'Sora Park', text: 'The utility cargo pairing with biker leather is top-tier. Best streetwear balance!', createdAt: 'May 27, 2026' }
    ],
    isFeatured: false,
    isTrending: true,
    outfitDetails: [
      'Distressed Matte Cowhide Leather Biker Jacket',
      'Heavyweight Graphic Box-Fit Tee (Charcoal)',
      'Water-Repellent Technical Cargo Pants (Black)',
      'Vintage Wool Rib Watchcap Beanie'
    ]
  },
  {
    id: 'blog-3',
    title: 'Midnight Satin: Reimagining Evening Party Wear',
    slug: 'midnight-satin-evening-party-wear',
    category: 'Party Wear',
    image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=800',
    excerpt: 'An exploration of soft drapes, dark cocoa palettes, and brushed suede. Ditch the rigid suit for unstructured fluidity.',
    content: `Formal dress codes often evoke images of stiff, starched collars and constricting tuxedos. However, the contemporary trend leans toward unstructured luxury—garments that flow with natural movement and communicate sophistication through drape.

The anchor of this look is a heavy satin drop-shoulder shirt in rich dark cocoa brown. Under artificial restaurant lighting, the satin captures light dynamically, producing deep, liquid shadows that outline the torso's fluid lines. When combined with unstructured, high-waisted trousers in a soft mocha beige, the outfit achieves a balanced, vertical flow.

To prevent the look from reading too casual, layer a structured, single-breasted blazer in sand-toned brushed suede. The matte suede absorbs light, creating an elegant visual counterpoint to the glossy satin shirt. Complete the ensemble with honey-brown suede Chelsea boots and a slim vintage leather belt with solid brass fasteners.`,
    publishedAt: 'May 18, 2026',
    readTime: '3 min read',
    author: {
      name: 'Clara Dupont',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      role: 'European Contributor'
    },
    likes: 95,
    saves: 38,
    comments: [],
    isFeatured: false,
    isTrending: false,
    outfitDetails: [
      'Structured Single-Breasted Blazer (Sand Suede)',
      'Liquid Satin Drop-Shoulder Shirt (Dark Cocoa)',
      'High-Waisted Unstructured Trousers (Mocha)',
      'Suede Chelsea Boots with Crepe Soles'
    ]
  },
  {
    id: 'blog-4',
    title: 'Contemporary Linen Kurtas: A Heritage Dialogue',
    slug: 'contemporary-linen-kurtas-heritage-dialogue',
    category: 'Ethnic',
    image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800',
    excerpt: 'How handcrafted Indian fabrics and structural bandhgala tailoring find a home in a modern, neutral-toned wardrobe.',
    content: `The dialogue between heritage crafts and modern minimalism is producing some of the most exciting silhouettes in contemporary fashion. Traditional drapes are being liberated from heavy brocades and instead rendered in raw, coarse linen and unbleached organic cotton.

The centerpiece OOTD features an asymmetric pleated linen Kurta in dry oatmeal beige. The raw texture, punctuated by natural wooden buttons, drapes beautifully due to the crisp flax fibers. Instead of wide pajamas, we pair this Kurta with tailored, carrot-cut cargo-trouser blends in soft beige, blending historic patterns with military utility.

For cool evening gatherings, layer an unstructured Bandhgala vest in brushed deep brown khadi cotton. The textured khadi provides structural warmth without stiffness. Slide into leather straps or woven leather mules in rich mahagony to support local artisanal weaving workshops while establishing a highly civilized presence.`,
    publishedAt: 'May 15, 2026',
    readTime: '5 min read',
    author: {
      name: 'Aditya Mehta',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      role: 'Weave Specialist'
    },
    likes: 219,
    saves: 85,
    comments: [
      { id: 'c-4', userName: 'Karan J.', text: 'The asymmetry on that linen kurta is masterfully drafty. Love seeing ethnic craft elevated.', createdAt: 'May 16, 2026' }
    ],
    isFeatured: false,
    isTrending: true,
    outfitDetails: [
      'Asymmetric Pleated Linen Kurta (Oatmeal)',
      'Artisanal Khadi Cotton Vest (Deep Brown)',
      'Carrot-Cut Tailored Chinos (Warm Sand)',
      'Hand-Woven Leather Mules (Mahogany)'
    ]
  },
  {
    id: 'blog-5',
    title: 'Linen Whispers: High-Contrast Resort Styling',
    slug: 'linen-whispers-high-contrast-resort-styling',
    category: 'Summer Fits',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
    excerpt: 'Beating the city humidity inside organic unbleached flax. An guide to boxy summer shirts and sand sliders.',
    content: `City summer presents a difficult dress-code paradox: you must remain cool under high humidity while projecting a sharp, professional composure. The answer lies in linen—but not the wrinkled, ill-fitting linen of the past. Today’s linen is heavier, tightly woven, and structured to prevent immediate collapsing.

Our featured outfit highlights an ultra-light, box-fit linen camp collar shirt in unbleached ecru. The shirt’s relaxed, boxy cut keeps the fabric off your skin, allowing optimal airflow. The high-contrast pairing comes from slim-cut utility shorts in a rich tobacco brown linen-cotton blend. The stiffer cotton blend keeps the shorts structured, elevating the look beyond standard beachwear.

Accessories make the man—or woman. Pair this looks with sand-colored leather slide sandals featuring robust ergonomic soles. Introduce a tortoiseshell horn eyewear frame and a minimal braided calfskin wrist strap to seal a classic, Mediterranean-appropriate urban uniform.`,
    publishedAt: 'May 10, 2026',
    readTime: '3 min read',
    author: {
      name: 'Clara Dupont',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      role: 'European Contributor'
    },
    likes: 175,
    saves: 62,
    comments: [],
    isFeatured: false,
    isTrending: false,
    outfitDetails: [
      'Boxy Flax Camp Collar Shirt (Ecru White)',
      'Rigid Cotton-Linen Utility Shorts (Tobacco)',
      'Ergonomic Leather Slide Sandals (Sand)',
      'Tortoiseshell Horn Eyewear'
    ]
  },
  {
    id: 'blog-6',
    title: 'Cognac Merino: Layering For The Cold Sector',
    slug: 'cognac-merino-layering-cold-sector',
    category: 'Winter Fits',
    image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=800',
    excerpt: 'Draping thick cashmere wraps and double-breasted trenchcoats in deep chocolate and cognac. Warmth without bulk.',
    content: `Winter wear represents the pinnacle of style expression because of one simple factor: layering. Stacking different garment lengths and colors allows you to create high-contrast visual depth while protecting your core against the biting cold.

The base layer begins with a fine-gauge, mockneck top in pure Mongolian cashmere—dyed a deep cognac orange. Over this, we place a structured, oversized knitwear cardigan with horn-buttons in a soft oatmeal weave. The warm wool traps air pockets, providing outstanding heat retention.

The crowning layer is our Charcoal Tailored Trenchcoat. This piece is cut from heavy, 800GSM double-faced virgin wool, featuring generous dropped shoulders and a sweeping hemline that hits below the knee. When walking, the trailing wool coat creates a spectacular cinematic motion. Balance the upper bulk with heavy wool trousers in solid espresso black and hand-polished chelsea leather boots.`,
    publishedAt: 'May 02, 2026',
    readTime: '4 min read',
    author: {
      name: 'Sinclair Shanks',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      role: 'Editorial Director'
    },
    likes: 290,
    saves: 130,
    comments: [
      { id: 'c-5', userName: 'Alex Mercer', text: 'That cognac knitwear under charcoal wool matches perfectly. A go-to strategy this fall.', createdAt: 'May 03, 2026' }
    ],
    isFeatured: false,
    isTrending: true,
    outfitDetails: [
      'Charcoal Tailored French Trench (Heavy Wool)',
      'Cognac Mongolian Cashmere Mockneck',
      'Oatmeal Horn-Button Knitted Cardigan',
      'Solid Espresso Heavy Wool Trousers'
    ]
  }
];
