import Head from "next/head";
import { useRouter } from "next/router";
import Card from "@/components/homepage/Card";
import { faBolt, faClock, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import SEO from "@/config/SEO.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faFacebook, faYoutube } from "@fortawesome/free-brands-svg-icons";
import SwiperSection from "@/components/homepage/SwiperSection";
import Particles from "@/components/Particles";

const Index = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{SEO.Index.title}</title>
        <meta name="description" content={SEO.Index.description} />
        <meta property="og:title" content={SEO.Index.title} />
        <meta property="og:description" content={SEO.Index.description} />
        <meta property="og:image" content={SEO.Index.image} />
        {/* <meta property="og:url" content={`https://yourdomain.com/post/${post.frontMatter.id}`} /> */}
        <meta property="og:type" content={SEO.Index.type} />
        {/* <meta name="twitter:card" content="summary_large_image" /> */}
        <meta name="twitter:title" content={SEO.Index.title} />
        <meta name="twitter:description" content={SEO.Index.description} />
        <meta name="twitter:image" content={SEO.Index.image} />
      </Head>

      <div className="relative w-full h-[80vh]">
        {/* 例子效果 */}
        <Particles
          className="absolute z-10 animate-fade-in w-full h-[90%]"
          quantity={100}
        />
        {/* 背後swiper */}
        <SwiperSection />

        {/* 文字內容 */}
        <div className="absolute inset-x-0 top-0 z-10 flex flex-col text-center pt-[120px] md:pt-[150px] xl:pt-[180px] 2xl:pt-[210px] px-5">
          <div className="hidden z-10 w-full h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-tpp/0 via-tpp/50 to-tpp/0" />
          <h1 className="py-3.5 px-0.5 text-transparent duration-1000 bg-transparent cursor-default text-edge-outline animate-title font-display whitespace-nowrap bg-clip-text z-40 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center font-medium">
            {/* 標題 */}
            <span className="bg-gradient-to-r from-tpp via-tpp to-[#2878c8] inline-block text-transparent bg-clip-text">
              全台灣最強大的
            </span>
            <br className="xs:hidden" />
            {/* 子標題 */}
            <span className="bg-gradient-to-r from-[#17ff8f] to-[#17FFAD] inline-block text-transparent bg-clip-text">
              二步驟驗證器
            </span>
          </h1>
          <div className="hidden w-full screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-tpp/0 via-tpp/50 to-tpp/0" />
          {/* 描述 */}
          <p className="text-center text-lg sm:text-xl mt-3 text-neutral-100 dark:text-neutral-300 animate-fade-in">
            從台灣的區塊鏈程式團隊打造的最強大二步驟驗證器，支援基於 OTP、TOTP、HOTP 一次性密碼演算法的驗證碼。
          </p>

          {/* 按鈕 */}
          <div className="w-full flex justify-center animate-fade-in">
            <div className="mt-5 grid grid-cols-1 gap-3 sm:w-fit sm:grid-cols-2 items-center">
              {/* <a
                href="https://discord.gg/Rj69yHwqGy"
                className="flex items-center justify-center rounded-lg px-2 py-2 border-2 border-tpp hover:bg-tpp/50 dark:hover:bg-tpp/50 text-white"
              >
                <FontAwesomeIcon icon={faDiscord} className="mr-2 w-5" />
                進入 Discord 社群
              </a> */}
              <button
                onClick={() => router.push('/code')}
                className="flex items-center justify-center rounded-lg px-2 py-2 border-2 border-tpp hover:bg-tpp/50 dark:hover:bg-tpp/50 text-white"
              >
                <FontAwesomeIcon icon={faFacebook} className="mr-2 w-5" />
                開始使用
              </button>
              <button
                onClick={() => router.push('/about')}
                className="flex items-center justify-center px-2 py-2 rounded-lg border-2 border-[#17FFAD] hover:bg-[#17FFAD]/50 dark:hover:bg-tpp/50 text-white"
              >
                <FontAwesomeIcon icon={faYoutube} className="mr-2 w-5" />
                了解更多
              </button>
            </div>
          </div>
        </div>
      </div >

      {/* 底下部分 */}
      <div className="container mx-auto pt-5 pl-5 pr-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card
            title="安全性"
            description="使用 Google Authenticator 一樣的演算法，讓您的帳戶更安全。"
            icon={faShieldHalved}
          ></Card>
          <Card
            title="方便性"
            description="使用 QR Code 掃描，並且透過跨平台機制，讓您的可以在任何地方使用。"
            icon={faClock}
          ></Card>
          <Card
            title="功能強大"
            description="支援基於 OTP、TOTP、HOTP 一次性密碼演算法的驗證碼。"
            icon={faBolt}
          ></Card>
        </div>
      </div>

    </>
  );
}
export default Index;