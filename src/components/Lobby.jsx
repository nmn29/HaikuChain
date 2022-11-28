import React, { useState, useEffect } from "react";
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged } from "firebase/auth";
import { useLocation, Link, Navigate } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

export default function Lobby(){

  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState([]);

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
  
  const invitationID = useLocation().state.id;  

  useEffect(() => {
    //データベースを追加順で取得
    const usersQueryRef = query(collection(db, invitationID), orderBy('timestamp', 'asc'))
    onSnapshot(usersQueryRef, (querySnapshot) => {
      for (let change of querySnapshot.docChanges()) {
        console.log('load')
        if (change.type === 'added') {
            // データが追加された時
            console.log('aaa')
            setUserList(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        }
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
          {userList.map((user) => (
            <div key={user.id}>{user.id}、{user.name}</div>
          ))}
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