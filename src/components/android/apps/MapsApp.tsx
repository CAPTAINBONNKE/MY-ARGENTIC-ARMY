import React, { useState } from 'react';
import { Search, Navigation, Compass, Layers, Coffee, Fuel, Utensils, Star, Clock, Crosshair, MapPin } from 'lucide-react';
import { DeviceLocation } from '../../../types/androidAgent';

interface MapsAppProps {
  location: DeviceLocation;
  onSelectPlace?: (place: any) => void;
}

export const MapsApp: React.FC<MapsAppProps> = ({ location, onSelectPlace }) => {
  const [searchQuery, setSearchQuery] = useState('Coffee shops');
  const [selectedPlace, setSelectedPlace] = useState<any>({
    id: 'p1',
    name: 'Artisan Roast & Bakery',
    category: 'Specialty Espresso & Pastries',
    rating: 4.8,
    reviews: 412,
    distance: '0.3 mi',
    eta: '4 min walk',
    address: '452 Market St, Financial District, SF',
    open: true,
    hours: 'Open until 7:00 PM'
  });

  const places = [
    {
      id: 'p1',
      name: 'Artisan Roast & Bakery',
      category: 'Specialty Espresso & Pastries',
      rating: 4.8,
      reviews: 412,
      distance: '0.3 mi',
      eta: '4 min walk',
      address: '452 Market St, Financial District, SF',
      open: true,
      hours: 'Open until 7:00 PM',
      color: 'bg-amber-500'
    },
    {
      id: 'p2',
      name: 'Equator Coffees',
      category: 'Organic Coffee Bar',
      rating: 4.7,
      reviews: 289,
      distance: '0.5 mi',
      eta: '7 min walk',
      address: '222 2nd St, San Francisco, CA',
      open: true,
      hours: 'Open until 6:00 PM',
      color: 'bg-emerald-500'
    },
    {
      id: 'p3',
      name: 'Philz Coffee',
      category: 'Handcrafted Drips',
      rating: 4.9,
      reviews: 950,
      distance: '0.7 mi',
      eta: '10 min walk',
      address: '1 Front St, San Francisco, CA',
      open: true,
      hours: 'Open until 8:00 PM',
      color: 'bg-blue-500'
    }
  ];

  return (
    <div id="app-maps" className="flex flex-col h-full bg-slate-950 text-slate-100 select-none relative overflow-hidden">
      {/* Top Search Overlay */}
      <div className="absolute top-2 left-2 right-2 z-10 space-y-2">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-full px-3 py-1.5 shadow-lg shadow-black/40">
          <Search className="w-4 h-4 text-emerald-400 shrink-0" />
          <input
            id="maps-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nearby places, cafes, gas..."
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button 
            id="btn-recenter-gps"
            title="Recenter GPS"
            className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-emerald-400"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-[10px] text-emerald-300 font-medium whitespace-nowrap">
            <Coffee className="w-3 h-3" /> Coffee
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-[10px] text-slate-300 font-medium whitespace-nowrap">
            <Utensils className="w-3 h-3" /> Food
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-[10px] text-slate-300 font-medium whitespace-nowrap">
            <Fuel className="w-3 h-3" /> Gas
          </button>
        </div>
      </div>

      {/* Simulated Map Canvas */}
      <div className="flex-1 w-full h-full bg-[#0d141e] relative flex items-center justify-center">
        {/* Map Grid Lines */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:28px_28px]" />
        
        {/* Roads & Blocks simulation */}
        <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 100 Q 150 140 360 80" stroke="#334155" strokeWidth="18" fill="none" />
          <path d="M 120 0 L 120 500" stroke="#334155" strokeWidth="14" fill="none" />
          <path d="M 260 0 L 260 500" stroke="#334155" strokeWidth="16" fill="none" />
          <path d="M 0 280 L 360 280" stroke="#38bdf8" strokeWidth="6" strokeDasharray="8 4" fill="none" />
          <path d="M 0 380 L 360 350" stroke="#334155" strokeWidth="12" fill="none" />
        </svg>

        {/* GPS User Dot */}
        <div className="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 animate-ping absolute" />
          <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-md shadow-blue-500/50 flex items-center justify-center z-10">
            <Navigation className="w-2.5 h-2.5 text-white transform -rotate-45" />
          </div>
          <span className="absolute top-6 whitespace-nowrap text-[9px] bg-slate-900/90 text-blue-300 font-mono px-1.5 py-0.5 rounded border border-blue-800/60 shadow">
            You (GPS ±{location.accuracy}m)
          </span>
        </div>

        {/* Place Markers */}
        <div 
          onClick={() => setSelectedPlace(places[0])}
          className="absolute top-[35%] left-[62%] cursor-pointer group -translate-x-1/2 -translate-y-1/2"
        >
          <div className="p-1.5 rounded-full bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
            <Coffee className="w-3.5 h-3.5" />
          </div>
          <span className="text-[9px] bg-slate-900/95 text-amber-300 font-semibold px-1 rounded shadow border border-amber-500/40 absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
            Artisan 4.8★
          </span>
        </div>

        <div 
          onClick={() => setSelectedPlace(places[1])}
          className="absolute top-[68%] left-[28%] cursor-pointer group -translate-x-1/2 -translate-y-1/2"
        >
          <div className="p-1.5 rounded-full bg-emerald-500 text-slate-950 shadow-lg group-hover:scale-110 transition-transform">
            <Coffee className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Floating Controls */}
        <div className="absolute right-3 top-28 flex flex-col gap-2 z-10">
          <button className="p-2 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white shadow">
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button className="p-2 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white shadow">
            <Compass className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Selected Place Bottom Sheet */}
      {selectedPlace && (
        <div className="bg-slate-900 border-t border-slate-800 p-3 shadow-2xl z-20">
          <div className="w-8 h-1 bg-slate-700 rounded-full mx-auto mb-2" />
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                {selectedPlace.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{selectedPlace.category}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-0.5 text-[10px] text-amber-400 font-semibold">
                  <Star className="w-3 h-3 fill-amber-400" /> {selectedPlace.rating}
                </span>
                <span className="text-[10px] text-slate-500">({selectedPlace.reviews})</span>
                <span className="text-[10px] text-emerald-400 font-medium">● {selectedPlace.open ? 'Open' : 'Closed'}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-400">{selectedPlace.distance}</span>
              <p className="text-[10px] text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                <Clock className="w-3 h-3" /> {selectedPlace.eta}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2.5">
            <button 
              id="btn-maps-start-navigation"
              onClick={() => onSelectPlace && onSelectPlace(selectedPlace)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 fill-white" /> Start Navigation
            </button>
            <button className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700">
              Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
