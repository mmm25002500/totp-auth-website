import { auth, db } from "@/config/firebase";
import { GoogleAuthProvider, Unsubscribe, User, UserMetadata, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { toast } from 'react-hot-toast';

// 定義使用者資料格式
export interface UserData {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  bgPhotoURL: string;
  emailVerified: boolean;
  phoneNumber: string;
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
  totp: any[];
}

// 同步 Google 使用者資料 至 firestore
export const syncGoogleUserData = async (user: User) => {
  const uid = user.uid;

  // 查詢 user 文檔，以 uid 為條件
  const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
  const userQuerySnapshot = await getDocs(userQuery);

  // 如果有 user 文檔，就更新
  if (!userQuerySnapshot.empty) {
    // 更新 user 文檔
    await updateDoc(userQuerySnapshot.docs[0].ref, {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber,
      metadata: {
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime
      },
      uid: user.uid,
      totp: userQuerySnapshot.docs[0].data().totp
    }).then(() => {
      toast.success('更新使用者資料成功！', {
        position: "top-right"
      });
    }).catch((error) => {
      toast.success(`更新使用者資料失敗！\n錯誤訊息：\n${error}`, {
        position: "top-right"
      });
    });
  }
}

// 刪除帳戶
export const deleteAccount = async (user: User) => { 
  
  try {
    const q = query(collection(db, 'user'), where('uid', '==', user?.uid));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      const docRef = doc.ref;

      // 删除 Doc
      await deleteDoc(docRef);
    });

    toast.success("刪除成功！", {
      position: "top-right"
    });
  } catch (error) {
    toast.error(`刪除失敗！\n錯誤訊息：\n${error}`, {
      position: "top-right"
    });
  }
    
  // 刪除帳戶
  auth.currentUser?.delete().then(() => {
    toast.success("刪除成功！", {
      position: "top-right" 
    });
  }).catch((error) => {
    toast.error(`刪除失敗！\n錯誤訊息：\n${error}`, {
      position: "top-right"
    });
  });
}

// 更新 name 欄位
export const updateNameField = async (user: User, name: string) => {
  const uid = user.uid;

  // 查詢 user 文檔，以 uid 為條件
  const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
  const userDoc = await getDocs(userQuery);
  const docRef = doc(db, 'user', userDoc.docs[0].id);

  // 更新 name 到 doc
  await updateDoc(docRef, {
    name: name
  }).then(() => {
    toast.success('更新使用者名稱成功！', {
      position: "top-right"
    });
  }).catch((error) => {
    toast.success(`更新使用者名稱失敗！\n錯誤訊息：\n${error}`, {
      position: "top-right"
    });
  });
};

// 更新 email 欄位
export const updateEmailField = async (user: User, email: string) => {
  const uid = user.uid;

  // 查詢 user 文檔，以 uid 為條件
  const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
  const userDoc = await getDocs(userQuery);
  const docRef = doc(db, 'user', userDoc.docs[0].id);

  // 更新 email 到 doc
  await updateDoc(docRef, {
    email: email
  }).then(() => {
    toast.success('更新使用者電子郵件成功！', {
      position: "top-right"
    });
  }).catch((error) => {
    toast.success(`更新使用者電子郵件失敗！\n錯誤訊息：\n${error}`, {
      position: "top-right"
    });
  });
};

// 更新 photoURL 欄位
export const updatePhotoURLField = async (user: User, photoURL: string) => {
  const uid = user.uid;

  // 查詢 user 文檔，以 uid 為條件
  const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
  const userDoc = await getDocs(userQuery);
  const docRef = doc(db, 'user', userDoc.docs[0].id);

  // 更新 photoURL 到 doc
  await updateDoc(docRef, {
    photoURL: photoURL
  }).then(() => {
    toast.success('更新使用者頭像成功！', {
      position: "top-right"
    });
  }).catch((error) => {
    toast.success(`更新使用者頭像失敗！\n錯誤訊息：\n${error}`, {
      position: "top-right"
    });
  });
}

// 更新 bgPhotoURL 欄位
export const updateBgPhotoURLField = async (user: User, bgPhotoURL: string) => {
  const uid = user.uid;

  // 查詢 user 文檔，以 uid 為條件
  const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
  const userDoc = await getDocs(userQuery);
  const docRef = doc(db, 'user', userDoc.docs[0].id);

  // 更新 bgPhotoURL 到 doc
  await updateDoc(docRef, {
    bgPhotoURL: bgPhotoURL
  }).then(() => {
    toast.success('更新使用者背景圖片成功！', {
      position: "top-right"
    });
  }).catch((error) => {
    toast.success(`更新使用者背景圖片失敗！\n錯誤訊息：\n${error}`, {
      position: "top-right"
    });
  });
}

