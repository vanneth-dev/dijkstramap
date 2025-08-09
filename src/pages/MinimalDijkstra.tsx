import React, { useState, useMemo } from 'react';
import { Search, ArrowRight } from 'lucide-react';

const cityConnections: Record<string, Record<string, number>> = {
  Passau: { Linz: 102, Munchen: 189, Nurnberg: 220 },
  Linz: { Passau: 102, Salzburg: 126 },
  Munchen: { Passau: 189, Rosenheim: 59, Nurnberg: 170, Ulm: 123, Memmingen: 115 },
  Nurnberg: { Passau: 220, Bayreuth: 75, Wurzburg: 104, Memmingen: 230, Ulm: 171, Munchen: 170 },
  Salzburg: { Linz: 126, Rosenheim: 81 },
  Rosenheim: { Salzburg: 81, Munchen: 59, Innsbruck: 93 },
  Ulm: { Munchen: 123, Nurnberg: 171, Wurzburg: 183, Stuttgart: 107, Memmingen: 55 },
  Memmingen: { Ulm: 55, Munchen: 115, Zurich: 184 },
  Stuttgart: { Ulm: 107, Wurzburg: 140, Karlsruhe: 64 },
  Karlsruhe: { Stuttgart: 64, Mannheim: 67, Basel: 191 },
  Mannheim: { Karlsruhe: 67, Nurnberg: 230, Frankfurt: 85 },
  Wurzburg: { Frankfurt: 111, Stuttgart: 140, Ulm: 183, Nurnberg: 104 },
  Frankfurt: { Wurzburg: 111, Mannheim: 85 },
  Bayreuth: { Nurnberg: 75 },
  Innsbruck: { Rosenheim: 93, Landeck: 73 },
  Landeck: { Innsbruck: 73 },
  Zurich: { Memmingen: 184, Basel: 85, Bern: 120 },
  Basel: { Zurich: 85, Bern: 91, Karlsruhe: 191 },
  Bern: { Basel: 91, Zurich: 120 }
};

interface DijkstraResult {
  distances: Record<string, number>;
  previous: Record<string, string | null>;
  visited: Set<string>;
}

const dijkstra = (graph: Record<string, Record<string, number>>, start: string): DijkstraResult => {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();
  const unvisited = new Set<string>();

  Object.keys(graph).forEach(city => {
    distances[city] = city === start ? 0 : Infinity;
    previous[city] = null;
    unvisited.add(city);
  });

  while (unvisited.size > 0) {
    let current: string | null = null;
    let minDistance = Infinity;
    
    unvisited.forEach(city => {
      if (distances[city] < minDistance) {
        minDistance = distances[city];
        current = city;
      }
    });

    if (current === null || minDistance === Infinity) break;

    unvisited.delete(current);
    visited.add(current);

    const neighbors = graph[current] || {};
    Object.entries(neighbors).forEach(([neighbor, distance]) => {
      if (!unvisited.has(neighbor)) return;
      
      const newDistance = distances[current as string] + distance;
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = current;
      }
    });
  }

  return { distances, previous, visited };
};

const getPath = (previous: Record<string, string | null>, start: string, end: string): string[] => {
  const path: string[] = [];
  let current: string | null = end;

  while (current !== null) {
    path.unshift(current);
    if (current === start) break;
    current = previous[current];
  }

  return path[0] === start ? path : [];
};

const MinimalDijkstra: React.FC = () => {
  const [startCity, setStartCity] = useState<string>('Passau');
  const [endCity, setEndCity] = useState<string>('Frankfurt');
  const [searchTerm, setSearchTerm] = useState('');

  const cities = Object.keys(cityConnections).sort();
  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dijkstraResult = useMemo(() => {
    return dijkstra(cityConnections, startCity);
  }, [startCity]);

  const shortestPath = useMemo(() => {
    return getPath(dijkstraResult.previous, startCity, endCity);
  }, [dijkstraResult.previous, startCity, endCity]);

  const totalDistance = dijkstraResult.distances[endCity];
  const isPathFound = shortestPath.length > 0 && shortestPath[0] === startCity;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dijkstra's Algorithm</h1>
          <p className="text-gray-600">Find shortest paths between European cities</p>
        </div>

        {/* City Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Cities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start City</label>
              <div className="space-y-1 max-h-48 overflow-y-auto border border-gray-200 rounded-md">
                {cities.map(city => (
                  <button
                    key={city}
                    onClick={() => setStartCity(city)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                      startCity === city ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* End City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End City</label>
              <div className="space-y-1 max-h-48 overflow-y-auto border border-gray-200 rounded-md">
                {cities.map(city => (
                  <button
                    key={city}
                    onClick={() => setEndCity(city)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                      endCity === city ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Route Result */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Route: {startCity} → {endCity}</h2>
          
          {isPathFound ? (
            <div>
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                <span>Distance: <strong>{totalDistance} km</strong></span>
                <span>•</span>
                <span>Stops: <strong>{shortestPath.length - 1}</strong></span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                {shortestPath.map((city, index) => (
                  <React.Fragment key={city}>
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      city === startCity ? 'bg-blue-100 text-blue-800' :
                      city === endCity ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {city}
                    </span>
                    {index < shortestPath.length - 1 && (
                      <ArrowRight className="text-gray-400" size={16} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No path available between {startCity} and {endCity}</p>
          )}
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">All Distances from {startCity}</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Filter cities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Previous</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCities.map((city) => {
                  const distance = dijkstraResult.distances[city];
                  const isReachable = distance !== Infinity;
                  const isInPath = shortestPath.includes(city);
                  
                  return (
                    <tr 
                      key={city}
                      className={`${isInPath ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            city === startCity ? 'bg-blue-500' :
                            city === endCity ? 'bg-green-500' :
                            isInPath ? 'bg-blue-300' :
                            'bg-gray-300'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-900">{city}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {isReachable ? `${distance} km` : '∞'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dijkstraResult.previous[city] || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          dijkstraResult.visited.has(city)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {dijkstraResult.visited.has(city) ? 'Processed' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimalDijkstra;