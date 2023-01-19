import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, setDoc, updateDoc, increment } from 'firebase/firestore';
import { Fade, Zoom } from 'react-reveal';
import './stylesheets/start.css';
import './stylesheets/header.css';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import check from '../images/peke.png'

export default function Start() {

  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [userDai, setUserDai] = useState(" ")
  const [done, setDone] = useState({ done: 0 })
  let userCount = 0

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
    console.log("autodone")
    if (doneCheck === false) {
      daiDone()
    }
  }

  //ランダムお題
  const randThemeList =
    [
      '自由', '春', '夏', '秋', '冬', '学校', '仕事', 'スポーツ', 'アウトドア', 'インドア',
      '恋愛', '友情', '家族', '食', '日常', '午前', '午後', '朝', '昼', '夜',
      'ゲーム', '本', '料理', 'テレビ', '勉強', '旅行', 'スマホ', 'カメラ', '服', '車',
      '過去', '現在', '未来', '人生', '動物', '音楽', 'オタク', '卒業', '東京', '新生活',
      'クリスマス', '正月', '年末', 'ハロウィン', '平成', '令和', '日本', '地元', '釣り', '苦難'
    ]
  const [randTheme, setRandTheme] = useState("")

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

  //招待ID、自身の番号、人数
  const invitationID = useLocation().state.id;
  const myIndex = useLocation().state.index;
  userCount = useLocation().state.count;

  console.log("myIndex:" + myIndex)

  //ランダムお題を決定
  useEffect(() => {
    const rand = Math.floor(Math.random() * 50)
    const randThemeTemp = randThemeList[rand]
    setRandTheme(randThemeTemp)
    setUserDai(randThemeTemp)
  }, [])

  //お題の状態を管理
  useEffect(() => {
    if (userDai === "") {
      setUserDai(randTheme)
    }
  }, [userDai])

  //リアルタイムで決定数を取得
  useEffect(() => {
    const userDocumentRef = doc(db, invitationID, 'doneDai');
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
      navigate("/Game1", { state: { id: invitationID, index: myIndex, count: userCount } });
    }
  }, [done]);

  const daiDone = async () => {

    const dai = userDai;
    const index = myIndex;

    setdoneCheck(true)

    if (index === 1) {
      await setDoc(doc(db, invitationID, 'Dai1'), {
        dai: dai
      });
    } else if (index === 2) {
      await setDoc(doc(db, invitationID, 'Dai2'), {
        dai: dai
      });
    } else if (index === 3) {
      await setDoc(doc(db, invitationID, 'Dai3'), {
        dai: dai
      });
    } else if (index === 4) {
      await setDoc(doc(db, invitationID, 'Dai4'), {
        dai: dai
      });
    } else if (index === 5) {
      await setDoc(doc(db, invitationID, 'Dai5'), {
        dai: dai
      });
    }

    await updateDoc(doc(db, invitationID, 'doneDai'), {
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

                    <Fade>
                      <div className="header">
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
                      <div className="odai">
                        <div className="odaiBox">
                          <h1>お題を決めよう</h1>
                          <h2>※16文字まで</h2>
                          <input disabled={doneCheck} type="text" placeholder={userDai} onChange={(e) => setUserDai(e.target.value)} maxLength={16} />
                          {!doneCheck
                            ? (<button className="odaiButton" onClick={daiDone}>決定</button>)
                            : (<button disabled={true} className="odaiButtonDone" onClick={daiDone}>決定<Zoom duration={300}><img className="buttonCheck" src={check}></img></Zoom></button>)
                          }
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