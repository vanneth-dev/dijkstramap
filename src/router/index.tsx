import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "../components/NotFound";
import Dijkstra from "../pages/Dijkstra";

function RouterApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dijkstra />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RouterApp;
