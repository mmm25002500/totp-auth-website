import ButtonSection from "./ButtonSection";

const TitleSection = () => {
  return (
    <div className="absolute inset-x-0 top-0 z-10 flex flex-col text-center pt-[120px] md:pt-[150px] xl:pt-[180px] 2xl:pt-[210px] px-5">
      <div className="hidden z-10 w-full h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-tpp/0 via-tpp/50 to-tpp/0" />
      <h1 className="py-3.5 px-0.5 text-transparent duration-1000 bg-transparent cursor-default text-edge-outline animate-title font-display whitespace-nowrap bg-clip-text z-40 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center font-medium">
        {/* 標題 */}
        <span className="bg-gradient-to-r from-tpp via-tpp to-[#2878c8] inline-block text-transparent bg-clip-text">
          全台灣最強大的
        </span>
        <br className="sm:hidden" />
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
        <ButtonSection />
      </div>
    </div>
  )
}

export default TitleSection;