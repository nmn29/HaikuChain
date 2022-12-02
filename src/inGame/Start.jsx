import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { doc, deleteDoc, collection, onSnapshot, query, orderBy, setDoc, getCountFromServer } from 'firebase/firestore';


export default function Start() {

  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [dai, setDai] = useState("")

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        //ユーザが存在する場合
        setUser(currentUser);
        setLoading(false);
      } else {
        //ユーザが存在しない場合
        setLoading(false);
        console.log("deleted");
      }
    });
  }, []);

  return (
    <div className="odai">
      <input type="text" onChange={(e) => setDai(e.target.value)} maxLength={16} />
      <button>決定</button>
    </div>
  )
}