import { initializeApp } from "firebase/app";
import {
  getFirestore,
  getDocs,
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  startAfter,
  getDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACSfDmK993dHOCxSSoSphBOb2V-7c1-R4",
  authDomain: "mbti-project-2e81f.firebaseapp.com",
  projectId: "mbti-project-2e81f",
  storageBucket: "mbti-project-2e81f.appspot.com",
  messagingSenderId: "728122301056",
  appId: "1:728122301056:web:4bb857b82d9fb75e252465",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getAllDatas(collectionName, order) {
  const collect = collection(db, collectionName);
  const q = query(collect, orderBy(order, "desc"));
  const querySnapshot = await getDocs(q);
  const resultData = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    docId: doc.id,
  }));
  return resultData;
  // debugger를 사용하면 console에서 미리 코드를 작성하며 확인해볼 수 있음
  // debugger는 실제로 실무에서 많이 쓰임
  //   debugger;
}

export { getAllDatas };
