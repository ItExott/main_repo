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


const Product_Main = () => {

    return (
        <div className="flex flex-col h-full items-center justify-center mx-44  ">  {/*슬라이더 박스*/}
            <div className="flex flex-row  h-14 w-[35rem] items-center justify-center bg-red-500">
                검색 div
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