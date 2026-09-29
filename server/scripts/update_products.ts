import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const HEADPHONE_PRODUCTS = [
  {
    sku: 'NXR-APX-01',
    name: 'NEXORO Apex X',
    description: 'Flagship wireless planar headphone engineered with 50mm custom beryllium diaphragm drivers, active noise cancellation, and aerospace-grade chassis with warm copper accents.',
    category: 'HEADPHONES',
    price: 499.0,
    imageUrl: '/images/products/apex-x.jpg',
    stock: 14,
    rating: 4.96,
    status: 'ACTIVE',
    has3DModel: true,
    modelUrl: '/models/nexoro-apex-pro.glb',
    specs: JSON.stringify({
      'Driver Architecture': '50mm Custom Beryllium Diaphragm',
      'Frequency Response': '5Hz – 45,000Hz',
      'Impedance': '32 Ohms',
      'Battery Endurance': '42 Hours with ANC Active',
      'Weight': '310g Aerospace Billet Aluminum',
      'Connectivity': 'Bluetooth 5.3 aptX HD, USB-C Lossless, 3.5mm Analog',
      'Experience': 'CINEMATIC'
    }),
  },
  {
    sku: 'NXR-VST-02',
    name: 'NEXORO Vector Studio',
    description: 'Professional studio reference headphone engineered with 90mm ultra-thin planar magnetic matrix and open acoustic resonance chambers for surgical spatial precision.',
    category: 'HEADPHONES',
    price: 649.0,
    imageUrl: '/images/products/vector-studio.jpg',
    stock: 6,
    rating: 4.98,
    status: 'ACTIVE',
    has3DModel: true,
    modelUrl: '/models/nexoro-vector-studio.glb',
    specs: JSON.stringify({
      'Driver Architecture': '90mm Ultra-thin Planar Magnetic Matrix',
      'Frequency Response': '4Hz – 52,000Hz',
      'Impedance': '48 Ohms',
      'Enclosure': 'Open Acoustic Resonance Chamber',
      'Weight': '365g CNC Aluminum & Lambskin',
      'Cable Interconnect': 'Dual 4-pin XLR Balanced Silver-plated',
      'Experience': 'ENGINEERING'
    }),
  },
  {
    sku: 'NXR-HX1-03',
    name: 'NEXORO Halo X1',
    description: 'Ultra-lightweight wireless over-ear headphone focused on long-session ergonomic comfort, 45mm graphene drivers, and 36-hour endurance.',
    category: 'HEADPHONES',
    price: 349.0,
    imageUrl: '/images/products/halo-x1.jpg',
    stock: 12,
    rating: 4.88,
    status: 'ACTIVE',
    has3DModel: true,
    modelUrl: '/models/nexoro-halo-x1.glb',
    specs: JSON.stringify({
      'Driver Architecture': '45mm Graphene-Composite Dynamic',
      'Frequency Response': '10Hz – 38,000Hz',
      'Impedance': '36 Ohms',
      'Battery Endurance': '36 Hours Continuous',
      'Weight': '248g Featherweight Carbon Blend',
      'Connectivity': 'Bluetooth 5.3 Multipoint, Low-Latency Gaming Mode',
      'Experience': '360_VIEW'
    }),
  },
  {
    sku: 'NXR-FRG-04',
    name: 'NEXORO Forge',
    description: 'Closed-back professional monitoring headphone designed for zero acoustic bleed, -32dB passive isolation, and 50mm high-flux neodymium transducers.',
    category: 'HEADPHONES',
    price: 289.0,
    imageUrl: '/images/products/forge.jpg',
    stock: 18,
    rating: 4.89,
    status: 'ACTIVE',
    specs: JSON.stringify({
      'Driver Architecture': '50mm High-Flux Neodymium Transducers',
      'Isolation Factor': '-32dB Passive Acoustic Isolation',
      'Frequency Response': '6Hz – 32,000Hz',
      'Max Input Power': '2500mW',
      'Weight': '290g Reinforced Magnesium Alloy',
      'Experience': 'STUDIO'
    }),
  },
  {
    sku: 'NXR-ZNT-05',
    name: 'NEXORO Zenith',
    description: 'Luxury artisan over-ear headphone handcrafted with hand-finished obsidian, champagne, and graphite chambers paired with cryogenic internal cabling.',
    category: 'HEADPHONES',
    price: 589.0,
    imageUrl: '/images/products/zenith.jpg',
    stock: 8,
    rating: 4.95,
    status: 'ACTIVE',
    specs: JSON.stringify({
      'Driver Architecture': '52mm Diamond-Like Carbon (DLC) Matrix',
      'Frequency Response': '5Hz – 50,000Hz',
      'Finishes Available': 'Obsidian, Champagne, Graphite',
      'Cabling': 'Cryogenic 7N Monocrystal OCC Copper',
      'Ear Cushions': 'Italian Perforated Full-Grain Lambskin',
      'Experience': 'COLOR_LAB'
    }),
  },
  {
    sku: 'NXR-FLX-06',
    name: 'NEXORO Flux',
    description: 'Compact everyday premium headphone featuring collapsible magnesium hinges, 40mm titanium drivers, and high-resolution wireless streaming.',
    category: 'HEADPHONES',
    price: 249.0,
    imageUrl: '/images/products/flux.jpg',
    stock: 22,
    rating: 4.84,
    status: 'ACTIVE',
    specs: JSON.stringify({
      'Driver Architecture': '40mm Titanium-Vapor Dynamic',
      'Frequency Response': '12Hz – 30,000Hz',
      'Portability': '180° Collapsible Magnesium Alloy Hinges',
      'Battery Endurance': '32 Hours with Rapid Charge (10m = 4h)',
      'Weight': '210g Ultra-Portable',
      'Experience': 'COMPACT'
    }),
  },
];

