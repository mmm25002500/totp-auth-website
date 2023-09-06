import { auth, db } from "@/config/firebase";
import { Unsubscribe, User, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PersonalCard from "@/components/PersonalCard";
import Head from "next/head";
import { collection, deleteDoc, getDocs, query, where } from "firebase/firestore";

const MyPage = () => {
  const [user, setUser] = useState<User>();
  const router = useRouter();

  // 驗證是否登入
  const checkAuth = (): Unsubscribe => onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log('User is logged in');
      setUser(user);

    } else {
      setUser(undefined);
      router.push('/');
      toast.error("驗證失敗！請先登入！", {
        position: "top-right"
      });
    }
  });

  // 刪除帳戶
  const deleteAccount = async () => { 
    
    try {
      const q = query(collection(db, 'user'), where('uid', '==', user?.uid)); // 替换为实际的集合名称和字段名
  
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach(async (doc) => {
        const docRef = doc.ref;
  
        // 删除文档
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
            name={user?.displayName || ''}
            email={user?.email || ''}
            phone={user?.phoneNumber || ''}
            image={user?.photoURL || ''}
            uid={user?.uid || ''}
            deleteAccount={deleteAccount}
          ></PersonalCard>
        </div>
      </div>
    </>
  )
}

export default MyPage;