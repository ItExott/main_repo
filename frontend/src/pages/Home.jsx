import MainBox from "../components/MainBox.jsx";

{/*모듈 import문*/}
import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay'; // Autoplay 스타일 시트
import { Autoplay } from 'swiper';
import axios from "axios";
{/*아이콘 import문*/}
import { useLocation, useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
{/*컴포넌트 동기화문*/}
import Attendance from "../popup/Attendance";
import SearchCard from "../components/SearchCard.jsx";


const Home = ({loginStatus}) => {
    const suggestionsRef = useRef(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false); // 출석체크 달력 팝업 상태
    const [activeTab, setActiveTab] = useState('weight');
    const [dontShowToday, setDontShowToday] = useState(false); // "오늘 하루 보지 않기" 상태
    const location = useLocation();
    const { openLoginModal: locationOpenLoginModal = false } = location.state || {};
    const [category_products, setcategory_Products] = useState([]);
    const navigate = useNavigate();
    const [userType, setUserType] = useState("individual");
    const [query, setQuery] = useState(""); // 검색어
    const [suggestions, setSuggestions] = useState([]); // 추천 검색어
    const [showSuggestions, setShowSuggestions] = useState(false); // 추천 검색어 표시 여부
    const [openLoginModal, setOpenLoginModal] = useState(locationOpenLoginModal); // 초기값을 locationOpenLoginModal로 설정
    const inputRef = useRef(null);

    // 로그인 상태 확인 db문
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:8080/category/products", {
                    params: { category: activeTab }, // activeTab을 카테고리로 사용
                });
                setcategory_Products(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [activeTab]); // activeTab이 변경될 때 호출


    useEffect(() => {
        const handleLoginStatusChange = async () => {
            if (loginStatus) {
                try {
                    // 로그인 상태에서 사용자 정보를 가져옴
                    const response = await axios.get('http://localhost:8080/api/userinfo', {
                        withCredentials: true,
                    });

                    if (response.data.success) {
                        setUserId(response.data.userId);
                        setUserType(response.data.userType);

                        // userType이 'individual'일 때만 출석 체크 확인
                        if (response.data.userType === 'individual') {
                            const attendanceResponse = await axios.get(
                                `http://localhost:8080/api/attendance/today/${response.data.userId}`
                            );
                            if (attendanceResponse.data.success) {
                                const dontShowToday = attendanceResponse.data.today === 1;
                                setDontShowToday(dontShowToday);

                                if (!dontShowToday) {
                                    setIsCalendarOpen(true); // 출석 체크 모달 열기
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user info or attendance:', error);
                }
            } else {
                // 로그아웃 상태일 때 모달 닫기
                setIsCalendarOpen(false);
                setUserId(null);
                setUserType("guest");
            }
        };

        handleLoginStatusChange();
    }, [loginStatus]);

    useEffect(() => {
        if (openLoginModal) {
            document.getElementById('my_modal_3').showModal();
        }
    }, [openLoginModal]);



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
        // locationOpenLoginModal과 userType을 확인하여 openLoginModal을 설정
        if (locationOpenLoginModal && userType === 'individual') {
            setOpenLoginModal(locationOpenLoginModal); // location에서 받은 값으로 openLoginModal 초기화
        } else {
            setOpenLoginModal(false); // userType이 individual이 아니면 modal을 닫음
        }
    }, [locationOpenLoginModal, userType]);  // locationOpenLoginModal과 userType이 변경될 때마다 실행



    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const saveRecentlyViewed = (id) => {
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        if (!recentlyViewed.includes(id)) {
            recentlyViewed.push(id);
        }
        if (recentlyViewed.length > 5) {
            recentlyViewed.shift();
        }
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    };

    const handleClick = (id) => {
        // Save to local storage (optional)
        saveRecentlyViewed(id);
        navigate(`/product/${id}`);  // Navigate to the product detail page
    };


    const handleChangesearch = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);

        if (newQuery.length > 0) {
            setShowSuggestions(true);  // 검색어가 있을 때만 추천 검색어를 표시
            fetchSuggestions(newQuery); // 추천 검색어 가져오기
        } else {
            setShowSuggestions(false); // 검색어가 없으면 추천 검색어 숨기기
            setSuggestions([]); // 검색어가 없을 때는 추천 검색어 리스트도 초기화
        }
    };

    const fetchSuggestions = async (query) => {
        try {
            const response = await axios.get("http://localhost:8080/api/suggestions", {
                params: { query },
            });
            setSuggestions(response.data.suggestions);  // 서버에서 받은 추천 검색어로 상태 업데이트
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);  // 오류가 발생하면 추천 검색어 리스트를 비웁니다
        }
    };
    const handleClearSuggestions = () => {
        setQuery('');  // 검색어 초기화
        setSuggestions([]);  // 추천 검색어 초기화
    };
    const handleClickid = (id) => {
        // Save to local storage (optional)
        saveRecentlyViewed(id);
        navigate(`/product/${id}`);  // Navigate to the product detail page
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col h-full w-full items-center justify-center">
            {userType === "individual" && (
                <Attendance
                    isOpen={isCalendarOpen}
                    onClose={() => setIsCalendarOpen(false)} // Close popup
                    onDateSelect={handleDateSelect} // Handle date selection
                    userId={userId} // Pass userId
                />
            )}
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
                        onChange={handleChangesearch} // 텍스트 입력 시
                    />
                </div>
                <BiSearch size="20"
                          className="mr-3 mt-1 cursor-pointer hover:scale-150 transition-transform ease-in-out duration-500"/>

                {/* 추천 검색어 박스 */}
                {showSuggestions && (
                    <div className="absolute top-14 w-[49rem] bg-white border bg-opacity-70 rounded-xl shadow-lg z-10 mt-2"
                         ref={suggestionsRef}>
                        <div className="flex justify-between items-center mx-3 mt-2">
                            <p className="flex-grow ml-[4rem] text-center">추천 검색어</p>
                            <p
                                onClick={handleClearSuggestions} // 전체삭제 클릭 시 추천 검색어와 입력란 초기화
                                className="text-blue-500 cursor-pointer ml-4"
                            >
                                전체삭제
                            </p>
                        </div>
                        <ul className="flex flex-wrap">
                            {suggestions.length > 0 ? (
                                suggestions.map((product) => (
                                    <li key={product.prodid} className="w-1/3 p-2 hover:bg-gray-100 cursor-pointer">
                                        <SearchCard
                                            key={product.prodid}
                                            id={product.prodid}
                                            prodtitle={product.prodtitle}
                                            prodprice={product.prodprice}
                                            prodaddress={product.prodaddress}
                                            prodrating={product.prodrating}
                                            iconpicture={product.iconpicture}
                                            onClick={() => handleClickid(product.prodid)}
                                            className="flex"
                                        />
                                    </li>
                                ))
                            ) : (
                                <li className="p-2 text-gray-500">추천 검색어가 없습니다.</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>

            {/* MainCard */}
            <div className="flex flex-row w-full h-[32rem] mt-6 items-center justify-center shadow-xl rounded-xl">
                <img className="shadow-xl rounded-xl" src="https://ifh.cc/g/aJojk3.png"/>

            </div>

            <div className="flex w-full h-[12rem] mt-[3rem] items-center justify-center shadow-xl rounded-md">
                <Swiper
                    spaceBetween={10} // 이미지 간의 간격
                    slidesPerView={1} // 한 번에 보여줄 이미지 개수
                    modules={[Autoplay]}
                    autoplay={{delay: 3000, disableOnInteraction: false}} // 자동 슬라이드 설정
                    loop // 반복 재생
                >
                    <SwiperSlide>
                        <img
                            className="w-full h-full object-fill rounded-md"
                            src="https://ifh.cc/g/dt71lm.png"
                            alt="Ad Banner 1"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img
                            className="w-full h-full object-fill rounded-md"
                            src="https://ifh.cc/g/g4f9hh.png"
                            alt="Ad Banner 2"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img
                            className="w-full h-full object-fill rounded-md"
                            src="https://ifh.cc/g/GA8AY9.png"
                            alt="Ad Banner 3"
                        />
                    </SwiperSlide>
                </Swiper>
            </div>
            <div
                className="flex flex-col items-start p-[1.8rem] h-[26rem] w-full mt-[3rem] justify-start"> {/*카테고리별 제품 한눈에 보기*/}
                <a className="text-2xl w-[13rem] h-[3rem] text-black items-center flex justify-center rounded-xl">카테고리 한
                    눈에 보기</a>
                <div className="w-full border-b-2 border-red-400 mt-4"></div>
                <div className="flex items-start ml-[1rem] mt-4 space-x-8 mb-4">
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
                    <div
                        className="flex flex-row w-full h-[16rem] items-center bg-white justify-center shadow-xl rounded-3xl">
                        {category_products.map((product) => (
                            <MainBox
                                key={product.prodid}
                                iconpicture={product.iconpicture}
                                prodtitle={product.prodtitle}
                                onClick={() => handleClick(product.prodid)}
                            />
                        ))}
                    </div>
                )}
                {activeTab === 'swim' && (
                    <div
                        className="flex flex-row w-full h-[16rem] items-center bg-white justify-center shadow-xl rounded-3xl">
                        {category_products.map((product) => (
                            <MainBox
                                key={product.prodid}
                                iconpicture={product.iconpicture}
                                prodtitle={product.prodtitle}
                                onClick={() => handleClick(product.prodid)}
                            />
                        ))}
                    </div>
                )}
                {activeTab === 'climbing' && (
                    <div
                        className="flex flex-row w-full h-[16rem] items-center bg-white justify-center shadow-xl rounded-3xl">
                        {category_products.map((product) => (
                            <MainBox
                                key={product.prodid}
                                iconpicture={product.iconpicture}
                                prodtitle={product.prodtitle}
                                onClick={() => handleClick(product.prodid)}
                            />
                        ))}
                    </div>
                )}
                {activeTab === 'pilates' && (
                    <div
                        className="flex flex-row w-full h-[16rem] items-center bg-white justify-center shadow-xl rounded-3xl">
                        {category_products.map((product) => (
                            <MainBox
                                key={product.prodid}
                                iconpicture={product.iconpicture}
                                prodtitle={product.prodtitle}
                                onClick={() => handleClick(product.prodid)}
                            />
                        ))}
                    </div>
                )}
                {activeTab === 'crossfit' && (
                    <div
                        className="flex flex-row w-full h-[16rem] items-center bg-white justify-center shadow-xl rounded-3xl">
                        {category_products.map((product) => (
                            <MainBox
                                key={product.prodid}
                                iconpicture={product.iconpicture}
                                prodtitle={product.prodtitle}
                                onClick={() => handleClick(product.prodid)}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div
                className="flex flex-col items-start p-[1.8rem] h-[26rem] w-full mt-[3rem] justify-start"> {/*카테고리별 제품 한눈에 보기*/}
                <a className="text-2xl w-full h-[3rem] text-black items-start flex justify-start rounded-xl">패키지 상품</a>
                <div className="w-full border-b-2 border-red-400 mt-4"></div>
                <div className="flex flex-row rounded-3xl p-6 w-full h-[25rem] items-center">
                    <div
                        className="h-[20rem] justify-center flex p-10 flex-col shadow-md w-[20rem] rounded-full bg-white border-4 border-red-400">
                        <a className="text-3xl">1+1 등록 패키지</a>
                        <ul className="list-disc text-gray-400">
                            <li><a className="text-lg">두 종류의 운동을 등록하고 싶은데 하나하나 찾아보기 귀찮을 때!</a></li>
                            <li><a className="text-lg">두 개 등록할 건데 더 할인되는 건 없을까?</a></li>
                        </ul>
                        <a className="text-2xl mt-[0.5rem] text-red-400">있습니다,</a>
                        <a className="text-2xl whitespace-nowrap text-red-400">오직 FIT PLAY에서!</a>
                    </div>
                    <div className="flex w-[15rem] h-[15rem] bg-white shadow-md ml-[2rem]"></div>
                    <div className="flex w-[15rem] h-[15rem] bg-white shadow-md ml-[2rem]"></div>
                    <div className="flex w-[15rem] h-[15rem] bg-white shadow-md ml-[2rem]"></div>
                </div>
            </div>
            <div
                className="flex flex-col items-start p-[1.8rem] h-[26rem] w-full mt-[3rem] justify-start"> {/*카테고리별 제품 한눈에 보기*/}
                <a className="text-2xl w-full h-[3rem] text-black items-start flex justify-start rounded-xl">추천 대회</a>
                <div className="w-full border-b-2 border-red-400 mt-4"></div>
                <div className="flex rounded-3xl p-6 space-x-8 w-full h-[25rem] justify-center items-center">
                    <div
                        className="flex flex-col w-[20rem] items-center h-[20rem] hover:scale-110 transition-transform ease-in-out duration-500 bg-white shadow-md">
                        <img src="https://ifh.cc/g/TlJJq0.png"/>
                        <div
                            onClick={() => window.open('https://winterrun.kr/', '_blank')}
                            className="h-[4rem] w-[12rem] mt-[1rem] text-red-400 border items-center justify-center rounded-xl text-xl border-red-400 flex hover:bg-red-400 hover:text-white cursor-pointer">바로가기
                        </div>
                    </div>
                    <div
                        className="flex flex-col w-[20rem] items-center h-[20rem] hover:scale-110 transition-transform ease-in-out duration-500 bg-white shadow-md">
                        <img src="https://ifh.cc/g/ON4Ngl.jpg"/>
                        <div
                            onClick={() => window.open('https://bodybuilding.or.kr/contest_kr/?q=YToxOntzOjEyOiJrZXl3b3JkX3R5cGUiO3M6MzoiYWxsIjt9&bmode=view&idx=81076702&t=board', '_blank')}
                            className="h-[4rem] w-[12rem] mt-[1rem] text-red-400 border items-center justify-center rounded-xl text-xl border-red-400 flex hover:bg-red-400 hover:text-white cursor-pointer">바로가기
                        </div>
                    </div>
                    <div
                        className="flex flex-col w-[20rem] items-center h-[20rem] hover:scale-110 transition-transform ease-in-out duration-500 bg-white shadow-md">
                        <img src="https://ifh.cc/g/sWOGm8.jpg"/>
                        <div
                            onClick={() => window.open('https://irun.kr/product/%EC%95%84%EC%9D%B4%EB%9F%B0-2024-%EA%B4%91%EB%B3%B5%EC%A0%88-815-%EA%B7%B8%EB%9E%80%ED%8F%B0%EB%8F%84/561/category/44/display/1/', '_blank')}
                            className="h-[4rem] w-[12rem] mt-[1rem] text-red-400 border items-center justify-center rounded-xl text-xl border-red-400 flex hover:bg-red-400 hover:text-white cursor-pointer">바로가기
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;
