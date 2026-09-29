/**
 * NEXORO LISTENING LAB — DETERMINISTIC DISCOVERY ENGINE
 * 
 * Production-Safe, Rules-Based Product Matching Engine.
 * Transparent logic matching customer listening preferences & context
 * to real canonical NEXORO audio hardware.
 * 
 * NO external AI, NO ML claims, NO randomness.
 */

import { Product } from '../types';

export interface ListeningAnswers {
  listenTo: 'Music' | 'Gaming' | 'Movies' | 'Podcasts';
  where: 'Home' | 'Office' | 'Commute' | 'Travel';
  priority: 'Deep Bass' | 'Balance' | 'Detail' | 'Immersion';
  portability: 'Low' | 'Medium' | 'High';
  sessionLength: 'Short' | 'Medium' | 'Long';
}

export interface ContextSelection {
  primary: 'COMMUTE' | 'FOCUS' | 'WORK' | 'TRAVEL' | 'HOME' | 'GAMING' | 'RELAX';
  secondary?: 'COMMUTE' | 'FOCUS' | 'WORK' | 'TRAVEL' | 'HOME' | 'GAMING' | 'RELAX';
}

export interface ListeningProfile {
  id: string;
  title: string;
  tagline: string;
  description: string;
  metrics: {
    immersion: number; // 0 - 100
    detail: number;    // 0 - 100
    portability: number;// 0 - 100
    isolation: number; // 0 - 100
    bass: number;      // 0 - 100
  };
}

export interface ProductMatch {
  product: Product;
  rank: 'PRIMARY' | 'SECONDARY' | 'ALTERNATIVE';
  score: number;
  whyThisMatch: string;
  metrics: {
    portability: number;
    immersion: number;
    isolation: number;
  };
}

/**
 * Generates a deterministic, rules-based listening profile from the 5 questions.
 */
export function calculateListeningProfile(answers: ListeningAnswers): ListeningProfile {
  const { listenTo, where, priority, portability, sessionLength } = answers;

  // Calculate base metrics (0 - 100)
  let immersion = 65;
  let detail = 65;
  let portScore = 50;
  let isolation = 60;
  let bass = 60;

  // 1. Content preference modifiers
  if (listenTo === 'Music') {
    detail += 20;
    bass += 10;
  } else if (listenTo === 'Gaming') {
    immersion += 25;
    detail += 15;
  } else if (listenTo === 'Movies') {
    immersion += 30;
    bass += 25;
  } else if (listenTo === 'Podcasts') {
    detail += 15;
    isolation += 10;
    bass -= 15;
  }

  // 2. Where modifier
  if (where === 'Home') {
    immersion += 15;
    portScore -= 20;
  } else if (where === 'Office') {
    isolation += 25;
    portScore += 10;
  } else if (where === 'Commute') {
    portScore += 35;
    isolation += 20;
  } else if (where === 'Travel') {
    portScore += 30;
    isolation += 25;
  }

  // 3. Priority modifier
  if (priority === 'Deep Bass') {
    bass += 30;
    immersion += 10;
  } else if (priority === 'Balance') {
    detail += 25;
    immersion += 10;
    bass = Math.min(bass, 70);
  } else if (priority === 'Detail') {
    detail += 30;
  } else if (priority === 'Immersion') {
    immersion += 30;
    isolation += 15;
  }

  // 4. Portability modifier
  if (portability === 'High') {
    portScore = Math.max(portScore + 30, 85);
  } else if (portability === 'Low') {
    portScore = Math.min(portScore - 25, 35);
  }

  // 5. Session length
  if (sessionLength === 'Long') {
    isolation += 10;
  }

  // Clamp 10 - 98
  immersion = Math.min(Math.max(immersion, 15), 98);
  detail = Math.min(Math.max(detail, 20), 98);
  portScore = Math.min(Math.max(portScore, 15), 98);
  isolation = Math.min(Math.max(isolation, 20), 98);
  bass = Math.min(Math.max(bass, 20), 98);

  // Deterministic profile assignment
  if (portability === 'High' || where === 'Commute') {
    return {
      id: 'MOBILE_LISTENER',
      title: 'THE MOBILE LISTENER',
      tagline: 'Life in motion. Uncompromising acoustic fidelity.',
      description: 'Your listening happens across transits, commutes, and fluid work spaces. You demand lightweight pocketability with active isolation.',
      metrics: { immersion, detail, portability: portScore, isolation, bass },
    };
  }

  if (priority === 'Detail' || (listenTo === 'Music' && priority === 'Balance')) {
    return {
      id: 'DETAIL_SEEKER',
      title: 'THE DETAIL SEEKER',
      tagline: 'Micro-transients. Spatial transparency. Natural timbre.',
      description: 'You listen critically to subtle acoustic separation, instrument placement, and pure resolving power without artificial frequency boosts.',
      metrics: { immersion, detail, portability: portScore, isolation, bass },
    };
  }

  if (priority === 'Immersion' || listenTo === 'Movies' || listenTo === 'Gaming') {
    return {
      id: 'IMMERSIVE_LISTENER',
      title: 'THE IMMERSIVE LISTENER',
      tagline: 'Expansive acoustic envelopes. Complete sonic capture.',
      description: 'You prioritize deep soundstage presence, physical sub-bass rumble, and acoustic isolation that pulls you directly into the performance.',
      metrics: { immersion, detail, portability: portScore, isolation, bass },
    };
  }

  if (where === 'Office' || sessionLength === 'Long') {
    return {
      id: 'DEEP_FOCUS_LISTENER',
      title: 'THE DEEP FOCUS LISTENER',
      tagline: 'Extended fatigue-free endurance. Distraction-free sanctuary.',
      description: 'Your sessions span consecutive hours of deep flow. Ergonomic clamp pressure, passive acoustic damping, and vocal clarity are paramount.',
      metrics: { immersion, detail, portability: portScore, isolation, bass },
    };
  }

  return {
    id: 'BALANCED_LISTENER',
    title: 'THE BALANCED LISTENER',
    tagline: 'Harmonious dynamics. Versatile acoustic agility.',
    description: 'You enjoy an expansive catalog across genres. You favor an organic tonal curve that renders vocals, percussion, and low-end with natural grace.',
    metrics: { immersion, detail, portability: portScore, isolation, bass },
  };
}

