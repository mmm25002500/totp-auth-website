import { getDocs, collection, query, where, updateDoc, deleteDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { UserData } from '@/types/userData';
import { onAuthStateChanged, User, Unsubscribe } from 'firebase/auth';

// Check user data
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

// add TOTP item
export const addTotp = async (uid: string, totp: { name: string; secret: string; category: string }): Promise<{ success: boolean; message?: string }> => {
  try {
    // 使用 where 查找 user 文檔
    const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
    const userQuerySnapshot = await getDocs(userQuery);

    if (!userQuerySnapshot.empty) {
      // 找到匹配的 Doc
      const docRef = userQuerySnapshot.docs[0].ref;

      // 更新 Doc 來添加新的 TOTP
      await updateDoc(docRef, {
        totp: arrayUnion(totp),
      });

      return { success: true };
    } else {
      return { success: false, message: '未找到匹配 UID 的文檔' };
    }
  } catch (error: any) {
    return { success: false, message: error.message };
  }
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