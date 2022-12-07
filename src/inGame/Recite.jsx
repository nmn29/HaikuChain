import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc, onSnapshot, updateDoc } from 'firebase/firestore';

export default function Recite() {

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

  const setUp = async () => {

    const haikuRef = await doc(db, invitationID, 'Haiku');
    await getDoc(haikuRef).then((snap) => {
      setUserHaiku(snap.data());
    });

    const daiRef = await doc(db, invitationID, 'Dai');
    await getDoc(daiRef).then((snap) => {
      setUserDai(snap.data());
    });
  }

  const navigate = useNavigate();
  const logout = async () => {
    const userDeleteDocumentRef = doc(db, invitationID, user.uid);
    await deleteDoc(userDeleteDocumentRef);
    await signOut(auth);
    await navigate("/");
  }

  const setHaiku = async () => {
    const index = currentIndex;
    const haiku = userHaiku[index] + enterHaiku;

    if (index === 1) {
      await updateDoc(doc(db, invitationID, 'Haiku'), {
        1: haiku
      });
    } else if (index === 2) {
      await updateDoc(doc(db, invitationID, 'Haiku'), {
        2: haiku
      });
    } else if (index === 3) {
      await updateDoc(doc(db, invitationID, 'Haiku'), {
        3: haiku
      });
    } else if (index === 4) {
      await updateDoc(doc(db, invitationID, 'Haiku'), {
        4: haiku
      });
    } else if (index === 5) {
      await updateDoc(doc(db, invitationID, 'Haiku'), {
        5: haiku
      });
    }

    const doneTemp = done.done + 1
    await updateDoc(doc(db, invitationID, 'Done'), {
      done: doneTemp
    });
  }
  console.log(userHaiku)
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
                <div className="recite">
                  {/* ページごとに変える */}
                  {userHaiku[1]
                    ?
                    (
                      <>
                        <p>お題：{userDai[1]}</p>
                        <h2>{(userHaiku[1]).substring(0, 5)}</h2>
                        <h2>{(userHaiku[1]).substring(5, 12)}</h2>
                        <h2>{(userHaiku[1]).substring(12, 17)}</h2>
                      </>
                    )
                    :
                    (
                      <>
                      </>
                    )
                  }
                  {userHaiku[2]
                    ?
                    (
                      <>
                        <p>お題：{userDai[2]}</p>
                        <h2>{(userHaiku[2]).substring(0, 5)}</h2>
                        <h2>{(userHaiku[2]).substring(5, 12)}</h2>
                        <h2>{(userHaiku[2]).substring(12, 17)}</h2>
                      </>
                    )
                    :
                    (
                      <>
                      </>
                    )
                  }
                  {userHaiku[3]
                    ?
                    (
                      <>
                        <p>お題：{userDai[3]}</p>
                        <h2>{(userHaiku[3]).substring(0, 5)}</h2>
                        <h2>{(userHaiku[3]).substring(5, 12)}</h2>
                        <h2>{(userHaiku[3]).substring(12, 17)}</h2>
                      </>
                    )
                    :
                    (
                      <>
                      </>
                    )
                  }
                  {userHaiku[4]
                    ?
                    (
                      <>
                        <p>お題：{userDai[4]}</p>
                        <h2>{(userHaiku[4]).substring(0, 5)}</h2>
                        <h2>{(userHaiku[4]).substring(5, 12)}</h2>
                        <h2>{(userHaiku[4]).substring(12, 17)}</h2>
                      </>
                    )
                    :
                    (
                      <>
                      </>
                    )
                  }
                  {userHaiku[5]
                    ?
                    (
                      <>
                        <p>お題：{userDai[5]}</p>
                        <h2>{(userHaiku[5]).substring(0, 5)}</h2>
                        <h2>{(userHaiku[5]).substring(5, 12)}</h2>
                        <h2>{(userHaiku[5]).substring(12, 17)}</h2>
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