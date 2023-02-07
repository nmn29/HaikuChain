import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged } from "firebase/auth";
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { doc, getDoc, onSnapshot, setDoc, updateDoc, increment } from 'firebase/firestore';
import { Fade, Zoom } from 'react-reveal';
import './stylesheets/game.css';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import check from '../images/peke.png'
import './stylesheets/header.css'

export default function Game1() {

  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0)
  const [enterHaiku, setEnterHaiku] = useState("");
  const [done, setDone] = useState({ done: 0 })
  const [userDai, setUserDai] = useState([])

  const randCharList = [
    'あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ',
    'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と',
    'な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ',
    'ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ',
    'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'を', 'ん'
  ]

  const [randChar, setRandChar] = useState("")
  const [doneCheck, setdoneCheck] = useState(false)
  //制限時間を表示するための関数
  const renderTime = ({ remainingTime }) => {
    return (
      <div className="timer">
        <div className="value">{remainingTime}</div>
      </div>
    );
  };

  //制限時間後に決定されなければ自動遷移
  const autoDone = () => {
    if (doneCheck === false) {
      setHaiku()
    }
  }

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

  //入力文字の状態を管理
  useEffect(() => {
    if (enterHaiku === "") {
      setEnterHaiku(randChar)
    }
  }, [enterHaiku])

  //招待ID、自身の番号、人数、ホストをルータから取得
  const invitationID = useLocation().state.id;
  const myIndex = useLocation().state.index;
  const userCount = useLocation().state.count;

  const user1 = useLocation().state.user1;
  const user2 = useLocation().state.user2;
  const user3 = useLocation().state.user3;
  const user4 = useLocation().state.user4;
  const user5 = useLocation().state.user5;

  const setUp = async () => {

    //現在の番号を計算（+1する）
    if (myIndex === userCount) {
      setCurrentIndex(1);
    } else {
      setCurrentIndex(myIndex + 1);
    }

    //お題を配列に追加する
    for (let i = 1; i <= userCount; i++) {
      await pushDai(i)
    }

    //ランダムにひらがなを決定
    const rand = Math.floor(Math.random() * 46)
    const randCharTemp = randCharList[rand]
    setRandChar(randCharTemp)
    setEnterHaiku(randCharTemp)

    await setLoading(false);
  }

  const pushDai = async (index) => {
    const docTemp = await "Dai" + index
    const daiRef = await doc(db, invitationID, docTemp);
    await getDoc(daiRef).then((snap) => {
      setUserDai((userDai) => [...userDai, snap.data().dai]);
    });
  }

  //リアルタイムで決定数を取得
  useEffect(() => {
    const userDocumentRef = doc(db, invitationID, 'doneHaiku');
    const unsub = onSnapshot(userDocumentRef, (documentSnapshot) => {
      setDone(documentSnapshot.data())
    });
    return unsub;
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    const doneTemp = done.done
    //全員が決定したら遷移

    if (doneTemp === userCount) {
      navigate("/Game2", {
        state:
        {
          id: invitationID, index: currentIndex, count: userCount,
          dai1: userDai[0], dai2: userDai[1], dai3: userDai[2], dai4: userDai[3], dai5: userDai[4],
          user1: user1, user2: user2, user3: user3, user4: user4, user5: user5
        }
      });
    }
  }, [done]);

  const setHaiku = async () => {
    const index = currentIndex;
    const haiku = enterHaiku;

    await setdoneCheck(true)

    if (index === 1) {
      await setDoc(doc(db, invitationID, 'Haiku1'), {
        haiku: haiku
      });
    } else if (index === 2) {
      await setDoc(doc(db, invitationID, 'Haiku2'), {
        haiku: haiku
      });
    } else if (index === 3) {
      await setDoc(doc(db, invitationID, 'Haiku3'), {
        haiku: haiku
      });
    } else if (index === 4) {
      await setDoc(doc(db, invitationID, 'Haiku4'), {
        haiku: haiku
      });
    } else if (index === 5) {
      await setDoc(doc(db, invitationID, 'Haiku5'), {
        haiku: haiku
      });
    }

    await updateDoc(doc(db, invitationID, 'doneHaiku'), {
      done: increment(1)
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
                    <>
                      <Fade>
                        <div className="header">
                          <div className="headerBox">
                            <div className="timer-wrapper">
                              <CountdownCircleTimer
                                isPlaying
                                size={60}
                                strokeWidth={8}
                                duration={30}
                                colors={["#838383"]}
                                trailColor={["#FFFFFF"]}
                                onComplete={() => autoDone()}
                              >
                                {renderTime}
                              </CountdownCircleTimer>
                            </div>
                            <div className="doneCount">
                              <img src={check} />{done.done} / {userCount}
                            </div>
                          </div>
                        </div>
                        <div className="haiku">
                          <div className="haikuInputBox">
                            <h2 className="charCount"><span className="charCountNum">1</span>文字目</h2>
                            <div className="inputText">
                              <p>文字を入力してください（1文字）</p>
                              <p className="attention">※制限時間を過ぎた場合、現在表示されている文字が入力されます</p>
                            </div>
                            <input disabled={doneCheck} type="text" placeholder={randChar} onChange={(e) => setEnterHaiku(e.target.value)} maxLength={1} />
                            <div className="gameButtonBox">
                              {!doneCheck
                                ?
                                <a class="btn3 btn-custom09" onClick={setHaiku}>
                                  <span class="btn-custom09-front">
                                    <p>決定</p>
                                  </span>
                                </a>
                                :
                                <a disabled={true} class="btn3 btn-custom09" onClick={setHaiku}>
                                  <span class="btn-custom09-front">
                                    <p>決定</p><Zoom duration={300}><img className="buttonCheck" src={check}></img></Zoom>
                                  </span>
                                </a>
                              }
                            </div>
                          </div>
                          <div className="haikuShowBox">
                            <h1>お題：</h1>
                            <div className="daiShow">
                              {userDai[currentIndex - 1]
                                ?
                                (
                                  <><h2>{userDai[currentIndex - 1]}</h2></>
                                )
                                :
                                (
                                  <><h2>　</h2></>
                                )
                              }
                            </div>
                            <h1>俳句</h1>
                            <div className="haikuShow">
                              <div className="haikuTop">
                                <p>
                                  <span>
                                    {enterHaiku.charAt(0)}
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