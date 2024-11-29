import MainBox from "../components/MainBox.jsx";

{/*모듈 import문*/}
import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Scrollbar } from "swiper";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/scrollbar';
import axios from "axios";
{/*아이콘 import문*/}
import { useLocation } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
{/*컴포넌트 동기화문*/}
import MainCard from "../components/MainCard.jsx";
import Attendance from "../popup/Attendance";
import Login from "../popup/Login.jsx";


const Home = () => {
    const [isFocused, setIsFocused] = useState(false); // 검색창 포커스 상태
    const [query, setQuery] = useState(""); // 검색어
    const [showSuggestions, setShowSuggestions] = useState(false); // 추천 검색어 박스 표시 여부
    const [isCalendarOpen, setIsCalendarOpen] = useState(false); // 출석체크 달력 팝업 상태
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 (로그인 여부)
    const [activeTab, setActiveTab] = useState('weight');

    const location = useLocation();
    const { openLoginModal: locationOpenLoginModal = false } = location.state || {};

    const [openLoginModal, setOpenLoginModal] = useState(locationOpenLoginModal); // 초기값을 locationOpenLoginModal로 설정
    const inputRef = useRef(null);

    // 로그인 상태 확인 db문
    const [userId, setUserId] = useState(null);
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/userinfo', {
                    withCredentials: true, // 세션을 확인하려면 반드시 필요
                });

                if (response.data.success) {
                    setIsLoggedIn(true);
                    setUserId(response.data.userId);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('로그인 상태 확인 실패', error);
            }
        };

        checkLoginStatus();
    }, []);

    useEffect(() => {
        const handleBeforeUnload = () => {
            // 새로고침 시 state에 { openLoginModal: false } 설정
            window.history.replaceState({ openLoginModal: false }, '');
        };

        // beforeunload 이벤트 리스너 추가
        window.addEventListener('beforeunload', handleBeforeUnload);

        // 컴포넌트가 언마운트되거나 새로고침 후에는 이벤트 리스너 제거
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []); // 빈 배열을 두어 컴포넌트가 마운트될 때만 실행되게 함

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

    // 로그인 모달 띄우기 (useEffect로 처리)
    useEffect(() => {

        if (openLoginModal) {
            document.getElementById('my_modal_3').showModal();  // 로그인 모달을 띄운다
        }
    }, [openLoginModal]); // openLoginModal 값이 변경될 때마다 실행
    useEffect(() => {
        const handleBeforeUnload = () => {
            // 새로고침 시 state에 { openLoginModal: false } 설정
            window.history.replaceState({ openLoginModal: false }, '');
        };

        // beforeunload 이벤트 리스너 추가
        window.addEventListener('beforeunload', handleBeforeUnload);

        // 컴포넌트가 언마운트되거나 새로고침 후에는 이벤트 리스너 제거
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    useEffect(() => {
        setOpenLoginModal(locationOpenLoginModal); // location에서 받은 값으로 openLoginModal 초기화
    }, [locationOpenLoginModal]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="flex flex-col h-full w-full items-center justify-center">
            {/* 출석 체크 팝업 */}
            <Attendance
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)} // 팝업 닫기
                onDateSelect={handleDateSelect} // 날짜 선택 시 처리 함수
            />
            {/* 검색창 */}
            <div className="flex flex-row h-14 w-[35rem] items-center justify-center shadow-md rounded-xl relative">
                <div className="flex flex-row w-1/5 cursor-pointer">
                    <FaLocationDot size="20" className="ml-3 cursor-pointer mt-[0.05rem]"/>
                    <p className="text-sm text-nowrap ml-[0.5rem]">송파구 마천동</p>
                </div>
                <div className="flex flex-row w-4/5 ml-2">
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
                          className="mr-3 mt-1 cursor-pointer hover:scale-150 transition-transform ease-in-out duration-500"/>
            </div>
            {/* MainCard들 */}
            <div className="flex flex-row w-full h-[32rem] mt-6 items-center justify-center shadow-xl rounded-xl">
                <Swiper
                    pagination={{dynamicBullets: true}}
                    modules={[Pagination, Autoplay]}
                    className="shadow-xl rounded-xl"
                >
                    <SwiperSlide><img className="slide1" src="https://ifh.cc/g/djK3KG.gif" alt="Slide 1"/></SwiperSlide>
                </Swiper>
            </div>
            <div className="flex flex-col mt-[5rem] items-start w-full justify-start"> {/*카테고리별 제품 한눈에 보기*/}
                <a className="text-xl">카테고리 한 눈에 보기</a>
            <div className="flex items-start mt-4 space-x-8 mb-4">
                <div
                    onClick={() => handleTabChange('weight')}
                    className={`cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 ${activeTab === 'weight' ? 'text-red-400 border-b-2 border-red-400' : 'text-red-400'}`}
                >
                    헬스
                </div>
                <div
                    onClick={() => handleTabChange('swim')}
                    className={`cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 ${activeTab === 'swim' ? 'text-red-400 border-b-2 border-red-400' : 'text-red-400'}`}
                >
                    수영
                </div>
                <div
                    onClick={() => handleTabChange('climbing')}
                    className={`cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 ${activeTab === 'climbing' ? 'text-red-400 border-b-2 border-red-400' : 'text-red-400'}`}
                >
                    클라이밍
                </div>
                <div
                    onClick={() => handleTabChange('pilates')}
                    className={`cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 ${activeTab === 'pilates' ? 'text-red-400 border-b-2 border-red-400' : 'text-red-400'}`}
                >
                    필라테스
                </div>
                <div
                    onClick={() => handleTabChange('crossfit')}
                    className={`cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 ${activeTab === 'crossfit' ? 'text-red-400 border-b-2 border-red-400' : 'text-red-400'}`}
                >
                    크로스핏
                </div>
            </div>
                {activeTab === 'weight' && (
                    <div className="w-full">
                        <MainBox/>
                    </div>
                    )}
            </div>


        </div>
    );
};

export default Home;
