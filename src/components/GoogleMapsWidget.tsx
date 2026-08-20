import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Search, Phone, ExternalLink, Star, Route, Building2 } from 'lucide-react';
import { GoogleMapPlace, RouteDirection } from '../types';
import { sampleGoogleMapPlaces } from '../mockData';

interface GoogleMapsWidgetProps {
  locationName?: string;
  address?: string;
  lat?: number;
  lng?: number;
}

export const GoogleMapsWidget: React.FC<GoogleMapsWidgetProps> = ({
  locationName = 'Cliente Central',
  address = 'Av. Corrientes 1234, Ciudad Autónoma de Buenos Aires',
  lat = -34.6037,
  lng = -58.3816
}) => {
  const [activeTab, setActiveTab] = useState<'map' | 'nearby' | 'directions'>('map');
  const [searchCategory, setSearchCategory] = useState<string>('all');
  const [places, setPlaces] = useState<GoogleMapPlace[]>(sampleGoogleMapPlaces);
  const [originAddress, setOriginAddress] = useState<string>('Sede Acme Central, Puerto Madero');
  const [calculatedRoute, setCalculatedRoute] = useState<RouteDirection | null>({
    origin: 'Sede Acme Central, Puerto Madero',
    destination: address,
    distanceKm: 3.8,
    durationMinutes: 12,
    steps: [
      'Dirígete al norte por Av. Alicia Moreau de Justo (1.2 km)',
      'Gira a la izquierda en Av. Corrientes (2.1 km)',
      'Llegada al destino a la derecha: ' + address
    ]
  });

  const encodedMapAddress = encodeURIComponent(address);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Widget Header */}
      <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-red-400" />
          <h4 className="text-xs font-bold truncate">Google Maps Real-Time Location</h4>
        </div>
        
        <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded transition ${
              activeTab === 'map' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Mapa
          </button>
          <button
            onClick={() => setActiveTab('nearby')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded transition ${
              activeTab === 'nearby' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Luagres Cercanos
          </button>
          <button
            onClick={() => setActiveTab('directions')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded transition ${
              activeTab === 'directions' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Ruta & Ruta
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {activeTab === 'map' && (
          <div className="space-y-3">
            <div className="flex items-start justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="min-w-0 space-y-1">
                <p className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{locationName}</span>
                </p>
                <p className="text-xs text-slate-600 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                  <span>{address}</span>
                </p>
                <p className="text-[10px] font-mono text-slate-400">
                  GPS: {lat}, {lng}
                </p>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodedMapAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200 shrink-0 transition"
              >
                <span>Abrir Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Simulated Map Render */}
            <div className="relative h-48 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
              <iframe
                title="Google Map Preview"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${encodedMapAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                allowFullScreen
              />
            </div>
          </div>
        )}

        {activeTab === 'nearby' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Búsqueda de puntos de interés y empresas asociadas cercanas a <span className="font-bold text-slate-800">{locationName}</span>:
            </p>

            <div className="space-y-2">
              {places.map((place) => (
                <div key={place.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800">{place.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{place.address}</p>
                    <div className="flex items-center space-x-2 mt-1 text-[10px]">
                      <span className="bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                        {place.category}
                      </span>
                      {place.rating && (
                        <span className="text-amber-600 font-bold flex items-center">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                          {place.rating}
                        </span>
                      )}
                      <span className="text-slate-400 font-mono">Distancia: {place.distanceKm} km</span>
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg border border-slate-200 transition"
                  >
                    <Navigation className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'directions' && calculatedRoute && (
          <div className="space-y-3">
            <div className="bg-blue-50/50 border border-blue-200 p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                <span className="flex items-center">
                  <Route className="w-4 h-4 text-blue-600 mr-1.5" />
                  Ruta Directa de Desplazamiento
                </span>
                <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px]">
                  {calculatedRoute.durationMinutes} min ({calculatedRoute.distanceKm} km)
                </span>
              </div>

              <div className="text-[11px] space-y-1 text-slate-700">
                <p><strong>Origen:</strong> {calculatedRoute.origin}</p>
                <p><strong>Destino:</strong> {calculatedRoute.destination}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-slate-700">Instrucciones de Navegación:</p>
              {calculatedRoute.steps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="font-bold text-blue-600 font-mono">{idx + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
