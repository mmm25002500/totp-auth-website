import { useEffect, useState } from "react";
import totp from "totp-generator";
import { useInterval } from 'react-use';
import {CircularProgress, Progress} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

interface CodeCardProps {
  name: string;
  code: string;
  category: string;
  deleteCode: () => void;
}

const CodeCard = (props: CodeCardProps) => {

  const secret = props.code;

  // TOTP Token 預設的有效時間是 30 秒
  const period = 30;

  const calculateTimeLeft = () => {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    return period - (currentTime % period);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("已複製驗證碼！", {
      position: "top-right"
    });
  };

  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // 初始計算
    setOtp(totp(secret));
    setTimeLeft(calculateTimeLeft());
  }, []); 

  // 更新剩餘時間
  useInterval(() => {
    const newTimeLeft = timeLeft - 1;

    if (newTimeLeft <= 0) {
      setOtp(totp(secret));
      setTimeLeft(period);
    } else {
      setTimeLeft(newTimeLeft);
    }
  }, 1000);

  // 如果 otp 或 timeLeft 為 null, 可以回傳加載 null 或 Loading...
  if (otp === null || timeLeft === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <li className="py-3 sm:py-4">
        <Progress
          maxValue={30}
          value={timeLeft}
          color="primary"
          className="mb-2 h-1"
        />
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {/* <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image" /> */}
            <button onClick={props.deleteCode}>
              <FontAwesomeIcon icon={faCircleXmark} className="w-8 text-red-500" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-medium text-gray-900 truncate dark:text-white">
            { props.name }
            </p>
            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
            { props.category }
            </p>
          </div>
          <button
            onClick={() => { copyToClipboard(otp) }}
            className="inline-flex items-center text-xl font-semibold text-gray-900 dark:text-white">
            { otp }
          </button>
          <CircularProgress
            aria-label="Loading..."
            size="lg"
            maxValue={30}
            value={timeLeft}
            color="primary"
            formatOptions={{
              style: 'unit',
              unit: 'second',
              unitDisplay: 'narrow',
            }}
            showValueLabel={ true }
          />
        </div>
        {/* <div>Category: {props.category}</div> */}
        {/* <button onClick={props.deleteCode}>delete</button> */}
      </li>
    </>
  )
}

export default CodeCard;