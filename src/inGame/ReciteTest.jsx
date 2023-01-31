import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { Fade } from 'react-reveal';
import './stylesheets/game.css';
import './stylesheets/header.css'
import './stylesheets/startButton.css'
import { hasSelectionSupport } from '@testing-library/user-event/dist/utils/index.js';

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

  const userCount = 5;

  //画面の進行を管理（現在のユーザ）
  const [reciteCount, setReciteCount] = useState(0)
  //画面の進行を管理（現在の画面）
  const [reciteFlag, setReciteFlag] = useState(0)

  //アニメーション用の時間停止
  const wait = async (ms) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms)
    });
  }

  //開始・次へ進むが押されたらフラグをリセットし、次のユーザの俳句を表示する
  const countUp = () => {
    setReciteFlag(0)
    setReciteCount((prevCount) => prevCount + 1);
    changeWindow()
  }

  //画面を変化させる
  const changeWindow = async () => {
    await wait(2000)
    setReciteFlag((prevCount) => prevCount + 1);
    await wait(2000)
    setReciteFlag((prevCount) => prevCount + 1);
    await wait(2000)
    setReciteFlag((prevCount) => prevCount + 1);
    await wait(2000)
    setReciteFlag((prevCount) => prevCount + 1);
  }

  console.log(reciteFlag)
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
                          <h1>詠み会</h1>
                        </div>
                        <div className="recite-child">
                          <div className="recite-userlistBox">
                            <div className="userlistBoxItem">

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
                          {reciteCount === 0
                            ?
                            (
                              <>
                                <div className="reciteStart">
                                  <div className="startText">
                                    <h1>俳句が完成しました！</h1>
                                    <p><span>「俳句を詠む」</span>をクリックし、</p>
                                    <p>完成した俳句を鑑賞しましょう！</p>
                                    <div className="soundAttentionBox">
                                      <p className="soundAttention">開始すると自動再生され、機械音声により俳句が読み上げられます。</p>
                                      <p className="soundAttention">左上のスピーカーをクリックすることで音声を無効にできます。</p>
                                    </div>
                                    <a class="btn btn-custom01" onClick={countUp}>
                                      <span class="btn-custom01-front"><p>俳句を詠む</p></span>
                                    </a>
                                  </div>

                                </div>
                              </>
                            )
                            :
                            (
                              <>
                                <Fade>
                                  <div className="haiku-recite">
                                    <div className="haikuUser">
                                      <span>{user1}</span>の俳句
                                    </div>
                                    <div className="reciteHaikuBox">
                                      <div className="reciteHaikuShowBox">
                                        {reciteFlag >= 1 || reciteFlag === 10
                                          ?
                                          <Fade top distance="10%">
                                            <h1 className="gamehead">お題：</h1>
                                          </Fade>
                                          :
                                          <h1 className="gamehead-none">　</h1>
                                        }
                                        <div className="recite-daiShow">
                                          {reciteFlag >= 2 || reciteFlag === 10
                                            ?
                                            <>
                                              {userDai[1]
                                                ?
                                                (
                                                  <Fade top distance="10%">
                                                    <><h2 className="dai-text">{userDai[1]}</h2></>
                                                  </Fade>
                                                )
                                                :
                                                (
                                                  <><h2 className="dai-text">　</h2></>
                                                )
                                              }
                                            </>
                                            :
                                            <h2 className="dai-text">　</h2>
                                          }
                                        </div>
                                        {reciteFlag >= 3 || reciteFlag === 10
                                          ?
                                          <Fade top distance="10%">
                                            <h1 className="gamehead">俳句</h1>
                                          </Fade>
                                          :
                                          <h1 className="gamehead-none">　</h1>
                                        }
                                        <div className="recite-haikuShow">
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
                                  </div>
                                </Fade>
                              </>
                            )
                          }
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