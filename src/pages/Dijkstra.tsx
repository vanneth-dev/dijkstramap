import React, { useState, useMemo } from 'react';
import { Search, ArrowRight, RefreshCcw } from 'lucide-react';

const SPEED_KMH = 80;

const baseCityConnections: Record<
  string,
  Record<string, { distance: number; trafficDelay: number; trafficProb: number }>
> = {
  Passau: { Linz: { distance: 102, trafficDelay: 0, trafficProb: 0.1 }, Munchen: { distance: 189, trafficDelay: 0, trafficProb: 0.1 }, Nurnberg: { distance: 220, trafficDelay: 0, trafficProb: 0.05 } },
  Linz: { Passau: { distance: 102, trafficDelay: 0, trafficProb: 0.1 }, Salzburg: { distance: 126, trafficDelay: 0, trafficProb: 0.1 } },
  Munchen: { Passau: { distance: 189, trafficDelay: 0, trafficProb: 0.1 }, Rosenheim: { distance: 59, trafficDelay: 0, trafficProb: 0.15 }, Nurnberg: { distance: 170, trafficDelay: 0, trafficProb: 0.1 }, Ulm: { distance: 123, trafficDelay: 0, trafficProb: 0.1 }, Memmingen: { distance: 115, trafficDelay: 0, trafficProb: 0.1 } },
  Nurnberg: { Passau: { distance: 220, trafficDelay: 0, trafficProb: 0.05 }, Bayreuth: { distance: 75, trafficDelay: 0, trafficProb: 0.1 }, Wurzburg: { distance: 104, trafficDelay: 0, trafficProb: 0.1 }, Memmingen: { distance: 230, trafficDelay: 0, trafficProb: 0.15 }, Ulm: { distance: 171, trafficDelay: 0, trafficProb: 0.1 }, Munchen: { distance: 170, trafficDelay: 0, trafficProb: 0.1 } },
  Salzburg: { Linz: { distance: 126, trafficDelay: 0, trafficProb: 0.1 }, Rosenheim: { distance: 81, trafficDelay: 0, trafficProb: 0.15 } },
  Rosenheim: { Salzburg: { distance: 81, trafficDelay: 0, trafficProb: 0.15 }, Munchen: { distance: 59, trafficDelay: 0, trafficProb: 0.15 }, Innsbruck: { distance: 93, trafficDelay: 0, trafficProb: 0.15 } },
  Ulm: { Munchen: { distance: 123, trafficDelay: 0, trafficProb: 0.1 }, Nurnberg: { distance: 171, trafficDelay: 0, trafficProb: 0.1 }, Wurzburg: { distance: 183, trafficDelay: 0, trafficProb: 0.1 }, Stuttgart: { distance: 107, trafficDelay: 0, trafficProb: 0.1 }, Memmingen: { distance: 55, trafficDelay: 0, trafficProb: 0.1 } },
  Memmingen: { Ulm: { distance: 55, trafficDelay: 0, trafficProb: 0.1 }, Munchen: { distance: 115, trafficDelay: 0, trafficProb: 0.1 }, Zurich: { distance: 184, trafficDelay: 0, trafficProb: 0.1 } },
  Stuttgart: { Ulm: { distance: 107, trafficDelay: 0, trafficProb: 0.1 }, Wurzburg: { distance: 140, trafficDelay: 0, trafficProb: 0.1 }, Karlsruhe: { distance: 64, trafficDelay: 0, trafficProb: 0.1 } },
  Karlsruhe: { Stuttgart: { distance: 64, trafficDelay: 0, trafficProb: 0.1 }, Mannheim: { distance: 67, trafficDelay: 0, trafficProb: 0.1 }, Basel: { distance: 191, trafficDelay: 0, trafficProb: 0.1 } },
  Mannheim: { Karlsruhe: { distance: 67, trafficDelay: 0, trafficProb: 0.1 }, Nurnberg: { distance: 230, trafficDelay: 0, trafficProb: 0.15 }, Frankfurt: { distance: 85, trafficDelay: 0, trafficProb: 0.1 } },
  Wurzburg: { Frankfurt: { distance: 111, trafficDelay: 0, trafficProb: 0.1 }, Stuttgart: { distance: 140, trafficDelay: 0, trafficProb: 0.1 }, Ulm: { distance: 183, trafficDelay: 0, trafficProb: 0.1 }, Nurnberg: { distance: 104, trafficDelay: 0, trafficProb: 0.1 } },
  Frankfurt: { Wurzburg: { distance: 111, trafficDelay: 0, trafficProb: 0.1 }, Mannheim: { distance: 85, trafficDelay: 0, trafficProb: 0.1 } },
  Bayreuth: { Nurnberg: { distance: 75, trafficDelay: 0, trafficProb: 0.1 } },
  Innsbruck: { Rosenheim: { distance: 93, trafficDelay: 0, trafficProb: 0.15 }, Landeck: { distance: 73, trafficDelay: 0, trafficProb: 0.15 } },
  Landeck: { Innsbruck: { distance: 73, trafficDelay: 0, trafficProb: 0.15 } },
  Zurich: { Memmingen: { distance: 184, trafficDelay: 0, trafficProb: 0.1 }, Basel: { distance: 85, trafficDelay: 0, trafficProb: 0.1 }, Bern: { distance: 120, trafficDelay: 0, trafficProb: 0.1 } },
  Basel: { Zurich: { distance: 85, trafficDelay: 0, trafficProb: 0.1 }, Bern: { distance: 91, trafficDelay: 0, trafficProb: 0.1 }, Karlsruhe: { distance: 191, trafficDelay: 0, trafficProb: 0.1 } },
  Bern: { Basel: { distance: 91, trafficDelay: 0, trafficProb: 0.1 }, Zurich: { distance: 120, trafficDelay: 0, trafficProb: 0.1 } }
};

