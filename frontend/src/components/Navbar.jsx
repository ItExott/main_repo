    import React, { useState, useEffect, useRef } from "react";
    import { useNavigate } from "react-router-dom";
    import Login from "../popup/Login.jsx";
    import { FaShoppingBasket } from "react-icons/fa";
    import { FaPlaystation } from "react-icons/fa6";
    import axios from "axios";
    import ChargePopup from "../popup/ChargePopup.jsx";

    const Navbar = ({ loginStatus, setLoginStatus, userProfile, money }) => {

        const displayMoney = money || 0; // money가 0일 경우 기본값 0으로 설정
        const navigate = useNavigate();
        const [isDropdownVisible, setDropdownVisible] = useState(false);
        const timeoutRef = useRef(null);
        const [isChargePopupVisible, setChargePopupVisible] = useState(false);

        useEffect(() => {
            // 세션 스토리지에서 로그인 정보와 사용자 정보 확인
            const storedLoginStatus = sessionStorage.getItem("loginStatus");
            const storedUserProfile = JSON.parse(sessionStorage.getItem("userProfile"));

            if (storedLoginStatus === "true" && storedUserProfile) {
                setLoginStatus(true);
            } else {
                setLoginStatus(false);
            }

            if (!storedLoginStatus || !storedUserProfile) {
                // 로그인 상태가 없으면 서버에서 정보 요청
                const fetchUserInfo = async () => {
                    try {
                        const response = await axios.get("http://localhost:8080/api/userinfo", { withCredentials: true });
                        if (response.data.success) { // 서버에서 응답 성공적으로 받은 경우
                            setLoginStatus(true);
                            sessionStorage.setItem("loginStatus", "true");
                            sessionStorage.setItem("userProfile", JSON.stringify(response.data.profileimg)); // 프로필 이미지 저장
                            sessionStorage.setItem("money", response.data.money); // money 값을 세션에 저장
                        } else {
                            setLoginStatus(false);
                            sessionStorage.removeItem("loginStatus");
                            sessionStorage.removeItem("userProfile");
                            sessionStorage.removeItem("money"); // 세션에서 money 정보도 제거
                        }
                    } catch (error) {
                        console.error("사용자 정보 가져오기 실패:", error);
                    }
                };

                fetchUserInfo(); // 사용자 정보 요청
            }
        }, [setLoginStatus]);

        // 드롭다운 표시 상태 관리
        const showDropdown = () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setDropdownVisible(true);
        };

        const handleOpenChargePopup = () => {
            setChargePopupVisible(true);
        };

        const handleCloseChargePopup = () => {
            setChargePopupVisible(false);
        };

        const handleConfirmCharge = (amount) => {
            console.log(`${amount}원이 충전되었습니다.`);
            // API 호출로 충전 처리 추가 가능
            setChargePopupVisible(false);
        };

        const hideDropdown = () => {
            timeoutRef.current = setTimeout(() => {
                setDropdownVisible(false);
            }, 300);
        };

        const gohome = () => navigate("/");
        const gocart = () => navigate("/cart");
        const goweight = () => navigate("/product_Main/weight");
        const gocrossfit = () => navigate("/product_Main/crossfit");
        const gopilates = () => navigate("/product_Main/pilates");
        const goclimbing = () => navigate("/product_Main/climbing");
        const goswim = () => navigate("/product_Main/swim");

        // 로그아웃 처리
        const handleLogout = async () => {
            try {
                const response = await axios.post("http://localhost:8080/api/logout", {}, { withCredentials: true });
                if (response.data.success) {
                    setLoginStatus(false);
                    sessionStorage.removeItem("loginStatus");
                    sessionStorage.removeItem("userProfile"); // sessionStorage에서 로그아웃 정보 제거
                    sessionStorage.removeItem("money"); // money 정보도 제거
                    alert("로그아웃 되었습니다.");
                    navigate("/");
                }
            } catch (error) {
                alert("로그아웃에 실패했습니다.");
            }
        };

        return (
            <div className="navbar bg-base-100]">
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
                    <div onClick={gocart} className="flex rounded-full w-[3rem] h-[3rem] border-[0.2rem] cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 mb-[0.38rem] mr-[0.7rem] border-red-400">
                        <FaShoppingBasket className="w-[2.4rem] items-center justify-center fill-red-400 h-[2.4rem] ml-[0.1rem]"/>
                    </div>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0}
                             role="btn"
                             className="btn btn-ghost btn-circle avatar">
                            <>
                            {userProfile && userProfile.profileimg && (
                            <div className="w-10 rounded-full">
                                <img
                                    src={userProfile.profileimg}
                                    alt="Profile"
                                />
                            </div>
                            )}
                            </>
                        </div>
                        <div
                            tabIndex={0}
                            className="mt-3 z-10 p-2 menu menu-sm dropdown-content bg-white rounded-box w-60"
                        >
                            <div className="border-[0.1rem] text-red-400 hover:bg-red-400 hover:scale-110 transition-transform ease-in-out duration-500 hover:text-white cursor-pointer text-start rounded-md border-red-400">
                                <a className="ml-[1rem] text-lg">MY PAGE</a>
                            </div>

                            <div
                                className="h-full rounded-md items-start fill-red-400 hover:fill-white text-red-400 hover:scale-110 hover:bg-red-400 hover:text-white transition-transform ease-in-out duration-500 justify-start p-3 flex flex-col border-red-400 border-[0.1rem]">
                                <div className="flex flex-row">
                                    <a className="text-xs">핏머니 ·</a>
                                    <FaPlaystation className="ml-[0.1rem]"/>
                                    <a className="text-xs">PLAY 증권</a>
                                </div>
                                {loginStatus ? (
                                    <p className="text-xl flex">{Number(displayMoney).toLocaleString()}원</p>
                                ) : (
                                    <p>로그인되지 않았습니다.</p>
                                )}
                                {loginStatus && ( // 로그인 상태일 때만 렌더링
                                <div className="flex flex-row ml-[7.2rem]">
                                    <div
                                        onClick={handleOpenChargePopup} className="w-[2.5rem] bg-red-400 text-white  hover:text-red-400 shadow-md cursor-pointer hover:scale-125 transition-transform ease-in-out duration-500 hover:bg-white h-[1.4rem] flex itmes-center justify-center rounded-xl">
                                        <a className="flex mt-[0.15rem]">충전</a></div>
                                <div
                                    className="w-[2.5rem] text-red-400 hover:text-white bg-white border-[0.1rem] cursor-pointer hover:scale-125 hover:bg-red-400 transition-transform ease-in-out duration-500 border-red-400 ml-[0.2rem] shadow-md h-[1.4rem] flex itmes-center justify-center rounded-xl">
                                    <a className="flex mt-[0.1rem]">선물</a></div>
                                </div>
                                )}
                            </div>
                            {isChargePopupVisible && (
                                <ChargePopup
                                    userId={userProfile?.userId}
                                    closePopup={handleCloseChargePopup}
                                    confirmCharge={handleConfirmCharge}
                                />
                            )}
                            <>
                            {loginStatus ? (
                                <div onClick={handleLogout} className="border-[0.1rem] text-red-400 hover:text-white hover:bg-red-400 cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 text-start rounded-xl shadow-md border-red-400">
                                <a className="text-lg ml-[1rem] text-start">
                                    Logout
                                </a>
                                </div>
                            ) : (
                                <div onClick={() => document.getElementById("my_modal_3").showModal()} className="border-[0.1rem] text-red-400 hover:text-white hover:bg-red-400 cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 text-start rounded-xl shadow-md border-red-400">
                                    <a className="text-lg ml-[1rem] text-start">
                                        Login
                                    </a>
                                </div>
                            )}
                            </>
                        </div>
                    </div>
                </div>

                <dialog id="my_modal_3" className="modal">
                    <Login setLoginStatus={setLoginStatus}/>
                </dialog>
            </div>
        );
    };

    export default Navbar;
