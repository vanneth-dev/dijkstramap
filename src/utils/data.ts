const baseCityConnections: Record<
  string,
  Record<
    string,
    { distance: number; trafficDelay: number; trafficProb: number }
  >
> = {
  Passau: {
    Linz: { distance: 102, trafficDelay: 0, trafficProb: 0.1 },
    Munchen: { distance: 189, trafficDelay: 0, trafficProb: 0.1 },
    Nurnberg: { distance: 220, trafficDelay: 0, trafficProb: 0.05 },
  },
  Linz: {
    Passau: { distance: 102, trafficDelay: 0, trafficProb: 0.1 },
    Salzburg: { distance: 126, trafficDelay: 0, trafficProb: 0.1 },
  },
  Munchen: {
    Passau: { distance: 189, trafficDelay: 0, trafficProb: 0.1 },
    Rosenheim: { distance: 59, trafficDelay: 0, trafficProb: 0.15 },
    Nurnberg: { distance: 170, trafficDelay: 0, trafficProb: 0.1 },
    Ulm: { distance: 123, trafficDelay: 0, trafficProb: 0.1 },
    Memmingen: { distance: 115, trafficDelay: 0, trafficProb: 0.1 },
  },
  Nurnberg: {
    Passau: { distance: 220, trafficDelay: 0, trafficProb: 0.05 },
    Bayreuth: { distance: 75, trafficDelay: 0, trafficProb: 0.1 },
    Wurzburg: { distance: 104, trafficDelay: 0, trafficProb: 0.1 },
    Memmingen: { distance: 230, trafficDelay: 0, trafficProb: 0.15 },
    Ulm: { distance: 171, trafficDelay: 0, trafficProb: 0.1 },
    Munchen: { distance: 170, trafficDelay: 0, trafficProb: 0.1 },
  },
  Salzburg: {
    Linz: { distance: 126, trafficDelay: 0, trafficProb: 0.1 },
    Rosenheim: { distance: 81, trafficDelay: 0, trafficProb: 0.15 },
  },
  Rosenheim: {
    Salzburg: { distance: 81, trafficDelay: 0, trafficProb: 0.15 },
    Munchen: { distance: 59, trafficDelay: 0, trafficProb: 0.15 },
    Innsbruck: { distance: 93, trafficDelay: 0, trafficProb: 0.15 },
  },
  Ulm: {
    Munchen: { distance: 123, trafficDelay: 0, trafficProb: 0.1 },
    Nurnberg: { distance: 171, trafficDelay: 0, trafficProb: 0.1 },
    Wurzburg: { distance: 183, trafficDelay: 0, trafficProb: 0.1 },
    Stuttgart: { distance: 107, trafficDelay: 0, trafficProb: 0.1 },
    Memmingen: { distance: 55, trafficDelay: 0, trafficProb: 0.1 },
  },
  Memmingen: {
    Ulm: { distance: 55, trafficDelay: 0, trafficProb: 0.1 },
    Munchen: { distance: 115, trafficDelay: 0, trafficProb: 0.1 },
    Zurich: { distance: 184, trafficDelay: 0, trafficProb: 0.1 },
  },
  Stuttgart: {
    Ulm: { distance: 107, trafficDelay: 0, trafficProb: 0.1 },
    Wurzburg: { distance: 140, trafficDelay: 0, trafficProb: 0.1 },
    Karlsruhe: { distance: 64, trafficDelay: 0, trafficProb: 0.1 },
  },
  Karlsruhe: {
    Stuttgart: { distance: 64, trafficDelay: 0, trafficProb: 0.1 },
    Mannheim: { distance: 67, trafficDelay: 0, trafficProb: 0.1 },
    Basel: { distance: 191, trafficDelay: 0, trafficProb: 0.1 },
  },
  Mannheim: {
    Karlsruhe: { distance: 67, trafficDelay: 0, trafficProb: 0.1 },
    Nurnberg: { distance: 230, trafficDelay: 0, trafficProb: 0.15 },
    Frankfurt: { distance: 85, trafficDelay: 0, trafficProb: 0.1 },
  },
  Wurzburg: {
    Frankfurt: { distance: 111, trafficDelay: 0, trafficProb: 0.1 },
    Stuttgart: { distance: 140, trafficDelay: 0, trafficProb: 0.1 },
    Ulm: { distance: 183, trafficDelay: 0, trafficProb: 0.1 },
    Nurnberg: { distance: 104, trafficDelay: 0, trafficProb: 0.1 },
  },
  Frankfurt: {
    Wurzburg: { distance: 111, trafficDelay: 0, trafficProb: 0.1 },
    Mannheim: { distance: 85, trafficDelay: 0, trafficProb: 0.1 },
  },
  Bayreuth: { Nurnberg: { distance: 75, trafficDelay: 0, trafficProb: 0.1 } },
  Innsbruck: {
    Rosenheim: { distance: 93, trafficDelay: 0, trafficProb: 0.15 },
    Landeck: { distance: 73, trafficDelay: 0, trafficProb: 0.15 },
  },
  Landeck: { Innsbruck: { distance: 73, trafficDelay: 0, trafficProb: 0.15 } },
  Zurich: {
    Memmingen: { distance: 184, trafficDelay: 0, trafficProb: 0.1 },
    Basel: { distance: 85, trafficDelay: 0, trafficProb: 0.1 },
    Bern: { distance: 120, trafficDelay: 0, trafficProb: 0.1 },
  },
  Basel: {
    Zurich: { distance: 85, trafficDelay: 0, trafficProb: 0.1 },
    Bern: { distance: 91, trafficDelay: 0, trafficProb: 0.1 },
    Karlsruhe: { distance: 191, trafficDelay: 0, trafficProb: 0.1 },
  },
  Bern: {
    Basel: { distance: 91, trafficDelay: 0, trafficProb: 0.1 },
    Zurich: { distance: 120, trafficDelay: 0, trafficProb: 0.1 },
  },
};

export const getBaseCityConnections = () => {
  return baseCityConnections;
};
