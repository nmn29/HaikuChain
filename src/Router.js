import { BrowserRouter, Routes, Route } from "react-router-dom";
import Top from "./Top.jsx";
import Lobby from "./components/Lobby.jsx";
import Start from "./inGame/Start.jsx";
import Game1 from "./inGame/Game1.jsx";
import Game2 from "./inGame/Game2.jsx";
import Game3 from "./inGame/Game3.jsx";
import Game4 from "./inGame/Game4.jsx";
import Game5 from "./inGame/Game5.jsx";
import Game6 from "./inGame/Game6.jsx";
import Game7 from "./inGame/Game7.jsx";
import Game8 from "./inGame/Game8.jsx";
import Game9 from "./inGame/Game9.jsx";
import Game10 from "./inGame/Game10.jsx";
import Game11 from "./inGame/Game11.jsx";
import Game12 from "./inGame/Game12.jsx";
import Game13 from "./inGame/Game13.jsx";
import Game14 from "./inGame/Game14.jsx";
import Game15 from "./inGame/Game15.jsx";
import Game16 from "./inGame/Game16.jsx";
import Game17 from "./inGame/Game17.jsx";
import Recite from "./inGame/Recite.jsx";

import ReciteTest from "./inGame/ReciteTest.jsx";

export default function Router(){
  return(
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Top />}></Route>
          <Route path="/lobby" element={<Lobby />}></Route>
          <Route path="/start" element={<Start />}></Route>
          <Route path="/Game1" element={<Game1 />}></Route>
          <Route path="/Game2" element={<Game2 />}></Route>
          <Route path="/Game3" element={<Game3 />}></Route>
          <Route path="/Game4" element={<Game4 />}></Route>
          <Route path="/Game5" element={<Game5 />}></Route>
          <Route path="/Game6" element={<Game6 />}></Route>
          <Route path="/Game7" element={<Game7 />}></Route>
          <Route path="/Game8" element={<Game8 />}></Route>
          <Route path="/Game9" element={<Game9 />}></Route>
          <Route path="/Game10" element={<Game10 />}></Route>
          <Route path="/Game11" element={<Game11 />}></Route>
          <Route path="/Game12" element={<Game12 />}></Route>
          <Route path="/Game13" element={<Game13 />}></Route>
          <Route path="/Game14" element={<Game14 />}></Route>
          <Route path="/Game15" element={<Game15 />}></Route>
          <Route path="/Game16" element={<Game16 />}></Route>
          <Route path="/Game17" element={<Game17 />}></Route>                        
          <Route path="/recite" element={<Recite />}></Route>
          <Route path="/test" element={<ReciteTest />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
