import { useEffect, useState } from "react";
import { TOTP } from "totp-generator";
import { useInterval } from 'react-use';
import { CircularProgress, Progress } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import ModalAlert from "./Code/ModalAlert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { isBase32 } from "@/lib/totp/crud";

interface CodeCardProps {
  name: string;
  code: string;
  category: string;
  deleteCode: () => void;
}

const CodeCard = (props: CodeCardProps) => {

  const period = 30;
  const totp = isBase32(props.code) ? TOTP.generate(props.code, { period: 30 }) : null;

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
  if (totp?.otp === null || timeLeft === null) {
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

            {/* Delete Btn */}
            <ModalAlert
              deleteTOTP={props.deleteCode}
            >
              <div className="rounded-full border-2 border-red-500 w-10 h-10 flex items-center justify-center">
                <FontAwesomeIcon icon={faTrash} className="w-5 h-5 text-red-500" />
              </div>
            </ModalAlert>
          </div>

          {/* TOTP Name */}
          <div className="flex-1 min-w-0">
            <p className="text-base sm:text-lg font-medium text-gray-blue-900 truncate dark:text-white">
              {props.name}
            </p>
            <span className="text-xs font-medium sm:mr-2 px-2 sm:px-2.5 sm:py-0.5 rounded bg-purple-100 text-purple-800 border-2 border-purple-300 dark:bg-tpp/30 dark:text-bityo dark:border-tpp">{props.category}</span>

          </div>
          {
            totp?.otp ? (
              <button
                onClick={() => { totp?.otp && copyToClipboard(totp?.otp) }}
                className="text-xl font-semibold text-gray-blue-900 dark:text-white">
                {totp?.otp}
              </button>
            ) : (
              <p
                className="text-sm sm:text-xl font-semibold text-red-500">
                驗證碼錯誤！
              </p>
            )
          }
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
      </li>
    </>
  )
}

export default CodeCard;