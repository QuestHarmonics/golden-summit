import { create } from 'zustand';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import {
  FamilyTree,
  FamilyNode,
  FamilyRelation,
  FamilyNodeType,
  RelationType,
  ActiveNode,
  HistoricalNode,
  PlaceholderNode
} from '../types/FamilyTree';

interface FamilyTreeState {
  currentTree: FamilyTree | null;
  selectedNode: FamilyNode | null;
  loading: boolean;
  error: string | null;
}

interface FamilyTreeActions {
  fetchFamilyTree: (familyId: string) => Promise<void>;
  createFamilyTree: (familyId: string, rootNode: FamilyNode) => Promise<void>;
  addNode: (node: Omit<FamilyNode, 'id' | 'lastUpdated' | 'lastUpdatedBy'>, updatedBy: string) => Promise<void>;
  updateNode: (nodeId: string, updates: Partial<FamilyNode>, updatedBy: string) => Promise<void>;
  removeNode: (nodeId: string) => Promise<void>;
  addRelation: (relation: Omit<FamilyRelation, 'id'>) => Promise<void>;
  updateRelation: (relationId: string, updates: Partial<FamilyRelation>) => Promise<void>;
  removeRelation: (relationId: string) => Promise<void>;
  convertToActive: (nodeId: string, userId: string, profileId: string) => Promise<void>;
  addStory: (nodeId: string, story: { title: string; content: string; photos?: string[] }, addedBy: string) => Promise<void>;
  updateSettings: (settings: Partial<FamilyTree['settings']>) => Promise<void>;
  setSelectedNode: (node: FamilyNode | null) => void;
  clearError: () => void;
}

