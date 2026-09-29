export type ProductMechanic = 'CINEMATIC' | '360_VIEW' | 'COLOR_LAB' | 'ENGINEERING' | 'NONE';

export interface MechanicBadgeInfo {
  type: ProductMechanic;
  label: string;
  badgeClass: string;
  description: string;
}

export function getProductMechanic(product: { name: string; sku?: string; specs?: string }): ProductMechanic {
  const name = product.name.toLowerCase();
  
  if (name.includes('apex') || name.includes('arc tws')) {
    return 'CINEMATIC';
  }
  if (name.includes('halo')) {
    return '360_VIEW';
  }
  if (name.includes('zenith')) {
    return 'COLOR_LAB';
  }
  if (name.includes('vector')) {
    return 'ENGINEERING';
  }

  // Also check if specs JSON has an Experience field
  if (product.specs) {
    try {
      const parsed = JSON.parse(product.specs);
      if (parsed.Experience === 'CINEMATIC') return 'CINEMATIC';
      if (parsed.Experience === '360_VIEW') return '360_VIEW';
      if (parsed.Experience === 'COLOR_LAB') return 'COLOR_LAB';
      if (parsed.Experience === 'ENGINEERING') return 'ENGINEERING';
    } catch {
      // ignore
    }
  }

  return 'NONE';
}

export function getBadgeInfo(mechanic: ProductMechanic): MechanicBadgeInfo | null {
  switch (mechanic) {
    case 'CINEMATIC':
      return {
        type: 'CINEMATIC',
        label: 'CINEMATIC',
        badgeClass: 'bg-copper/20 text-copper border-copper/40 shadow-[0_0_10px_rgba(200,131,74,0.3)]',
        description: 'Scroll-driven mechanical & acoustic disassembly sequence',
      };
    case '360_VIEW':
      return {
        type: '360_VIEW',
        label: '360° VIEW',
        badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]',
        description: 'Interactive multi-angle rotational viewer with smooth zoom',
      };
    case 'COLOR_LAB':
      return {
        type: 'COLOR_LAB',
        label: 'COLOR LAB',
        badgeClass: 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.3)]',
        description: 'Interactive finish switcher: Obsidian, Champagne, Graphite',
      };
    case 'ENGINEERING':
      return {
        type: 'ENGINEERING',
        label: 'ENGINEERING',
        badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]',
        description: 'Interactive structural telemetry and component hotspots',
      };
    default:
      return null;
  }
}
