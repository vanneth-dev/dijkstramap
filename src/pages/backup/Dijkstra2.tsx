import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

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

const Dijkstra: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<string>('Frankfurt');

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

  const selectedPath = selectedDestination ? getPathToPassau(selectedDestination) : [];
  const totalDistance = graphMap[selectedDestination]?.distance || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dijkstra's Algorithm</h1>
          <p className="text-gray-600">Find shortest paths from Passau to European cities</p>
        </div>

        {/* City Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Destination</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start City (Fixed) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start City</label>
              <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                <span className="text-sm font-medium text-blue-700">Passau (Fixed Start)</span>
              </div>
            </div>

            {/* End City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End City</label>
              <div className="space-y-1 max-h-48 overflow-y-auto border border-gray-200 rounded-md">
                {Object.values(graphMap).filter(city => city.vertex !== 'Passau').map(city => (
                  <button
                    key={city.vertex}
                    onClick={() => setSelectedDestination(city.vertex)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                      selectedDestination === city.vertex ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {city.vertex}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Route Result */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Route: Passau → {selectedDestination}</h2>
          
          <div>
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
              <span>Distance: <strong>{totalDistance} km</strong></span>
              <span>•</span>
              <span>Stops: <strong>{selectedPath.length - 1}</strong></span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {selectedPath.map((city, index) => (
                <React.Fragment key={city}>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    city === 'Passau' ? 'bg-blue-100 text-blue-800' :
                    city === selectedDestination ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {city}
                  </span>
                  {index < selectedPath.length - 1 && (
                    <ArrowRight className="text-gray-400" size={16} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">All Distances from Passau</h2>
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
                  const isInPath = selectedPath.includes(city.vertex);
                  
                  return (
                    <tr 
                      key={city.vertex}
                      className={`${isInPath ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            city.vertex === 'Passau' ? 'bg-blue-500' :
                            city.vertex === selectedDestination ? 'bg-green-500' :
                            isInPath ? 'bg-blue-300' :
                            'bg-gray-300'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-900">{city.vertex}</span>
                          {city.vertex === 'Passau' && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                              Start
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {city.distance} km
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {city.previous || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          city.visited
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {city.visited ? 'Processed' : 'Pending'}
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

export default Dijkstra;