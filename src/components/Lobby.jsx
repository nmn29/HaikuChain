import React, { useState, useEffect } from "react";
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged } from "firebase/auth";
import { Link, Navigate} from 'react-router-dom';

export default function Lobby(){

  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);

  //認証の確認  
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
  }, []);

  console.log(user.uid)
  console.log(loading)

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
        (
        <div>
          あああ
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