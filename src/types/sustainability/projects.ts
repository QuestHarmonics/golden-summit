export interface SustainabilityProject {
  id: string;
  name: string;
  description: string;
  dependencies: {
    projects?: string[];
    resources: Record<string, number>;
    skills: Record<string, number>;
    infrastructure?: string[];
    environmentalConditions?: {
      season?: Season[];
      weather?: WeatherCondition[];
      moonPhase?: MoonPhase[];
    };
  };
}

// Example interconnected projects
export const SUSTAINABILITY_PROJECTS: Record<string, SustainabilityProject> = {
  'rainwater-collection': {
    id: 'rainwater-collection',
    name: 'Rainwater Harvesting System',
    description: 'Establish basic water collection infrastructure',
    dependencies: {
      resources: {
        'TOOLS': 2,
        'WOOD': 10
      },
      skills: {
        'water-management': 1
      }
    }
  },

  'greenhouse-construction': {
    id: 'greenhouse-construction',
    name: 'Greenhouse Construction',
    description: 'Build a climate-controlled growing environment',
    dependencies: {
      projects: ['rainwater-collection'], // Requires water system first
      resources: {
        'TOOLS': 4,
        'WOOD': 20,
        'PLASTIC': 10
      },
      skills: {
        'construction': 2,
        'planning': 1
      },
      environmentalConditions: {
        weather: ['clear', 'partly-cloudy']
      }
    }
  },

  'citrus-grove': {
    id: 'citrus-grove',
    name: 'Citrus Grove Establishment',
    description: 'Plant and establish citrus trees',
    dependencies: {
      projects: ['greenhouse-construction', 'composting-system'],
      resources: {
        'CITRUS-SAPLINGS': 48,
        'COMPOST': 100,
        'TOOLS': 2
      },
      skills: {
        'horticulture': 2,
        'soil-management': 1
      },
      infrastructure: ['irrigation-system'],
      environmentalConditions: {
        season: ['spring'],
        moonPhase: ['waxing-crescent', 'first-quarter']
      }
    }
  },

  'composting-system': {
    id: 'composting-system',
    name: 'Composting System',
    description: 'Create a sustainable soil enrichment system',
    dependencies: {
      resources: {
        'TOOLS': 1,
        'WOOD': 5
      },
      skills: {
        'composting': 1
      }
    }
  },

  'chicken-integration': {
    id: 'chicken-integration',
    name: 'Chicken Integration',
    description: 'Establish chicken system within citrus grove',
    dependencies: {
      projects: ['citrus-grove'], // Must have grove established first
      resources: {
        'CHICKENS': 100,
        'FEED': 50,
        'TOOLS': 3
      },
      skills: {
        'animal-husbandry': 2,
        'integrated-systems': 1
      }
    }
  }
}; 