import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import WaitingRoom from "./pages/WaitingRoom";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";

function App() {
  return (
    <div className="bg-indigo-600 h-screen w-screen">
      {/* Defino mis rutas */}
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/lobby" element={<LobbyPage />} />
          <Route path="/waitingRoom" element={<WaitingRoom />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
