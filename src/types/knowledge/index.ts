interface Knowledge {
  id: string;
  category: 'natural' | 'technical' | 'traditional' | 'spiritual';
  level: number;
  applications: Array<{
    type: string;
    effect: {
      target: string;
      modifier: number;
    };
  }>;
  unlocks: string[];
  requirements: {
    skills: Record<string, number>;
    experience: number;
    observations: string[];
  };
}

const KNOWLEDGE_CATEGORIES = {
  natural: ['plant-identification', 'weather-reading', 'animal-tracking'],
  technical: ['tool-making', 'construction', 'preservation'],
  traditional: ['herbal-medicine', 'food-preservation', 'crafting'],
  spiritual: ['meditation', 'ritual-crafting', 'energy-work']
}; 