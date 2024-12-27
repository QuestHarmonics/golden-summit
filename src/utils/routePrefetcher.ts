import { Routes } from '../types/routes';

interface PrefetchConfig {
  routes: {
    [key in Routes]?: Routes[];
  };
  threshold?: number;
}

export class RoutePrefetcher {
  private static prefetchedRoutes = new Set<string>();
  private static config: PrefetchConfig = {
    routes: {
      [Routes.HOME]: [Routes.QUESTS, Routes.SKILLS],
      [Routes.QUESTS]: [Routes.SKILLS, Routes.MAP],
      [Routes.SKILLS]: [Routes.QUESTS, Routes.ACHIEVEMENTS],
      [Routes.MAP]: [Routes.QUESTS, Routes.HOMESTEAD],
      [Routes.TASKS]: [Routes.HABITS, Routes.JOURNAL],
      [Routes.HABITS]: [Routes.TASKS, Routes.ACHIEVEMENTS],
      [Routes.JOURNAL]: [Routes.TASKS, Routes.PROFILE],
      [Routes.ACHIEVEMENTS]: [Routes.SKILLS, Routes.PROFILE],
      [Routes.PROFILE]: [Routes.ACHIEVEMENTS, Routes.HOMESTEAD],
      [Routes.HOMESTEAD]: [Routes.MAP, Routes.PROFILE]
    },
    threshold: 0.2 // Intersection observer threshold
  };

  static initialize(config?: Partial<PrefetchConfig>): void {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    // Set up intersection observers for navigation links
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const link = entry.target as HTMLAnchorElement;
              const route = link.getAttribute('href');
              if (route) {
                this.prefetchRoute(route as Routes);
              }
            }
          });
        },
        { threshold: this.config.threshold }
      );

      // Observe all navigation links
      document.querySelectorAll('a[href^="/"]').forEach((link) => {
        observer.observe(link);
      });
    }
  }

  static async prefetchRoute(route: Routes): Promise<void> {
    if (this.prefetchedRoutes.has(route)) return;

    try {
      // Prefetch the requested route
      await this.prefetchComponent(route);
      this.prefetchedRoutes.add(route);

      // Prefetch related routes
      const relatedRoutes = this.config.routes[route];
      if (relatedRoutes) {
        for (const relatedRoute of relatedRoutes) {
          if (!this.prefetchedRoutes.has(relatedRoute)) {
            // Use requestIdleCallback if available, otherwise setTimeout
            if ('requestIdleCallback' in window) {
              window.requestIdleCallback(() => {
                this.prefetchComponent(relatedRoute);
                this.prefetchedRoutes.add(relatedRoute);
              });
            } else {
              setTimeout(() => {
                this.prefetchComponent(relatedRoute);
                this.prefetchedRoutes.add(relatedRoute);
              }, 0);
            }
          }
        }
      }
    } catch (error) {
      console.error('Route prefetch error:', error);
    }
  }

  private static async prefetchComponent(route: Routes): Promise<void> {
    try {
      switch (route) {
        case Routes.HOME:
          await import('../components/Dashboard');
          break;
        case Routes.QUESTS:
          await import('../components/QuestSystem');
          break;
        case Routes.SKILLS:
          await import('../components/SkillTree');
          break;
        case Routes.MAP:
          await import('../pages/Map');
          break;
        case Routes.TASKS:
          await import('../pages/Tasks');
          break;
        case Routes.HABITS:
          await import('../pages/Habits');
          break;
        case Routes.JOURNAL:
          await import('../pages/Journal');
          break;
        case Routes.ACHIEVEMENTS:
          await import('../pages/Achievements');
          break;
        case Routes.PROFILE:
          await import('../pages/Profile');
          break;
        case Routes.HOMESTEAD:
          await import('../pages/Homestead');
          break;
      }
    } catch (error) {
      console.error(`Failed to prefetch component for route ${route}:`, error);
    }
  }

  static clearPrefetchCache(): void {
    this.prefetchedRoutes.clear();
  }
} 