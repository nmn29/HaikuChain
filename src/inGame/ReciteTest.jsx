import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { Fade } from 'react-reveal';
import './stylesheets/game.css';
import './stylesheets/header.css'

export default function ReciteTest() {

  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0)
  const userHaiku = ["あああああああああああああああああ", "いいいいいいいいいいいいいいいいい", "ううううううううううううううううう", "えええええええええええええええええ", "おおおおおおおおおおおおおおおおお"]


  //前のページから受け取ったお題を配列に代入する
  let userDai = []
  userDai[1] = "お題1";
  userDai[2] = "お題2";
  userDai[3] = "お題3";
  userDai[4] = "お題4";
  userDai[5] = "お題5";

  const user1 = "ユーザ1";
  const user2 = "ユーザ2";
  const user3 = "ユーザ3";
  const user4 = "ユーザ4";
  const user5 = "ユーザ5";

  return (
    <>
      <div className="global">
        <div className="main">
          {!loading
            ?
            (
              <>
                {user
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
                          <h1>鑑賞会</h1>
                        </div>
                        <div className="recite-child">
                          <div className="r-userlistBox">

                            {/* 1人目 */}
                            {user1 === ""
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
                                <div className="users">
                                  <p>
                                    <span className="number">
                                      1
                                    </span>
                                    <span className="username">
                                      {user1}
                                    </span>
                                  </p>
                                </div>
                              )
                            }

                            {/* 2人目 */}
                            {user2 === ""
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
                                        {user2}
                                      </span>
                                    </p>
                                  </div>
                                </Fade>
                              )
                            }

                            {/* 3人目 */}
                            {user3 === ""
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
                                        {user3}
                                      </span>
                                    </p>
                                  </div>
                                </Fade>
                              )
                            }

                            {/* 4人目 */}
                            {user4 === ""
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
                                        {user4}
                                      </span>
                                    </p>
                                  </div>
                                </Fade>
                              )
                            }

                            {/* 5人目 */}
                            {user5 === ""
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
                                        {user5}
                                      </span>
                                    </p>
                                  </div>
                                </Fade>
                              )
                            }
                          </div>
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
                            <div className="haikuShow">
                              {!userHaiku[0]
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
                                        <span>{userHaiku[0].charAt(0)}</span>
                                        <span>{userHaiku[0].charAt(1)}</span>
                                        <span>{userHaiku[0].charAt(2)}</span>
                                        <span>{userHaiku[0].charAt(3)}</span>
                                        <span>{userHaiku[0].charAt(4)}</span>
                                      </p>
                                    </div>
                                    <div className="haikuMiddle">
                                      <p>
                                        <span>{userHaiku[0].charAt(5)}</span>
                                        <span>{userHaiku[0].charAt(6)}</span>
                                        <span>{userHaiku[0].charAt(7)}</span>
                                        <span>{userHaiku[0].charAt(8)}</span>
                                        <span>{userHaiku[0].charAt(9)}</span>
                                        <span>{userHaiku[0].charAt(10)}</span>
                                        <span>{userHaiku[0].charAt(11)}</span>
                                      </p>
                                    </div>
                                    <div className="haikuBottom">
                                      <p>
                                        <span>{userHaiku[0].charAt(12)}</span>
                                        <span>{userHaiku[0].charAt(13)}</span>
                                        <span>{userHaiku[0].charAt(14)}</span>
                                        <span>{userHaiku[0].charAt(15)}</span>
                                        <span>{userHaiku[0].charAt(16)}</span>
                                      </p>
                                    </div>
                                  </>
                                )
                              }
                            </div>
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