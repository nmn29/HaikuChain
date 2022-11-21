import { useState } from 'react';

import './Top.css';

export default function Top() {

  //ランダムIDの生成
  const [ID, setID] = useState("")
  
  window.onload = function randomID(){
    setID("ユーザ" + Math.floor(Math.random()*(100000-10000)+10000))
  }

  //名前入力フォーム
  const [name, setName] = useState(ID)

  return (
    <div className="App">
      <h1>俳句チェイン</h1>
      <input type="text" placeholder={ID} onChange={(e) => setName(e.target.value)} maxlength={16}/>
    </div>
  
  );
}


