import InputLabel from "@/components/Input/InputLabel";
import { auth, db } from "@/config/firebase";
import { Unsubscribe, User, onAuthStateChanged } from "firebase/auth";
import { arrayUnion, collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SEO from "@/config/SEO.json";

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
        <title>{SEO.AddCode.title}</title>
        <meta name="description" content={SEO.AddCode.description} />
        <meta property="og:title" content={SEO.AddCode.title} />
        <meta property="og:description" content={SEO.AddCode.description} />
        <meta property="og:image" content={SEO.AddCode.image} />
        {/* <meta property="og:url" content={`https://yourdomain.com/post/${post.frontMatter.id}`} /> */}
        <meta property="og:type" content={SEO.AddCode.type} />
        {/* <meta name="twitter:card" content="summary_large_image" /> */}
        <meta name="twitter:title" content={SEO.AddCode.title} />
        <meta name="twitter:description" content={SEO.AddCode.description} />
        <meta name="twitter:image" content={SEO.AddCode.image} />
      </Head>
      <div className="container mx-auto pt-16 pl-5 pr-5">
        <form onSubmit={e => e.preventDefault()}>
          <InputLabel
            value={totp.name}
            isRequired={true}
            label="Totp 名稱"
            onChange={e => setTotp({ ...totp, name: e.target.value })}
          />

          <InputLabel
            value={totp.secret}
            isRequired={true}
            label="Secret"
            onChange={e => setTotp({ ...totp, secret: e.target.value })}
          />

          <InputLabel
            value={totp.category}
            isRequired={true}
            label="類別"
            onChange={e => setTotp({ ...totp, category: e.target.value })}
          />
          <button
            onClick={addTotp}
            className="px-3 py-2 border-2 border-bityo rounded-lg hover:bg-bityo/20">
            新增驗證碼
          </button>
        </form>
      </div>
    </>
  )
}

export default AddCode;