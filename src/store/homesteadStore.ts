import { create } from 'zustand';
import { HomesteadSkill, HomesteadTask, HomesteadProject, ResourceType } from '../types/homestead';
import { HOMESTEAD_TASKS, HOMESTEAD_PROJECTS } from '../data/homestead/tasks';
import { useQuestStore } from './questStore';
import { useProgressStore } from './progressStore';
import { useResourceStore } from './resourceStore';
import { persist } from 'zustand/middleware';

interface HomesteadStore {
  // State
  skills: Record<string, HomesteadSkill>;
  activeTasks: HomesteadTask[];
  completedTasks: HomesteadTask[];
  activeProjects: HomesteadProject[];
  completedProjects: HomesteadProject[];
  resources: Record<ResourceType, number>;
  
  // Task Management
  startTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  startProject: (projectId: string) => void;
  updateProjectProgress: (projectId: string, stepIndex: number) => void;
  
  // Resource Management
  addResource: (type: ResourceType, amount: number) => void;
  useResource: (type: ResourceType, amount: number) => boolean;
  
  // Skill Progress
  gainSkillXP: (skillType: string, amount: number) => void;
  
  // Integration with other systems
  generateDailyTasks: () => void;
  checkProjectCompletionAchievements: () => void;
  getAvailableTasks: () => HomesteadTask[];
  getAvailableProjects: () => HomesteadProject[];
}

