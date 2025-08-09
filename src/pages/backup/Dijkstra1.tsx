import React, { useState } from 'react';
import { Search, MapPin, Route, Navigation, Clock, Zap } from 'lucide-react';

type Graph = {
  vertex: string;
  visited: boolean;
  distance: number;
  previous: string | null;
};

const graphMap: Record<string, Graph> = {
  Passau:     { vertex: 'Passau', visited: true, distance: 0, previous: null },
  Linz:       { vertex: 'Linz', visited: true, distance: 102, previous: 'Passau' },
  Salzburg:   { vertex: 'Salzburg', visited: true, distance: 228, previous: 'Linz' },
  Rosenheim:  { vertex: 'Rosenheim', visited: true, distance: 287, previous: 'Salzburg' },
  Munchen:    { vertex: 'Munchen', visited: true, distance: 189, previous: 'Passau' },
  Ulm:        { vertex: 'Ulm', visited: true, distance: 312, previous: 'Munchen' },
  Memmingen:  { vertex: 'Memmingen', visited: true, distance: 367, previous: 'Ulm' },
  Nurnberg:   { vertex: 'Nurnberg', visited: true, distance: 220, previous: 'Passau' },
  Bayreuth:   { vertex: 'Bayreuth', visited: true, distance: 295, previous: 'Nurnberg' },
  Wurzburg:   { vertex: 'Wurzburg', visited: true, distance: 324, previous: 'Nurnberg' },
  Stuttgart:  { vertex: 'Stuttgart', visited: true, distance: 419, previous: 'Ulm' },
  Karlsruhe:  { vertex: 'Karlsruhe', visited: true, distance: 483, previous: 'Stuttgart' },
  Mannheim:   { vertex: 'Mannheim', visited: true, distance: 550, previous: 'Karlsruhe' },
  Frankfurt:  { vertex: 'Frankfurt', visited: true, distance: 435, previous: 'Wurzburg' },
  Zurich:     { vertex: 'Zurich', visited: true, distance: 551, previous: 'Memmingen' },
  Basel:      { vertex: 'Basel', visited: true, distance: 636, previous: 'Zurich' },
  Bern:       { vertex: 'Bern', visited: true, distance: 727, previous: 'Basel' },
  Innsbruck:  { vertex: 'Innsbruck', visited: true, distance: 380, previous: 'Rosenheim' },
  Landeck:    { vertex: 'Landeck', visited: true, distance: 453, previous: 'Innsbruck' }
};

const getSegmentDistance = (fromCity: string, toCity: string): number => {
  const fromDistance = graphMap[fromCity]?.distance || 0;
  const toDistance = graphMap[toCity]?.distance || 0;
  return Math.abs(toDistance - fromDistance);
};

