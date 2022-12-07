import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged } from "firebase/auth";
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';


export default function Start() {

  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [userDai, setUserDai] = useState("")
  const [daiList, setDaiList] = useState({})

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
  useEffect(() => {
    const userDocumentRef = doc(db, invitationID, 'Dai');
    const unsub = onSnapshot(userDocumentRef, (documentSnapshot) => {
      setDaiList(documentSnapshot.data())
    });
    return unsub;
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    //daiListの長さから完了ユーザ数を取得
    const done = Object.keys(daiList).length
    console.log(userCount)

    //全員が決定したら遷移
    if(done === userCount){
      navigate("/Game1", {state: {id: invitationID, index: myIndex, count: userCount}});
    }
  }, [daiList]);

  const daiDone = async () =>{

    const dai = userDai;
    const index = myIndex;
    
    if(index === 1){
      await updateDoc(doc(db, invitationID, 'Dai'), {
        1: dai
      });
    } else if(index === 2) {
      await updateDoc(doc(db, invitationID, 'Dai'), {
        2: dai
      });
    } else if(index === 3) {
      await updateDoc(doc(db, invitationID, 'Dai'), {
        3: dai
      });
    } else if(index === 4) {
      await updateDoc(doc(db, invitationID, 'Dai'), {
        4: dai
      });
    } else if(index === 5) {
      await updateDoc(doc(db, invitationID, 'Dai'), {
        5: dai
      });
      
    } 
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
              <div className="odai">
                <p>お題を入力しよう</p>
                <input type="text" onChange={(e) => setUserDai(e.target.value)} maxLength={16} />
                <button onClick={daiDone}>決定</button>
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