// 更新 emailVerified 欄位
export const updateEmailVerifiedField = async (user: User, emailVerified: boolean) => {
  const uid = user.uid;

  // 查詢 user 文檔，以 uid 為條件
  const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
  const userDoc = await getDocs(userQuery);
  const docRef = doc(db, 'user', userDoc.docs[0].id);

  // 更新 emailVerified 到 doc
  await updateDoc(docRef, {
    emailVerified: emailVerified
  }).then(() => {
    toast.success('更新使用者電子郵件驗證成功！', {
      position: "top-right"
    });
  }).catch((error) => {
    toast.success(`更新使用者電子郵件驗證失敗！\n錯誤訊息：\n${error}`, {
      position: "top-right"
    });
  });
}

// 更新 phoneNumber 欄位
export const updatePhoneNumberField = async (user: User, phoneNumber: string) => {
  const uid = user.uid;

  // 查詢 user 文檔，以 uid 為條件
  const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
  const userDoc = await getDocs(userQuery);
  const docRef = doc(db, 'user', userDoc.docs[0].id);

  // 更新 phoneNumber 到 doc
  await updateDoc(docRef, {
    phoneNumber: phoneNumber
  }).then(() => {
    toast.success('更新使用者電話號碼成功！', {
      position: "top-right"
    });
  }).catch((error) => {
    toast.success(`更新使用者電話號碼失敗！\n錯誤訊息：\n${error}`, {
      position: "top-right"
    });
  });
}

// 更新 metadata 欄位
export const updateMetadataField = async (user: User, metadata: UserMetadata) => {
  const uid = user.uid;

  // 查詢 user 文檔，以 uid 為條件
  const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
  const userDoc = await getDocs(userQuery);
  const docRef = doc(db, 'user', userDoc.docs[0].id);

  // 更新 metadata 到 doc
  await updateDoc(docRef, {
    metadata: {
      creationTime: metadata.creationTime,
      lastSignInTime: metadata.lastSignInTime
    }
  }).then(() => {
    toast.success('更新使用者 metadata 成功！', {
      position: "top-right"
    });
  }).catch((error) => {
    toast.success(`更新使用者 metadata 失敗！\n錯誤訊息：\n${error}`, {
      position: "top-right"
    });
  });
}

// 建立 name 欄位
export const handleNameField = async (user: User, name: string) => {
  const uid = user.uid;

  // 查詢 user 文檔，以 uid 為條件
  const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
  const userDoc = await getDocs(userQuery);
  const docRef = doc(db, 'user', userDoc.docs[0].id);

  // 如果 firestore 沒有 name 欄位，就加入
  if (!userDoc.docs[0].data().name) {
    // 加入 name 到 doc
    await updateDoc(docRef, {
      name: name
    }).then(() => {
      toast.success('建立使用者名稱成功！', {
        position: "top-right"
      });
    }).catch((error) => {
      toast.success(`建立使用者名稱失敗！\n錯誤訊息：\n${error}`, {
        position: "top-right"
      });
    });
  }
};

// 建立 email 欄位
export const handleEmailField = async (user: User, email: string) => {
  const uid = user.uid;

  // 查詢 user 文檔，以 uid 為條件
  const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
  const userDoc = await getDocs(userQuery);
  const docRef = doc(db, 'user', userDoc.docs[0].id);

  // 如果 firestore 沒有 email 欄位，就加入
  if (!userDoc.docs[0].data().email) {
    // 加入 email 到 doc
    await updateDoc(docRef, {
      email: email
    }).then(() => {
      toast.success('建立使用者電子郵件成功！', {
        position: "top-right"
      });
    }).catch((error) => {
      toast.success(`建立使用者電子郵件失敗！\n錯誤訊息：\n${error}`, {
        position: "top-right"
      });
    });
  }
};

// 建立 photoURL 欄位
export const handlePhotoURLField = async (user: User, photoURL: string) => {
  const uid = user.uid;

  // 查詢 user 文檔，以 uid 為條件
  const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
  const userDoc = await getDocs(userQuery);
  const docRef = doc(db, 'user', userDoc.docs[0].id);

  // 如果 firestore 沒有 photoURL 欄位，就加入
  if (!userDoc.docs[0].data().photoURL) {
    // 加入 photoURL 到 doc
    await updateDoc(docRef, {
      photoURL: photoURL
    }).then(() => {
      toast.success('建立使用者頭像成功！', {
        position: "top-right"
      });
    }).catch((error) => {
      toast.success(`建立使用者頭像失敗！\n錯誤訊息：\n${error}`, {
        position: "top-right"
      });
    });
  }
}

