import { auth, db } from "@/config/firebase";
import { Unsubscribe, User, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Head from "next/head";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { UserData, deleteAccount, syncGoogleUserData } from "@/components/CheckLogin";

const UpdateInfo = () => {
  const [user, setUser] = useState<User>();
	const [userData, setUserData] = useState<UserData>(
		{
			uid: '',
			name: '',
			email: '',
			phoneNumber: '',
			photoURL: '',
			bgPhotoURL: '',
			emailVerified: false,
			metadata: {
				creationTime: '',
				lastSignInTime: ''
			},
			totp: []
		}

	);
	const router = useRouter();

  // 驗證是否登入
  const checkAuth = (): Unsubscribe => onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log('User is logged in');
      setUser(user);

      // 如果有登入就從 Firestore 拿資料
      if (user) {
        getUserData(user.uid);
      }

    } else {
      setUser(undefined);
      router.push('/');
      toast.error("驗證失敗！請先登入！", {
        position: "top-right"
      });
    }
  });

  // 將 firestore 資料拿下來
  const getUserData = async (uid: string) => {
    try {
      const q = query(collection(db, 'user'), where('uid', '==', uid));
  
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // 如果查詢結果不為空，將 userData 設置為查詢結果
        const doc = querySnapshot.docs[0];
        const data = doc.data() as UserData;
        setUserData(data);
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
	};
	
	// 修改資料
	const submitChange = async () => {
		try {
			const userQuery = query(collection(db, 'user'), where('uid', '==', user?.uid));
			const querySnapshot = await getDocs(userQuery);

			// 創建一個新的物件，只包含要更新的資料
			const updatedUserData = {
				email: userData.email,
				name: userData.name,
				phoneNumber: userData.phoneNumber,
				photoURL: userData.photoURL,
				bgPhotoURL: userData.bgPhotoURL,

				uid: userData.uid,
				emailVerified: userData.emailVerified,
				metadata: {
					creationTime: userData.metadata.creationTime,
					lastSignInTime: userData.metadata.lastSignInTime
				},
				totp: userData.totp
			};

			// 使用 updateDoc 更新資料
			if (!querySnapshot.empty) {
				// 使用 where 查找 user 文檔
				const docRef = querySnapshot.docs[0].ref;
				await updateDoc(docRef, updatedUserData)
					.then(() => {
						toast.success('修改成功！', {
							position: "top-right"
						});
					})
					.catch((error) => {
						toast.error(`修改失敗！\n錯誤訊息：\n${error}`, {
							position: "top-right"
						});
					});
				
			} else {
				toast.error('找不到使用者', {
					position: "top-right"
				});
			}
		} catch (error) {
			toast.error(`修改失敗！\n錯誤訊息：\n${error}`, {
				position: "top-right"
			});
		}
	};
  
  // 一進頁面就驗證，如果沒登入就導回首頁
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <Head>
        <title>更改個人資料 - TOTP 2FA</title>
      </Head>
      <div className="container mx-auto pt-16 pl-5 pr-5">
        <div className="text-left text-gray-500 dark:text-gray-400 text-2xl">
          <p>
            更改個人資料
					</p>
				</div>
				
				<form className="mt-5">
					<div className="relative z-0 w-full mb-6 group">
						<input type="email" value={userData.email} disabled={ true } name="email" id="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer cursor-not-allowed" placeholder=" " required />
							<label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">電子郵件(不可修改)</label>
					</div>
					<div className="grid md:grid-cols-2 md:gap-6">
						<div className="relative z-0 w-full mb-6 group">
								<input type="text" onChange={e => setUserData({...userData, name : e.target.value})} value={userData.name} name="name" id="name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
								<label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">姓名</label>
						</div>
						<div className="relative z-0 w-full mb-6 group">
								<input type="tel" onChange={e => setUserData({...userData, phoneNumber : e.target.value})} value={userData.phoneNumber ? userData.phoneNumber : '' } pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="phoneNumber" id="phoneNumber" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
								<label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">電話號碼</label>
						</div>
					</div>
					<div className="grid md:grid-cols-2 md:gap-6">
						<div className="relative z-0 w-full mb-6 group">
								<input type="text" onChange={e => setUserData({...userData, photoURL : e.target.value})} value={userData.photoURL}  name="photoURL" id="photoURL" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
								<label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">大頭照(URL)</label>
						</div>
						<div className="relative z-0 w-full mb-6 group">
								<input type="text" onChange={e => setUserData({...userData, bgPhotoURL : e.target.value})} value={userData.bgPhotoURL} name="bgPhotoURL" id="bgPhotoURL" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
								<label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">背景圖片(URL)</label>
						</div>
					</div>
					<button type="submit" onClick={submitChange} className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
						<span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
							修改
						</span>
					</button>

					<button
						type="submit"
						onClick={async () => {
							await syncGoogleUserData(user as User)
								.then(() => {
									let user_data = user as User;
									getUserData(user_data.uid);
							});
						}}
						className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
					>
						<span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
							同步 Google 資料
						</span>
					</button>

					<button type="button" onClick={() => deleteAccount(user as User)} className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br focus:outline-none text-gray-900 dark:text-white bg-red-500 hover:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
						<span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
							同步 Google 資料
						</span>
					</button>
				</form>

      </div>
    </>
  )
}

export default UpdateInfo;