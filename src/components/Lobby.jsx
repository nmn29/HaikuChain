import React, { useState, useEffect } from "react";
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { doc, deleteDoc, collection, onSnapshot, query, orderBy, setDoc, Timestamp} from 'firebase/firestore';

export default function Lobby() {

  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState([{ id: null }]);
  const [hostID, setHostID] = useState([])


  //認証の確認  
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

  //routerから招待IDを取得
  const invitationID = useLocation().state.id;

  useEffect(() => {   
    //データベースを追加順で取得
    const usersQueryRef = query(collection(db, invitationID), orderBy('timestamp', 'asc'))
    onSnapshot(usersQueryRef, (querySnapshot) => {
      for (let change of querySnapshot.docChanges()) {
        if (change.type === 'added') {
          // データが追加された時
          console.log("set")
          setUserList(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        }
        if (change.type === 'removed') {
          // データが削除された時
          setUserList(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))      
        }
      }
    });
  }, []);

  //ユーザリストを監視し、ホスト以外のゲーム開始・ホストのIDを格納する・部屋が無くなった場合の処理
  useEffect(() => {
    try {
      if (userList[userList.length - 1].id === "Game"){
        const totalCount = userList.length - 1
        const userIndex = (userList.findIndex((users) => users.id === user.uid) + 1)
        //招待ID、自分の番号、人数をゲームに送信
        navigate("/start", {state: {id: invitationID, index: userIndex, count: totalCount, host: userList[0].id}});
      }

      if (userList[0].id !== null) {
        setHostID(userList[0].id)
      }
    } catch (error) {
      alert("部屋が解散されました")
    }
  }, [userList])

  //退出し、ドキュメントと認証情報を削除
  const navigate = useNavigate();
  const logout = async () => {
    const userDeleteDocumentRef = doc(db, invitationID, user.uid);
    await deleteDoc(userDeleteDocumentRef);
    await signOut(auth);
    await navigate("/");
  }

  //ゲームスタート
  const startGame = async () => {

    const totalCount = userList.length
  
    await setDoc(doc(db, invitationID, 'Dai'), {  
    });

    await setDoc(doc(db, invitationID, 'Haiku'), {
    });

    await setDoc(doc(db, invitationID, 'Done'), {
      done:0
    });

    await setDoc(doc(db, invitationID, 'Game'), {
      turn: 1,
      people: totalCount,
      timestamp: Timestamp.fromDate(new Date())
    });
  }

  return (
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
                  ロビー
                  ルームID：{invitationID}
                  {userList.map((user) => (
                    <div key={user.id}>{user.name}</div>
                  ))}
                  <button onClick={logout}>退室</button>
                  {hostID === user.uid
                    ?
                    (
                      <>
                        <div>YOUR IS HOST</div>
                        <button onClick={startGame}>ゲームを開始</button>
                      </>
                    )
                    :
                    (
                      <>
                        <div>YOUR IS NOT HOST</div>
                      </>
                    )
                  }
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