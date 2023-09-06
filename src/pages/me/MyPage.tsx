import { auth, db } from "@/config/firebase";
import { Unsubscribe, User, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PersonalCard from "@/components/PersonalCard";
import Head from "next/head";
import { collection, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { UserData } from "@/components/CheckLogin";

const MyPage = () => {
  const [user, setUser] = useState<User>();
  const [userData, setUserData] = useState<UserData>();
  const router = useRouter();

  // 驗證是否登入
  const checkAuth = (): Unsubscribe => onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log('User is logged in');
      setUser(user);

      // 如果有登入就從 Firestore 拿資料
      if (user) {
        getUserData(user.uid);
      }

    } else {
      setUser(undefined);
      router.push('/');
      toast.error("驗證失敗！請先登入！", {
        position: "top-right"
      });
    }
  });

  // 將 firestore 資料拿下來
  const getUserData = async (uid: string) => {
    try {
      const q = query(collection(db, 'user'), where('uid', '==', uid));
  
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // 如果查詢結果不為空，將 userData 設置為查詢結果
        const doc = querySnapshot.docs[0];
        const data = doc.data() as UserData;
        setUserData(data);
      } else {
        // 如果查詢結果為空，將 userData 設置為 undefined
        setUserData(undefined); // 或設定為預設值
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  };
  
  // 一進頁面就驗證，如果沒登入就導回首頁
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <Head>
        <title>{user?.displayName || '我的頁面'} - TOTP 2FA</title>
      </Head>
      <div className="container mx-auto pt-16 pl-5 pr-5">
        <div className="text-left text-gray-500 dark:text-gray-400 text-2xl">
          <p>
            個人頁面
          </p>
          <PersonalCard
            name={userData?.name || ''}
            email={userData?.email || ''}
            photoURL={userData?.photoURL || ''}
            bgPhotoURL={userData?.bgPhotoURL || ''}
            emailVerified={userData?.emailVerified || false}
            phoneNumber={userData?.phoneNumber || ''}
            uid={userData?.uid || ''}
            metadata={{
              creationTime: userData?.metadata.creationTime || '',
              lastSignInTime: userData?.metadata.lastSignInTime || ''
            }}
          ></PersonalCard>
        </div>
      </div>
    </>
  )
}

export default MyPage;