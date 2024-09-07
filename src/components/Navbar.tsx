/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */

import { faCircleUser, faHome, faPlus, faRectangleList, faRightFromBracket, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from 'next/link';
import Themes from "./Themes";
import { ReactNode, useEffect, useState } from "react";
import { auth } from "@/config/firebase";
import { Unsubscribe, User, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { handleGoogleLogin } from "@/components/CheckLogin";

// 整個 Navbar
const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | undefined>();

  // 個人頁面按鈕
  const Personal = (props: {user: User| undefined}) => {
    return (
      <button
        onClick={() => { router.push('/me/MyPage'); setIsOpen(false); }}
        className="flex w-full items-center mr-10 text-base font-normal hover:text-black/70 dark:hover:text-white/70"
      >
        {
          props.user?.photoURL ? (
            <div className="relative mr-2">
              <img className="w-7 h-7 rounded-full" src={props.user?.photoURL} alt="" />
              <span className="top-0 left-5 absolute  w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-blue-800 rounded-full"></span>
            </div>
          ): (
            <FontAwesomeIcon icon={faCircleUser} className="w-5 pr-1" />
          )
        }
        {props.user?.displayName || "個人頁面"}
      </button>
    )
  }

  // 還沒登入的按鈕
  const LoginBtn = (props: {user: User| undefined}) => {
    return (
      props.user ? '' : (
          <>
            <div className="false" key="login">
              <button
              onClick={() => { handleGoogleLogin(); setIsOpen(false);}}
                className="w-full flex items-center mr-10 text-base font-normal hover:text-black/70 dark:hover:text-white/70"
              >
              <FontAwesomeIcon icon={faRightToBracket} className="w-5 pr-1" />
              登入
            </button>
          </div>
        </>
      )
    )
  }

  // 已經登入的按鈕
  const CodeBtn = (props: {user: User| undefined}) => {
    const router = useRouter();

    return (
      props.user ? (
        <>
          <div className="false" key="code">
            <button
              onClick={() => {router.push('/code', { scroll: false }); setIsOpen(false);}}
              className="w-full flex items-center mr-10 text-base font-normal hover:text-black/70 dark:hover:text-white/70"
            >
              <FontAwesomeIcon icon={faRectangleList} className="w-5 pr-1" />
              驗證碼
            </button>
          </div>
        </>
      ) : (
        <>
        </>
      )
    )
  }

  // 已經登入的按鈕
  const PersonalPageBtn = (props: {user: User| undefined}) => {

    return (
      props.user ? (
        <>
          <div className="false" key="PersonalPageBtn">
              <Personal user={ props.user } />
          </div>
        </>
      ) : (
        <>
        </>
      )
    )
  }

  // 已經登入的按鈕
  const AddCodeBtn = (props: {user: User| undefined}) => {
    const router = useRouter();

    return (
      props.user ? (
        <>
          <div className="false" key="AddCpdeBtn">
            <button
              onClick={() => {router.push('/addCode', { scroll: false }); setIsOpen(false);}}
              className="w-full flex items-center mr-10 text-base font-normal hover:text-black/70 dark:hover:text-white/70"
            >
              <FontAwesomeIcon icon={faPlus} className="w-5 pr-1" />
              增加驗證碼
            </button>
          </div>
        </>
      ) : (
        <>
        </>
      )
    )
  }

  // 已經登入的按鈕
  const LogoutBtn = (props: {user: User| undefined, checkAuth: () => void}) => {
    const router = useRouter();

    const logout_btn = () => {
      signOut(auth).then(() => {
        toast.success('登出成功！', {
          position: "top-right"
        });
      }).catch((error) => {
        toast.success(`登出失敗！\n錯誤訊息：\n${error}`, {
          position: "top-right"
        });
      });
      props.checkAuth();
      
      router.push('/', { scroll: false });
    }

    return (
      props.user ? (
        <>
          <div className="false" key="logout">
            <button
              onClick={() => { logout_btn(); setIsOpen(false); }}
              className="w-full flex items-center mr-10 text-base font-normal hover:text-black/70 dark:hover:text-white/70"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="w-5 pr-1" />
              登出
            </button>
          </div>
        </>
      ) : (
        <>
        </>
      )
    )
  }

  const navlinks = [
    {
      title: "首頁",
      href: "/",
      icon: faHome,
    },
    // {
    //   title: "關於我們",
    //   href: "/About",
    //   icon: faCircleInfo,
    // },
  ];

  const PhoneNavBtn = (props: { children: ReactNode }) => {
    return (
      props.children != null ? (
        <li>
          <div className="block py-2 pl-3 pr-4 text-gray-blue-900 rounded hover:bg-gray-blue-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-blue-700 dark:hover:text-white md:dark:hover:bg-transparent">
            { props.children }
          </div>
        </li>
      ): (
        <></>
      )
    )
  }

  const checkAuth = (): Unsubscribe => onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log('User is logged in');
      setUser(user);
    } else {
      setUser(undefined);
    }
  });

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <nav className="z-50">
      <div className="fixed flex h-16 z-50 w-full items-center bg-transparent justify-between px-3 font-bold text-black shadow md:justify-center md:px-7 mb-1 dark:text-white">
        <Link href="/">
          <button className="flex items-center border-none bg-transparent text-lg normal-case">
            <img src="/imgs/bityo_bg_circle.png" alt="logo" className="w-7 mr-2" />
            <h1 className="">TOTP 2FA 驗證器</h1>
          </button>
        </Link>
        <div className="hidden flex-1 items-center justify-end sm:flex">

          {/* Navbar 右邊欄位 */}
          {navlinks.map((link) => (
            <div className="false" key={link.title}>
              <Link
                href={link.href}
                prefetch={false}
                className="flex items-center mr-10 text-base font-normal hover:text-black/70 dark:hover:text-white/70"
              >
                <FontAwesomeIcon icon={link.icon} className="w-5 pr-1" />
                {link.title}
              </Link>
            </div>
          ))}

          {/* 驗證碼按鈕 */}
          <CodeBtn user={user}></CodeBtn>

          {/* 登入按鈕 */}
          <LoginBtn user={user}></LoginBtn>

          {/* 增加驗證碼按鈕 */}
          <AddCodeBtn user={user}></AddCodeBtn>

          {/* 登出按鈕 */}
          <LogoutBtn user={user} checkAuth={checkAuth}></LogoutBtn>

          {/* 個人頁面按鈕 */}
          <PersonalPageBtn user={user}></PersonalPageBtn>
          
          {/* 切換背景 */}
          <Themes></Themes>
          
        </div>
        {/* 手機版摺疊按鈕 */}
        <div className="z-10 flex items-center justify-end sm:hidden">
          <button className="flex h-10 w-10 items-center justify-center" onClick={() => setIsOpen(!isOpen)}>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 1024 1024"
              className="h-[30px] w-[30px]"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* 手機版頁面 */}
      <div className={`fixed w-full pl-2 pr-2 md:block md:w-auto ${isOpen? '': 'hidden'}`} id="navbar-default">
        <ul className="font-medium flex flex-col p-4 md:p-0 mt-16 border border-gray-blue-100 rounded-lg bg-gray-blue-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-blue-800 md:dark:bg-gray-blue-900 dark:border-gray-blue-700 sm:hidden">

          {/* 寫一個迴圈 */}
          {navlinks.map((link) => (
            <li key={link.title}>
              <Link
                href={link.href}
                prefetch={false}
                onClick={() => setIsOpen(false)}
                className="py-2 pl-3 pr-4 text-gray-blue-900 rounded hover:bg-gray-blue-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-blue-700 dark:hover:text-white md:dark:hover:bg-transparent flex w-full"
              >
                <FontAwesomeIcon icon={link.icon} className="w-5 pr-1" />
                {link.title}
              </Link>
            </li>
          ))}

          {/* 驗證碼按鈕 */}
          {
            user ? (
              <PhoneNavBtn>
                <CodeBtn user={user}></CodeBtn>
              </PhoneNavBtn>
            ) : ''
          }
          
          {/* 登入按鈕 */}
          {
            user ? '' : (
              <PhoneNavBtn>
                <LoginBtn user={user}></LoginBtn>
              </PhoneNavBtn>
            )
          }

          {/* 增加驗證碼按鈕 */}
          {
            user ? (
              <PhoneNavBtn>
                <AddCodeBtn user={user}></AddCodeBtn>
              </PhoneNavBtn>
            ) : ''
          }
          
          {/* 登出按鈕 */}
          {
            user ? (
              <PhoneNavBtn>
                <LogoutBtn user={user} checkAuth={checkAuth}></LogoutBtn>
              </PhoneNavBtn>
            ) : ''
          }

          {/* 個人頁面按鈕 */}
          {
            user ? (
              <PhoneNavBtn>
                <PersonalPageBtn user={user}></PersonalPageBtn>
              </PhoneNavBtn>
            ) : ''
          }

          <li>
            <div className="block py-2 pl-3 pr-4 text-gray-blue-900 rounded hover:bg-gray-blue-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-blue-700 dark:hover:text-white md:dark:hover:bg-transparent">
              <Themes></Themes>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;