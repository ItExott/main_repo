import React, {useState, useEffect, useRef} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay, EffectCoverflow } from "swiper";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import {FaLocationDot} from "react-icons/fa6";
import {BiSearch} from "react-icons/bi";
import ProductCard from "../components/ProductCard.jsx";
import { FaCaretDown } from "react-icons/fa";
import axios from "axios";


const Product_Main = () => {


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

    const navigate = useNavigate();

    const [selectedOption, setSelectedOption] = useState("평점 순");

    // 드롭다운 열고 닫는 상태
    const [isOpen, setIsOpen] = useState(false);

    // 항목을 선택했을 때 호출되는 함수
    const handleSelect = (option) => {
        setSelectedOption(option); // 선택한 옵션으로 상태 업데이트
        setIsOpen(false); // 드롭다운 닫기
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


    const handleClick = (id) => {
        navigate(`/product/${id}`);
    };


    return (
        <div className="flex flex-col h-full items-center justify-center mx-56">  {/*전체 틀*/}
            <div
                className="flex flex-row h-14 w-[35rem] items-center justify-center shadow-xl rounded-xl relative"> {/*검색창*/}
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
                <BiSearch size="20"
                          className="mr-3 mt-1 cursor-pointer hover:scale-150 transition-transform ease-in-out duration-500"/>
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
            <div className="flex justify-start w-[62rem] h-[22rem] mt-[4rem] items-center">
                <div className="flex items-center w-[24rem] h-[18rem] ml-[6rem]">
                    <img className="rounded-3xl shadow-xl" src="https://ifh.cc/g/XGnqgV.jpg"/>
                </div>
                <div
                    className="flex flex-col border-[0.01rem] border-gray-100 justify-center rounded-r-full shadow-xl w-[29rem] h-[18rem]">
                    <a className="text-[1.5rem] font-semibold ml-[2rem]">Climbing란?</a>
                    <a className="text-[0.9rem] ml-[2rem] mt-[0.4rem]">등반의 한 종류로 자연암벽 또는 인공암벽을 타는 행위다.</a>
                    <a className="text-[0.9rem] ml-[2rem]">스포츠의 일환으로 행해지는 암벽 등반은</a>
                    <a className="text-[0.9rem] ml-[2rem]">'스포츠 클라이밍(sportsclimbing)'이라 한다.</a>
                    <a className="text-[0.9rem] ml-[2rem]">수 십에서 수 백미터 절벽을 기어오르기 위해서 높은 육체적,</a>
                    <a className="text-[0.9rem] ml-[2rem]">정신적 능력이 요구되는 익스트림 스포츠로,</a>
                    <a className="text-[0.9rem] ml-[2rem] mb-[1rem]">충분한 교육과 적절한 장비, 알맞은 등반술이 없다면 위험해질 수 있다.
                    </a>
                </div>
            </div>
            <div className="flex items-center justify-end w-full ml-[12rem] mt-[3rem]">
                <details
                    className="dropdown shadow-xl hover:bg-gray-100 cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 items-center flex justify-center w-[6rem] rounded-xl h-[2rem] z-[2]"
                    open={isOpen} // 드롭다운 상태 제어
                    onClick={() => setIsOpen(!isOpen)} // 드롭다운 열기/닫기
                >
                    {/* 드롭다운 항목 */}
                    <summary className="flex font-semibold items-center">
                        {selectedOption} <FaCaretDown className="ml-[0.1rem]"/>
                    </summary>

                    {/* 드롭다운 리스트 */}
                    {isOpen && (
                        <div
                            className="dropdown-content flex flex-col absolute left-0 bg-base-100 rounded-box h-[5rem] z-[10] w-[6rem] mt-[1rem] shadow">
                            {/* "평점 순" 항목이 선택되지 않으면 표시 */}
                            {selectedOption !== "평점 순" && (
                                <a
                                    className="p-2 flex flex-row items-center justify-center hover:rounded-xl cursor-pointer hover:bg-gray-200 font-semibold"
                                    onClick={() => handleSelect("평점 순")} // "평점 순" 선택
                                >
                                    평점 순 <FaCaretDown className="ml-[0.1rem]"/>
                                </a>
                            )}
                            {/* "가격 순" 항목 */}
                            {selectedOption !== "가격 순" && (
                                <a
                                    className="p-2 flex flex-row items-center justify-center hover:rounded-xl cursor-pointer hover:bg-gray-200 font-semibold"
                                    onClick={() => handleSelect("가격 순")} // "가격 순" 선택
                                >
                                    가격 순 <FaCaretDown className="ml-[0.1rem]"/>
                                </a>
                            )}
                            {/* "조회 순" 항목 */}
                            {selectedOption !== "조회 순" && (
                                <a
                                    className="p-2 flex flex-row items-center justify-center hover:rounded-xl cursor-pointer hover:bg-gray-200 font-semibold"
                                    onClick={() => handleSelect("조회 순")} // "조회 순" 선택
                                >
                                    조회 순 <FaCaretDown className="ml-[0.1rem]"/>
                                </a>
                            )}
                        </div>
                    )}
                </details>
            </div>


            {/* 제품 목록 */}
            <div className="flex flex-row w-[62rem] h-[35rem] mt-[1rem]">
                <ProductCard id="1" onClick={handleClick} text="Mining 클라이밍" address="서울시 송파구 마천동" price="130,000원"
                             className="flex"/>
                <ProductCard id="2" onClick={handleClick} text="DOT 클라이밍" address="서울시 송파구 문정동" price="120,000원"
                             className="flex"/>
                <ProductCard id="3" onClick={handleClick} text="DAMJANG 클라이밍" address="서울시 서대문구 신촌동" price="140,000원"
                             className="flex"/>
            </div>
        </div>
    );
};

export default Product_Main;