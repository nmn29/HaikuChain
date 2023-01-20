import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { Fade } from 'react-reveal';
import './stylesheets/game.css';
import './stylesheets/header.css'

export default function Recite() {

  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userHaiku, setUserHaiku] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        //ユーザが存在する場合
        setUser(currentUser);
        setUp()
      } else {
        //ユーザが存在しない場合
        setLoading(false);
      }
    });
  }, []);

  //招待ID、自身の番号、人数をルータから取得
  const invitationID = useLocation().state.id;
  const myIndex = useLocation().state.index;
  const userCount = useLocation().state.count;

  //前のページから受け取ったお題を配列に代入する
  let userDai = []
  userDai[1] = useLocation().state.dai1;
  userDai[2] = useLocation().state.dai2;
  userDai[3] = useLocation().state.dai3;
  userDai[4] = useLocation().state.dai4;
  userDai[5] = useLocation().state.dai5;

  const setUp = async () => {

    let thisCurrentIndex = 0

    //現在の番号を計算（+1する）
    if (myIndex === userCount) {
      setCurrentIndex(1);
      thisCurrentIndex = 1
    } else {
      setCurrentIndex(myIndex + 1);
      thisCurrentIndex = myIndex + 1
    }

    //俳句を配列に追加する
    for (let i = 1; i <= userCount; i++) {
      await pushHaiku(i)
    }

    await setLoading(false);
  }

  const pushHaiku = async (index) => {
    const docTemp = await "Haiku" + index
    const daiRef = await doc(db, invitationID, docTemp);
    await getDoc(daiRef).then((snap) => {
      setUserHaiku((userHaiku) => [...userHaiku, snap.data().haiku]);
    });
  }

  console.log(userHaiku)
  const navigate = useNavigate();

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
                    <>
                      <Fade>
                        <div className="reciteHeader">
                          <h1 className="ReciteHeader">鑑賞会</h1>
                        </div>
                        <div className="haiku">
                          <div className="haikuShowBox">
                            <h1>お題：</h1>
                            <div className="daiShow">
                              {userDai[currentIndex]
                                ?
                                (
                                  <><h2>{userDai[currentIndex]}</h2></>
                                )
                                :
                                (
                                  <><h2>　</h2></>
                                )
                              }
                            </div>
                            <h1>俳句</h1>
                            {/* <div className="haikuShow">
                              {!userHaiku['haiku']
                                ?
                                (
                                  <>
                                    <div className="haikuTop">
                                      <p>
                                        <span>

                                        </span>
                                        <span>　</span>
                                        <span>　</span>
                                        <span>　</span>
                                        <span>　</span>
                                      </p>
                                    </div>
                                    <div className="haikuMiddle">
                                      <p>
                                        <span>　</span>
                                        <span>　</span>
                                        <span>　</span>
                                        <span>　</span>
                                        <span>　</span>
                                        <span>　</span>
                                        <span>　</span>
                                      </p>
                                    </div>
                                    <div className="haikuBottom">
                                      <p>
                                        <span>　</span>
                                        <span>　</span>
                                        <span>　</span>
                                        <span>　</span>
                                        <span>　</span>
                                      </p>
                                    </div>
                                  </>
                                )
                                :
                                (
                                  <>
                                    <div className="haikuTop">
                                      <p>
                                        <span>{userHaiku['haiku'].charAt(0)}</span>
                                        <span>{userHaiku['haiku'].charAt(1)}</span>
                                        <span>{userHaiku['haiku'].charAt(2)}</span>
                                        <span>{userHaiku['haiku'].charAt(3)}</span>
                                        <span>{userHaiku['haiku'].charAt(4)}</span>
                                      </p>
                                    </div>
                                    <div className="haikuMiddle">
                                      <p>
                                        <span>{userHaiku['haiku'].charAt(5)}</span>
                                        <span>{userHaiku['haiku'].charAt(6)}</span>
                                        <span>{userHaiku['haiku'].charAt(7)}</span>
                                        <span>{userHaiku['haiku'].charAt(8)}</span>
                                        <span>{userHaiku['haiku'].charAt(9)}</span>
                                        <span>{userHaiku['haiku'].charAt(10)}</span>
                                        <span>{userHaiku['haiku'].charAt(11)}</span>
                                      </p>
                                    </div>
                                    <div className="haikuBottom">
                                      <p>
                                        <span>{userHaiku['haiku'].charAt(12)}</span>
                                        <span>{userHaiku['haiku'].charAt(13)}</span>
                                        <span>{userHaiku['haiku'].charAt(14)}</span>
                                        <span>{userHaiku['haiku'].charAt(15)}</span>
                                        <span>{userHaiku['haiku'].charAt(16)}</span>
                                      </p>
                                    </div>
                                  </>
                                )
                              }
                            </div> */}
                          </div>
                        </div>
                      </Fade>
                    </>
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