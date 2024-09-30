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

function LobbyWithParams() {
  const { playerID } = useParams();
  return <LobbyPage playerID={playerID} />;
}

function WaitingRoomWithParams() {
  const { playerID, gameID } = useParams();
  return <WaitingRoom game_id={gameID} playerID={playerID} />;
}

function CreateGameWithParams() {
  const { playerID } = useParams();
  return <CreateGame playerID={playerID} />;
}

function GameWithParams() {
  const { playerID, gameID } = useParams();
  return <GamePage playerID={playerID} game_id={gameID} />;
}

function App() {
  return (
    <div className="bg-black h-screen w-screen">
      {/* Defino mis rutas */}
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/lobby/:playerID" element={<LobbyWithParams />} />
          <Route
            path="/:playerID/:gameID/waitingRoom"
            element={<WaitingRoomWithParams />}
          />
          <Route path="/:playerID/:gameID/game" element={<GameWithParams />} />
          <Route
            path="/:playerID/creategame"
            element={<CreateGameWithParams />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
