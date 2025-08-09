import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from '../components/NotFound';
import Dijkstra from '../pages/Dijkstra';
import MinimalDijkstra from '../pages/MinimalDijkstra';

function RouterApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dijkstra />} />
        <Route path="/d" element={<MinimalDijkstra />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RouterApp;
