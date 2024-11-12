import React, {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import {useRecoilValue} from "recoil";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay, EffectCoverflow } from "swiper";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import {FaLocationDot} from "react-icons/fa6";
import {BiSearch} from "react-icons/bi";


const Product_Main = () => {

    // 상태 변수들
    const [isFocused, setIsFocused] = useState(false); // 검색창 포커스 상태
    const [query, setQuery] = useState(""); // 검색어
    const [showSuggestions, setShowSuggestions] = useState(false); // 추천 검색어 박스 표시 여부

    // useRef를 사용하여 검색창에 접근
    const inputRef = useRef(null);

    // 검색어 입력 변화 처리
    const handleChange = (e) => {
        setQuery(e.target.value);
        setShowSuggestions(e.target.value.length > 0); // 입력이 있으면 추천 박스 표시
    };

    // 검색창에 포커스 처리
    const handleFocus = () => {
        setIsFocused(true); // 포커스 되면 추천 박스 보이기
        setShowSuggestions(true); // 추천 박스 표시
    };

    // 검색창에서 포커스를 벗어날 때
    const handleBlur = () => {
        setIsFocused(false); // 포커스를 벗어나면 추천 박스 숨기기
        setShowSuggestions(false);
    };

    return (
        <div className="flex flex-col h-full items-center justify-center mx-56">  {/*전체 틀*/}
            <div className="flex flex-row h-14 w-[35rem] items-center justify-center shadow-xl rounded-xl relative"> {/*검색창*/}
                <FaLocationDot size="20" className="ml-3 cursor-pointer mt-[0.06rem]"/> {/* 로케이션 아이콘 */}
                <div className="flex flex-row w-1/5 cursor-pointer"> {/* 로케이션 박스 */}
                    <p className="text-sm font-bold text-nowrap ml-[0.5rem]">송파구 마천동</p>
                </div>
                <div className="flex flex-row w-4/5 ml-2"> {/* 검색 박스 */}
                    <input
                        ref={inputRef}
                        type="text"
                        className="grow border-0 text-center mt-1"
                        placeholder="검색"
                        value={query}
                        onFocus={handleFocus} // 포커스 시 이벤트
                        onBlur={handleBlur}   // 포커스 벗어나면 숨기기
                        onChange={handleChange} // 텍스트 입력 시
                    />
                </div>
                <BiSearch size="20" className="mr-3 mt-1 cursor-pointer hover:scale-150 transition-transform ease-in-out duration-500"/>
                {/* 검색 아이콘 */}

                {/* 추천 검색어 박스 */}
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
            <div className="flex justify-start flex-row w-[62rem] h-[22rem] mt-6 items-center">
                <div className="flex flex-row bg-indigo-700  w-[33rem] h-[22rem]">그림 부분</div>
                <div className="flex flex-row bg-green-300  w-[29rem] h-[22rem]">운동 소개 부분</div>
            </div>
                <div className="flex flex-row justify-start bg-violet-300 w-[62rem] h-[35rem] mt-14 justify-start">




            </div>

        </div>

    )
}

export default Product_Main;