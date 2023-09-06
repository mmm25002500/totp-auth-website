import Head from "next/head";

const NotFound = () => { 
  return (
    <>
      <Head>
        <title>找不到頁面 - TOTP 2FA</title>
      </Head>
      <div className="text-center text-gray-500 dark:text-gray-400 text-2xl">
        <p>
          404 NotFound <br />
          找不到頁面
        </p>
      </div>
    </>
  )
}

export default NotFound;