import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import WaitingRoom from "./pages/WaitingRoom";

function App() {
  return (
    <div className="bg-indigo-600 h-screen w-screen">
      {/* Defino mis rutas */}
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/waitingRoom" element={<WaitingRoom />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