export const useFamilyTreeStore = create<FamilyTreeState & FamilyTreeActions>((set, get) => ({
  currentTree: null,
  selectedNode: null,
  loading: false,
  error: null,

  fetchFamilyTree: async (familyId: string) => {
    set({ loading: true, error: null });
    try {
      const treeDoc = await getDoc(doc(db, 'familyTrees', familyId));
      
      if (treeDoc.exists()) {
        set({
          currentTree: treeDoc.data() as FamilyTree,
          loading: false
        });
      } else {
        set({
          currentTree: null,
          loading: false
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch family tree',
        loading: false
      });
    }
  },

  createFamilyTree: async (familyId: string, rootNode: FamilyNode) => {
    set({ loading: true, error: null });
    try {
      const newTree: FamilyTree = {
        id: familyId,
        familyId,
        nodes: [rootNode],
        relations: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        rootNodeId: rootNode.id,
        settings: {
          privacyLevel: 'family',
          allowedEditors: [rootNode.id],
          showLiving: false,
          showDates: false
        }
      };

      await setDoc(doc(db, 'familyTrees', familyId), newTree);
      set({
        currentTree: newTree,
        loading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create family tree',
        loading: false
      });
    }
  },

  addNode: async (node, updatedBy: string) => {
    set({ loading: true, error: null });
    try {
      const { currentTree } = get();
      if (!currentTree) throw new Error('No family tree loaded');

      const newNode: FamilyNode = {
        ...node,
        id: `node_${Date.now()}`,
        lastUpdated: Timestamp.now(),
        lastUpdatedBy: updatedBy
      };

      await updateDoc(doc(db, 'familyTrees', currentTree.id), {
        nodes: arrayUnion(newNode),
        updatedAt: Timestamp.now()
      });

      set({
        currentTree: {
          ...currentTree,
          nodes: [...currentTree.nodes, newNode],
          updatedAt: Timestamp.now()
        },
        loading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to add node',
        loading: false
      });
    }
  },

  updateNode: async (nodeId: string, updates: Partial<FamilyNode>, updatedBy: string) => {
    set({ loading: true, error: null });
    try {
      const { currentTree } = get();
      if (!currentTree) throw new Error('No family tree loaded');

      const updatedNodes = currentTree.nodes.map(node =>
        node.id === nodeId
          ? {
              ...node,
              ...updates,
              lastUpdated: Timestamp.now(),
              lastUpdatedBy: updatedBy
            }
          : node
      );

      await updateDoc(doc(db, 'familyTrees', currentTree.id), {
        nodes: updatedNodes,
        updatedAt: Timestamp.now()
      });

      set({
        currentTree: {
          ...currentTree,
          nodes: updatedNodes,
          updatedAt: Timestamp.now()
        },
        loading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update node',
        loading: false
      });
    }
  },

  removeNode: async (nodeId: string) => {
    set({ loading: true, error: null });
    try {
      const { currentTree } = get();
      if (!currentTree) throw new Error('No family tree loaded');

      // Remove node and all relations involving it
      const updatedNodes = currentTree.nodes.filter(node => node.id !== nodeId);
      const updatedRelations = currentTree.relations.filter(
        relation => relation.from !== nodeId && relation.to !== nodeId
      );

      await updateDoc(doc(db, 'familyTrees', currentTree.id), {
        nodes: updatedNodes,
        relations: updatedRelations,
        updatedAt: Timestamp.now()
      });

      set({
        currentTree: {
          ...currentTree,
          nodes: updatedNodes,
          relations: updatedRelations,
          updatedAt: Timestamp.now()
        },
        loading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to remove node',
        loading: false
      });
    }
  },

  addRelation: async (relation) => {
    set({ loading: true, error: null });
    try {
      const { currentTree } = get();
      if (!currentTree) throw new Error('No family tree loaded');

      const newRelation: FamilyRelation = {
        ...relation,
        id: `relation_${Date.now()}`
      };

      await updateDoc(doc(db, 'familyTrees', currentTree.id), {
        relations: arrayUnion(newRelation),
        updatedAt: Timestamp.now()
      });

      set({
        currentTree: {
          ...currentTree,
          relations: [...currentTree.relations, newRelation],
          updatedAt: Timestamp.now()
        },
        loading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to add relation',
        loading: false
      });
    }
  },

  updateRelation: async (relationId: string, updates: Partial<FamilyRelation>) => {
    set({ loading: true, error: null });
    try {
      const { currentTree } = get();
      if (!currentTree) throw new Error('No family tree loaded');

      const updatedRelations = currentTree.relations.map(relation =>
        relation.id === relationId
          ? { ...relation, ...updates }
          : relation
      );

      await updateDoc(doc(db, 'familyTrees', currentTree.id), {
        relations: updatedRelations,
        updatedAt: Timestamp.now()
      });

      set({
        currentTree: {
          ...currentTree,
          relations: updatedRelations,
          updatedAt: Timestamp.now()
        },
        loading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update relation',
        loading: false
      });
    }
  },

  removeRelation: async (relationId: string) => {
    set({ loading: true, error: null });
    try {
      const { currentTree } = get();
      if (!currentTree) throw new Error('No family tree loaded');

      const updatedRelations = currentTree.relations.filter(
        relation => relation.id !== relationId
      );

      await updateDoc(doc(db, 'familyTrees', currentTree.id), {
        relations: updatedRelations,
        updatedAt: Timestamp.now()
      });

      set({
        currentTree: {
          ...currentTree,
          relations: updatedRelations,
          updatedAt: Timestamp.now()
        },
        loading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to remove relation',
        loading: false
      });
    }
  },

  convertToActive: async (nodeId: string, userId: string, profileId: string) => {
    set({ loading: true, error: null });
    try {
      const { currentTree } = get();
      if (!currentTree) throw new Error('No family tree loaded');

      const node = currentTree.nodes.find(n => n.id === nodeId);
      if (!node) throw new Error('Node not found');
      if (node.type === FamilyNodeType.ACTIVE) throw new Error('Node is already active');

      const activeNode: ActiveNode = {
        ...node,
        type: FamilyNodeType.ACTIVE,
        userId,
        profileId,
        isOnline: true,
        lastActive: Timestamp.now()
      };

      await get().updateNode(nodeId, activeNode, userId);
    } catch (error: any) {
      set({
        error: error.message || 'Failed to convert node to active',
        loading: false
      });
    }
  },

  addStory: async (nodeId: string, story: { title: string; content: string; photos?: string[] }, addedBy: string) => {
    set({ loading: true, error: null });
    try {
      const { currentTree } = get();
      if (!currentTree) throw new Error('No family tree loaded');

      const node = currentTree.nodes.find(n => n.id === nodeId);
      if (!node) throw new Error('Node not found');
      if (node.type !== FamilyNodeType.HISTORICAL) throw new Error('Stories can only be added to historical nodes');

      const historicalNode = node as HistoricalNode;
      const newStory = {
        id: `story_${Date.now()}`,
        title: story.title,
        content: story.content,
        photos: story.photos || [],
        addedBy,
        addedAt: Timestamp.now()
      };

      const updatedNode: HistoricalNode = {
        ...historicalNode,
        stories: [...(historicalNode.stories || []), newStory]
      };

      await get().updateNode(nodeId, updatedNode, addedBy);
    } catch (error: any) {
      set({
        error: error.message || 'Failed to add story',
        loading: false
      });
    }
  },

  updateSettings: async (settings: Partial<FamilyTree['settings']>) => {
    set({ loading: true, error: null });
    try {
      const { currentTree } = get();
      if (!currentTree) throw new Error('No family tree loaded');

      await updateDoc(doc(db, 'familyTrees', currentTree.id), {
        settings: { ...currentTree.settings, ...settings },
        updatedAt: Timestamp.now()
      });

      set({
        currentTree: {
          ...currentTree,
          settings: { ...currentTree.settings, ...settings },
          updatedAt: Timestamp.now()
        },
        loading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update settings',
        loading: false
      });
    }
  },

  setSelectedNode: (node: FamilyNode | null) => set({ selectedNode: node }),

  clearError: () => set({ error: null })
})); 