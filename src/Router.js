import { BrowserRouter, Routes, Route } from "react-router-dom";
import Top from "./Top.jsx";
import Lobby from "./components/Lobby.jsx";
import Start from "./inGame/Start.jsx";

export default function Router(){
  return(
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Top />}></Route>
          <Route path="/lobby" element={<Lobby />}></Route>
          <Route path="/start" element={<Start />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
