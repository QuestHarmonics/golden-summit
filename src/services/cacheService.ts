const CACHE_NAME = 'golden-summit-cache-v1';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const cache = await caches.open(CACHE_NAME);
      const response = await cache.match(key);
      
      if (!response) return null;
      
      const data = await response.json();
      
      // Check if cache has expired
      if (data.timestamp && Date.now() - data.timestamp > CACHE_DURATION) {
        await cache.delete(key);
        return null;
      }
      
      return data.value;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async set<T>(key: string, value: T): Promise<void> {
    try {
      const cache = await caches.open(CACHE_NAME);
      const data = {
        value,
        timestamp: Date.now()
      };
      
      const response = new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
      
      await cache.put(key, response);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  static async remove(key: string): Promise<void> {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.delete(key);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  }

  static async clear(): Promise<void> {
    try {
      await caches.delete(CACHE_NAME);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  static async clearExpired(): Promise<void> {
    try {
      const cache = await caches.open(CACHE_NAME);
      const keys = await cache.keys();
      
      for (const request of keys) {
        const response = await cache.match(request);
        if (!response) continue;
        
        const data = await response.json();
        if (data.timestamp && Date.now() - data.timestamp > CACHE_DURATION) {
          await cache.delete(request);
        }
      }
    } catch (error) {
      console.error('Cache clear expired error:', error);
    }
  }
} 