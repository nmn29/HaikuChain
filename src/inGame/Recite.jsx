import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { Fade } from 'react-reveal';
import './stylesheets/game.css';
import './stylesheets/header.css'
import './stylesheets/startButton.css'
import volumeOn from './svg/volume-high-solid.svg';
import volumeOff from './svg/volume-xmark-solid.svg'
import { useSpeechSynthesis } from 'react-speech-kit';

export default function Recite() {

  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
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
  const userCount = useLocation().state.count;

  //前のページから受け取ったお題を配列に代入する
  let userDai = []
  userDai[1] = useLocation().state.dai1;
  userDai[2] = useLocation().state.dai2;
  userDai[3] = useLocation().state.dai3;
  userDai[4] = useLocation().state.dai4;
  userDai[5] = useLocation().state.dai5;

  let userList = []
  userList[1] = useLocation().state.user1;
  userList[2] = useLocation().state.user2;
  userList[3] = useLocation().state.user3;
  userList[4] = useLocation().state.user4;
  userList[5] = useLocation().state.user5;

  const setUp = async () => {

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

  const navigate = useNavigate();
  const logout = async () => {
    await signOut(auth);
    await navigate("/");
  }

  //画面の進行を管理（現在のユーザ）
  const [reciteCount, setReciteCount] = useState(0)
  //画面の進行を管理（現在の画面）
  const [reciteFlag, setReciteFlag] = useState(0)
  //終了を管理
  const [end, setEnd] = useState(false)
  //読み上げの設定
  const { speak, voices, cancel } = useSpeechSynthesis();
  //読み上げの可否の設定
  const [speakBool, setSpeakBool] = useState(true)
  const [speakVolume, setSpeakVolume] = useState(0.5)

  //アニメーション用の時間停止
  const wait = async (ms) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms)
    });
  }

  //俳句の読み上げ
  const speakHaiku = async (str) => {
    await speak({ text: str, voice: voices[2], rate: 0.6, volume: speakVolume })
  }

  //開始・次へ進むが押されたらフラグをリセットし、次のユーザの俳句を表示する
  const countUp = async () => {
    await setReciteFlag(0)
    await setReciteCount((prevCount) => prevCount + 1);
    await changeWindow(reciteCount)
  }

  //画面を変化させる
  const changeWindow = async (count) => {
    //お題（見出し）
    await wait(1500);
    setReciteFlag((prevCount) => prevCount + 1);
    //お題
    await wait(1500);
    setReciteFlag((prevCount) => prevCount + 1);
    //俳句（見出し）
    await wait(1500);
    setReciteFlag((prevCount) => prevCount + 1);
    //俳句（上）
    await wait(2000)
    await setReciteFlag((prevCount) => prevCount + 1);
    await speakHaiku(userHaiku[count].substring(0, 5));
    //俳句（中）
    await wait(2000);
    await cancel();
    await setReciteFlag((prevCount) => prevCount + 1);
    await speakHaiku(userHaiku[count].substring(5, 12));
    //俳句（下）
    await wait(2000);
    await cancel();
    await setReciteFlag((prevCount) => prevCount + 1);
    await speakHaiku(userHaiku[count].substring(12, 17));
    //ボタンを表示
    await wait(2000);
    await cancel();
    //人数と同じになったら鑑賞を終了、退室ボタンを表示
    if (reciteCount === userCount - 1) {
      await setEnd(true);
      await setReciteFlag((prevCount) => prevCount + 1);
    } else {
      await setReciteFlag((prevCount) => prevCount + 1);
    }

  }

  const SpeakerOff = () => {
    setSpeakVolume(0)
    setSpeakBool(false)
  }

  const SpeakerOn = () => {
    setSpeakVolume(0.5)
    setSpeakBool(true)
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
                    <>
                      <Fade>
                        <div className="reciteHeader">
                          <h1>詠み会</h1>
                        </div>
                        <div className="recite-child">

                          <div className="recite-userlistBox">
                            <div className="speaker">
                              {speakBool
                                ?
                                <img onClick={() => SpeakerOff()} src={volumeOn}></img>
                                :
                                <img onClick={() => SpeakerOn()} src={volumeOff}></img>
                              }
                            </div>
                            <div className="responsive-recite-head">
                              <div className="numberHead">ユーザ番号</div>
                              <div className="userlistBoxItem">

                                {/* 1人目 */}
                                {userList[1] === ""
                                  ?
                                  (
                                    <></>
                                  )
                                  :
                                  (
                                    <>
                                      {reciteCount === 1
                                        ?
                                        <div className="users-r read-active">
                                          <p>
                                            <span className="number-r read-active-bg">
                                              1
                                            </span>
                                            <span className="username-r">
                                              {userList[1]}
                                            </span>
                                          </p>
                                        </div>
                                        :
                                        <div className="users-r">
                                          <p>
                                            <span className="number-r">
                                              1
                                            </span>
                                            <span className="username-r">
                                              {userList[1]}
                                            </span>
                                          </p>
                                        </div>
                                      }
                                    </>
                                  )
                                }

                                {/* 2人目 */}
                                {userList[2] === ""
                                  ?
                                  (
                                    <></>
                                  )
                                  :
                                  (
                                    <>
                                      {reciteCount === 2
                                        ?
                                        <div className="users-r read-active">
                                          <p>
                                            <span className="number-r read-active-bg">
                                              2
                                            </span>
                                            <span className="username-r">
                                              {userList[2]}
                                            </span>
                                          </p>
                                        </div>
                                        :
                                        <div className="users-r">
                                          <p>
                                            <span className="number-r">
                                              2
                                            </span>
                                            <span className="username-r">
                                              {userList[2]}
                                            </span>
                                          </p>
                                        </div>
                                      }
                                    </>
                                  )
                                }

                                {/* 3人目 */}
                                {userList[3] === ""
                                  ?
                                  (
                                    <></>
                                  )
                                  :
                                  (
                                    <>
                                      {reciteCount === 3
                                        ?
                                        <div className="users-r read-active">
                                          <p>
                                            <span className="number-r read-active-bg">
                                              3
                                            </span>
                                            <span className="username-r">
                                              {userList[3]}
                                            </span>
                                          </p>
                                        </div>
                                        :
                                        <div className="users-r">
                                          <p>
                                            <span className="number-r">
                                              3
                                            </span>
                                            <span className="username-r">
                                              {userList[3]}
                                            </span>
                                          </p>
                                        </div>
                                      }
                                    </>
                                  )
                                }

                                {/* 4人目 */}
                                {userList[4] === ""
                                  ?
                                  (
                                    <></>
                                  )
                                  :
                                  (
                                    <>
                                      {reciteCount === 4
                                        ?
                                        <div className="users-r read-active">
                                          <p>
                                            <span className="number-r read-active-bg">
                                              4
                                            </span>
                                            <span className="username-r">
                                              {userList[4]}
                                            </span>
                                          </p>
                                        </div>
                                        :
                                        <div className="users-r">
                                          <p>
                                            <span className="number-r">
                                              4
                                            </span>
                                            <span className="username-r">
                                              {userList[4]}
                                            </span>
                                          </p>
                                        </div>
                                      }
                                    </>
                                  )
                                }

                                {/* 5人目 */}
                                {userList[5] === ""
                                  ?
                                  (
                                    <></>
                                  )
                                  :
                                  (
                                    <>
                                      {reciteCount === 5
                                        ?
                                        <div className="users-r read-active">
                                          <p>
                                            <span className="number-r read-active-bg">
                                              5
                                            </span>
                                            <span className="username-r">
                                              {userList[5]}
                                            </span>
                                          </p>
                                        </div>
                                        :
                                        <div className="users-r">
                                          <p>
                                            <span className="number-r">
                                              5
                                            </span>
                                            <span className="username-r">
                                              {userList[5]}
                                            </span>
                                          </p>
                                        </div>
                                      }
                                    </>
                                  )
                                }
                              </div>
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
                                      <span>{userList[reciteCount]}</span>の俳句
                                    </div>
                                    <div className="reciteHaikuBox">
                                      <div className="reciteHaikuShowBox">
                                        {reciteFlag >= 1 || reciteFlag === 10
                                          ?
                                          <Fade top distance="10%">
                                            <h1 className="gamehead">お題</h1>
                                          </Fade>
                                          :
                                          <h1 className="gamehead-none">　</h1>
                                        }
                                        <div className="recite-daiShow">
                                          {reciteFlag >= 2 || reciteFlag === 10
                                            ?
                                            <>
                                              {userDai[reciteCount]
                                                ?
                                                (
                                                  <Fade>
                                                    <><h2 className="dai-text">{userDai[reciteCount]}</h2></>
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

                                          {!userHaiku[reciteCount - 1]
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
                                                {reciteFlag >= 4 || reciteFlag === 10
                                                  ?
                                                  (
                                                    <Fade top distance="10%">
                                                      <div className="haikuTop">
                                                        <p>
                                                          <span>{userHaiku[reciteCount - 1].charAt(0)}</span>
                                                          <span>{userHaiku[reciteCount - 1].charAt(1)}</span>
                                                          <span>{userHaiku[reciteCount - 1].charAt(2)}</span>
                                                          <span>{userHaiku[reciteCount - 1].charAt(3)}</span>
                                                          <span>{userHaiku[reciteCount - 1].charAt(4)}</span>
                                                        </p>
                                                      </div>
                                                    </Fade>
                                                  )
                                                  :
                                                  (
                                                    <div className="haikuTop">
                                                      <p>
                                                        <span>　</span>
                                                        <span>　</span>
                                                        <span>　</span>
                                                        <span>　</span>
                                                        <span>　</span>
                                                      </p>
                                                    </div>
                                                  )
                                                }
                                                {reciteFlag >= 5 || reciteFlag === 10
                                                  ?
                                                  (
                                                    <Fade top distance="10%">
                                                      <div className="haikuMiddle">
                                                        <p>
                                                          <span>{userHaiku[reciteCount - 1].charAt(5)}</span>
                                                          <span>{userHaiku[reciteCount - 1].charAt(6)}</span>
                                                          <span>{userHaiku[reciteCount - 1].charAt(7)}</span>
                                                          <span>{userHaiku[reciteCount - 1].charAt(8)}</span>
                                                          <span>{userHaiku[reciteCount - 1].charAt(9)}</span>
                                                          <span>{userHaiku[reciteCount - 1].charAt(10)}</span>
                                                          <span>{userHaiku[reciteCount - 1].charAt(11)}</span>
                                                        </p>
                                                      </div>
                                                    </Fade>
                                                  )
                                                  :
                                                  (
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
                                                  )
                                                }
                                                {reciteFlag >= 6 || reciteFlag === 10
                                                  ?
                                                  (
                                                    <Fade top distance="10%">
                                                      <div className="haikuBottom">
                                                        <p>
                                                          <span>{userHaiku[reciteCount - 1].charAt(12)}</span>
                                                          <span>{userHaiku[reciteCount - 1].charAt(13)}</span>
                                                          <span>{userHaiku[reciteCount - 1].charAt(14)}</span>
                                                          <span>{userHaiku[reciteCount - 1].charAt(15)}</span>
                                                          <span>{userHaiku[reciteCount - 1].charAt(16)}</span>
                                                        </p>
                                                      </div>
                                                    </Fade>
                                                  )
                                                  :
                                                  (
                                                    <div className="haikuBottom">
                                                      <p>
                                                        <span>　</span>
                                                        <span>　</span>
                                                        <span>　</span>
                                                        <span>　</span>
                                                        <span>　</span>
                                                      </p>
                                                    </div>
                                                  )
                                                }
                                              </>
                                            )
                                          }
                                        </div>
                                      </div>
                                    </div>
                                    {reciteFlag >= 7 || reciteFlag === 10
                                      ?
                                      <Fade>
                                        {!end
                                          ?
                                          <div className="reciteButtonBox">
                                            <a class="btn2 btn-custom02" onClick={countUp}>
                                              <span class="btn-custom02-front"><p>次の俳句</p></span>
                                            </a>
                                            <a class="btn2 btn-custom03">
                                              <span class="btn-custom03-front"><p>ツイート</p></span>
                                            </a>
                                          </div>
                                          :
                                          <div className="reciteButtonBox">
                                            <a class="btn2 btn-custom10" onClick={logout}>
                                              <span class="btn-custom10-front"><p>　退室　</p></span>
                                            </a>
                                            <a class="btn2 btn-custom03">
                                              <span class="btn-custom03-front"><p>ツイート</p></span>
                                            </a>
                                          </div>
                                        }
                                      </Fade>
                                      :
                                      <>
                                      </>
                                    }
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