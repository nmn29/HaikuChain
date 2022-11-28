import { useState, useEffect } from 'react';
import { db, auth } from './firebase/firebase.js';
import { collection, query, doc, setDoc, getCountFromServer, Timestamp} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import './Top.css';


export default function Top() {

  const [ID, setID] = useState("");
  const [IDTemp, setIDTemp] = useState(ID);
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

      //名前の格納（空欄であればデフォルトの名前）
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
        name: addName,
        timestamp: Timestamp.fromDate(new Date())
      });

      //ロビーに遷移し、招待コードを送信する
      await navigate("/lobby", {state: {id: docUid}});
      
    } catch (error) {
      alert("セッションの更新が必要です");
      console.log(error)
    }
  };

  //部屋に入る
  const enterLobby = async (event) => {
    event.preventDefault();

    try{  
      //招待コードを格納
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

      //部屋の人数が10人以上であれば認証しない
      if(totalCount <= 9){    
        await signInAnonymously(auth);
        const uidTemp = auth.currentUser.uid;

        setDoc(doc(db, invitationIDTemp, uidTemp), {
          name: addName,
          timestamp: Timestamp.fromDate(new Date())
        });
        //ロビーに遷移し、招待コードを送信する
        await navigate("/lobby", {state: {id: invitationIDTemp}});
      
      } else {
        alert("人数オーバーです")
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


