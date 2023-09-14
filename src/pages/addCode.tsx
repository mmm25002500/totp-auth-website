import { auth, db } from "@/config/firebase";
import { Unsubscribe, User, onAuthStateChanged } from "firebase/auth";
import { arrayUnion, collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface totpData {
  name: string;
  secret: string;
  category: string;
}

const AddCode = () => {
  const [totp, setTotp] = useState<totpData>({ name: '', secret: '', category: '' });
  const [user, setUser] = useState<User>();
  const router = useRouter();

  // 驗證是否登入
  const checkAuth = (): Unsubscribe => onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log('User is logged in');
      setUser(user);
    } else {
      setUser(undefined);
      toast.error("請先登入！", {
        position: "top-right"
      });
      router.push('/');
    }
  });

  // 一進頁面就驗證，如果沒登入就導回首頁
  useEffect(() => {
    checkAuth();
  }, []);

  // 新增 TOTP 資料
  const addTotp = async () => {
    try {
      const uid = user?.uid;
      
      // 使用 where 查找 user 文檔
      const userQuery = query(collection(db, 'user'), where('uid', '==', uid));
      const userQuerySnapshot = await getDocs(userQuery);

      if (!userQuerySnapshot.empty) {
        // 找到匹配的 Doc
        const docRef = userQuerySnapshot.docs[0].ref;

        // 更新 Doc 來添加新的 TOTP
        await updateDoc(docRef, {
          totp: arrayUnion(totp)
        });

        toast.success("新增 TOTP 成功！", {
          position: "top-right"
        });

        // 清空表單
        setTotp({ name: '', secret: '', category: '' });
      } else {
        toast.error("未找到匹配 UID 的文檔", {
          position: "top-right"
        });
      }
    } catch (error) {
      toast.error("新增 TOTP 資料失敗！", {
        position: "top-right"
      });
    }
  };

  return (
    <>
      <Head>
        <title>新增驗證碼 - TOTP 2FA</title>
      </Head>
      <div className="container mx-auto pt-16 pl-5 pr-5">
        <form onSubmit={e => e.preventDefault()}>
          <div className="relative z-0 w-full mb-6 group">
              <input type="text" onChange={e => setTotp({...totp, name : e.target.value})} value={ totp.name } name="title" id="title" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Totp 名稱</label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
              <input type="text" onChange={e => setTotp({...totp, secret : e.target.value})} value={ totp.secret } name="description" id="description" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Secret</label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
              <input type="text" onChange={e => setTotp({...totp, category : e.target.value})} value={ totp.category } name="img_addr" id="img_addr" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">類別</label>
          </div>
          <button onClick={addTotp} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">新增驗證碼</button>
        </form>
      </div>
    </>
  )
}

export default AddCode;