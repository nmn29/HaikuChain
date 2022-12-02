import React, { useState, useEffect } from "react";
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { doc, deleteDoc, collection, onSnapshot, query, orderBy, setDoc, getCountFromServer } from 'firebase/firestore';

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
        console.log("deleted");
      }
    });
  }, []);

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

  //ホストのIDを格納する・部屋が無くなった場合の処理
  useEffect(() => {
    try {
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
    navigate("/");
  }

  console.log(userList)
  //ゲームスタート
  const startGame = async () => {

    //部屋の人数を取得
    const collectionRef = collection(db, invitationID);
    const totalCountTemp = await getCountFromServer(query(collectionRef));
    const totalCount = totalCountTemp.data().count
    console.log(totalCount);

    //人数が一人の場合
    if (totalCount === 1) {
      await setDoc(doc(db, invitationID, 'Dai'), {
        dai1: "",
      });

      await setDoc(doc(db, invitationID, 'Haiku'), {
        haiku1: "",
      });
    }

    //人数が二人の場合
    else if (totalCount === 2) {
      await setDoc(doc(db, invitationID, 'Dai'), {
        dai1: "",
        dai2: "",
      });

      await setDoc(doc(db, invitationID, 'Haiku'), {
        haiku1: "",
        haiku2: "",
      });
    }

    //人数が三人の場合
    else if (totalCount === 3) {
      await setDoc(doc(db, invitationID, 'Dai'), {
        dai1: "",
        dai2: "",
        dai3: "",
      });

      await setDoc(doc(db, invitationID, 'Haiku'), {
        haiku1: "",
        haiku2: "",
        haiku3: "",
      });
    }

    //人数が四人の場合
    else if (totalCount === 4) {
      await setDoc(doc(db, invitationID, 'Dai'), {
        dai1: "",
        dai2: "",
        dai3: "",
        dai4: "",
      });

      await setDoc(doc(db, invitationID, 'Haiku'), {
        haiku1: "",
        haiku2: "",
        haiku3: "",
        haiku4: "",
      });
    }

    //人数が五人の場合
    else if (totalCount === 5) {
      await setDoc(doc(db, invitationID, 'Dai'), {
        dai1: "",
        dai2: "",
        dai3: "",
        dai4: "",
        dai5: "",
      });

      await setDoc(doc(db, invitationID, 'Haiku'), {
        haiku1: "",
        haiku2: "",
        haiku3: "",
        haiku4: "",
        haiku5: "",
      });
    }

    await setDoc(doc(db, invitationID, 'Game'), {
      turn: 1,
      people: totalCount
    });

    await console.log(userList)
    
    await navigate("/start");
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