import { UserData } from '@/components/CheckLogin';
import { db, auth } from '@/config/firebase';
import { User, signOut, GoogleAuthProvider, signInWithPopup, UserMetadata, onAuthStateChanged } from 'firebase/auth';
import { Unsubscribe, addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';

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

// login
export const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);

    handleUser(result.user as User);
    // 成功，返回使用者資料
    return { success: true, user: result.user as User };
  } catch (error: any) {
    // 失敗，返回錯誤訊息
    console.error('Google 登入錯誤:', error);
    return { success: false, message: error.message };
  }
};

// logout
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// 從 Firestore 獲取使用者資料
export const getUserData = async (uid: string): Promise<{ success: boolean; data?: UserData; message?: string }> => {
  try {
    const q = query(collection(db, 'user'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data() as UserData;
      return { success: true, data };
    } else {
      return { success: false, message: '找不到使用者資料' };
    }
  } catch (error: any) {
    console.error("Error getting user data:", error);
    return { success: false, message: error.message };
  }
};

// 更新使用者資料
export const submitChange = async (uid: string, updatedUserData: Partial<UserData>): Promise<{ success: boolean; message?: string }> => {
  try {
    const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, updatedUserData);
      return { success: true };
    } else {
      return { success: false, message: '找不到使用者' };
    }
  } catch (error: any) {
    console.error("Error updating user data:", error);
    return { success: false, message: error.message };
  }
};

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
      return { success: true };
      // });
    }).catch((error) => {
      return { success: false, message: error.message };
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
  } catch (error) {
    console.error('Error deleting user data:', error);
  }

  // 刪除帳戶
  auth.currentUser?.delete().then(() => {

    return { success: true };
  }).catch((error) => {

    return { success: false, message: error.message };
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
    return { success: true };
  }).catch((error) => {
    return { success: false, message: error.message };
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
    return { success: true };
  }).catch((error) => {
    return { success: false, message: error.message };
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
    return { success: true };
  }).catch((error) => {
    return { success: false, message: error.message };
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
    return { success: true };
  }).catch((error) => {
    return { success: false, message: error.message };
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
    return { success: true };
  }).catch((error) => {
    return { success: false, message: error.message };
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
    return { success: true };
  }).catch((error) => {
    return { success: false, message: error.message };
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
    return { success: true };
  }).catch((error) => {
    return { success: false, message: error.message };
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
      return { success: true };
    }).catch((error) => {
      return { success: false, message: error.message };
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
      return { success: true };
    }).catch((error) => {
      return { success: false, message: error.message };
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
      return { success: true };
    }).catch((error) => {
      return { success: false, message: error.message };
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
      return { success: true };
    }).catch((error) => {
      return { success: false, message: error.message };
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
      return { success: true };
    }).catch((error) => {
      return { success: false, message: error.message };
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
      return { success: true };
    }).catch((error) => {
      return { success: false, message: error.message };
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
      return { success: true };
    }).catch((error) => {
      return { success: false, message: error.message };
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
    } catch (error) {
      console.error('Error creating user document:', error);
    }

  } else {
    console.log('User document already exists');
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
