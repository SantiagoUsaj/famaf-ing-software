import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import WaitingRoom from "./pages/WaitingRoom";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import CreateGame from "./pages/CreateGame";

function App() {
  return (
    <div className="bg-black h-screen w-screen">
      {/* Defino mis rutas */}
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/lobby/:string" element={<LobbyPage />} />
          <Route path="/:string/waitingRoom" element={<WaitingRoom />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/creategame" element={<CreateGame />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
