import { BrowserRouter, Routes, Route } from "react-router-dom";
import Top from "./Top.jsx";
import Lobby from "./components/Lobby.jsx";
import Start from "./inGame/Start.jsx";
import Game1 from "./inGame/Game1.jsx";

export default function Router(){
  return(
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Top />}></Route>
          <Route path="/lobby" element={<Lobby />}></Route>
          <Route path="/start" element={<Start />}></Route>
          <Route path="/Game1" element={<Game1 />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
