import React, { useEffect, useState } from 'react';
import { getDocs, collection, doc, getDoc, query, where, updateDoc, deleteDoc, arrayRemove } from 'firebase/firestore';
import { User, Unsubscribe, onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';
import { auth, db } from '@/config/firebase';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import CodeCard from '@/components/CodeCard';
import Head from 'next/head';

interface totpItems {
  name: string;
  secret: string;
  category: string;
}

export interface userData {
  uid: string;
  totp: totpItems[];
}

// 刪除驗證碼資料(搭配刪除帳號使用)
export const deleteUserCode = async (uid: string) => {
  try {
    // 找到匹配的 user 文檔
    const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
    const userQuerySnapshot = await getDocs(userQuery);

    if (!userQuerySnapshot.empty) {
      // 刪除 user 文檔
      const userDoc = userQuerySnapshot.docs[0];
      const userDocRef = doc(db, 'user', userDoc.id);
      await deleteDoc(userDocRef);
      toast.success("刪除驗證碼資料成功！", {
        position: "top-right" 
      });
    } else {
      toast.error("找不到驗證碼資料！", {
        position: "top-right" 
      });
    }
  } catch (error) {
    toast.error(`刪除驗證碼資料失敗！\n錯誤訊息：\n${error}`, {
      position: "top-right" 
    });
  }
}

const Code = () => {
  const [codesMap, setCodesMap] = useState<totpItems[]>([]);
  const [userData, setUserData] = useState<userData | undefined>();
  const [user, setUser] = useState<User | undefined>();
  const router = useRouter();

  // 驗證是否登入
  const checkAuth = (): Unsubscribe =>
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadUserData(user.uid);
      } else {
        setUser(undefined);
        router.push('/');
        toast.error('請先登入！', {
          position: 'top-right',
        });
      }
    });

    // 載入 User Data
    const loadUserData = async (uid: string) => {
      try {
        const userRef = collection(db, "user");

        const q = query(userRef, where("uid", "==", uid));
        
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          setUserData(doc.data() as userData);
        });
    
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
  
    // 刪除 TOTP 項目
    const deleteTotpItem = async (totpCode: string) => {
      try {
        const userRef = collection(db, "user");
        const q = query(userRef, where("uid", "==", user?.uid));
        const querySnapshot = await getDocs(q);
    
        // 遍歷尋找符合 TOTP 的
        querySnapshot.forEach(async (doc) => {
          const docRef = doc.ref;

          // 獲取當前 TOTP 的 Array
          const userData = doc.data();
          const totpArray = userData.totp || [];

          // 建立一個新的 TOTP Array，把要刪除的排除
          const newTotpArray = totpArray.filter((item: { secret: string; }) => item.secret !== totpCode);

          // 更新 Doc
          await updateDoc(docRef, {
            totp: newTotpArray
          });
          
          // 重新加載 TOTP
          if (user?.uid) {
            loadUserData(user.uid);
          }

        });
        
        toast.success('已成功刪除驗證碼！', {
          position: 'top-right'
        });
      } catch (error) {
        toast.error(`刪除驗證碼失敗！\n錯誤訊息：\n${error}`, {
          position: 'top-right'
        });
      }
    };
  
    // 清空 所有 TOTP 項目
    const clearTotpItem = async () => {
      try {
        if (user) {
          const uid = user.uid;
          const userRef = collection(db, 'user');
          const q = query(userRef, where('uid', '==', uid));
          const querySnapshot = await getDocs(q);
    
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userId = userDoc.id;
    
            await updateDoc(doc(db, 'user', userId), {
              totp: []
            });
    
            loadUserData(uid);
    
            toast.success('已成功清空驗證碼！', {
              position: 'top-right'
            });
          } else {
            toast.error('找不到驗證碼！', {
              position: 'top-right'
            });
          }
        } else {
          toast.error('請先登入！', {
            position: 'top-right'
          });
        }
      } catch (error) {
        toast.error(`清空驗證碼失敗！\n錯誤訊息：\n${error}`, {
          position: 'top-right'
        });
      }
    };
    
    useEffect(() => {
      checkAuth();
    }, []);
  
  return (
    <>
      <Head>
        <title>驗證碼 - TOTP 2FA</title>
      </Head>
      <div className="container mx-auto pt-8 pl-5 pr-5">
        {
          userData?.totp.length === 0 ? (
            <div className="flex items-center p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800 text-lg" role="alert">
              <FontAwesomeIcon icon={faTriangleExclamation} className="inline w-4 h-4 mr-3" />
              <span className="sr-only">Info</span>
              <div>
                <span className="font-bold">喔不!</span> 驗證碼是空的！！！
                <button className="underline underline-offset-4 text-cyan-300" onClick={() => router.push('/addCode')}>點我立刻去新增驗證碼？</button>
              </div>
            </div>
          ) : (
              <button onClick={clearTotpItem} className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  點我清空所有驗證碼
              </span>
            </button>
          )
        }
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> */}
          <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:px-8 sm:pt-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">驗證碼</h5>
              <button onClick={ () => router.push('/addCode')} className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                  新增驗證碼
              </button>
            </div>
            <div className="flow-root">
              <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                  {
                    userData?.totp.map((items) => (
                      <div key={items.name}>
                        <CodeCard
                          code={items.secret}
                          name={items.name}
                          category={items.category}
                          deleteCode={() => deleteTotpItem(items.secret)}
                        />
                      </div>
                    ))
                  }
              </ul>
            </div>
          </div>
        {/* </div> */}
      </div>
    </>
  );
};

export default Code;
