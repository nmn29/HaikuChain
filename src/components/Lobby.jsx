import React, { useState, useEffect } from "react";
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { doc, deleteDoc, collection, onSnapshot, query, orderBy, setDoc, Timestamp } from 'firebase/firestore';
import Fade from 'react-reveal/Fade';
import Crown from '../images/hostCrown.png'
import './stylesheets/lobby.css'

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
      if (userList[userList.length - 1].id === "Game") {
        const totalCount = userList.length - 1
        const userIndex = (userList.findIndex((users) => users.id === user.uid) + 1)
        //招待ID、自分の番号、人数をゲームに送信

        switch (totalCount) {
          case 1:
            navigate("/start", { state: { id: invitationID, index: userIndex, count: totalCount, user1: userList[0].name, user2: "", user3: "", user4: "", user5: "" } });
            break;
          case 2:
            navigate("/start", { state: { id: invitationID, index: userIndex, count: totalCount, user1: userList[0].name, user2: userList[1].name, user3: "", user4: "", user5: "" } });
            break;
          case 3:
            navigate("/start", { state: { id: invitationID, index: userIndex, count: totalCount, user1: userList[0].name, user2: userList[1].name, user3: userList[2].name, user4: "", user5: "" } });
            break;
          case 4:
            navigate("/start", { state: { id: invitationID, index: userIndex, count: totalCount, user1: userList[0].name, user2: userList[1].name, user3: userList[2].name, user4: userList[3].name, user5: "" } });
            break;
          case 5:
            navigate("/start", { state: { id: invitationID, index: userIndex, count: totalCount, user1: userList[0].name, user2: userList[1].name, user3: userList[2].name, user4: userList[3].name, user5: userList[4].name } });
            break;
        }
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

    await setDoc(doc(db, invitationID, 'doneDai'), {
      done: 0
    });

    await setDoc(doc(db, invitationID, 'doneHaiku'), {
      done: 0
    });

    await setDoc(doc(db, invitationID, 'Game'), {
      people: totalCount,
      timestamp: Timestamp.fromDate(new Date())
    });
  }

  return (
    <>
      <div className="global">
        <div className="main">
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

                    <Fade>
                      <div className="header">
                        <div className="headerBox">
                          <div className="leave">
                            <button className="leaveButton" onClick={logout}><span>◀</span>退室</button>
                          </div>
                        </div>
                      </div>
                      <div className="lobby">
                        <div className="lobby-child">
                          <div className="userlistBox">

                            {/* 1人目 */}
                            {userList[0] == undefined
                              ?
                              (
                                <div className="users none">
                                  <p>
                                    <span className="number">
                                      1
                                    </span>
                                    <span className="username">
                                    </span>
                                  </p>
                                </div>
                              )
                              :
                              (
                                <>
                                  <div className="users">
                                    <p>
                                      <span className="number">
                                        1
                                      </span>
                                      <span className="username">
                                        {userList[0].name}
                                      </span>
                                      <span className="crown">
                                        <img src={Crown} />
                                      </span>
                                    </p>
                                  </div>

                                </>
                              )
                            }

                            {/* 2人目 */}
                            {userList[1] == undefined
                              ?
                              (
                                <div className="users none">
                                  <p>
                                    <span className="number">
                                      2
                                    </span>
                                    <span className="username">
                                    </span>
                                  </p>
                                </div>
                              )
                              :
                              (
                                <Fade>
                                  <div className="users">
                                    <p>
                                      <span className="number">
                                        2
                                      </span>
                                      <span className="username">
                                        {userList[1].name}
                                      </span>
                                    </p>
                                  </div>
                                </Fade>
                              )
                            }

                            {/* 3人目 */}
                            {userList[2] == undefined
                              ?
                              (
                                <div className="users none">
                                  <p>
                                    <span className="number">
                                      3
                                    </span>
                                    <span className="username">
                                    </span>
                                  </p>
                                </div>
                              )
                              :
                              (
                                <Fade>
                                  <div className="users">
                                    <p>
                                      <span className="number">
                                        3
                                      </span>
                                      <span className="username">
                                        {userList[2].name}
                                      </span>
                                    </p>
                                  </div>
                                </Fade>
                              )
                            }

                            {/* 4人目 */}
                            {userList[3] == undefined
                              ?
                              (
                                <div className="users none">
                                  <p>
                                    <span className="number">
                                      4
                                    </span>
                                    <span className="username">
                                    </span>
                                  </p>
                                </div>
                              )
                              :
                              (
                                <Fade>
                                  <div className="users">
                                    <p>
                                      <span className="number">
                                        4
                                      </span>
                                      <span className="username">
                                        {userList[3].name}
                                      </span>
                                    </p>
                                  </div>
                                </Fade>
                              )
                            }

                            {/* 5人目 */}
                            {userList[4] == undefined
                              ?
                              (
                                <div className="users none">
                                  <p>
                                    <span className="number">
                                      5
                                    </span>
                                    <span className="username">
                                    </span>
                                  </p>
                                </div>
                              )
                              :
                              (
                                <Fade>
                                  <div className="users">
                                    <p>
                                      <span className="number">
                                        5
                                      </span>
                                      <span className="username">
                                        {userList[4].name}
                                      </span>
                                    </p>
                                  </div>
                                </Fade>
                              )
                            }
                          </div>
                          <div className="gameStartBox">

                            <p>招待コード</p>
                            <p className="invitationID">{invitationID}</p>

                            {hostID === user.uid
                              ?
                              (
                                <>
                                  <button className="startButton" onClick={startGame}>ゲームを開始<span>▶</span></button>
                                </>
                              )
                              :
                              (
                                <>
                                  <div>ホストが選択中</div>
                                </>
                              )
                            }

                          </div>
                        </div>
                      </div>
                    </Fade>

                  )
                }
              </>
            )
            :
            <>
            </>
          }
        </div>
      </div>
    </>
  );
}