const bayesianUpdate = (prior: number, evidence: boolean, pEvidenceGivenTraffic = 0.8, pEvidenceGivenNoTraffic = 0.2): number => {
  const pTraffic = prior;
  const pNoTraffic = 1 - prior;
  const pEvidence = evidence ? (pEvidenceGivenTraffic * pTraffic + pEvidenceGivenNoTraffic * pNoTraffic) : ( (1-pEvidenceGivenTraffic)*pTraffic + (1-pEvidenceGivenNoTraffic)*pNoTraffic );
  const posterior = evidence ? (pEvidenceGivenTraffic * pTraffic) / pEvidence : ((1-pEvidenceGivenTraffic) * pTraffic) / pEvidence;
  return Math.min(Math.max(posterior, 0), 1);
};

const neuralNetworkPredictDelayMultiplier = (historicalDelays: number[], currentDelay: number): number => {
  const avgHistorical = historicalDelays.reduce((a, b) => a + b, 0) / historicalDelays.length || 0;
  const predicted = 0.7 * avgHistorical + 0.3 * currentDelay;
  return Math.max(1, 1 + predicted);
};

type TrafficGraph = Record<
  string,
  Record<string, { distance: number; trafficDelay: number; trafficProb: number; historicalDelays: number[] }>
>;

const initializeTrafficGraph = (): TrafficGraph => {
  const graph: TrafficGraph = {};
  for (const city in baseCityConnections) {
    graph[city] = {};
    for (const neighbor in baseCityConnections[city]) {
      const { distance, trafficDelay, trafficProb } = baseCityConnections[city][neighbor];
      graph[city][neighbor] = {
        distance,
        trafficDelay,
        trafficProb,
        historicalDelays: [0.1, 0.2, 0.15, 0.05]
      };
    }
  }
  return graph;
};

const getEffectiveWeight = (edge: { distance: number; trafficDelay: number; trafficProb: number; historicalDelays: number[] }) => {
  const delayMultiplier = neuralNetworkPredictDelayMultiplier(edge.historicalDelays, edge.trafficDelay);
  const delayInKm = (delayMultiplier - 1) * 60;
  return edge.distance + delayInKm;
};

interface DijkstraResult {
  distances: Record<string, number>;
  previous: Record<string, string | null>;
  visited: Set<string>;
}

