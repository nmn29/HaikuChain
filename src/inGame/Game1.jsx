import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged } from "firebase/auth";
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { doc, getDoc, onSnapshot, setDoc, updateDoc, increment } from 'firebase/firestore';

export default function Game1(){

  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0)
  const [enterHaiku, setEnterHaiku] = useState("");
  const [done, setDone] = useState("")
  const [userDai, setUserDai] = useState([])

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
    if (myIndex === userCount) {
      setCurrentIndex(1);
    } else {
      setCurrentIndex(myIndex + 1);
    }

    //お題を配列に追加する
    for(let i = 1; i <= userCount; i++){
      console.log(i)
      await pushDai(i)
    }

    await setLoading(false);
  }

  const pushDai = async(index) =>{
    const docTemp = await "Dai" + index
    await console.log(docTemp)
    const daiRef = await doc(db, invitationID, docTemp);
    await getDoc(daiRef).then((snap) => {
      setUserDai((userDai) => [...userDai, snap.data().dai]);
    });
  }

  console.log(userDai)

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
      navigate("/Game2", {state: {id: invitationID, index: myIndex, count: userCount, dai1: userDai[0], dai2: userDai[1], dai3: userDai[2], dai4: userDai[3], dai5: userDai[4]}});     
    }
  }, [done]);

  const setHaiku = async() =>{
    const index = currentIndex;
    const haiku = enterHaiku;
    
    if(index === 1){
      setDoc(doc(db, invitationID, 'Haiku1'), {
        1: haiku
      });
    } else if(index === 2) {
      setDoc(doc(db, invitationID, 'Haiku2'), {
        2: haiku
      });
    } else if(index === 3) {
      setDoc(doc(db, invitationID, 'Haiku3'), {
        3: haiku
      });
    } else if(index === 4) {
      setDoc(doc(db, invitationID, 'Haiku4'), {
        4: haiku
      });
    } else if(index === 5) {
      setDoc(doc(db, invitationID, 'Haiku5'), {
        5: haiku
      });
    }

    await updateDoc(doc(db, invitationID, 'doneHaiku'), {
      done: increment(1)
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