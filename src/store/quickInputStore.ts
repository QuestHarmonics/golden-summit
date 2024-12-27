import { create } from 'zustand';
import { useHealthStore } from './healthStore';
import { useProgressStore } from './progressStore';
import { useQuestStore } from './questStore';

interface QuickInputStore {
  // Quick inputs for various metrics
  logMeal: (type: string, quality: 1|2|3|4|5, notes?: string) => void;
  logSleep: (hours: number, quality: 1|2|3|4|5, notes?: string) => void;
  logTraining: (type: string, intensity: 1|2|3|4|5, duration: number) => void;
  logStress: (level: 1|2|3|4|5, recovery: string[]) => void;
  logEnvironment: (sunlight: number, movement: number) => void;
  
  // Quick mood/energy tracking
  trackMood: (level: 1|2|3|4|5) => void;
  trackEnergy: (level: 1|2|3|4|5) => void;
  
  // Quick symptoms
  logSymptom: (type: string, severity: 1|2|3|4|5) => void;
}

export const useQuickInputStore = create<QuickInputStore>((set, get) => ({
  logMeal: (type, quality, notes) => {
    const healthStore = useHealthStore.getState();
    const now = new Date();
    
    healthStore.addMeal({
      meatType: type as any,
      preparation: 'medium', // default
      organMeats: false,
      fatContent: 70, // default percentage
      quantity: 200, // default grams
      timing: now,
      hungerLevel: 3,
      satiety: quality,
      mood: quality,
      energy: quality,
      symptoms: notes ? [notes] : []
    });

    // Update progress
    useProgressStore.getState().addXP('NUTRITION', quality * 10);
  },

  logSleep: (hours, quality, notes) => {
    const healthStore = useHealthStore.getState();
    const now = new Date();
    
    healthStore.addSleepEntry({
      bedTime: new Date(now.getTime() - (hours * 3600000)),
      wakeTime: now,
      totalDuration: hours,
      deepSleep: hours * 0.3, // estimated
      remSleep: hours * 0.2,  // estimated
      lightSleep: hours * 0.5, // estimated
      awakeTime: 0,
      hrv: 0, // to be filled by device data
      respiratoryRate: 0, // to be filled by device data
      temperature: 0, // to be filled by device data
      quality: quality,
      environmentalFactors: {
        temperature: 20,
        humidity: 50,
        noise: 0,
        light: 0
      }
    });

    useProgressStore.getState().addXP('PHYSICAL', quality * 20);
  },

  logTraining: (type, intensity, duration) => {
    const healthStore = useHealthStore.getState();
    
    healthStore.addTrainingSession({
      type: type as any,
      exercises: [],
      intensity: intensity,
      duration: duration,
      energyLevel: intensity,
      recovery: 3,
      notes: ''
    });

    useProgressStore.getState().addXP('PHYSICAL', intensity * duration / 10);
  },

  logStress: (level, recovery) => {
    const healthStore = useHealthStore.getState();
    
    healthStore.addStressEntry({
      hrvMorning: 0, // to be filled by device data
      hrvNight: 0,   // to be filled by device data
      perceivedStress: level,
      meditation: {
        duration: recovery.includes('meditation') ? 15 : 0,
        type: 'breathing',
        quality: 3
      },
      recoveryActivities: recovery.map(r => ({
        type: r as any,
        duration: 15,
        intensity: 3
      }))
    });

    useProgressStore.getState().addXP('MENTAL', (6 - level) * 10);
  },

  logEnvironment: (sunlight, movement) => {
    const healthStore = useHealthStore.getState();
    
    healthStore.addEnvironmentalData({
      sunlight: {
        duration: sunlight,
        timeOfDay: ['morning'],
        uvIndex: 5
      },
      temperature: {
        morning: 20,
        afternoon: 25,
        evening: 22
      },
      airQuality: {
        pm25: 0,
        voc: 0,
        co2: 0
      },
      emf: {
        electric: 0,
        magnetic: 0,
        rf: 0
      }
    });

    useProgressStore.getState().addXP('PHYSICAL', sunlight + movement);
  },

  trackMood: (level) => {
    useProgressStore.getState().addXP('MENTAL', level * 5);
    // Could trigger quests/achievements based on mood streaks
  },

  trackEnergy: (level) => {
    useProgressStore.getState().addXP('PHYSICAL', level * 5);
    // Could modify available tasks/activities based on energy
  },

  logSymptom: (type, severity) => {
    // Track symptoms and potentially trigger alerts or recommendations
    useQuestStore.getState().updateProgress('HEALTH_TRACKING', {
      count: 1,
      metadata: { symptom: type, severity }
    });
  }
})); 