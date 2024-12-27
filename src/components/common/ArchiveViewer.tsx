import React from 'react';
import { BaseEntity } from '../../types/core/store';

interface ArchiveViewerProps<T extends BaseEntity> {
  items: T[];
  archivedItems: T[];
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onDelete: (id: string) => void;
  renderItem: (item: T) => React.ReactNode;
  showArchived: boolean;
  onToggleView: () => void;
}

export function ArchiveViewer<T extends BaseEntity>({
  items,
  archivedItems,
  onArchive,
  onUnarchive,
  onDelete,
  renderItem,
  showArchived,
  onToggleView
}: ArchiveViewerProps<T>) {
  const displayItems = showArchived ? archivedItems : items;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-pixel">
          {showArchived ? 'Archived Items' : 'Active Items'}
        </h2>
        <button
          onClick={onToggleView}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
        >
          Show {showArchived ? 'Active' : 'Archived'}
        </button>
      </div>

      <div className="space-y-2">
        {displayItems.map(item => (
          <div key={item.id} className="relative group">
            {renderItem(item)}
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {showArchived ? (
                <>
                  <button
                    onClick={() => onUnarchive(item.id)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onArchive(item.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Archive
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {displayItems.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No {showArchived ? 'archived' : 'active'} items to display
        </p>
      )}
    </div>
  );
} 