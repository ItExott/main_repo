import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom"; // useLocation 훅은 컴포넌트 맨 위에 두어야 합니다.
import { BiSearch } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Scrollbar } from "swiper";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/scrollbar';
import MainCard from "../components/MainCard.jsx";
import Attendance from "../popup/Attendance"; // 출석 체크 컴포넌트 임포트
import Login from "../popup/Login.jsx"; // 로그인 모달 컴포넌트 임포트

const Home = () => {
    const [isFocused, setIsFocused] = useState(false); // 검색창 포커스 상태
    const [query, setQuery] = useState(""); // 검색어
    const [showSuggestions, setShowSuggestions] = useState(false); // 추천 검색어 박스 표시 여부
    const [isCalendarOpen, setIsCalendarOpen] = useState(false); // 출석체크 달력 팝업 상태
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 (로그인 여부)
    const location = useLocation();
    const { openLoginModal = false } = location.state || {}; // state에서 openLoginModal 가져오기
    // useLocation 훅을 통해 location 객체 가져오기


    const inputRef = useRef(null);

    // 검색어 입력 변화 처리
    const handleChange = (e) => {
        setQuery(e.target.value);
        setShowSuggestions(e.target.value.length > 0); // 입력이 있으면 추천 박스 표시
    };

    // 로그인 상태 변경 함수
    const handleLogin = () => {
        setIsLoggedIn(true); // 로그인 상태로 변경
        setIsCalendarOpen(true); // 로그인 후 출석 체크 팝업 열기
    };

    // 출석 체크 날짜 선택 처리
    const handleDateSelect = (date) => {
        console.log("선택된 날짜:", date); // 선택된 날짜 출력
    };

    // 로그인 모달 띄우기
    useEffect(() => {
        const loginModal = document.getElementById('loginModal');
        if (openLoginModal) {
            loginModal.showModal();  // 모달 열기
        } else {
            loginModal.close();  // 모달 닫기
        }
    }, [openLoginModal]);

    return (
        <div className="flex flex-col h-full items-center justify-center mx-56">
            {/* 로그인 버튼 (임시) */}
            {!isLoggedIn && (
                <button onClick={handleLogin} className="mt-4 p-2 bg-blue-500 text-white rounded-md">
                    로그인
                </button>
            )}

            {/* 출석 체크 팝업 */}
            <Attendance
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)} // 팝업 닫기
                onDateSelect={handleDateSelect} // 날짜 선택 시 처리 함수
            />

            {/* 로그인 모달 (dialog) */}
            <dialog id="loginModal">
                <Login />
                <button onClick={() => document.getElementById('loginModal').close()}>닫기</button>
            </dialog>

            <div className="flex flex-row h-14 w-[35rem] items-center justify-center shadow-xl rounded-xl relative"> {/*검색창*/}
                <FaLocationDot size="20" className="ml-3 cursor-pointer mt-[0.06rem]" />
                <div className="flex flex-row w-1/5 cursor-pointer"> {/* 로케이션 아이콘 */}
                    <p className="text-sm font-bold text-nowrap ml-[0.5rem]">송파구 마천동</p>
                </div>
                <div className="flex flex-row w-4/5 ml-2"> {/* 검색 박스 */}
                    <input
                        ref={inputRef}
                        type="text"
                        className="grow border-0 text-center mt-1"
                        placeholder="검색"
                        value={query}
                        onChange={handleChange} // 텍스트 입력 시
                    />
                </div>
                <BiSearch size="20"
                          className="mr-3 mt-1 cursor-pointer hover:scale-150 transition-transform ease-in-out duration-500"
                />
            </div>

            {/* MainCard들 */}
            <div className="flex flex-row w-[60rem] h-[20rem] mt-6 items-center justify-center shadow-xl rounded-xl">
                <Swiper
                    pagination={{
                        dynamicBullets: true,
                    }}
                    modules={[Pagination, Autoplay]}
                    className="shadow-xl rounded-xl"
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                >
                    <SwiperSlide><img src="https://ifh.cc/g/jS0w0T.png" /></SwiperSlide>
                    <SwiperSlide><img src="https://ifh.cc/g/PANybK.jpg" /></SwiperSlide>
                    <SwiperSlide><img src="https://ifh.cc/g/fxBCJX.jpg" /></SwiperSlide>
                </Swiper>
            </div>

            {/* 추가 Swiper 및 MainCard */}
            <div className="flex flex-row w-[60rem] h-[20rem] mt-6 items-center justify-center shadow-xl rounded-xl">
                <Swiper
                    slidesPerView="auto"
                    spaceBetween={-120}
                    centeredSlides={false}
                    scrollbar={{
                        hide: false,
                        draggable: true,
                        dragSize: 200,
                    }}
                    modules={[Scrollbar]}
                    className="flex w-full"
                >
                    <SwiperSlide className="flex ml-[5rem] justify-center w-auto h-auto"><MainCard text="카드1" sor="https://ifh.cc/g/QqVy3C.png" /></SwiperSlide>
                    <SwiperSlide className="flex ml-[14rem] justify-center w-auto h-auto"><MainCard text="카드2" sor="https://ifh.cc/g/M0Yaqq.png" /></SwiperSlide>
                </Swiper>
            </div>
        </div>
    );
};

export default Home