const EARBUDS_PRODUCTS = [
  {
    sku: 'NXR-ARC-01',
    name: 'NEXORO ARC TWS',
    description: 'Flagship true wireless earbuds with adaptive spatial audio algorithms, 11mm liquid crystal polymer drivers, and instant copper-accented charging case.',
    category: 'EARBUDS',
    price: 189.0,
    imageUrl: '/images/products/arc-tws.jpg',
    stock: 15,
    rating: 4.89,
    status: 'ACTIVE',
    specs: JSON.stringify({
      'Acoustic Driver': '11mm Liquid Crystal Polymer (LCP) Driver',
      'ANC Engine': 'Dynamic Environment Adaptation (-40dB)',
      'Battery Endurance': '8h Playback + 24h Charging Cradle',
      'Connectivity': 'Bluetooth 5.4 LE Audio & LC3 Codec',
      'Water Resistance': 'IPX5 Weather Proof',
      'Experience': 'CINEMATIC'
    }),
  },
  {
    sku: 'NXR-PLS-02',
    name: 'NEXORO Pulse Buds',
    description: 'High-performance wireless earbuds with dual-microphone beamforming array, IPX5 weather rating, and low-latency gaming transmission.',
    category: 'EARBUDS',
    price: 159.0,
    imageUrl: '/images/products/pulse-buds.jpg',
    stock: 20,
    rating: 4.86,
    status: 'ACTIVE',
    specs: JSON.stringify({
      'Driver Configuration': '10mm Carbon Nanotube Composite Transducer',
      'Latency': '45ms Ultra-Low Latency Gaming Mode',
      'Microphones': 'Dual MEMS Noise-Cancelling Array',
      'Battery Life': '7h Earbuds + 21h Travel Shell',
      'Controls': 'Capacitive Tap & Pressure Sensor',
      'Experience': 'PERFORMANCE'
    }),
  },
  {
    sku: 'NXR-HLB-03',
    name: 'NEXORO Halo Buds',
    description: 'Premium everyday wireless earbuds engineered with sculpted silicone-free ergonomic stems, touch controls, and 30-hour total cradle reserve.',
    category: 'EARBUDS',
    price: 139.0,
    imageUrl: '/images/products/halo-buds.jpg',
    stock: 24,
    rating: 4.87,
    status: 'ACTIVE',
    specs: JSON.stringify({
      'Driver Architecture': '12mm Bio-Cellulose Custom Dynamic',
      'Fit Architecture': 'Semi-In-Ear Pressure-Relief Concha Lock',
      'Battery Reserve': '6h Continuous + 24h Case Reserve',
      'Microphone Matrix': 'Dual Environmental Beamforming',
      'Weight': '4.1g Per Earbud',
      'Experience': '360_VIEW'
    }),
  },
  {
    sku: 'NXR-COR-04',
    name: 'NEXORO Core TWS',
    description: 'Compact everyday wireless earbuds engineered with 8.5mm graphene drivers, quick-charge Qi inductive cradle, and featherweight 3.8g earpieces.',
    category: 'EARBUDS',
    price: 99.0,
    imageUrl: '/images/products/core-tws.jpg',
    stock: 30,
    rating: 4.81,
    status: 'ACTIVE',
    specs: JSON.stringify({
      'Transducer': '8.5mm Pure Graphene Micro-Driver',
      'Cradle Charging': 'Qi Inductive Wireless + USB-C Quick Charge',
      'Weight': '3.8g Featherweight Shell',
      'Battery Life': '5h + 20h Pocket Case',
      'Water Rating': 'IPX4 Splash Resistant',
      'Experience': 'COMPACT'
    }),
  },
  {
    sku: 'NXR-FXB-05',
    name: 'NEXORO Flux Buds',
    description: 'Sport and active wireless earbuds equipped with secure ear-fin stabilizers, IPX7 submersible waterproofing, and ambient awareness passthrough.',
    category: 'EARBUDS',
    price: 149.0,
    imageUrl: '/images/products/flux-buds.jpg',
    stock: 16,
    rating: 4.85,
    status: 'ACTIVE',
    specs: JSON.stringify({
      'Waterproof Seal': 'IPX7 Submersible Waterproof & Sweat-Proof',
      'Stabilization': 'Medical-Grade Silicone Wing Stabilizers',
      'Driver System': '9.2mm High-Output Dynamic Transducer',
      'Passthrough': 'Binaural Environmental Transparency Mode',
      'Battery Life': '8h + 24h Heavy-Duty Shell',
      'Experience': 'ACTIVE'
    }),
  },
  {
    sku: 'NXR-ZTB-06',
    name: 'NEXORO Zenith TWS',
    description: 'Luxury flagship earbuds in CNC ceramic and anodized alloy shells, featuring dual hybrid Knowles armatures and lossless LDAC transmission.',
    category: 'EARBUDS',
    price: 279.0,
    imageUrl: '/images/products/zenith-tws.jpg',
    stock: 9,
    rating: 4.96,
    status: 'ACTIVE',
    specs: JSON.stringify({
      'Acoustic Matrix': 'Custom Knowles Dual Balanced Armature + 10mm DLC',
      'Finishes Available': 'Obsidian, Champagne, Graphite',
      'Chassis Material': 'Polished Zirconia Ceramic & Aerospace Alloy',
      'Hi-Res Codecs': 'Sony LDAC 990kbps 24-bit/96kHz, aptX Lossless',
      'Battery Life': '7.5h + 22.5h Wireless Charging Case',
      'Experience': 'COLOR_LAB'
    }),
  },
];

