interface ErrorScreenProps {
  error: string;
}

export function ErrorScreen({ error }: ErrorScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-4">⚠️</div>
        <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    </div>
  );
} 