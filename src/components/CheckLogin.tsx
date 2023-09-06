import { auth, db } from "@/config/firebase";
import { GoogleAuthProvider, Unsubscribe, User, UserMetadata, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
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

// 更新 name 欄位
export const updateNameField = async (userDoc: any, name: string) => {
  const docRef = doc(db, 'user', userDoc.id);

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
export const updateEmailField = async (userDoc: any, email: string) => {
  const docRef = doc(db, 'user', userDoc.id);

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
export const updatePhotoURLField = async (userDoc: any, photoURL: string) => {
  const docRef = doc(db, 'user', userDoc.id);

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
export const updateBgPhotoURLField = async (userDoc: any, bgPhotoURL: string) => {
  const docRef = doc(db, 'user', userDoc.id);

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
export const updateEmailVerifiedField = async (userDoc: any, emailVerified: boolean) => {
  const docRef = doc(db, 'user', userDoc.id);

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
export const updatePhoneNumberField = async (userDoc: any, phoneNumber: string) => {
  const docRef = doc(db, 'user', userDoc.id);

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
export const updateMetadataField = async (userDoc: any, metadata: UserMetadata) => {
  const docRef = doc(db, 'user', userDoc.id);

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
export const handleNameField = async (userDoc: any, name: string) => {
  const docRef = doc(db, 'user', userDoc.id);

  // 如果 firestore 沒有 name 欄位，就加入
  if (!userDoc.data().name) {
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
export const handleEmailField = async (userDoc: any, email: string) => {
  const docRef = doc(db, 'user', userDoc.id);

  // 如果 firestore 沒有 email 欄位，就加入
  if (!userDoc.data().email) {
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
export const handlePhotoURLField = async (userDoc: any, photoURL: string) => {
  const docRef = doc(db, 'user', userDoc.id);

  // 如果 firestore 沒有 photoURL 欄位，就加入
  if (!userDoc.data().photoURL) {
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
export const handleBgPhotoURLField = async (userDoc: any) => {
  const docRef = doc(db, 'user', userDoc.id);

  // 如果 firestore 沒有 bgPhotoURL 欄位，就加入
  if (!userDoc.data().bgPhotoURL) {
    // 加入 bgPhotoURL 到 doc
    await updateDoc(docRef, {
      bgPhotoURL: ''
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
export const handleEmailVerifiedField = async (userDoc: any, emailVerified: boolean) => {
  const docRef = doc(db, 'user', userDoc.id);

  // 如果 firestore 沒有 emailVerified 欄位，就加入
  if (!userDoc.data().emailVerified) {
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
export const handlePhoneNumberField = async (userDoc: any, phoneNumber: string) => {
  const docRef = doc(db, 'user', userDoc.id);

  // 如果 firestore 沒有 phoneNumber 欄位，就加入
  if (!userDoc.data().phoneNumber) {
    // 加入 phoneNumber 到 doc
    await updateDoc(docRef, {
      phoneNumber: phoneNumber
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
export const handleMetadataField = async (userDoc: any, metadata: UserMetadata) => {
  const docRef = doc(db, 'user', userDoc.id);

  // 如果 firestore 沒有 metadata 欄位，就加入
  if (!userDoc.data().metadata) {
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
    handleNameField(userQuerySnapshot.docs[0], user.displayName);
  }

  // 單獨處理 email
  if (user.email) {
    handleEmailField(userQuerySnapshot.docs[0], user.email);
  }

  // 單獨處理 photoURL
  if (user.photoURL) {
    handlePhotoURLField(userQuerySnapshot.docs[0], user.photoURL);
  }

  // 單獨處理 bgPhotoURL
  if (user.photoURL) {
    handleBgPhotoURLField(userQuerySnapshot.docs[0]);
  }

  // 單獨處理 metadata
  if (user.metadata) {
    handleMetadataField(userQuerySnapshot.docs[0], user.metadata);
  }

  // 單獨處理 emailVerified
  if (user.emailVerified) {
    handleEmailVerifiedField(userQuerySnapshot.docs[0], user.emailVerified);
  }

  // 單獨處理 phoneNumber
  if (user.phoneNumber) {
    handlePhoneNumberField(userQuerySnapshot.docs[0], user.phoneNumber);
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
