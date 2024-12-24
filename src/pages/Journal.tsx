import { useDocumentationStore } from '../store/documentationStore';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

export default function Journal() {
  const { journalEntries, addJournalEntry } = useDocumentationStore();

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Journal</h1>
      
      {/* Entry Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">New Entry</h2>
        <form className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <textarea
              placeholder="Write your thoughts..."
              rows={4}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <input
                type="number"
                min="1"
                max="10"
                placeholder="Mood (1-10)"
                className="w-24 p-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Tags (comma separated)"
                className="w-48 p-2 border rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Entry
            </button>
          </div>
        </form>
      </div>

      {/* Journal Entries */}
      <div className="space-y-6">
        {journalEntries.map((entry) => (
          <div key={entry.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{entry.title}</h2>
              <div className="text-sm text-gray-500">
                {format(new Date(entry.createdAt), 'MMM d, yyyy')}
              </div>
            </div>
            <div className="prose max-w-none">
              <ReactMarkdown>{entry.content}</ReactMarkdown>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex space-x-2">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-sm">
                Mood: <span className="font-medium">{entry.mood}/10</span>
              </div>
            </div>
            {entry.attachments.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {entry.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <img
                      src={attachment.thumbnail || attachment.url}
                      alt={attachment.caption || ''}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 