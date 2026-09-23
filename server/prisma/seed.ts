import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NEXORO Database Seed (Expanded 27 Product Ecosystem)...');

  // Clean existing tables in correct order
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Default Users
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const customerPassword = await bcrypt.hash('Customer@123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'NEXORO Executive Admin',
      email: 'admin@nexoro.io',
      passwordHash: adminPassword,
      role: 'ADMIN',
      cart: { create: {} },
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Alex Vance',
      email: 'customer@nexoro.io',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
      cart: { create: {} },
    },
  });

  console.log('✅ Created Demo Users:');
  console.log('   👑 Admin: admin@nexoro.io (Password: Admin@123)');
  console.log('   👤 Customer: customer@nexoro.io (Password: Customer@123)');

  // 2. Comprehensive 27-Product NEXORO Ecosystem
  const products = [
    // --- HEADPHONES ---
    {
      name: 'NEXORO Apex Pro Wireless',
      description: 'Flagship acoustic system engineered with 50mm beryllium diaphragm drivers, active noise cancellation, custom DSP processing, and machined aerospace-grade aluminum chassis with warm copper accents.',
      category: 'HEADPHONES',
      price: 499.0,
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      stock: 12,
      sku: 'NXR-APX-01',
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
      }),
    },
    {
      name: 'NEXORO Halo X1',
      description: 'Ultra-lightweight wireless over-ear headphones focused on long-session ergonomic comfort, immersive acoustic tuning, and spatial resonance optimization.',
      category: 'HEADPHONES',
      price: 349.0,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      stock: 7,
      sku: 'NXR-HX1-02',
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
      }),
    },
    {
      name: 'NEXORO Vector Studio',
      description: 'Open-back planar magnetic reference headphones engineered for mastering engineers and audio purists seeking expansive spatial soundstages and surgical transient precision.',
      category: 'HEADPHONES',
      price: 649.0,
      imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
      stock: 3, // LOW STOCK
      sku: 'NXR-VST-03',
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
      }),
    },
    {
      name: 'NEXORO Axis ANC',
      description: 'Hybrid multi-microphone adaptive noise-cancelling headphones featuring real-time acoustic environment analysis and dual discrete amplifiers.',
      category: 'HEADPHONES',
      price: 429.0,
      imageUrl: 'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&w=800&q=80',
      stock: 0, // OUT OF STOCK
      sku: 'NXR-ANC-04',
      rating: 4.91,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Driver Architecture': '48mm Titanium-Coated Dynamic Transducers',
        'Noise Suppression': '4-Microphone Beamforming Hybrid ANC (-38dB)',
        'Frequency Response': '8Hz – 40,000Hz',
        'Impedance': '32 Ohms',
        'Battery Endurance': '30 Hours with ANC On',
      }),
    },
    {
      name: 'NEXORO Forge Monitor',
      description: 'Closed-back professional monitoring headphones designed for zero acoustic bleed, surgical frequency isolation, and high SPL tolerance in recording studios.',
      category: 'HEADPHONES',
      price: 289.0,
      imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      stock: 18,
      sku: 'NXR-FRG-05',
      rating: 4.89,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Driver Architecture': '50mm High-Flux Neodymium Transducers',
        'Isolation Factor': '-32dB Passive Acoustic Isolation',
        'Frequency Response': '6Hz – 32,000Hz',
        'Max Input Power': '2500mW',
        'Weight': '290g Reinforced Magnesium Alloy',
      }),
    },

    // --- IEM / IN-EAR MONITORS ---
    {
      name: 'NEXORO Solis Wireless IEMs',
      description: 'Hybrid tri-driver in-ear monitors pairing custom balanced armatures with a dynamic graphene woofer in a sculpted ceramic enclosure.',
      category: 'IEM',
      price: 279.0,
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      stock: 25,
      sku: 'NXR-SLS-06',
      rating: 4.87,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Driver Setup': '2x Custom Knowles BA + 1x 10mm Graphene Dynamic',
        'Noise Isolation': '-28dB Ergonomic Passive Seal',
        'Battery Life': '9h + 27h Qi Wireless Charging Shell',
        'Water Resistance': 'IPX5 Sweat & Weather Proof',
        'Codecs Supported': 'LDAC, AAC, SBC, aptX Lossless',
      }),
    },
    {
      name: 'NEXORO Pulse Mini IEM',
      description: 'Compact CNC aluminum wired in-ear monitors tuned for transparent mid-range fidelity and deep sub-bass control for on-the-go audiophiles.',
      category: 'IEM',
      price: 119.0,
      imageUrl: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80',
      stock: 9,
      sku: 'NXR-PMI-07',
      rating: 4.82,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Driver Architecture': '8.2mm Carbon Nanotube Dynamic Driver',
        'Frequency Range': '15Hz – 28,000Hz',
        'Connector': '0.78mm 2-Pin Detachable MMCX Interface',
        'Chassis': 'Anodized Aircraft Billet Aluminum',
      }),
    },
    {
      name: 'NEXORO Arc TWS',
      description: 'True wireless earbuds with adaptive spatial audio algorithms, dual MEMS beamforming voice microphones, and instant copper-accented charging case.',
      category: 'IEM',
      price: 189.0,
      imageUrl: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80',
      stock: 14,
      sku: 'NXR-ARC-08',
      rating: 4.85,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Acoustic Driver': '11mm Liquid Crystal Polymer Driver',
        'ANC Engine': 'Dynamic Environment Adaptation',
        'Battery Endurance': '8h Playback + 24h Charging Cradle',
        'Connectivity': 'Bluetooth 5.4 LE Audio Ready',
      }),
    },
    {
      name: 'NEXORO Core Reference IEM',
      description: 'Five-driver balanced armature reference in-ear monitors equipped with a 3-way passive crossover network for critical mixing and staging.',
      category: 'IEM',
      price: 299.0,
      imageUrl: 'https://images.unsplash.com/photo-1590658006821-04f4008d5717?auto=format&fit=crop&w=800&q=80',
      stock: 2, // LOW STOCK
      sku: 'NXR-CRI-09',
      rating: 4.97,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Driver Matrix': '5x Precision Balanced Armatures (1 Bass, 2 Mid, 2 High)',
        'Crossover': '3-Way Passive Integrated Filter Network',
        'Frequency Range': '10Hz – 42,000Hz',
        'Impedance': '24 Ohms @ 1kHz',
      }),
    },

    // --- AMPLIFICATION ---
    {
      name: 'NEXORO Pulse Hi-Res DAC / Amp',
      description: 'Dual ESS Sabre ES9038PRO digital-to-analog converter and fully balanced Class-A headphone amplifier with stepped copper attenuator.',
      category: 'AMPLIFICATION',
      price: 389.0,
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
      stock: 12,
      sku: 'NXR-PLS-10',
      rating: 4.93,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'DAC Chipset': 'Dual ESS Sabre ES9038PRO Flagship',
        'Amplifier Topology': 'Fully Discrete Balanced Pure Class-A',
        'Output Power': '4000mW @ 32Ω Balanced / 1500mW Single-Ended',
        'THD+N': '< 0.00008% @ 1kHz',
        'Digital Inputs': 'USB-C (768kHz/32-bit & DSD512), Optical, Coaxial',
      }),
    },
    {
      name: 'NEXORO Vector DAC Mini',
      description: 'Ultra-portable bus-powered USB-C DAC amplifier delivering clean reference decoding from smartphones, tablets, and laptops.',
      category: 'AMPLIFICATION',
      price: 149.0,
      imageUrl: 'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=800&q=80',
      stock: 5, // LOW STOCK
      sku: 'NXR-VDM-11',
      rating: 4.86,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'DAC Engine': 'Cirrus Logic CS43131 Dual Matrix',
        'Output': '4.4mm Balanced + 3.5mm Single-Ended',
        'Power Output': '240mW @ 32Ω',
        'Signal-to-Noise': '130dB High Dynamic Range',
      }),
    },
    {
      name: 'NEXORO Forge Headphone Amp',
      description: 'High-current solid-state desktop amplifier engineered specifically to drive demanding high-impedance and planar magnetic loads without strain.',
      category: 'AMPLIFICATION',
      price: 529.0,
      imageUrl: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=800&q=80',
      stock: 8,
      sku: 'NXR-FHA-12',
      rating: 4.94,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Amplifier Stage': 'Linear Power Supply with Toroidal Transformer',
        'Frequency Bandwidth': '2Hz – 120,000Hz (-0.5dB)',
        'Output Impedance': '< 0.1 Ohms Damping Factor',
        'Chassis': 'Solid Anodized Charcoal Aluminum with Copper Fin Heatsink',
      }),
    },
    {
      name: 'NEXORO Stage USB Interface',
      description: 'Studio-grade dual XLR/TRS audio interface with ultra-low noise preamps, hardware monitoring matrix, and 32-bit floating-point converters.',
      category: 'AMPLIFICATION',
      price: 329.0,
      imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
      stock: 4, // LOW STOCK
      sku: 'NXR-SUI-13',
      rating: 4.91,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Preamps': '2x Discrete Class-A Ultra-Low Noise Preamp (-131dBu EIN)',
        'Sample Rate': 'Up to 192kHz / 32-bit Floating Point',
        'Connectivity': 'USB-C Bus Powered with +48V Phantom Power',
      }),
    },

    // --- ACCESSORIES ---
    {
      name: 'NEXORO Magnetic Inductive Stand',
      description: 'Precision-balanced headphone perch with weighted obsidian steel base, warm bronze support arm, and integrated 15W Qi fast wireless charging.',
      category: 'ACCESSORIES',
      price: 129.0,
      imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
      stock: 6,
      sku: 'NXR-STD-14',
      rating: 4.92,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Construction': 'Solid Weighted Stainless Steel & Bronze Inlay',
        'Wireless Pad': '15W Fast Charge Qi Certified',
        'Cable Routing': 'Internal Concealed Channel',
        'Weight': '820g Low-Center Gravity Base',
      }),
    },
    {
      name: 'NEXORO Pure OCC Copper Cable',
      description: '8-core monocrystalline Ohno Continuous Cast copper balanced audio cable with interchangeable 4.4mm Pentaconn, 2.5mm, 3.5mm, and 6.35mm terminations.',
      category: 'ACCESSORIES',
      price: 149.0,
      imageUrl: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=800&q=80',
      stock: 22,
      sku: 'NXR-OCC-15',
      rating: 4.88,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Conductor': '7N Ultra-Pure OCC Monocrystalline Copper',
        'Braiding Geometry': '8-Core Litz Braiding with Kevlar Core',
        'Length': '1.5m / 4.9ft Soft PVC Sheath',
        'Modular System': '4-Pin Quick-Lock Interchangeable Plugs',
      }),
    },
    {
      name: 'NEXORO Studio Memory-Foam Pads',
      description: 'Ergonomic high-density gel-infused memory foam ear cushions sheathed in perforated full-grain Italian leather and breathable cooling weave.',
      category: 'ACCESSORIES',
      price: 59.0,
      imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      stock: 15,
      sku: 'NXR-PAD-16',
      rating: 4.79,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Foam Formulation': 'Gel-Infused Slow Rebound Acoustic Foam',
        'Outer Skin': 'Perforated Lambskin Leather + Microfiber Rim',
        'Mounting': 'Snap-Lock Magnetic Interface for Apex / Aero',
      }),
    },
    {
      name: 'NEXORO Acoustic Carbon Flight Case',
      description: 'Crushproof, weatherproof 3K carbon fiber travel flight case with custom laser-cut shock-absorbing EVA foam cavities for NEXORO headphones.',
      category: 'ACCESSORIES',
      price: 119.0,
      imageUrl: 'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&w=800&q=80',
      stock: 11,
      sku: 'NXR-CSE-17',
      rating: 4.9,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Outer Armor': '3K Woven Carbon Fiber Reinforced Shell',
        'Interior Core': 'Closed-Cell High-Density Impact Foam',
        'Water Resistance': 'IP67 Submersible Weatherproof Seal',
      }),
    },
    {
      name: 'NEXORO Flex USB-C Audio Cable',
      description: 'Silver-plated high-speed USB-C lossless audio transmission interconnect with braided Kevlar exterior and 24K gold-plated connectors.',
      category: 'ACCESSORIES',
      price: 49.0,
      imageUrl: 'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=800&q=80',
      stock: 30,
      sku: 'NXR-USB-18',
      rating: 4.84,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Data Throughput': 'USB 3.2 Gen 2 (10Gbps Lossless Audio Transmission)',
        'Shielding': 'Triple-Layer EMI Aluminum Foil + OFC Braid',
        'Length': '1.2m / 3.9ft',
      }),
    },
    {
      name: 'NEXORO Arc Carry Shell',
      description: 'Molded hardshell ballistic nylon travel pouch with magnetic quick-snap latch tailored for Solis and Arc true wireless earphones.',
      category: 'ACCESSORIES',
      price: 39.0,
      imageUrl: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80',
      stock: 19,
      sku: 'NXR-ACS-19',
      rating: 4.75,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Material': '1680D Ballistic Nylon Outer with Velvet Lining',
        'Closure': 'Neodymium Magnetic Snapping Mechanism',
        'Dimensions': '85mm x 60mm x 35mm',
      }),
    },
    {
      name: 'NEXORO Desk Dock Pro',
      description: 'Integrated desktop aluminum organizing station housing dual cable management clips, DAC amplifier riser, and headphone rest.',
      category: 'ACCESSORIES',
      price: 99.0,
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
      stock: 8,
      sku: 'NXR-DDK-20',
      rating: 4.88,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Material': 'Solid CNC Milled Aluminum with Anti-Slip Silicone Base',
        'Dimensions': '240mm x 140mm x 280mm',
        'Finish': 'Anodized Obsidian Graphite',
      }),
    },

    // --- ACOUSTICS ---
    {
      name: 'NEXORO Acoustic Diffuser Array',
      description: 'Architectural quadratic residue acoustic diffusers engineered from sustainable solid hardwood with obsidian finish to eliminate room flutter echoes.',
      category: 'ACOUSTICS',
      price: 349.0,
      imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
      stock: 6,
      sku: 'NXR-DIF-21',
      rating: 4.95,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Diffusion Bandwidth': '600Hz – 8,000Hz Linear Scattering',
        'Panel Core': 'CNC Precision Routed Solid American Walnut',
        'Dimensions': '600mm x 600mm x 100mm per panel',
        'Quantity Included': 'Set of 4 Interlocking Panels',
      }),
    },
    {
      name: 'NEXORO Wave Absorber Panel',
      description: 'High-absorption acoustic velocity absorber panel sheathed in fire-retardant architectural tweed for mid-to-high frequency damping.',
      category: 'ACOUSTICS',
      price: 189.0,
      imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
      stock: 14,
      sku: 'NXR-WAV-22',
      rating: 4.87,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Absorption Coefficient': 'NRC 0.95 (Broadband 250Hz - 20kHz)',
        'Internal Core': 'Non-toxic Basalt Mineral Fiber Core',
        'Dimensions': '1200mm x 600mm x 50mm',
      }),
    },
    {
      name: 'NEXORO Phase Control Panel',
      description: 'Hybrid diffusion and absorption panel combining quadratic scattering wells with membrane bass trapping for critical monitoring corners.',
      category: 'ACOUSTICS',
      price: 249.0,
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
      stock: 4, // LOW STOCK
      sku: 'NXR-PCP-23',
      rating: 4.93,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Effective Range': '80Hz – 6,500Hz Combined Phase Attenuation',
        'Frame': 'Machined Hardwood Frame with Rear Resonant Membrane',
        'Mounting': 'Includes Heavy-Duty Z-Bracket Hardware',
      }),
    },
    {
      name: 'NEXORO Room Reference Kit',
      description: 'Complete studio room calibration tuning package comprising 6 broadband absorbers, 2 corner bass traps, and 2 quadratic diffusers.',
      category: 'ACOUSTICS',
      price: 899.0,
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      stock: 3, // LOW STOCK
      sku: 'NXR-RRK-24',
      rating: 4.99,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Room Coverage': 'Ideal for critical listening spaces 12m² to 25m²',
        'Components': '6x Absorber Panels, 2x Corner Traps, 2x 3D Diffusers',
        'Certification': 'Class-A Fire Rating Tested',
      }),
    },

    // --- REPLACEMENTS / CONSUMABLES ---
    {
      name: 'NEXORO Comfort Cushion Kit',
      description: 'Pair of replacement ergonomic cooling ear cushions compatible with Apex, Halo, and Vector series headphones.',
      category: 'ACCESSORIES',
      price: 45.0,
      imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      stock: 28,
      sku: 'NXR-CCK-25',
      rating: 4.81,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Core': 'Dual-Density Thermoregulating Gel-Memory Foam',
        'Skin': 'Breathable Microfiber Rim with Protein Leather Backing',
      }),
    },
    {
      name: 'NEXORO Headband Comfort Sleeve',
      description: 'Zippered replacement padded headband sleeve crafted from supple lambskin leather to eliminate crown pressure during multi-hour sessions.',
      category: 'ACCESSORIES',
      price: 35.0,
      imageUrl: 'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&w=800&q=80',
      stock: 17,
      sku: 'NXR-HCS-26',
      rating: 4.78,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Material': 'Full-Grain Italian Lambskin with Memory Cushioning',
        'Fitment': 'Universal Zip-On Profile for NEXORO Headbands',
      }),
    },
    {
      name: 'NEXORO Precision Filter Set',
      description: 'Acoustic tuning mesh filter replacement kit with 3 pairs of interchangeable acoustic resistance dampers for Solis and Core IEMs.',
      category: 'ACCESSORIES',
      price: 29.0,
      imageUrl: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80',
      stock: 40,
      sku: 'NXR-PFS-27',
      rating: 4.86,
      status: 'ACTIVE',
      specs: JSON.stringify({
        'Filter Profiles': 'Reference Neutral, Warm Harmonic, Transparent Treble',
        'Material': 'Laser-Etched Stainless Steel 250-Mesh Screen',
      }),
    },
  ];

  const createdProducts = [];
  for (const p of products) {
    const created = await prisma.product.create({
      data: p,
    });
    createdProducts.push(created);
  }
  console.log(`✅ Created ${createdProducts.length} Realistic NEXORO Catalog Products.`);

  // 3. Create Demo Initial Orders for Real-Time Analytics & Tracking
  const order1 = await prisma.order.create({
    data: {
      userId: customer.id,
      totalAmount: 647.92,
      status: 'SHIPPED',
      customerName: 'Alex Vance',
      customerEmail: 'customer@nexoro.io',
      shippingAddress: '742 Evergreen Terrace, Suite 400',
      city: 'San Francisco',
      postalCode: '94107',
      country: 'United States',
      trackingNumber: 'NX-894102',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      items: {
        create: [
          {
            productId: createdProducts[0].id, // Apex Pro
            quantity: 1,
            priceAtPurchase: 499.0,
          },
          {
            productId: createdProducts[16].id, // Flight Case
            quantity: 1,
            priceAtPurchase: 119.0,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: customer.id,
      totalAmount: 1122.12,
      status: 'DELIVERED',
      customerName: 'Alex Vance',
      customerEmail: 'customer@nexoro.io',
      shippingAddress: '742 Evergreen Terrace, Suite 400',
      city: 'San Francisco',
      postalCode: '94107',
      country: 'United States',
      trackingNumber: 'NX-512093',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      items: {
        create: [
          {
            productId: createdProducts[2].id, // Vector Studio Open-Back
            quantity: 1,
            priceAtPurchase: 649.0,
          },
          {
            productId: createdProducts[9].id, // Pulse DAC Amp
            quantity: 1,
            priceAtPurchase: 389.0,
          },
        ],
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      userId: customer.id,
      totalAmount: 160.92,
      status: 'CONFIRMED',
      customerName: 'Alex Vance',
      customerEmail: 'customer@nexoro.io',
      shippingAddress: '742 Evergreen Terrace, Suite 400',
      city: 'San Francisco',
      postalCode: '94107',
      country: 'United States',
      trackingNumber: 'NX-304912',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      items: {
        create: [
          {
            productId: createdProducts[14].id, // Pure OCC Cable
            quantity: 1,
            priceAtPurchase: 149.0,
          },
        ],
      },
    },
  });

  console.log('✅ Created Demo Historical Orders with Tracking IDs:');
  console.log(`   📦 Order 1: ${order1.id} (Status: ${order1.status})`);
  console.log(`   📦 Order 2: ${order2.id} (Status: ${order2.status})`);
  console.log(`   📦 Order 3: ${order3.id} (Status: ${order3.status})`);

  console.log('✨ NEXORO Expanded Database Seed Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
