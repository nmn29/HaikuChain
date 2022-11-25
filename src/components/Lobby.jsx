import React, { useState, useEffect } from "react";
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged } from "firebase/auth";
import { Link, Navigate} from 'react-router-dom';

export default function Lobby(){

  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);

  window.addEventListener("beforeunload", (event) => {
    event.returnValue = "";
  });

  //認証の確認  
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if(currentUser){
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
        <div>
          ロビーです
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