import React, { useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../popup/Login.jsx";
import { FaMoneyCheckDollar } from "react-icons/fa6";


const Navbar = ({ loginStatus, setLoginStatus }) => {
    const navigate = useNavigate();
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const timeoutRef = useRef(null); // 타이머를 추적하기 위한 ref

    // 드롭다운 표시 상태를 처리하는 함수
    const showDropdown = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current); // 기존 타이머 취소
        setDropdownVisible(true); // 즉시 드롭다운 표시
    };

    const hideDropdown = () => {
        timeoutRef.current = setTimeout(() => {
            setDropdownVisible(false); // 일정 시간이 지난 후 드롭다운 숨김
        }, 300); // 300ms 지연 (필요에 따라 조정 가능)
    };

    const handleLogout = () => {
        setLoginStatus(false);
    };

    const gocliming = () => {
        navigate("/product_Main");
    };

    const gohome = () => {
        navigate("/");
    };

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <a onClick={gohome} className="btn btn-ghost w-[13rem]  text-xl">
                    <img alt="로고" src="https://ifh.cc/g/xrkNK1.png"/>
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
                                <li>헬스</li>
                                <li>수영</li>
                                <li className="cursor-pointer hover:scale-11    0 transition-transform ease-in-out duration-500" onClick={gocliming}>클라이밍</li>
                                <li>필라테스</li>
                                <li>크로스핏</li>
                            </ul>
                        </div>
                        <div className="ml-[6rem]">
                            <ul>
                                <li>NOTICE</li>
                                <li>Q&A</li>
                                <li>출석체크</li>
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
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="btn" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="프로필 사진"
                                src={loginStatus ? "https://ifh.cc/g/7ky5bT.jpg" : "https://ifh.cc/g/bFHjG0.png"}
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
                                <a className="whitespace-nowrap">보유 머니 : 5000원</a>
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