// 建立 bgPhotoURL 欄位
export const handleBgPhotoURLField = async (user: User) => {
  const uid = user.uid;

  // 查詢 user 文檔，以 uid 為條件
  const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
  const userDoc = await getDocs(userQuery);
  const docRef = doc(db, 'user', userDoc.docs[0].id);

  // 如果 firestore 沒有 bgPhotoURL 欄位，就加入
  if (!userDoc.docs[0].data().bgPhotoURL) {
    // 加入 bgPhotoURL 到 doc
    await updateDoc(docRef, {
      bgPhotoURL: 'https://img.freepik.com/free-photo/abstract-luxury-plain-blur-grey-black-gradient-used-as-background-studio-wall-display-your-products_1258-63747.jpg?w=2000'
    }).then(() => {
      toast.success('建立使用者背景圖片成功！', {
        position: "top-right"
      });
    }).catch((error) => {
      toast.success(`建立使用者背景圖片失敗！\n錯誤訊息：\n${error}`, {
        position: "top-right"
      });
    });
  }
}

// 建立 emailVerified 欄位
export const handleEmailVerifiedField = async (user: User, emailVerified: boolean) => {
  const uid = user.uid;

  // 查詢 user 文檔，以 uid 為條件
  const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
  const userDoc = await getDocs(userQuery);
  const docRef = doc(db, 'user', userDoc.docs[0].id);

  // 如果 firestore 沒有 emailVerified 欄位，就加入
  if (!userDoc.docs[0].data().emailVerified) {
    // 加入 emailVerified 到 doc
    await updateDoc(docRef, {
      emailVerified: emailVerified
    }).then(() => {
      toast.success('建立使用者電子郵件驗證成功！', {
        position: "top-right"
      });
    }).catch((error) => {
      toast.success(`建立使用者電子郵件驗證失敗！\n錯誤訊息：\n${error}`, {
        position: "top-right"
      });
    });
  }
}

// 建立 phoneNumber 欄位
export const handlePhoneNumberField = async (user: User, phoneNumber: string | null) => {
  const uid = user.uid;

  // 查詢 user 文檔，以 uid 為條件
  const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
  const userDoc = await getDocs(userQuery);
  const docRef = doc(db, 'user', userDoc.docs[0].id);

  // 如果 firestore 沒有 phoneNumber 欄位，就加入
  if (!userDoc.docs[0].data().phoneNumber) {
    // 加入 phoneNumber 到 doc
    await updateDoc(docRef, {
      phoneNumber: phoneNumber || ''
    }).then(() => {
      toast.success('建立使用者電話號碼成功！', {
        position: "top-right"
      });
    }).catch((error) => {
      toast.success(`建立使用者電話號碼失敗！\n錯誤訊息：\n${error}`, {
        position: "top-right"
      });
    });
  }
}

// 建立 metadata 欄位
export const handleMetadataField = async (user: User, metadata: UserMetadata) => {
  const uid = user.uid;

  // 查詢 user 文檔，以 uid 為條件
  const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
  const userDoc = await getDocs(userQuery);
  const docRef = doc(db, 'user', userDoc.docs[0].id);

  // 如果 firestore 沒有 metadata 欄位，就加入
  if (!userDoc.docs[0].data().metadata) {
    // 加入 metadata 到 doc
    await updateDoc(docRef, {
      metadata: {
        creationTime: metadata.creationTime,
        lastSignInTime: metadata.lastSignInTime
      }
    }).then(() => {
      toast.success('建立使用者 metadata 成功！', {
        position: "top-right"
      });
    }).catch((error) => {
      toast.success(`建立使用者 metadata 失敗！\n錯誤訊息：\n${error}`, {
        position: "top-right"
      });
    });
  }
}

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
      name: user.displayName,
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
  
  // 單獨處理 name
  if (user.displayName) { 
    handleNameField(user, user.displayName);
  }

  // 單獨處理 email
  if (user.email) {
    handleEmailField(user, user.email);
  }

  // 單獨處理 photoURL
  if (user.photoURL) {
    handlePhotoURLField(user, user.photoURL);
  }

  // 單獨處理 bgPhotoURL
  if (user.photoURL) {
    handleBgPhotoURLField(user);
  }

  // 單獨處理 metadata
  if (user.metadata) {
    handleMetadataField(user, user.metadata);
  }

  // 單獨處理 emailVerified
  if (user.emailVerified) {
    handleEmailVerifiedField(user, user.emailVerified);
  }
  
  // 單獨處理 phoneNumber
  if (user.phoneNumber || user.phoneNumber == null) {
    handlePhoneNumberField(user, user.phoneNumber);
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
