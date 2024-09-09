import { getDocs, collection, query, where, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { UserData } from '@/types/userData';
import { onAuthStateChanged, User, Unsubscribe } from 'firebase/auth';

// 驗證是否登入並載入使用者資料
export const checkAuth = (callback: (user: User | undefined, userData?: UserData) => void): Unsubscribe => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userRef = collection(db, 'user');
        const q = query(userRef, where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data() as UserData;
          callback(user, data);  // 回調帶回使用者及資料
        } else {
          callback(user);  // 回調帶回使用者，無資料
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        callback(user);  // 只回傳使用者，沒有資料
      }
    } else {
      callback(undefined);  // 沒有登入
    }
  });
};

// Delete user code data
export const deleteUserCode = async (uid: string) => {
  try {
    const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
    const userQuerySnapshot = await getDocs(userQuery);

    if (!userQuerySnapshot.empty) {
      const userDoc = userQuerySnapshot.docs[0];
      const userDocRef = userDoc.ref;
      await deleteDoc(userDocRef);
      return { success: true };
    } else {
      return { success: false, message: '找不到驗證碼資料' };
    }
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const loadUserData = async (uid: string) => {
  try {
    const userRef = collection(db, 'user');
    const q = query(userRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      
      // 顯式斷言為 userData 類型
      return { success: true, data: data as UserData };
    } else {
      return { success: false, message: '找不到使用者資料' };
    }
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// Delete TOTP item
export const deleteTotpItem = async (uid: string, totpCode: string) => {
  try {
    const userRef = collection(db, 'user');
    const q = query(userRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      const userData = querySnapshot.docs[0].data();
      const newTotpArray = (userData.totp || []).filter((item: { secret: string; }) => item.secret !== totpCode);

      await updateDoc(docRef, { totp: newTotpArray });
      return { success: true };
    } else {
      return { success: false, message: '找不到 TOTP 項目' };
    }
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// Clear TOTP items
export const clearTotpItems = async (uid: string) => {
  try {
    const userRef = collection(db, 'user');
    const q = query(userRef, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      await updateDoc(userDoc.ref, { totp: [] });
      return { success: true };
    } else {
      return { success: false, message: '找不到驗證碼' };
    }
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// check if the input is a base32 string
export const isBase32 = (input: string) => {
  const regex = /^[A-Z2-7]+=*$/
  return regex.test(input)
}