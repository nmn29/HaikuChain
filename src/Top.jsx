import { useState, useEffect } from 'react';
import { db, auth } from './firebase/firebase.js';
import { collection, query, doc, setDoc, getCountFromServer, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import Fade from 'react-reveal/Fade';
import { useModal } from 'react-hooks-use-modal';
import Rules from './Rules.jsx'
import useSound from 'use-sound'
import enterRoom from './sounds/enterRoom.mp3'

import './stylesheets/Top.css';
import './stylesheets/cherryblossom.css'
import './stylesheets/top-button.css'

import GameTitle from './images/GameTitle.png'

export default function Top() {

  const [ID, setID] = useState(" ");
  const [IDTemp, setIDTemp] = useState(ID);
  const [invitationID, setInvitationID] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [enterLoading, setEnterLoading] = useState(false);
  const [disable, setDisable] = useState(false)

  //ランダムIDの生成
  useEffect(() => {
    const randomID = "詠み人" + Math.floor(Math.random() * (100000 - 10000) + 10000);
    setID(randomID);
    setIDTemp(randomID);
  }, []);

  const navigate = useNavigate();

  //名前の状態を管理
  useEffect(() => {
    if (ID === "") {
      setID(IDTemp)
    }
  }, [ID])

  //部屋を作る
  const loginLobby = async (event) => {
    setDisable(true)
    setCreateLoading(true)
    event.preventDefault();

    try {
      await signInAnonymously(auth);

      //名前の格納（空欄であればデフォルトの名前）
      let addName = IDTemp;
      if (ID !== "") {
        addName = ID;
      }

      const uidTemp = auth.currentUser.uid;
      //uidの最初の8文字を取得
      const get8String = uidTemp.slice(0, 8);
      //取得した8文字のuidを大文字に変換
      const docUid = get8String.toUpperCase();

      await setDoc(doc(db, docUid, uidTemp), {
        name: addName,
        timestamp: Timestamp.fromDate(new Date())
      });

      await setCreateLoading(false)

      await play()
      //ロビーに遷移し、招待コードを送信する
      await navigate("/lobby", { state: { id: docUid } });

    } catch (error) {
      alert("セッションの更新が必要です");
      setCreateLoading(false)
      setDisable(false)
      console.log(error)
    }
  };

  //部屋に入る
  const enterLobby = async (event) => {
    event.preventDefault();
    setDisable(true)
    setEnterLoading(true);

    try {
      //招待コードを格納
      await signInAnonymously(auth);
      const invitationIDTemp = invitationID;

      //名前の格納（空欄であればデフォルトの名前）
      let addName = IDTemp;
      if (ID !== "") {
        addName = ID;
      }

      //部屋の人数を取得
      const collectionRef = collection(db, invitationIDTemp);
      const totalCountTemp = await getCountFromServer(query(collectionRef));
      const totalCount = totalCountTemp.data().count
      console.log(totalCount);

      if (totalCount === 0) {
        throw new Error('部屋が存在しません')
      }


      //部屋の人数がオーバー(5人)していれば認証しない
      if (totalCount <= 4) {
        const uidTemp = auth.currentUser.uid;

        await setDoc(doc(db, invitationIDTemp, uidTemp), {
          name: addName,
          timestamp: Timestamp.fromDate(new Date())
        });
        //ロビーに遷移し、招待コードと人数を送信する
        setEnterLoading(false)
        await navigate("/lobby", { state: { id: invitationIDTemp } });

      } else {
        alert("人数オーバーです")
        setDisable(false)
        setEnterLoading(false)
      }

    } catch (error) {
      alert("招待コードが違います");
      console.log(error)
      setDisable(false)
      setEnterLoading(false)
    }
  };

  const [Modal, open, close] = useModal('root', {
    preventScroll: true,
  });

  const modalStyle = {
    backgroundColor: '#fff',
    borderRadius: '10px',

  };

  //入室時の音声の設定
  const [play] = useSound(enterRoom, { volume: 0.05 })

  return (
    <>
      <div className="global">
        <ul class="sakura">
          <h1>Sakura</h1>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <div className="main">
          <div className="title"><img src={GameTitle}></img></div>
          <div className="top">
            <div className="startBox">
              <div className="start-child">
                <p className="namehead">名前を入力</p>
                <input disabled={disable} type="text" placeholder={ID} onChange={(e) => setID(e.target.value)} maxLength={16} />
                <p>
                  <div className="buttonBox">
                  {!createLoading
                    ?
                    (
                      <>
                        <a disabled={disable} className="btn3 btn-custom04" onClick={(e) => loginLobby(e)}>
                          <span class="btn-custom04-front">
                            <p>部屋を作る</p>
                          </span>
                        </a>
                      </>
                    )
                    :
                    (
                      <>
                        <a disabled={disable} className="btn3 btn-custom05">
                          <span className="btn-custom05-front">
                            <p><span className="loader"></span></p>
                          </span>
                        </a>
                      </>
                    )
                  }
                  <a class="btn3 btn-custom06" onClick={open}>
                    <span class="btn-custom06-front">
                      <p>部屋に入る</p>
                    </span>
                  </a>
                  </div>
                </p>
              </div>
            </div>
            <div className="rulesBox">
              <Rules />
            </div>
            <Modal>
              <Fade>

                <div className="modal" style={modalStyle}>
                  <input type="text" placeholder="招待コードを入力" onChange={(e) => setInvitationID((e.target.value).toUpperCase())} maxLength={8} />
                  <i onClick={close} class="fa-solid fa-xmark"></i>
                  {!enterLoading
                    ?
                    (
                      <>
                        <p>
                          <a class="btn3 btn-custom06" onClick={(e) => enterLobby(e)}>
                            <span class="btn-custom06-front">
                              <p>部屋に入る</p>
                            </span>
                          </a>
                        </p>
                      </>
                    )
                    :
                    (
                      <>
                        <p>
                          <a class="btn3 btn-custom05">
                            <span class="btn-custom05-front">
                              <p><span className="loader"></span></p>
                            </span>
                          </a>
                        </p>
                      </>
                    )
                  }

                </div>
              </Fade>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}


