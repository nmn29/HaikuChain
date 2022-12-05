import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { doc, deleteDoc, collection, onSnapshot, query, orderBy, setDoc, getCountFromServer, updateDoc, where } from 'firebase/firestore';

export default function Game1(){

  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        //ユーザが存在する場合
        setUser(currentUser);
        setLoading(false);
      } else {
        //ユーザが存在しない場合
        setLoading(false);
      }
    });
  }, []);
  
  return(
    <>
    {!loading
      ?
      (
        <>
          {!user
            ?
            (
              <Navigate to={"/"} />
            )
            :
            // ここにコードを記述
            (
              <div className="haiku">
              </div>
            )
          }
          </>
        )
        :
        <>
        </>
      }
    </>
  );
}