const Dijkstra: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

  const filteredCities = Object.values(graphMap).filter(city =>
    city.vertex.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPathToPassau = (startCity: string): string[] => {
    const path: string[] = [];
    let current = startCity;
    
    while (current) {
      path.push(current);
      if (current === 'Passau') {
        break;
      }
      const node = graphMap[current];
      current = node?.previous || '';
    }
    return path;
  };

  const handleCityClick = (cityName: string) => {
    setSelectedDestination(cityName === selectedDestination ? null : cityName);
  };

  const selectedPath = selectedDestination ? getPathToPassau(selectedDestination) : [];
  const totalCities = Object.keys(graphMap).length;
  const visitedCities = Object.values(graphMap).filter(city => city.visited).length;
  const furthestCity = Object.values(graphMap).reduce((max, city) => 
    city.distance > max.distance ? city : max
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-xl">
                <Navigation className="text-gray-600" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">
                  Dijkstra's Algorithm Explorer
                </h1>
                <p className="text-gray-600 mt-1">Find the shortest path between European cities</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
              <Zap className="text-gray-500" size={16} />
              <span className="text-sm font-medium text-gray-700">Smart Path Finding</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for any European city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200 text-lg"
            />
          </div>
        </div>

        {/* Path Visualization */}
        {selectedDestination && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Route className="text-gray-600" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Route from {selectedDestination} to Passau
                </h3>
                <p className="text-gray-600 text-sm">Optimal path calculated using Dijkstra's algorithm</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {selectedPath.map((city, index) => (
                  <React.Fragment key={city}>
                    <div className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
                      city === 'Passau' 
                        ? 'bg-gray-700 text-white' 
                        : city === selectedDestination
                        ? 'bg-gray-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300'
                    }`}>
                      {city}
                      {city === 'Passau' && <span className="ml-2">🎯</span>}
                      {city === selectedDestination && <span className="ml-2">📍</span>}
                    </div>
                    {index < selectedPath.length - 1 && (
                      <div className="flex items-center">
                        <div className="w-6 h-0.5 bg-gray-300"></div>
                        <span className="text-gray-400 mx-1">→</span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Detailed segment breakdown */}
              <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Route size={16} />
                  Segment Details
                </h4>
                <div className="space-y-2">
                  {selectedPath.slice(0, -1).map((city, index) => {
                    const nextCity = selectedPath[index + 1];
                    const segmentDistance = getSegmentDistance(city, nextCity);
                    return (
                      <div key={`${city}-${nextCity}`} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-gray-700">{city}</span>
                          <span className="text-gray-400">→</span>
                          <span className="font-medium text-gray-700">{nextCity}</span>
                        </div>
                        <div className="text-sm font-mono font-semibold text-gray-800">
                          {segmentDistance} km
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="text-gray-500" size={16} />
                  <span className="text-gray-700">
                    Total distance: <strong>{graphMap[selectedDestination]?.distance} km</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-gray-500" size={16} />
                  <span className="text-gray-700">
                    Stops: <strong>{selectedPath.length - 1}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Cities</p>
                <p className="text-3xl font-bold text-gray-800">{totalCities}</p>
              </div>
              <MapPin className="text-gray-400" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Processed</p>
                <p className="text-3xl font-bold text-gray-800">{visitedCities}</p>
              </div>
              <Zap className="text-gray-400" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Furthest City</p>
                <p className="text-xl font-bold text-gray-800">{furthestCity.vertex}</p>
              </div>
              <Navigation className="text-gray-400" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Max Distance</p>
                <p className="text-3xl font-bold text-gray-800">{furthestCity.distance}<span className="text-lg ml-1">km</span></p>
              </div>
              <Route className="text-gray-400" size={24} />
            </div>
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Algorithm Results</h2>
            <p className="text-gray-600">Complete results of Dijkstra's algorithm from Passau to all destinations</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      City Name
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Distance (km)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Previous City
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCities.map((city) => (
                  <tr 
                    key={city.vertex}
                    className={`transition-all duration-200 ${
                      selectedDestination === city.vertex 
                        ? 'bg-gray-50 border-l-4 border-gray-400' 
                        : 'hover:bg-gray-25'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          city.vertex === 'Passau' ? 'bg-gray-600' : 'bg-gray-300'
                        }`}></div>
                        <div>
                          <div className={`text-sm font-semibold ${
                            city.vertex === 'Passau' ? 'text-gray-800' : 'text-gray-700'
                          }`}>
                            {city.vertex}
                          </div>
                          {city.vertex === 'Passau' && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full mt-1">
                              Starting Point
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                        city.visited 
                          ? 'bg-gray-100 text-gray-700' 
                          : 'bg-gray-50 text-gray-500 border border-gray-200'
                      }`}>
                        {city.visited ? '✓ Processed' : '○ Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-semibold text-gray-800 font-mono">
                        {city.distance}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        city.previous ? 'text-gray-700' : 'text-gray-400'
                      }`}>
                        {city.previous || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {city.vertex !== 'Passau' && (
                        <button
                          onClick={() => handleCityClick(city.vertex)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            selectedDestination === city.vertex
                              ? 'bg-gray-700 text-white hover:bg-gray-800'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                          }`}
                        >
                          {selectedDestination === city.vertex ? 'Hide Route' : 'Show Route'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Dijkstra's shortest path algorithm • European cities network • Interactive visualization
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dijkstra;