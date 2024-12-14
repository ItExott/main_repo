import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../popup/Login.jsx";
import { FaShoppingBasket } from "react-icons/fa";
import { FaPlaystation } from "react-icons/fa6";
import axios from "axios";
import ChargePopup from "../popup/ChargePopup.jsx";
import { FaBell } from "react-icons/fa6";
import { FaWindowClose } from "react-icons/fa";

const Navbar = ({ loginStatus, setLoginStatus, userProfile, setUserProfile, money, setMoney, handleLogout, userType }) => {
    const displayMoney = money || 0; // Default money to 0 if not available
    const navigate = useNavigate();
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const timeoutRef = useRef(null);
    const [isChargePopupVisible, setChargePopupVisible] = useState(false);
    const [isFetching, setIsFetching] = useState(false); // Track fetch status
    const [isNotificationVisible, setNotificationVisible] = useState(false);
    const [alertlist, setAlertlist] = useState([]); // alertlist 상태 (제품 id 리스트)
    const [productInfo, setProductInfo] = useState({});
    const [productCount, setProductCount] = useState(0);
    const goProductManage = () => navigate("/ProductManage");


    useEffect(() => {
        const storedLoginStatus = sessionStorage.getItem("loginStatus");
        const storedUserProfile = sessionStorage.getItem("userProfile");
        const storedMoney = sessionStorage.getItem("money");

        if (storedLoginStatus === "true" && storedUserProfile) {
            setLoginStatus(true);
            setUserProfile(JSON.parse(storedUserProfile));
            setMoney(storedMoney || 0);
        } else {
            setLoginStatus(false);
            setUserProfile(null);
            setMoney(0);
        }
    }, [setLoginStatus, setUserProfile, setMoney]);

    useEffect(() => {
        if (userType === "gymManager") {
            const fetchProductCount = async () => {
                try {
                    const response = await axios.get("http://localhost:8080/user/products/count", { withCredentials: true });
                    if (response.data.productCount !== undefined) {
                        setProductCount(response.data.productCount); // 제품 개수 업데이트
                    }
                } catch (error) {
                    console.error("Failed to fetch product count:", error);
                }
            };

            fetchProductCount(); // 제품 개수 가져오기
        }
    }, [userType]);

    useEffect(() => {
        const storedAlertlist = sessionStorage.getItem("alertlist");
        if (storedAlertlist) {
            setAlertlist(JSON.parse(storedAlertlist)); // sessionStorage에서 alertlist 값을 가져와 설정
        }
    }, []);

    const handleAlertClick = (prodid) => {
        navigate(`/product/${prodid}`); // 클릭 시 해당 제품 페이지로 이동
        setNotificationVisible(false);
    };

    const handleRemoveAlert = async (prodid) => {
        try {
            const response = await axios.post(
                "http://localhost:8080/alertlist/remove",
                { prodid },
                { withCredentials: true } // 인증 정보 포함
            );

            if (response.status === 200) {
                // 서버가 성공적으로 업데이트되었을 때 로컬 상태도 업데이트
                setAlertlist((prevList) => {
                    const updatedList = prevList.filter((id) => id !== prodid);
                    sessionStorage.setItem("alertlist", JSON.stringify(updatedList)); // 세션에 저장
                    return updatedList;
                });

                console.log(`Product ${prodid} removed from alertlist successfully`);
            } else {
                console.error(`Failed to remove product ${prodid}:`, response.data.message);
            }
        } catch (error) {
            console.error(`Error removing product ${prodid} from alertlist:`, error);
        }
    };



    const renderProductAlerts = () => {
        return alertlist.map((prodid, index) => (
            <div
                onClick={() => handleAlertClick(prodid)} // 제품 클릭 시 상세 페이지로 이동
                key={index}
                className="bg-red-400 p-3 mt-[0.5rem] text-white border shadow-md rounded-xl flex items-center justify-between"
            >
                {/* 제품 아이콘 */}
                {productInfo[prodid]?.iconpicture && (
                    <img
                        src={productInfo[prodid].iconpicture} // 아이콘 이미지
                        alt={`Product ${prodid}`}
                        className="w-10 h-10 mr-2 rounded-lg shadow-md"
                    />
                )}
                <span>{prodid}번 제품에 제품 문의가 들어왔습니다</span>
                <div
                    className="h-full w-[1.5rem] cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation(); // X 아이콘 클릭 시 부모 div 클릭 이벤트를 막음
                        handleRemoveAlert(prodid); // 알림 제거 함수 호출
                    }}
                >
                    <FaWindowClose className="h-full w-[1.5rem] mt-[0.1rem] ml-[0.25rem]" />
                </div>
            </div>
        ));
    };


    const fetchProductInfo = async (prodid) => {
        setIsFetching(true);
        try {
            const response = await axios.get(`http://localhost:8080/product/${prodid}`);
            if (response.data) {
                setProductInfo((prevInfo) => ({
                    ...prevInfo,
                    [prodid]: response.data // 제품 정보 업데이트
                }));
            }
        } catch (error) {
            console.error("Error fetching product info:", error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        // 알림 목록에 있는 모든 prodid에 대해 제품 정보 가져오기
        alertlist.forEach((prodid) => {
            if (!productInfo[prodid]) { // 이미 정보가 없다면 API 호출
                fetchProductInfo(prodid);
            }
        });
    }, [alertlist, productInfo]);

    useEffect(() => {
        // 로그인 상태일 때만 실행
        if (loginStatus && !sessionStorage.getItem("userProfile") && !isFetching) {
            const fetchUserInfo = async () => {
                setIsFetching(true);
                try {
                    const response = await axios.get("http://localhost:8080/api/userinfo", { withCredentials: true });
                    if (response.data.success) {
                        // 로그인 상태 및 사용자 정보 업데이트
                        setLoginStatus(true);
                        setUserProfile(response.data.profileimg);
                        setMoney(response.data.money);

                        // 세션에 사용자 정보 저장
                        sessionStorage.setItem("loginStatus", "true");
                        sessionStorage.setItem("userProfile", JSON.stringify(response.data.profileimg));
                        sessionStorage.setItem("money", response.data.money);
                        sessionStorage.setItem("userType", response.data.userType);

                        // alertlist 값 설정
                        if (response.data.alertlist) {
                            setAlertlist(response.data.alertlist);  // alertlist 값이 있으면 설정
                            sessionStorage.setItem("alertlist", JSON.stringify(response.data.alertlist)); // 세션에도 저장
                        } else {
                            setAlertlist([]); // alertlist가 없으면 빈 배열 설정
                        }
                    } else {
                        // 로그인 실패 처리
                        setLoginStatus(false);
                        setUserProfile(null);
                        setMoney(0);
                        sessionStorage.removeItem("loginStatus");
                        sessionStorage.removeItem("userProfile");
                        sessionStorage.removeItem("money");
                        sessionStorage.removeItem("userType");
                        sessionStorage.removeItem("alertlist");
                    }
                } catch (error) {
                    console.error("Failed to fetch user info:", error);
                } finally {
                    setIsFetching(false); // Fetch 작업 끝
                }
            };

            fetchUserInfo(); // 서버에서 사용자 정보를 가져오는 함수 호출
        }
    }, [loginStatus, setLoginStatus, setUserProfile, setMoney, isFetching]);


    const handleOpenNotification = () => setNotificationVisible(true);
    const handleCloseNotification = () => setNotificationVisible(false);

    // Dropdown behavior for navigation
    const showDropdown = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setDropdownVisible(true);
    };

    const hideDropdown = () => {
        timeoutRef.current = setTimeout(() => {
            setDropdownVisible(false);
        }, 300);
    };

    // Navigation functions
    const gohome = () => navigate("/");
    const gocart = () => navigate("/cart");
    const goweight = () => navigate("/product_Main/weight");
    const gocrossfit = () => navigate("/product_Main/crossfit");
    const gopilates = () => navigate("/product_Main/pilates");
    const goclimbing = () => navigate("/product_Main/climbing");
    const goswim = () => navigate("/product_Main/swim");
    const gomypage = () => navigate("/MyPage");
    const goAddProduct = () => navigate("/AddProduct");
    const goFAQPage = () => navigate("/FAQPage")
    const goadminpage = () => navigate("/adminPage")
    // Handle charge popup visibility
    const handleOpenChargePopup = () => {
        setChargePopupVisible(true);
    };

    const handleCloseChargePopup = () => {
        setChargePopupVisible(false);
    };

    const handleConfirmCharge = (amount) => {
        alert(`${amount}원이 충전되었습니다.`);
        setChargePopupVisible(false);
    };


    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start mr-[2rem]">
                <a onClick={gohome} className="btn btn-ghost w-full h-full text-xl">
                    <img className="w-[14rem] h-[4rem] shadow-md rounded-3xl" alt="로고" src="https://ifh.cc/g/PTwhob.jpg" />
                </a>
            </div>

            <div
                className="navbar-center flex mt-[1rem] relative"
                onMouseEnter={showDropdown}
                onMouseLeave={hideDropdown}
            >
                <div className="mr-[2rem] w-[8rem] h-[2rem] cursor-pointer">GYM & PT</div>
                <div className="mr-[2rem] w-[8rem] h-[2rem] cursor-pointer">COMMUNITY</div>
                <div className="ml-[18rem] w-[8rem] h-[2rem] cursor-pointer">C/S CENTER</div>

                {isDropdownVisible && (
                    <div
                        className="absolute top-[2rem] border-[0.1rem] border-gray-950 rounded-xl mt-[0.5rem] left-1/2 transform -translate-x-1/2 w-[80rem] flex items-center bg-gray-100 shadow-md p-5 z-10"
                        onMouseEnter={showDropdown}
                        onMouseLeave={hideDropdown}
                    >
                        <div className="ml-[18rem]">
                            <ul>
                                <li className="cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500" onClick={goweight}>헬스</li>
                                <li className="cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500" onClick={goswim}>수영</li>
                                <li className="cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500" onClick={goclimbing}>클라이밍</li>
                                <li className="cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500" onClick={gopilates}>필라테스</li>
                                <li className="cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500" onClick={gocrossfit}>크로스핏</li>
                            </ul>
                        </div>
                        <div className="ml-[6rem]">
                            <ul>
                                <li>NOTICE</li>
                                <li className="cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500" onClick={goFAQPage}>Q&A</li>
                                <li>제휴/협력문의</li>
                            </ul>
                        </div>
                        <div className="ml-[15.4rem] border-l-[0.1rem] border-gray-400 w-[20rem] h-[9rem]">
                            <ul>
                                <li>1800-2401</li>
                                <li>OPEN 09:00 ~ 18:00</li>
                                <li>BREAK 12:00 ~ 13:00</li>
                                <li className="mt-[1.5rem]">KAKAO +</li>
                                <li>호준짐</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            <div className="navbar-end">
                {loginStatus ? (
                    // If the user is logged in
                    userType === "admin" ? (
                        // admin은 아무 것도 표시하지 않음
                        null
                    ) : userType === "gymManager" ? (
                        <div onClick={handleOpenNotification} className="flex rounded-full w-[3rem] h-[3rem] border-[0.2rem] cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 mb-[0.38rem] mr-[0.7rem] border-red-400">
                            <FaBell className="w-[2.4rem] items-center mt-[0.1rem] justify-center fill-red-400 h-[2.4rem] ml-[0.1rem]" />
                        </div>
                    ) : (
                        <div onClick={gocart} className="flex rounded-full w-[3rem] h-[3rem] border-[0.2rem] cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 mb-[0.38rem] mr-[0.7rem] border-red-400">
                            <FaShoppingBasket className="w-[2.4rem] items-center justify-center fill-red-400 h-[2.4rem] ml-[0.1rem]" />
                        </div>
                    )
                ) : (
                    <div onClick={gocart} className="flex rounded-full w-[3rem] h-[3rem] border-[0.2rem] cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 mb-[0.38rem] mr-[0.7rem] border-red-400">
                        <FaShoppingBasket className="w-[2.4rem] items-center justify-center fill-red-400 h-[2.4rem] ml-[0.1rem]" />
                    </div>
                )}
                {isNotificationVisible && (
                    <div
                        className="absolute top-[6rem] right-[9.5rem] bg-white shadow-lg p-5 rounded-lg z-50 border border-gray-300">
                        <h3 className="text-xl w-[15rem] ml-[1.8rem] font-semibold mb-2">알림</h3>
                        <div className="flex flex-col">
                            {renderProductAlerts()} {/* 알림 메시지 렌더링 */}
                            <button
                                onClick={handleCloseNotification}
                                className="mt-4 px-4 py-2 bg-red-400 hover:border hover:border-red-400 hover:bg-white hover:scale-110 transition-transform ease-in-out duration-500 hover:text-red-400 text-white rounded-lg"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                )}
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="btn" className="btn btn-ghost btn-circle avatar">
                        {loginStatus && userProfile && userProfile.profileimg ? (
                            <div className="w-10 rounded-full">
                                <img src={`http://localhost:8080${userProfile.profileimg}`} alt="User Avatar"/>
                            </div>
                        ) : (
                            <div className="w-10 rounded-full">
                                <img src="https://ifh.cc/g/bz6Sap.png" alt="Default Avatar" />
                            </div>
                        )}
                    </div>
                    <div
                        tabIndex={0}
                        className="mt-3 z-10 p-2 menu menu-sm dropdown-content bg-white rounded-box w-60"
                    >
                        {loginStatus && (
                            <div className="border-[0.1rem] text-red-400 hover:bg-red-400 hover:scale-110 transition-transform ease-in-out duration-500 hover:text-white cursor-pointer text-start rounded-md border-red-400">
                                <a
                                    onClick={userType === "admin" ? goadminpage : gomypage}
                                    className="ml-[1rem] text-lg"
                                >
                                    {userType === "admin" ? "ADMIN PAGE" : "MY PAGE"}
                                </a>
                            </div>
                        )}
                        <div
                            className="h-full rounded-md items-start fill-red-400 hover:fill-white text-red-400 hover:scale-110 hover:bg-red-400 hover:text-white transition-transform ease-in-out duration-500 justify-start p-3 flex flex-col border-red-400 border-[0.1rem]"
                        >
                            {loginStatus ? (
                                <>
                                    {userType === "gymManager" ? (
                                        // Gym Manager 뷰
                                        <>
                                            <p className="text-xl flex">{`등록한 제품 수: ${productCount}개`}</p>
                                            <div className="flex flex-row mt-[1rem] ml-[7.2rem]">
                                                <div
                                                    onClick={goProductManage}
                                                    className="w-[2.5rem] bg-red-400 text-white hover:text-red-400 shadow-md cursor-pointer hover:scale-125 transition-transform ease-in-out duration-500 hover:bg-white h-[1.4rem] flex items-center justify-center rounded-xl"
                                                >
                                                    <a className="flex mt-[0.15rem]">관리</a>
                                                </div>
                                                <div
                                                    onClick={goAddProduct}
                                                    className="w-[2.5rem] text-red-400 hover:text-white bg-white border-[0.1rem] cursor-pointer hover:scale-125 hover:bg-red-400 transition-transform ease-in-out duration-500 border-red-400 ml-[0.2rem] shadow-md h-[1.4rem] flex items-center justify-center rounded-xl"
                                                >
                                                    <a className="flex mt-[0.1rem]">등록</a>
                                                </div>
                                            </div>
                                        </>
                                    ) : userType === "individual" ? (
                                        // 개인 사용자 뷰 (핏머니)
                                        <>
                                            <div className="flex flex-row">
                                                <a className="text-xs">핏머니 ·</a>
                                                <FaPlaystation className="ml-[0.1rem]"/>
                                                <a className="text-xs">PLAY 증권</a>
                                            </div>
                                            <p className="text-xl flex">{Number(displayMoney).toLocaleString()}원</p>
                                            <div className="flex flex-row ml-[7.2rem]">
                                                <div
                                                    onClick={handleOpenChargePopup}
                                                    className="w-[2.5rem] bg-red-400 text-white hover:text-red-400 shadow-md cursor-pointer hover:scale-125 transition-transform ease-in-out duration-500 hover:bg-white h-[1.4rem] flex items-center justify-center rounded-xl"
                                                >
                                                    <a className="flex mt-[0.15rem]">충전</a>
                                                </div>
                                                <div
                                                    className="w-[2.5rem] text-red-400 hover:text-white bg-white border-[0.1rem] cursor-pointer hover:scale-125 hover:bg-red-400 transition-transform ease-in-out duration-500 border-red-400 ml-[0.2rem] shadow-md h-[1.4rem] flex items-center justify-center rounded-xl"
                                                >
                                                    <a className="flex mt-[0.1rem]">선물</a>
                                                </div>
                                            </div>
                                        </>
                                    ) : <p className="text-xl">관리자 계정</p>}
                                </>
                            ) : (
                                <p>로그인되지 않았습니다.</p>
                            )}
                        </div>

                        {isChargePopupVisible && userType !== "gymManager" && (
                            <ChargePopup
                                userProfile={userProfile}
                                closePopup={handleCloseChargePopup}
                                confirmCharge={handleConfirmCharge}
                                setMoney={setMoney}
                            />
                        )}
                        {loginStatus ? (
                            <div onClick={handleLogout} className="border-[0.1rem] text-red-400 hover:text-white hover:bg-red-400 cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 text-start rounded-xl shadow-md border-red-400">
                                <a className="text-lg ml-[1rem] text-start">Logout</a>
                            </div>
                        ) : (
                            <div onClick={() => document.getElementById("my_modal_3").showModal()} className="border-[0.1rem] text-red-400 hover:text-white hover:bg-red-400 cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 text-start rounded-xl shadow-md border-red-400">
                                <a className="text-lg ml-[1rem] text-start">Login</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <dialog id="my_modal_3" className="modal">
                <Login setLoginStatus={setLoginStatus} />
            </dialog>
        </div>
    );
};

export default Navbar;
