import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged } from "firebase/auth";
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { doc, getDoc, onSnapshot, updateDoc, increment } from 'firebase/firestore';

export default function Game1(){

  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userDai, setUserDai] = useState([]);
  const [enterHaiku, setEnterHaiku] = useState("");
  const [done, setDone] = useState("")

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

  //招待ID、自身の番号、人数、ホストをルータから取得
  const invitationID = useLocation().state.id;
  const myIndex = useLocation().state.index;
  const userCount = useLocation().state.count;

  const setUp = async() => {
    //現在の番号を計算（+1する）
    if(myIndex === userCount){
      await setCurrentIndex(1);
    } else {
      await setCurrentIndex(myIndex + 1);
    }

    for(let i = 1; i <= userCount; i++){
      const docTemp = await "Dai" + i
      const daiRef = await doc(db, invitationID, docTemp);
      await getDoc(daiRef).then((snap) => {
        setUserDai([...userDai, snap.data()[i]])
      });
    }

    await setLoading(false);
  }

  console.log(userCount)
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
    if(doneTemp === userCount){
      navigate("/Game2", {state: {id: invitationID, index: myIndex, count: userCount, dai1: userDai[1], dai2: userDai[2], dai3: userDai[3], dai4: userDai[4], dai5: userDai[5]}});     
    }
  }, [done]);

  const setHaiku = async() =>{
    const index = currentIndex;
    const haiku = enterHaiku;
    
    if(index === 1){
      updateDoc(doc(db, invitationID, 'Haiku1'), {
        1: haiku
      });
    } else if(index === 2) {
      updateDoc(doc(db, invitationID, 'Haiku2'), {
        2: haiku
      });
    } else if(index === 3) {
      updateDoc(doc(db, invitationID, 'Haiku3'), {
        3: haiku
      });
    } else if(index === 4) {
      updateDoc(doc(db, invitationID, 'Haiku4'), {
        4: haiku
      });
    } else if(index === 5) {
      updateDoc(doc(db, invitationID, 'Haiku5'), {
        5: haiku
      });
    }

    await updateDoc(doc(db, invitationID, 'doneHaiku'), {
      done: increment(1)
    });

  }

  console.log(userDai)
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
                <h2>1文字目</h2>
                <p>ひらがなを入力してください（1文字）</p>
                <input type="text" pattern="[\u3041-\u3096]*" onChange={(e) => setEnterHaiku(e.target.value)} maxLength={1} />
                <button onClick={setHaiku}>決定</button>
                {userDai[currentIndex-1]
                ?
                (
                  <p>お題：{userDai[currentIndex-1]}</p>
                )
                :
                (
                  <>
                  <p>お題：</p>
                  </>
                )
                }
                <h2>俳句</h2>
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