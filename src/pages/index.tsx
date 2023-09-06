import { useEffect, useState } from "react";
import totp from "totp-generator";
import { useInterval } from 'react-use';
import Head from "next/head";

const Index = () => {

  const secret = "";

  // TOTP 令牌的默认有效时间是 30 秒
  const period = 30;

  const calculateTimeLeft = () => {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    return period - (currentTime % period);
  };

  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // 在组件挂载时进行初始计算
    setOtp(totp(secret));
    setTimeLeft(calculateTimeLeft());
  }, []); 

  // 每秒更新剩余时间
  useInterval(() => {
    const newTimeLeft = timeLeft - 1;

    if (newTimeLeft <= 0) {
      setOtp(totp(secret));
      setTimeLeft(period);
    } else {
      setTimeLeft(newTimeLeft);
    }
  }, 1000);

  // 如果 otp 或 timeLeft 为 null, 可以返回加载占位符或空 div
  if (otp === null || timeLeft === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Bityo | 首頁</title>
      </Head>
      <div>
        <h1>Your One Time Password</h1>
        <div>OTP: {otp}</div>
        <div>Time Left: {timeLeft} seconds</div>
      </div>
    </>
  );
}
export default Index;