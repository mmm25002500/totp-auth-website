import { useEffect, useState } from "react";
import { TOTP } from "totp-generator";
import { useInterval } from 'react-use';
import { CircularProgress, Progress } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import ModalAlert from "./Code/ModalAlert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

interface CodeCardProps {
  name: string;
  code: string;
  category: string;
  deleteCode: () => void;
}

const CodeCard = (props: CodeCardProps) => {

  const period = 30;
  const { otp, expires } = TOTP.generate("JBSWY3DPEHPK3PXP", { period: 30 });

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

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
  }, []);

  // 更新剩餘時間
  useInterval(() => {
    const newTimeLeft = timeLeft - 1;

    if (newTimeLeft <= 0) {
      setTimeLeft(30);
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
            <ModalAlert
              deleteTOTP={props.deleteCode}
            >
              <FontAwesomeIcon icon={faCircleXmark} className="w-8 text-red-500" />
            </ModalAlert>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-medium text-gray-blue-900 truncate dark:text-white">
              {props.name}
            </p>
            {
              otp ? (<></>) : (
                <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">錯誤！</span>
              )
            }
            <span className="bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">{props.category}</span>

          </div>
          <button
            onClick={() => { copyToClipboard(otp) }}
            className="inline-flex items-center text-xl font-semibold text-gray-blue-900 dark:text-white">
            {otp}
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
            showValueLabel={true}
          />
        </div>
        {/* <div>Category: {props.category}</div> */}
        {/* <button onClick={props.deleteCode}>delete</button> */}
      </li>
    </>
  )
}

export default CodeCard;