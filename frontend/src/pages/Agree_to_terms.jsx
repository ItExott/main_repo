import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useRecoilValue} from "recoil";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay, EffectCoverflow } from "swiper";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import MainCard from "../components/MainCard.jsx";


const Agree_to_terms = () => {

    return (
        <div className="flex flex-col h-full items-center justify-center mx-56">  {/*슬라이더 박스*/}
            <div className="flex flex-row mt-6  h-11 w-[35rem] items-center justify-center text-xl">
                약관동의
            </div>
            <div className="flex flex-col w-[60rem] h-[60rem] mt-6 items-center justify-start border border-gray-300">
                {/* 체크박스 */}
                <div className="flex w-full items-start h-10 ml-5 mt-5">
                    <input type="checkbox" name="agree1" value="checked1"/>
                    <label className="ml-2">전체동의</label>
                </div>

                {/* 빨간 박스 */}
                <div className="flex w-[58rem] h-[25rem] bg-red-300 items-center justify-center">
                    {/* 빨간 박스 안의 내용 */}
                    <span className="text-white text-lg">내용이 여기에 들어갑니다.</span>
                </div>


                {/* 체크박스 */}
                <div className="flex w-full items-start h-10 ml-5 mt-5">
                    <input type="checkbox" name="agree1" value="checked1"/>
                    <label className="ml-2">전체동의</label>
                </div>

                {/* 빨간 박스 */}
                <div className="flex w-[58rem] h-[25rem] bg-red-300 items-center justify-center">
                    {/* 빨간 박스 안의 내용 */}
                    <span className="text-white text-lg">내용이 여기에 들어갑니다.</span>
                </div>

            </div>
            <div className="flex flex-row w-full h-[7rem] items-center justify-center  ">
                <button type="button" className="w-40 h-12 bg-black text-white">
                    다음
                </button>

            </div>

        </div>

    )
}

export default Agree_to_terms;