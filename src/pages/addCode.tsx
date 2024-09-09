import InputLabel from "@/components/Input/InputLabel";
import { auth } from "@/config/firebase";
import { Unsubscribe, User, onAuthStateChanged } from "firebase/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SEO from "@/config/SEO.json";
import { totpItems } from "@/types/userData";
import { addTotp } from "@/lib/totp/crud";

const AddCode = () => {
  const [totp, setTotp] = useState<totpItems>({ name: '', secret: '', category: '' });
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
  const handleAddTotp = async () => {
    if (!user?.uid) return;

    const result = await addTotp(user.uid, totp);

    if (result.success) {
      toast.success('新增 TOTP 成功！', { position: 'top-right' });

      // 清空表單
      setTotp({ name: '', secret: '', category: '' });
    } else {
      toast.error(`新增 TOTP 失敗！\n錯誤訊息：${result.message}`, { position: 'top-right' });
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
      <div className="container mx-auto pt-5 pl-5 pr-5">
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
            onClick={handleAddTotp}
            className="px-3 py-2 border-2 border-bityo rounded-lg hover:bg-bityo/20">
            新增驗證碼
          </button>
        </form>
      </div>
    </>
  )
}

export default AddCode;