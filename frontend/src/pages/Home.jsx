// src/pages/Home.jsx

import React, { useRef, useState, useEffect } from "react";
import { BiSearch } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Scrollbar } from "swiper";
import { useLocation } from "react-router-dom";
import Attendance from "../popup/Attendance.jsx"; // 출석체크 팝업 컴포넌트

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/scrollbar';
import MainCard from "../components/MainCard.jsx";
import Login from "../popup/Login.jsx";

const Home = () => {

    const [isFocused, setIsFocused] = useState(false);
    const [query, setQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false); // 출석체크 달력 팝업 상태
    const inputRef = useRef(null);

    // useLocation 훅을 사용하여 state에서 모달 열기 정보 가져오기
    const location = useLocation();
    const { openLoginModal = false } = location.state || {};

    // 페이지가 로드될 때 출석체크 팝업을 자동으로 띄우기
    useEffect(() => {
        const hasVisited = localStorage.getItem("hasVisited");

        // 방문 기록이 없으면 출석체크 팝업을 띄움

            setIsCalendarOpen(true);
            localStorage.setItem("hasVisited", "true");

    }, []);

    // 검색 관련 함수
    const handleChange = (e) => {
        setQuery(e.target.value);
        setShowSuggestions(e.target.value.length > 0);
    };

    const handleFocus = () => {
        setIsFocused(true);
        setShowSuggestions(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setShowSuggestions(false);
    };

    const handleDateSelect = (date) => {
        console.log("Selected Date:", date);
        // 날짜 선택 시 원하는 로직 추가 (예: 서버로 출석 정보 전송 등)
    };

    // 출석체크 팝업 닫기
    const closeCalendarPopup = () => {
        setIsCalendarOpen(false);
    };

    return (
        <div className="flex flex-col h-full items-center justify-center mx-56">
            {/* 출석체크 팝업 */}
            <Attendance
                isOpen={isCalendarOpen}
                onClose={closeCalendarPopup}
                onDateSelect={handleDateSelect}
            />

            {/* 검색 입력 필드 */}
            <div className="flex flex-row h-14 w-[35rem] items-center justify-center shadow-xl rounded-xl relative">
                <FaLocationDot size="20" className="ml-3 cursor-pointer mt-[0.06rem]" />
                <div className="flex flex-row w-1/5 cursor-pointer">
                    <p className="text-sm font-bold text-nowrap ml-[0.5rem]">송파구 마천동</p>
                </div>
                <div className="flex flex-row w-4/5 ml-2">
                    <input
                        ref={inputRef}
                        type="text"
                        className="grow border-0 text-center mt-1"
                        placeholder="검색"
                        value={query}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={handleChange}
                    />
                </div>
                <BiSearch size="20" className="mr-3 mt-1 cursor-pointer hover:scale-150 transition-transform ease-in-out duration-500" />
                {isFocused && showSuggestions && (
                    <div className="absolute top-14 w-[35rem] bg-white border rounded-xl shadow-lg z-10 mt-2">
                        <div className="flex justify-between mx-3 mt-2">
                            <p>추천 검색어</p>
                            <p>전체삭제</p>
                        </div>
                        <ul>
                            <li className="p-2 hover:bg-gray-100 cursor-pointer">추천 검색어 1</li>
                            <li className="p-2 hover:bg-gray-100 cursor-pointer">추천 검색어 2</li>
                            <li className="p-2 hover:bg-gray-100 cursor-pointer">추천 검색어 3</li>
                            <li className="p-2 hover:bg-gray-100 cursor-pointer">추천 검색어 4</li>
                        </ul>
                    </div>
                )}
            </div>

            {/* 슬라이드 */}
            <div className="flex flex-row w-[60rem] h-[20rem] mt-6 items-center justify-center shadow-xl rounded-xl">
                <Swiper
                    pagination={{ dynamicBullets: true }}
                    modules={[Pagination, Autoplay]}
                    className="shadow-xl rounded-xl"
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                >
                    <SwiperSlide>Slide 1</SwiperSlide>
                    <SwiperSlide>Slide 2</SwiperSlide>
                    <SwiperSlide>Slide 3</SwiperSlide>
                </Swiper>
            </div>

            {/* MainCard들 */}
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
                    <SwiperSlide className="flex justify-center w-auto h-auto"><MainCard text="카드1" sor="https://ifh.cc/g/7ky5bT.jpg" /></SwiperSlide>
                    <SwiperSlide className="flex justify-center w-auto h-auto"><MainCard text="카드2" /></SwiperSlide>
                    <SwiperSlide className="flex justify-center w-auto h-auto"><MainCard text="카드3" /></SwiperSlide>
                    <SwiperSlide className="flex justify-center w-auto h-auto"><MainCard text="카드4" /></SwiperSlide>
                    <SwiperSlide className="flex justify-center w-auto h-auto"><MainCard text="카드5" /></SwiperSlide>
                </Swiper>
            </div>
        </div>
    );
};

export default Home;
