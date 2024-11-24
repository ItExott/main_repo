import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../popup/Login.jsx";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { FaShoppingBasket } from "react-icons/fa";
import axios from "axios";

const Navbar = ({ loginStatus, setLoginStatus }) => {
    const navigate = useNavigate();
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [userProfile, setUserProfile] = useState(null); // 사용자 프로필 정보
    const timeoutRef = useRef(null);

    // 새로고침 시 로그인 정보 유지
    useEffect(() => {
        const storedLoginStatus = sessionStorage.getItem("loginStatus");
        const storedUserProfile = JSON.parse(sessionStorage.getItem("userProfile"));

        if (storedLoginStatus === "true" && storedUserProfile) {
            setLoginStatus(true);
            setUserProfile(storedUserProfile);
        } else {
            setLoginStatus(false);
            setUserProfile(null);
        }
    }, [setLoginStatus]);

    // 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/userinfo", { withCredentials: true });
                if (response.data.loggedIn) {
                    setLoginStatus(true);
                    setUserProfile(response.data.user);
                    sessionStorage.setItem("loginStatus", "true");
                    sessionStorage.setItem("userProfile", JSON.stringify(response.data.user)); // sessionStorage에 저장
                } else {
                    setLoginStatus(false);
                    setUserProfile(null); // 로그아웃 상태 처리
                    sessionStorage.removeItem("loginStatus");
                    sessionStorage.removeItem("userProfile");
                }
            } catch (error) {
                console.error("사용자 정보 가져오기 실패:", error);
            }
        };

        if (!loginStatus) {
            fetchUserInfo(); // 로그인하지 않은 상태일 때만 사용자 정보 요청
        }
    }, [loginStatus, setLoginStatus]);

    // 드롭다운 표시 상태 관리
    const showDropdown = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setDropdownVisible(true);
    };

    const hideDropdown = () => {
        timeoutRef.current = setTimeout(() => {
            setDropdownVisible(false);
        }, 300);
    };

    const gohome = () => navigate("/");

    const goweight = () => {
        navigate("/product_Main/weight");
    };

    const gocart = () => {
        navigate("/Cart");
    };

    const gocrossfit = () => {
        navigate("/product_Main/crossfit");
    };

    const gopilates = () => {
        navigate("/product_Main/pilates");
    };

    const goclimbing = () => {
        navigate("/product_Main/climbing");
    };

    const goswim = () => {
        navigate("/product_Main/swim");
    };

    // 로그아웃 처리
    const handleLogout = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/logout", {}, { withCredentials: true });
            if (response.data.success) {
                setLoginStatus(false);
                setUserProfile(null); // 프로필 정보 초기화
                sessionStorage.removeItem("loginStatus");
                sessionStorage.removeItem("userProfile"); // sessionStorage에서 로그아웃 정보 제거
                alert("로그아웃");
            }
        } catch (error) {
            alert("로그아웃에 실패했습니다.");
        }
    };

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <a onClick={gohome} className="btn btn-ghost w-full h-full text-xl">
                    <img className="w-[14rem] h-[3rem]" alt="로고" src="https://ifh.cc/g/KMhc7f.png" />
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
                        onMouseEnter={showDropdown} // 드롭다운 영역에 마우스가 진입하면 유지
                        onMouseLeave={hideDropdown} // 드롭다운 영역을 떠나면 숨김
                    >
                        <div className="ml-[18rem]">
                            <ul>
                                <li className="cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500"
                                    onClick={goweight}>헬스
                                </li>
                                <li className="cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500"
                                    onClick={goswim}>수영
                                </li>
                                <li className="cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500"
                                    onClick={goclimbing}>클라이밍
                                </li>
                                <li className="cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500"
                                    onClick={gopilates}>필라테스
                                </li>
                                <li className="cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500"
                                    onClick={gocrossfit}>크로스핏
                                </li>
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
                <div onClick={gocart} className="flex rounded-full w-[3rem] h-[3rem] border-[0.2rem] cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 mb-[0.38rem] mr-[0.7rem] border-red-400"><FaShoppingBasket className="w-[2.4rem] items-center justify-center fill-red-400 h-[2.4rem] ml-[0.1rem]"/></div>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="btn" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="프로필 사진"
                                src={loginStatus && userProfile ? userProfile.profileimg : "https://ifh.cc/g/bFHjG0.png"}
                            />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="mt-3 z-10 p-2 shadow-md menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                    >
                        <li>
                            <a className="justify-between font-bold">Profile</a>
                        </li>
                        <li>
                            <div className="h-[4rem] items-center justify-center flex flex-row border-[0.1rem]">
                                <FaMoneyCheckDollar className="h-[1.5rem] w-[1.5rem]"/>
                                <a className="whitespace-nowrap">보유 머니 : {userProfile?.money || 0}원</a>
                                <a className="text-xs w-[1rem] h-[1rem] border-[0.1rem] whitespace-nowrap">충전</a>
                            </div>
                        </li>
                        {loginStatus ? (
                            <li className="mt-[0.2rem]">
                                <a onClick={handleLogout} className="font-bold">
                                    Logout
                                </a>
                            </li>
                        ) : (
                            <li className="mt-[0.2rem]">
                                <a onClick={() => document.getElementById("my_modal_3").showModal()}
                                   className="font-bold">
                                    Login
                                </a>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            <dialog id="my_modal_3" className="modal">
                <Login setLoginStatus={setLoginStatus}/>
            </dialog>
        </div>
    );
};

export default Navbar;