/**
 * Deterministic scoring rules matching real NEXORO products.
 */
export function calculateProductMatches(
  products: Product[],
  answers: ListeningAnswers,
  context: ContextSelection
): ProductMatch[] {
  if (!products || products.length === 0) return [];

  const scored = products
    .filter((p) => p.status === 'ACTIVE')
    .map((product) => {
      let score = 50; // base
      const isEarbuds = product.category === 'EARBUDS' || product.category === 'WIRELESS EARBUDS';
      const name = product.name.toLowerCase();
      const sku = product.sku || '';

      // --- Portability vs Stationary Weights ---
      if (answers.portability === 'High') {
        if (isEarbuds) score += 35;
        if (name.includes('flux') && !isEarbuds) score += 15; // Flux folds
        if (name.includes('apex') || name.includes('vector')) score -= 15;
      } else if (answers.portability === 'Low') {
        if (!isEarbuds) score += 30;
        if (isEarbuds) score -= 10;
      }

      // --- Where & Context Weights ---
      const activeContexts = [context.primary, context.secondary].filter(Boolean);

      if (activeContexts.includes('COMMUTE') || activeContexts.includes('TRAVEL')) {
        if (name.includes('arc') || name.includes('pulse')) score += 30;
        if (name.includes('flux')) score += 20;
        if (name.includes('vector')) score -= 25; // Open back unsuitable for transit
      }

      if (activeContexts.includes('FOCUS') || activeContexts.includes('WORK')) {
        if (name.includes('apex') || name.includes('forge') || name.includes('halo')) score += 25;
        if (name.includes('halo buds')) score += 20; // Lightweight for calls
      }

      if (activeContexts.includes('HOME') || activeContexts.includes('RELAX')) {
        if (name.includes('apex') || name.includes('vector') || name.includes('zenith')) score += 30;
      }

      if (activeContexts.includes('GAMING')) {
        if (name.includes('pulse') || name.includes('halo x1') || name.includes('apex')) score += 25;
      }

      // --- Priority Weights ---
      if (answers.priority === 'Detail') {
        if (name.includes('vector')) score += 35;
        if (name.includes('apex')) score += 25;
        if (name.includes('zenith')) score += 20;
      } else if (answers.priority === 'Immersion') {
        if (name.includes('apex') || name.includes('arc')) score += 30;
        if (name.includes('forge')) score += 20;
      } else if (answers.priority === 'Deep Bass') {
        if (name.includes('zenith') || name.includes('apex') || name.includes('forge')) score += 25;
      } else if (answers.priority === 'Balance') {
        if (name.includes('vector') || name.includes('halo') || name.includes('arc')) score += 25;
      }

      // --- Session Length ---
      if (answers.sessionLength === 'Long') {
        if (name.includes('halo x1') || name.includes('halo buds')) score += 25; // Lightweight comfort
        if (name.includes('apex')) score += 15;
      }

      // Generate explainable reason
      let whyThisMatch = '';
      if (isEarbuds) {
        if (name.includes('arc')) {
          whyThisMatch = `You prioritized ${answers.portability.toLowerCase()} portability and ${context.primary.toLowerCase()} use. ARC TWS delivers adaptive -40dB isolation with instant pocketability.`;
        } else if (name.includes('pulse')) {
          whyThisMatch = `With your focus on ${answers.listenTo.toLowerCase()} and dynamic response, Pulse Buds provides ultra-low latency and beamforming vocal pickup.`;
        } else if (name.includes('halo buds')) {
          whyThisMatch = `You indicated ${answers.sessionLength.toLowerCase()} listening sessions. Halo Buds' 4.1g pressure-relief design provides all-day zero-fatigue comfort.`;
        } else if (name.includes('zenith tws')) {
          whyThisMatch = `For critical audio fidelity on the go, Zenith TWS pairs luxury finishes with high-resolution wireless streaming.`;
        } else {
          whyThisMatch = `Engineered for seamless ${context.primary.toLowerCase()} convenience and active acoustic agility.`;
        }
      } else {
        if (name.includes('apex')) {
          whyThisMatch = `You selected ${answers.priority.toLowerCase()} and immersive listening. Apex X's 50mm custom beryllium planar drivers deliver expansive depth with aerospace rigidity.`;
        } else if (name.includes('vector')) {
          whyThisMatch = `Your preference for pure acoustic detail aligns perfectly with Vector Studio's 90mm open planar magnetic resonance chambers.`;
        } else if (name.includes('halo x1')) {
          whyThisMatch = `You prioritized ergonomic comfort for ${answers.sessionLength.toLowerCase()} sessions. At 248g, Halo X1 offers graphene-composite agility.`;
        } else if (name.includes('forge')) {
          whyThisMatch = `For high acoustic isolation in your listening space, Forge provides -32dB passive dampening with high-flux neodymium drivers.`;
        } else if (name.includes('zenith')) {
          whyThisMatch = `Crafted for deep musicality and luxurious organic warmth with hand-finished obsidian and champagne chambers.`;
        } else {
          whyThisMatch = `Lightweight collapsible architecture engineered for agile listening across home and transit.`;
        }
      }

      // Product metrics for visual bar display
      const metrics = isEarbuds
        ? { portability: 95, immersion: 80, isolation: 85 }
        : { portability: name.includes('flux') ? 70 : 40, immersion: 95, isolation: name.includes('forge') ? 95 : 85 };

      return {
        product,
        score,
        whyThisMatch,
        metrics,
      };
    });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Return top 3 with ranks
  return scored.slice(0, 3).map((item, idx) => ({
    product: item.product,
    score: item.score,
    whyThisMatch: item.whyThisMatch,
    metrics: item.metrics,
    rank: idx === 0 ? 'PRIMARY' : idx === 1 ? 'SECONDARY' : 'ALTERNATIVE',
  }));
}

