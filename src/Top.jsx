import { useState, useEffect } from 'react';
import { db, auth } from './firebase/firebase.js';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import './Top.css';


export default function Top() {

  //ランダムIDの生成
  const [ID, setID] = useState("")
  const [IDTemp, setIDTemp] = useState(ID)

  window.onload = function randomID(){
    const randomID = "ユーザ" + Math.floor(Math.random()*(100000-10000)+10000)
    setID(randomID)
    setIDTemp(randomID)
  }

  //名前入力フォーム
  const [name, setName] = useState(ID)

  //DB追加テスト
  const handleSubmit = async (event) => {
    event.preventDefault();

    let addName = IDTemp;

    if(ID != ""){
      addName = ID
    }

    const usersCollectionRef = collection(db, 'haikuDB');
    const documentRef = await addDoc(usersCollectionRef, {
      user1: addName,
      email: 'test@gmail.com',
      oooo: 'あ？'
    });
    console.log("追加")
  };

  const navigate = useNavigate();

  const loginLobby = async (event) => {
    event.preventDefault()
    console.log("aaa")
    try{
      await signInAnonymously(auth);
    }catch(error){
      alert("セッションの更新が必要です")
    }

    navigate("/lobby");
  };

  return (
    <>
      <div className="App">
        <h1>俳句チェイン</h1>
        <input type="text" placeholder={ID} 
        onChange={(e) => setID(e.target.value)} maxlength={16}/>
        <button onClick={handleSubmit}>追加</button>
        <button onClick={(e) => loginLobby(e)}>ログイン？</button>
      </div>
    </>
  );
}