const dijkstra = (graph: TrafficGraph, start: string): DijkstraResult => {
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
    Object.entries(neighbors).forEach(([neighbor, edge]) => {
      if (!unvisited.has(neighbor)) return;

      const newDistance = distances[current as string] + getEffectiveWeight(edge);
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

const getPathStats = (
  path: string[],
  graph: TrafficGraph
): { totalDistance: number; totalTime: number } => {
  let totalDistance = 0;
  let totalTime = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];
    const edge = graph[from]?.[to];
    if (edge) {
      const effectiveDistance = getEffectiveWeight(edge);
      totalDistance += effectiveDistance;
    }
  }
  totalTime = totalDistance / SPEED_KMH;
  return { totalDistance, totalTime };
};

const formatTime = (hours: number) => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m} min`;
  return `${h} hr${h > 1 ? 's' : ''} ${m} min`;
};

const Dijkstra: React.FC = () => {
  const [startCity, setStartCity] = useState<string>('Passau');
  const [endCity, setEndCity] = useState<string>('Frankfurt');
  const [searchTerm, setSearchTerm] = useState('');
  const [trafficGraph, setTrafficGraph] = useState<TrafficGraph>(() => initializeTrafficGraph());

  const updateTrafficData = () => {
    setTrafficGraph((prevGraph) => {
      const newGraph: TrafficGraph = JSON.parse(JSON.stringify(prevGraph));

      Object.keys(newGraph).forEach(city => {
        Object.keys(newGraph[city]).forEach(neighbor => {
          const edge = newGraph[city][neighbor];
          const evidence = Math.random() < 0.3;
          edge.trafficProb = bayesianUpdate(edge.trafficProb, evidence);
          edge.trafficDelay = Math.round(edge.trafficProb * 30);
          edge.historicalDelays.push(edge.trafficDelay / 60);
          if (edge.historicalDelays.length > 5) edge.historicalDelays.shift();
        });
      });
      return newGraph;
    });
  };

  const cities = Object.keys(baseCityConnections).sort();
  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dijkstraResult = useMemo(() => {
    return dijkstra(trafficGraph, startCity);
  }, [trafficGraph, startCity]);

  const shortestPath = useMemo(() => {
    return getPath(dijkstraResult.previous, startCity, endCity);
  }, [dijkstraResult.previous, startCity, endCity]);

  const isPathFound = shortestPath.length > 0 && shortestPath[0] === startCity;

  const { totalDistance, totalTime } = useMemo(() => {
    if (!isPathFound) return { totalDistance: 0, totalTime: 0 };
    return getPathStats(shortestPath, trafficGraph);
  }, [shortestPath, trafficGraph, isPathFound]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Route Planning & Traffic Prediction</h1>
          <p className="text-gray-600">
            Using Dijkstra’s Algorithm with dynamic traffic delays and probabilistic traffic updates.
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Cities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={updateTrafficData}
            className="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <RefreshCcw size={18} />
            Update Traffic Data
          </button>
          <span className="text-sm text-gray-600">
            Simulates new traffic reports & updates route times.
          </span>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shortest Route</h2>
          {!isPathFound ? (
            <p className="text-red-600 font-medium">No route found from {startCity} to {endCity}.</p>
          ) : (
            <div className="flex items-center flex-wrap gap-2">
              {shortestPath.map((city, index) => (
                <React.Fragment key={city}>
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      city === startCity ? 'bg-blue-100 text-blue-700' :
                      city === endCity ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {city}
                  </span>
                  {index < shortestPath.length - 1 && (
                    <ArrowRight className="inline-block text-gray-400" size={18} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
          {isPathFound && (
            <div className="mt-3 text-gray-700 font-medium space-y-1">
              <div>
                Total Estimated Distance (with traffic): {totalDistance.toFixed(2)} km
              </div>
                <div>
                Total Estimated Time (with traffic, at a speed of {SPEED_KMH} km/h): {formatTime(totalTime)}
                </div>
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Cities from {startCity}</h2>
          <div className="mb-4">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search City
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Search cities"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <table className="w-full border-collapse border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 p-2 text-left">City</th>
                <th className="border border-gray-300 p-2 text-right">Distance (km)</th>
                <th className="border border-gray-300 p-2 text-left">Previous</th>
                <th className="border border-gray-300 p-2 text-right">Status</th>
                <th className="border border-gray-300 p-2 text-right">Traffic Delay (min)</th>
                <th className="border border-gray-300 p-2 text-right">Traffic Probability</th>
                <th className="border border-gray-300 p-2 text-right">Estimated Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredCities.map(city => {
                const dist = dijkstraResult.distances[city];
                const prev = dijkstraResult.previous[city];
                const visited = dijkstraResult.visited.has(city);
                let estTime = '-';
                if (dist !== Infinity) {
                  estTime = formatTime(dist / SPEED_KMH);
                }
                return (
                  <tr key={city} className={visited ? '' : 'opacity-60'}>
                    <td className="border border-gray-300 p-2">{city}</td>
                    <td className="border border-gray-300 p-2 text-right">{dist === Infinity ? '-' : dist.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2">{prev ?? '-'}</td>
                    <td className="border border-gray-300 p-2 text-right">{visited ? 'Visited' : 'Unvisited'}</td>
                    <td className="border border-gray-300 p-2 text-right">
                      {(() => {
                        if (city === startCity) return '0';
                        const edge = trafficGraph[startCity]?.[city];
                        return edge ? edge.trafficDelay : '0';
                      })()}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      {(() => {
                        if (city === startCity) return '0%';
                        const edge = trafficGraph[startCity]?.[city];
                        return edge ? (edge.trafficProb * 100).toFixed(0) + '%' : '0%';
                      })()}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">{estTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dijkstra;