async function updateEcosystem() {
  console.log('🔄 Updating NEXORO Product Ecosystem to Headphones & Wireless Earbuds ONLY...');

  // 1. Mark all existing products that are NOT in our 12 target SKUs as INACTIVE
  const targetSkus = [
    ...HEADPHONE_PRODUCTS.map((p) => p.sku),
    ...EARBUDS_PRODUCTS.map((p) => p.sku),
  ];

  const deactivated = await prisma.product.updateMany({
    where: {
      sku: { notIn: targetSkus },
    },
    data: {
      status: 'INACTIVE',
    },
  });
  console.log(`🔒 Deactivated ${deactivated.count} non-target products from customer catalogue.`);

  // 2. Upsert the 6 Headphone Products
  for (const item of HEADPHONE_PRODUCTS) {
    await prisma.product.upsert({
      where: { sku: item.sku },
      update: {
        name: item.name,
        description: item.description,
        category: item.category,
        price: item.price,
        imageUrl: item.imageUrl,
        stock: item.stock,
        rating: item.rating,
        status: item.status,
        has3DModel: item.has3DModel || false,
        modelUrl: item.modelUrl || null,
        specs: item.specs,
      },
      create: {
        sku: item.sku,
        name: item.name,
        description: item.description,
        category: item.category,
        price: item.price,
        imageUrl: item.imageUrl,
        stock: item.stock,
        rating: item.rating,
        status: item.status,
        has3DModel: item.has3DModel || false,
        modelUrl: item.modelUrl || null,
        specs: item.specs,
      },
    });
  }
  console.log(`✅ Upserted ${HEADPHONE_PRODUCTS.length} Headphone products.`);

  // 3. Upsert the 6 Wireless Earbud Products
  for (const item of EARBUDS_PRODUCTS) {
    await prisma.product.upsert({
      where: { sku: item.sku },
      update: {
        name: item.name,
        description: item.description,
        category: item.category,
        price: item.price,
        imageUrl: item.imageUrl,
        stock: item.stock,
        rating: item.rating,
        status: item.status,
        specs: item.specs,
      },
      create: {
        sku: item.sku,
        name: item.name,
        description: item.description,
        category: item.category,
        price: item.price,
        imageUrl: item.imageUrl,
        stock: item.stock,
        rating: item.rating,
        status: item.status,
        specs: item.specs,
      },
    });
  }
  console.log(`✅ Upserted ${EARBUDS_PRODUCTS.length} Wireless Earbud products.`);

  // 4. Verification summary
  const activeProducts = await prisma.product.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, name: true, category: true, sku: true, price: true },
    orderBy: [{ category: 'asc' }, { price: 'desc' }],
  });

  console.log(`\n🎉 Customer-Facing Active Catalogue: ${activeProducts.length} Systems`);
  console.table(activeProducts);
}

updateEcosystem()
  .catch((e) => {
    console.error('Error updating ecosystem:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