/**
 * Recommends an optimal Headphone + Earbud Duo setup.
 */
export function getRecommendedDuo(
  products: Product[],
  answers: ListeningAnswers,
  context: ContextSelection
): { headphone: Product; earbud: Product } {
  const headphones = products.filter((p) => p.status === 'ACTIVE' && p.category === 'HEADPHONES');
  const earbuds = products.filter(
    (p) => p.status === 'ACTIVE' && (p.category === 'EARBUDS' || p.category === 'WIRELESS EARBUDS')
  );

  // Default fallbacks if empty
  let selectedHp = headphones[0];
  let selectedEb = earbuds[0];

  // Match optimal headphone based on priority
  if (answers.priority === 'Detail') {
    selectedHp = headphones.find((h) => h.name.includes('Vector')) || selectedHp;
  } else if (answers.sessionLength === 'Long') {
    selectedHp = headphones.find((h) => h.name.includes('Halo X1')) || selectedHp;
  } else {
    selectedHp = headphones.find((h) => h.name.includes('Apex')) || selectedHp;
  }

  // Match optimal earbuds based on context
  if (context.primary === 'GAMING' || answers.listenTo === 'Gaming') {
    selectedEb = earbuds.find((e) => e.name.includes('Pulse')) || selectedEb;
  } else if (context.primary === 'WORK' || answers.sessionLength === 'Long') {
    selectedEb = earbuds.find((e) => e.name.includes('Halo Buds')) || selectedEb;
  } else {
    selectedEb = earbuds.find((e) => e.name.includes('ARC')) || selectedEb;
  }

  return { headphone: selectedHp, earbud: selectedEb };
}
