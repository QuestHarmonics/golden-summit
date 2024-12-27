import { UserData } from '../store/gameStore';

class DataService {
  private static instance: DataService;
  
  private constructor() {}
  
  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  public async saveUserData(username: string, data: UserData): Promise<void> {
    try {
      localStorage.setItem(`user_${username}`, JSON.stringify(data));
      await this.syncWithCloud(username, data);
    } catch (error) {
      console.error('Error saving user data:', error);
      // Fallback to local storage only if cloud sync fails
      localStorage.setItem(`user_${username}`, JSON.stringify(data));
    }
  }

  public getUserData(username: string): UserData | null {
    try {
      const data = localStorage.getItem(`user_${username}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  public async syncWithCloud(username: string, data: UserData): Promise<void> {
    // TODO: Implement cloud synchronization
    // This will be implemented when we add backend services
    return Promise.resolve();
  }

  public clearUserData(username: string): void {
    try {
      localStorage.removeItem(`user_${username}`);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }

  public exportUserData(username: string): string {
    const data = this.getUserData(username);
    return data ? JSON.stringify(data) : '';
  }

  public importUserData(username: string, jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      this.saveUserData(username, data);
      return true;
    } catch (error) {
      console.error('Error importing user data:', error);
      return false;
    }
  }

  public isDataAvailable(username: string): boolean {
    return !!localStorage.getItem(`user_${username}`);
  }
}

export const dataService = DataService.getInstance(); 