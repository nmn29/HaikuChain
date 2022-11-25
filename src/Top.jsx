import { useState, useEffect } from 'react';
import { db, auth } from './firebase/firebase.js';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import './Top.css';


export default function Top() {

  const [ID, setID] = useState("");
  const [IDTemp, setIDTemp] = useState(ID);

  const [haikuDBList, setHaikuDBList] = useState([]);
  const [invitationID, setInvitationID] = useState("");

  //ランダムIDの生成
  useEffect(() => {
    const randomID = "ユーザ" + Math.floor(Math.random() * (100000 - 10000) + 10000);
    setID(randomID);
    setIDTemp(randomID);
  }, []);

  const navigate = useNavigate();

  //部屋を作る
  const loginLobby = async (event) => {
    event.preventDefault();

    try {
      await signInAnonymously(auth);

      let addName = IDTemp;
      if (ID !== "") {
        addName = ID;
      }

      const uidTemp = auth.currentUser.uid;
      //uidの最初の8文字を取得
      const get8String = uidTemp.slice( 0, 8 );
      //取得した8文字のuidを大文字に変換
      const docUid = get8String.toUpperCase();

      await setDoc(doc(db, docUid, uidTemp), {
        host_name: addName,
      });

      await navigate("/lobby");
      
    } catch (error) {
      alert("セッションの更新が必要です");
    }
  };

  //部屋に入る
  const enterLobby = async (event) => {
    event.preventDefault();

    try{   
      const invitationIDTemp = invitationID;
      const userDocumentRef = doc(db, 'haikuDB', invitationIDTemp);

      let numberTemp = 0
      let userTemp = ""

      let addName = IDTemp;
      if (ID !== "") {
        addName = ID;
      }

      await getDoc(userDocumentRef).then((documentSnapshot) => {
        numberTemp = documentSnapshot.data().number
      });

      await signInAnonymously(auth);
      const uidTemp = auth.currentUser.uid;
      
      if(numberTemp === 1){

        console.log("あああ" + userTemp)

        await updateDoc(doc(db, "haikuDB", invitationID), {
          user2_ID: uidTemp,
          user2_name: addName,
          number:2,
        });
        await navigate("/lobby");

      } else if(numberTemp === 2){
        await updateDoc(doc(db, "haikuDB", invitationID), {
          user3_ID: uidTemp,
          user3_name: addName,
          number:3,
        });
        await navigate("/lobby");

      } else if(numberTemp === 3){
        await updateDoc(doc(db, "haikuDB", invitationID), {
          user4_ID: uidTemp,
          user4_name: addName,
          number:4,
        });
        await navigate("/lobby");

      } else if(numberTemp === 4){
        await updateDoc(doc(db, "haikuDB", invitationID), {
          user5_ID: uidTemp,
          user5_name: addName,
          number:5,
        });
        await navigate("/lobby");

      } else if(numberTemp === 5){
        await updateDoc(doc(db, "haikuDB", invitationID), {
          user6_ID: uidTemp,
          user6_name: addName,
          number:6,
        });
        await navigate("/lobby");

      } else if(numberTemp === 6){
        await updateDoc(doc(db, "haikuDB", invitationID), {
          user7_ID: uidTemp,
          user7_name: addName,
          number:7,
        });
        await navigate("/lobby");

      } else if(numberTemp === 7){
        await updateDoc(doc(db, "haikuDB", invitationID), {
          user8_ID: uidTemp,
          user8_name: addName,
          number:8,
        });
        await navigate("/lobby");

      } else if(numberTemp === 8){
        await updateDoc(doc(db, "haikuDB", invitationID), {
          user9_ID: uidTemp,
          user9_name: addName,
          number:9,
        });
        await navigate("/lobby");

      } else if(numberTemp === 9){
        await updateDoc(doc(db, "haikuDB", invitationID), {
          user10_ID: uidTemp,
          user10_name: addName,
          number:10,
        });
        await navigate("/lobby");

      } else {
        alert("人数オーバーです");
      }

    } catch (error) {
      alert("招待コードが違います");
      console.log(error)
    }
  };


  return (
    <>
      <div className="App">
        <h1>俳句チェイン</h1>
        <input type="text" placeholder={ID}
          onChange={(e) => setID(e.target.value)} maxLength={16} />
        <button onClick={(e) => loginLobby(e)}>部屋を作る</button>
        <p>
        <input type="text" onChange={(e) => setInvitationID(e.target.value)} maxLength={8} />
        <button onClick={(e) => enterLobby(e)}>部屋に入る</button>
        </p>
      </div>
    </>
  );
}


