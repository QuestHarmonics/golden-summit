export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;
  isArchived?: boolean;
}

export interface BaseState<T extends BaseEntity> {
  items: Record<string, T>;
  archivedItems: Record<string, T>;
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  showArchived: boolean;
}

export interface BaseActions<T extends BaseEntity> {
  add: (item: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'archivedAt' | 'isArchived'>) => void;
  update: (id: string, updates: Partial<T>) => void;
  remove: (id: string) => void;
  select: (id: string | null) => void;
  archive: (id: string) => void;
  unarchive: (id: string) => void;
  toggleArchiveView: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  getActive: () => T[];
  getArchived: () => T[];
} 