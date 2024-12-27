interface SocialSystem {
  coop: {
    members: Member[];
    projects: CoopProject[];
    schedule: Schedule;
    resources: SharedResource[];
  };
  band: {
    members: BandMember[];
    repertoire: Song[];
    practices: PracticeSession[];
    performances: Performance[];
  };
  family: {
    members: FamilyMember[];
    activities: FamilyActivity[];
    responsibilities: Responsibility[];
  };
} 