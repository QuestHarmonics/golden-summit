import { create } from 'zustand';
import { Location, MapMarker } from '../types/map';

interface MapStore {
  locations: Location[];
  mapMarkers: MapMarker[];
  addLocation: (location: Location) => void;
  updateLocation: (id: string, location: Partial<Location>) => void;
  deleteLocation: (id: string) => void;
  addMapMarker: (marker: MapMarker) => void;
  updateMapMarker: (id: string, marker: Partial<MapMarker>) => void;
  deleteMapMarker: (id: string) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  locations: [],
  mapMarkers: [],
  addLocation: (location) =>
    set((state) => ({
      locations: [...state.locations, location]
    })),
  updateLocation: (id, location) =>
    set((state) => ({
      locations: state.locations.map((l) => 
        l.id === id ? { ...l, ...location } : l
      )
    })),
  deleteLocation: (id) =>
    set((state) => ({
      locations: state.locations.filter((l) => l.id !== id)
    })),
  addMapMarker: (marker) =>
    set((state) => ({
      mapMarkers: [...state.mapMarkers, marker]
    })),
  updateMapMarker: (id, marker) =>
    set((state) => ({
      mapMarkers: state.mapMarkers.map((m) =>
        m.id === id ? { ...m, ...marker } : m
      )
    })),
  deleteMapMarker: (id) =>
    set((state) => ({
      mapMarkers: state.mapMarkers.filter((m) => m.id !== id)
    }))
})); 