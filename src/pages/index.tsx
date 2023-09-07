import Head from "next/head";
import { useRouter } from "next/router";
import Card from "@/components/homepage/Card";
import { faBolt, faClock, faHome, faShieldHalved } from "@fortawesome/free-solid-svg-icons";

const Index = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>首頁 - TOTP 2FA</title>
      </Head>
      <section className="bg-center bg-no-repeat dark:bg-[url('https://wallpapers.com/images/hd/blockchain-white-and-blue-sections-e1xrmn9wneve45yx.jpg')] bg-white dark:bg-gray-700 bg-blend-multiply border-b-1 dark:border-b-1 border-gray-200 dark:border-gray-600">
        <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-black dark:text-white md:text-5xl lg:text-6xl">全台灣最強大的二步驟驗證器</h1>
          <p className="mb-8 text-lg font-normal text-black dark:text-gray-300 lg:text-xl sm:px-16 lg:px-48">從台灣的區塊鏈程式團隊打造的最強大二步驟驗證器，支援基於 OTP、TOTP、HOTP 一次性密碼演算法的驗證碼。</p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <button onClick={ () => router.push('/login')} className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
              開始使用
              <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
              </svg>
            </button>
            <a href="#" className="inline-flex justify-center hover:text-gray-900 items-center py-3 px-5 text-base font-medium text-center text-black dark:text-white rounded-lg border border-black dark:border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400">
              了解更多(敬請期待)
            </a>  
          </div>
        </div>
      </section>

      <div className="container mx-auto pt-5 pl-5 pr-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card
            title="安全性"
            description="使用 Google Authenticator 一樣的演算法，讓您的帳戶更安全。"
            icon={ faShieldHalved }
          ></Card>
          <Card
            title="方便性"
            description="使用 QR Code 掃描，並且透過跨平台機制，讓您的可以在任何地方使用。"
            icon={ faClock }
          ></Card>
          <Card
            title="功能強大"
            description="支援基於 OTP、TOTP、HOTP 一次性密碼演算法的驗證碼。"
            icon={ faBolt }
          ></Card>
        </div>
      </div>

    </>
  );
}
export default Index;