export const useHomesteadStore = create(
  persist(
    <HomesteadStore>((set, get) => ({
      // Initial state setup
      skills: {},
      activeTasks: [],
      completedTasks: [],
      activeProjects: [],
      completedProjects: [],
      resources: {} as Record<ResourceType, number>,

      startTask: (taskId: string) => {
        const task = HOMESTEAD_TASKS.find(t => t.id === taskId);
        if (!task) return;

        const questStore = useQuestStore.getState();
        const progressStore = useProgressStore.getState();

        set(state => ({
          activeTasks: [...state.activeTasks, task]
        }));

        // Integrate with quest system
        questStore.updateQuestProgress('HOMESTEAD', taskId);
        progressStore.addXP('HOMESTEAD', 10);
      },

      completeTask: (taskId: string) => {
        const task = get().activeTasks.find(t => t.id === taskId);
        if (!task) return;

        const questStore = useQuestStore.getState();
        const progressStore = useProgressStore.getState();
        const resourceStore = useResourceStore.getState();

        // Apply streak bonus
        const streakMultiplier = Math.pow(task.streakBonus, task.streak);
        const totalXP = task.xpReward * streakMultiplier;

        // Award resources
        task.resourceRewards.forEach(reward => {
          get().addResource(reward.type, reward.amount);
        });

        // Update skill XP
        get().gainSkillXP(task.skillType, totalXP);

        // Update global progress
        progressStore.addXP('HOMESTEAD', totalXP);
        questStore.updateQuestProgress('HOMESTEAD', taskId);

        // Update task lists
        set(state => ({
          activeTasks: state.activeTasks.filter(t => t.id !== taskId),
          completedTasks: [...state.completedTasks, {
            ...task,
            streak: task.streak + 1
          }]
        }));
      },

      startProject: (projectId: string) => {
        const project = HOMESTEAD_PROJECTS.find(p => p.id === projectId);
        if (!project) return;

        // Check requirements
        const hasSkills = project.requiredSkills.every(req => 
          get().skills[req.type]?.currentLevel >= req.level
        );

        const hasResources = project.requiredResources.every(req =>
          get().resources[req.type] >= req.amount
        );

        if (!hasSkills || !hasResources) return;

        // Consume resources
        project.requiredResources.forEach(req => {
          get().useResource(req.type, req.amount);
        });

        set(state => ({
          activeProjects: [...state.activeProjects, project]
        }));
      },

      updateProjectProgress: (projectId: string, stepIndex: number) => {
        const project = get().activeProjects.find(p => p.id === projectId);
        if (!project) return;

        const step = project.steps[stepIndex];
        if (!step) return;

        // Award XP for step completion
        get().gainSkillXP(step.skillType, 100);

        // Check if project is complete
        if (stepIndex === project.steps.length - 1) {
          // Award project completion rewards
          project.rewards.resources.forEach(reward => {
            get().addResource(reward.type, reward.amount);
          });

          useProgressStore.getState().addXP('HOMESTEAD', project.rewards.xp);
          get().checkProjectCompletionAchievements();

          // Update project lists
          set(state => ({
            activeProjects: state.activeProjects.filter(p => p.id !== projectId),
            completedProjects: [...state.completedProjects, project]
          }));
        }
      },

      // Resource management
      addResource: (type: ResourceType, amount: number) => {
        set(state => ({
          resources: {
            ...state.resources,
            [type]: (state.resources[type] || 0) + amount
          }
        }));
      },

      useResource: (type: ResourceType, amount: number) => {
        const current = get().resources[type] || 0;
        if (current < amount) return false;

        set(state => ({
          resources: {
            ...state.resources,
            [type]: current - amount
          }
        }));
        return true;
      },

      // Skill progress
      gainSkillXP: (skillType: string, amount: number) => {
        set(state => {
          const skill = state.skills[skillType];
          if (!skill) return state;

          const newXP = skill.xp + amount;
          const levelUps = Math.floor(newXP / skill.xpRequired);
          
          if (levelUps > 0 && skill.currentLevel < skill.maxLevel) {
            // Handle level up unlocks
            const newLevel = Math.min(skill.currentLevel + levelUps, skill.maxLevel);
            const unlocks = skill.unlocksAt[newLevel] || [];
            unlocks.forEach(unlock => {
              // Apply unlocked bonuses
              if (unlock.resourceBonus) {
                // Implement resource bonus
              }
              if (unlock.efficiencyBonus) {
                // Implement efficiency bonus
              }
            });

            return {
              skills: {
                ...state.skills,
                [skillType]: {
                  ...skill,
                  currentLevel: newLevel,
                  xp: newXP % skill.xpRequired
                }
              }
            };
          }

          return {
            skills: {
              ...state.skills,
              [skillType]: {
                ...skill,
                xp: newXP
              }
            }
          };
        });
      },

      // Integration helpers
      generateDailyTasks: () => {
        const homesteadLevel = useProgressStore.getState().progress.HOMESTEAD.level;
        
        // Filter tasks based on level requirements
        const availableTasks = HOMESTEAD_TASKS.filter(task => {
          if (!task.requirements) return true;
          return task.requirements.skills.every(skill => 
            get().skills[skill.type]?.currentLevel >= skill.level
          );
        });

        // Generate a mix of tasks based on level
        const dailyTasks = [];
        
        // Always include basic tasks
        dailyTasks.push(...availableTasks.filter(t => t.type === 'DAILY'));
        
        // Add weekly tasks if it's the start of the week
        if (new Date().getDay() === 0) {
          dailyTasks.push(...availableTasks.filter(t => t.type === 'WEEKLY'));
        }
        
        // Add monthly tasks if it's the start of the month
        if (new Date().getDate() === 1) {
          dailyTasks.push(...availableTasks.filter(t => t.type === 'MONTHLY'));
        }

        // Add seasonal tasks based on current season
        const currentMonth = new Date().getMonth();
        if ([2, 5, 8, 11].includes(currentMonth)) { // Start of each season
          dailyTasks.push(...availableTasks.filter(t => t.type === 'SEASONAL'));
        }

        set({ activeTasks: dailyTasks });
      },

      checkProjectCompletionAchievements: () => {
        const completedProjects = get().completedProjects;
        const questStore = useQuestStore.getState();
        
        // Check for project-based achievements
        if (completedProjects.length >= 5) {
          questStore.completeAchievement('homestead_builder');
        }
        
        // Check for specific project completions
        const hasSmokehouse = completedProjects.some(p => p.id === 'smokehouse_build');
        if (hasSmokehouse) {
          questStore.completeAchievement('smoke_master');
        }
        
        // Check for skill-based achievements
        Object.entries(get().skills).forEach(([skillType, skill]) => {
          if (skill.currentLevel >= 10) {
            questStore.completeAchievement(`${skillType.toLowerCase()}_master`);
          }
        });
      },

      getAvailableTasks: () => {
        const currentLevel = useProgressStore.getState().progress.HOMESTEAD.level;
        const activeTasks = get().activeTasks;
        
        return HOMESTEAD_TASKS.filter(task => {
          // Check if task is already active
          if (activeTasks.some(t => t.id === task.id)) return false;
          
          // Check level requirements
          if (task.requirements?.skills.some(req => 
            get().skills[req.type]?.currentLevel < req.level
          )) return false;
          
          // Check resource requirements
          if (task.requirements?.resources?.some(req =>
            get().resources[req.type] < req.amount
          )) return false;
          
          return true;
        });
      },

      getAvailableProjects: () => {
        const currentLevel = useProgressStore.getState().progress.HOMESTEAD.level;
        const activeProjects = get().activeProjects;
        
        return HOMESTEAD_PROJECTS.filter(project => {
          // Check if project is already active
          if (activeProjects.some(p => p.id === project.id)) return false;
          
          // Check if project was already completed
          if (get().completedProjects.some(p => p.id === project.id)) return false;
          
          // Check skill requirements
          if (project.requiredSkills.some(req =>
            get().skills[req.type]?.currentLevel < req.level
          )) return false;
          
          // Check resource requirements
          if (project.requiredResources.some(req =>
            get().resources[req.type] < req.amount
          )) return false;
          
          return true;
        });
      }
    })),
    {
      name: 'homestead-store',
      getStorage: () => localStorage,
      partialize: (state) => ({
        skills: state.skills,
        resources: state.resources,
        completedTasks: state.completedTasks,
        completedProjects: state.completedProjects
      })
    }
  )
); 