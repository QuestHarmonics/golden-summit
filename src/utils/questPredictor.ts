import { MetricEntry } from '../types/metrics';
import { Quest, QuestSuggestion } from '../types/quests';

export class QuestPredictor {
  private recentMetrics: MetricEntry[] = [];
  private timePatterns: Record<string, number> = {};
  private categoryPreferences: Record<string, number> = {};

  updatePatterns(metrics: MetricEntry[]) {
    this.recentMetrics = metrics.slice(-20); // Look at last 20 entries
    
    // Analyze time patterns
    this.recentMetrics.forEach(metric => {
      const hour = new Date(metric.timestamp).getHours();
      this.timePatterns[hour] = (this.timePatterns[hour] || 0) + 1;
    });

    // Analyze category preferences
    this.recentMetrics.forEach(metric => {
      this.categoryPreferences[metric.category] = 
        (this.categoryPreferences[metric.category] || 0) + metric.value;
    });
  }

  suggestQuests(availableQuests: Quest[]): QuestSuggestion[] {
    const currentHour = new Date().getHours();
    const activeTime = this.timePatterns[currentHour] > 0;
    
    return availableQuests.map(quest => {
      let confidence = 0;
      let reasons: string[] = [];

      // Time-based confidence
      if (activeTime) {
        confidence += 0.3;
        reasons.push("You're usually active at this time");
      }

      // Category preference confidence
      const questCategory = quest.requirements.find(r => r.type === 'activity')?.value;
      if (questCategory && this.categoryPreferences[questCategory]) {
        confidence += 0.4;
        reasons.push(`You enjoy ${questCategory} activities`);
      }

      // Progress-based confidence
      if (quest.progress > 0) {
        confidence += 0.3;
        reasons.push("You've already made progress on this");
      }

      return {
        quest,
        confidence: Math.min(confidence, 1),
        reason: reasons.join('. ')
      };
    })
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3); // Return top 3 suggestions
  }
} 