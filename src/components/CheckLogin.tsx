import { auth, db } from "@/config/firebase";
import { GoogleAuthProvider, Unsubscribe, User, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { toast } from 'react-hot-toast';

// 查看是否有 user 文檔，沒有的話就建立一個
const handleUser = async (user: User) => {
  const uid = user.uid;

  // 查詢 user 文檔，以 uid 為條件
  const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
  const userQuerySnapshot = await getDocs(userQuery);

  if (userQuerySnapshot.empty) {
    // 如果沒有 user 文檔，就建立一個
    const newUserData = {
      uid: uid,
      totp: []
    };
    
    try {
      const userRef = collection(db, 'user');
      await addDoc(userRef, newUserData);
      toast.success('建立使用者成功！', {
        position: "top-right"
      });
    } catch (error) {
      console.error('Error creating user document:', error);
      toast.success(`建立使用者失敗！\n錯誤訊息：\n${error}`, {
        position: "top-right"
      });
    }
  } else {
    toast.success('使用者載入成功！', {
      position: "top-right"
    });
  }
};

// 登入，會跳出 Google 登入視窗
export const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // 登入成功的處理

    toast.success('登入成功！', {
      position: "top-right"
    });

    handleUser(result.user as User);

    return result.user as User;
  } catch (error) {
    // 登入失敗的處理
    console.error('Google 登入錯誤:', error);

    toast.error(`登入失敗！\n失敗原因:\n${error}`, {
      position: "top-right"
    });

    return error;
  }
};

// 檢查登入
export const checkAuth = (): Unsubscribe => onAuthStateChanged(auth, (user) => {
  if (user) {
    // if user logged in, set loading to false and navigate to home page
    console.log('User is logged in');
  } else {
    // if user not logged in, set loading to false and navigate to login page
    console.log('User is not logged in');
  }
});
