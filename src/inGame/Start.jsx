import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged } from "firebase/auth";
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, setDoc, updateDoc, increment } from 'firebase/firestore';


export default function Start() {

  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [userDai, setUserDai] = useState("")
  const [done, setDone] = useState("")

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
  const userCount = useLocation().state.count;

  //リアルタイムでお題を取得
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
                <div className="global">
                  <div className="main">
                    <div className="odai">
                      <p>お題を入力しよう</p>
                      <input type="text" onChange={(e) => setUserDai(e.target.value)} maxLength={16} />
                      <button onClick={daiDone}>決定</button>
                    </div>
                  </div>
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