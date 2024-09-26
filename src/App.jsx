import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import WaitingRoom from "./pages/WaitingRoom";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import CreateGame from "./pages/CreateGame";

function App() {
  const { playerID } = useParams();
  const { gameID } = useParams();

  return (
    <div className="bg-black h-screen w-screen">
      {/* Defino mis rutas */}
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/lobby/:playerID"
            element={<LobbyPage playerID={playerID} />}
          />
          <Route
            path="/:playerID/:gameID/waitingRoom"
            element={<WaitingRoom game_id={gameID} playerID={playerID} />}
          />
          <Route path="/:playerID/:gameID/game" element={<GamePage />} />
          <Route path="/:playerID/creategame" element={<CreateGame />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
