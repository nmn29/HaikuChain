import { useState, useEffect } from 'react';
import { db, auth } from './firebase/firebase.js';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';

import './Top.css';
import { signInAnonymously } from 'firebase/auth';

export default function Top() {

  //ランダムIDの生成
  const [ID, setID] = useState("")
  
  window.onload = function randomID(){
    setID("ユーザ" + Math.floor(Math.random()*(100000-10000)+10000))
  }

  //名前入力フォーム
  const [name, setName] = useState(ID)

  //DB追加テスト
  const handleSubmit = async (event) => {
    event.preventDefault();
    const usersCollectionRef = collection(db, 'haikuDB');
    const documentRef = await addDoc(usersCollectionRef, {
      user1: 'aaaa',
      email: 'test@gmail.com',
      oooo: 'あ？'
    });
    console.log("追加")
  };

  const [user, setUser] = useState("");

  //匿名ログイン
  const loginLobby = () =>{
    signInAnonymously(auth);
  }

  return (
    <>
      <div className="App">
        <h1>俳句チェイン</h1>
        <input type="text" placeholder={ID} onChange={(e) => setName(e.target.value)} maxlength={16}/>
        <button onClick={handleSubmit}>追加</button>
        <Link to="/lobby"><button onClick={loginLobby}>ログイン？</button></Link>
      </div>
    </>
  );
}


