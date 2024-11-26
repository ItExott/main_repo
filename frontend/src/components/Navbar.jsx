import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../popup/Login.jsx";
import { FaShoppingBasket } from "react-icons/fa";
import { FaPlaystation } from "react-icons/fa6";
import axios from "axios";
import ChargePopup from "../popup/ChargePopup.jsx";
import myPage from "../pages/MyPage.jsx";

const Navbar = ({ loginStatus, setLoginStatus, userProfile, setUserProfile, money, setMoney, handleLogout }) => {
    const displayMoney = money || 0; // Default money to 0 if not available
    const navigate = useNavigate();
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const timeoutRef = useRef(null);
    const [isChargePopupVisible, setChargePopupVisible] = useState(false);
    const [isFetching, setIsFetching] = useState(false); // Track fetch status

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
        if (loginStatus && !sessionStorage.getItem("userProfile") && !isFetching) {
            const fetchUserInfo = async () => {
                setIsFetching(true);
                try {
                    const response = await axios.get("http://localhost:8080/api/userinfo", { withCredentials: true });
                    if (response.data.success) {
                        setLoginStatus(true);
                        setUserProfile(response.data.profileimg);
                        setMoney(response.data.money);
                        sessionStorage.setItem("loginStatus", "true");
                        sessionStorage.setItem("userProfile", JSON.stringify(response.data.profileimg));
                        sessionStorage.setItem("money", response.data.money);
                    } else {
                        setLoginStatus(false);
                        setUserProfile(null);
                        setMoney(0);
                        sessionStorage.removeItem("loginStatus");
                        sessionStorage.removeItem("userProfile");
                        sessionStorage.removeItem("money");
                    }
                } catch (error) {
                    console.error("Failed to fetch user info:", error);
                } finally {
                    setIsFetching(false); // End the fetch operation
                }
            };

            fetchUserInfo(); // 서버에서 사용자 정보를 가져오는 함수 호출
        }
    }, [loginStatus, setLoginStatus, setUserProfile, setMoney, isFetching]);

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
            <div className="navbar-start">
                <a onClick={gohome} className="btn btn-ghost w-full h-full text-xl">
                    <img className="w-[14rem] h-[4rem]" alt="로고" src="https://ifh.cc/g/oRNlfd.png" />
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
                                <li>Q&A</li>
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
                <div onClick={gocart} className="flex rounded-full w-[3rem] h-[3rem] border-[0.2rem] cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 mb-[0.38rem] mr-[0.7rem] border-red-400">
                    <FaShoppingBasket className="w-[2.4rem] items-center justify-center fill-red-400 h-[2.4rem] ml-[0.1rem]" />
                </div>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="btn" className="btn btn-ghost btn-circle avatar">
                        {userProfile && userProfile.profileimg && (
                            <div className="w-10 rounded-full">
                                <img src={userProfile.profileimg} alt="Profile" />
                            </div>
                        )}
                    </div>
                    <div
                        tabIndex={0}
                        className="mt-3 z-10 p-2 menu menu-sm dropdown-content bg-white rounded-box w-60"
                    >
                        <div className="border-[0.1rem] text-red-400 hover:bg-red-400 hover:scale-110 transition-transform ease-in-out duration-500 hover:text-white cursor-pointer text-start rounded-md border-red-400">
                            <a onClick={gomypage} className="ml-[1rem] text-lg">MY PAGE</a>
                        </div>

                        <div
                            className="h-full rounded-md items-start fill-red-400 hover:fill-white text-red-400 hover:scale-110 hover:bg-red-400 hover:text-white transition-transform ease-in-out duration-500 justify-start p-3 flex flex-col border-red-400 border-[0.1rem]"
                        >
                            <div className="flex flex-row">
                                <a className="text-xs">핏머니 ·</a>
                                <FaPlaystation className="ml-[0.1rem]" />
                                <a className="text-xs">PLAY 증권</a>
                            </div>
                            {loginStatus ? (
                                <p className="text-xl flex">{Number(displayMoney).toLocaleString()}원</p>
                            ) : (
                                <p>로그인되지 않았습니다.</p>
                            )}
                            {loginStatus && (
                                <div className="flex flex-row ml-[7.2rem]">
                                    <div onClick={handleOpenChargePopup} className="w-[2.5rem] bg-red-400 text-white  hover:text-red-400 shadow-md cursor-pointer hover:scale-125 transition-transform ease-in-out duration-500 hover:bg-white h-[1.4rem] flex itmes-center justify-center rounded-xl">
                                        <a className="flex mt-[0.15rem]">충전</a>
                                    </div>
                                    <div
                                        className="w-[2.5rem] text-red-400 hover:text-white bg-white border-[0.1rem] cursor-pointer hover:scale-125 hover:bg-red-400 transition-transform ease-in-out duration-500 border-red-400 ml-[0.2rem] shadow-md h-[1.4rem] flex itmes-center justify-center rounded-xl">
                                        <a className="flex mt-[0.1rem]">선물</a>
                                    </div>
                                </div>
                            )}
                        </div>
                        {isChargePopupVisible && (
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
