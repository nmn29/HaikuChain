import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged } from "firebase/auth";
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';

export default function Game15(){

  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userDai, setUserDai] = useState("");
  const [userHaiku, setUserHaiku] = useState("");
  const [enterHaiku, setEnterHaiku] = useState("");
  const [done, setDone] = useState("")

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        //ユーザが存在する場合
        setUser(currentUser);
        setLoading(false);
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
  const dai1 = useLocation().state.dai1;
  const dai2 = useLocation().state.dai2;
  const dai3 = useLocation().state.dai3;
  const dai4 = useLocation().state.dai4;
  const dai5 = useLocation().state.dai5;

  const setUp = async() => {
    //現在の番号を計算（+1する）
    if(myIndex === userCount){
      await setCurrentIndex(1);
    } else {
      await setCurrentIndex(myIndex + 1);
    }

    const haikuRef = await doc(db, invitationID, 'Haiku');
    await getDoc(haikuRef).then((snap) => {
      setUserHaiku(snap.data());
    });

    const daiRef = await doc(db, invitationID, 'Dai');
    await getDoc(daiRef).then((snap) => {
      setUserDai(snap.data());
    });
  }
  
  //リアルタイムで決定数を取得
  useEffect(() => {
    const userDocumentRef = doc(db, invitationID, 'Done');
    const unsub = onSnapshot(userDocumentRef, (documentSnapshot) => {
      setDone(documentSnapshot.data())
    });
    return unsub;
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    const doneTemp = done.done
    //全員が決定したら遷移

    //ページごとに変える
    if(doneTemp === userCount * 15){
      navigate("/Game16", {state: {id: invitationID, index: currentIndex, count: userCount, dai1: dai1, dai2: dai2, dai3: dai3, dai4: dai4, dai5: dai5}});        
    }
  }, [done]);

  const setHaiku = async() =>{
    const index = currentIndex;
    const haiku = userHaiku[index] + enterHaiku;
    
    if(index === 1){
      await updateDoc(doc(db, invitationID, 'Haiku'), {
        1: haiku
      });
    } else if(index === 2) {
      await updateDoc(doc(db, invitationID, 'Haiku'), {
        2: haiku
      });
    } else if(index === 3) {
      await updateDoc(doc(db, invitationID, 'Haiku'), {
        3: haiku
      });
    } else if(index === 4) {
      await updateDoc(doc(db, invitationID, 'Haiku'), {
        4: haiku
      });
    } else if(index === 5) {
      await updateDoc(doc(db, invitationID, 'Haiku'), {
        5: haiku
      });
    }

    const doneTemp = done.done + 1
    await updateDoc(doc(db, invitationID, 'Done'), {
      done: doneTemp
    });
  }

  return(
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
              <div className="haiku">
                {/* ページごとに変える */}
                <h2>15文字目</h2>
                <p>ひらがなを入力してください（1文字）</p>
                <input type="text" pattern="[\u3041-\u3096]*" onChange={(e) => setEnterHaiku(e.target.value)} maxLength={1} />
                <button onClick={setHaiku}>決定</button>
                <p>お題：{userDai[currentIndex]}</p>
                <h2>俳句</h2>
                {userHaiku
                ?
                (
                  <>
                  <h2>{(userHaiku[currentIndex]).substring(0, 5)}</h2>
                  <h2>{(userHaiku[currentIndex]).substring(5, 12)}</h2>
                  <h2>{(userHaiku[currentIndex]).substring(12, 17)}</h2>
                  </>
                )
                :
                (
                  <>
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