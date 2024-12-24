import { useMapStore } from '../store/mapStore';

export default function Map() {
  const { regions, activeRegion, setActiveRegion } = useMapStore();

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">World Map</h1>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="aspect-video bg-gray-100 rounded-lg relative">
          {/* Map visualization will go here */}
          {regions.map((region) => (
            <div
              key={region.id}
              className={`absolute cursor-pointer p-2 rounded-lg ${
                activeRegion?.id === region.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white shadow hover:shadow-lg'
              }`}
              style={{
                left: `${region.coordinates.x}%`,
                top: `${region.coordinates.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => setActiveRegion(region)}
            >
              {region.name}
            </div>
          ))}
        </div>
      </div>
      
      {activeRegion && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">{activeRegion.name}</h2>
          <p className="text-gray-600 mb-4">{activeRegion.description}</p>
          <div className="text-sm text-gray-500">
            Level Required: {activeRegion.level}
          </div>
        </div>
      )}
    </div>
  );
} 