import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useRecoilValue} from "recoil";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay, EffectCoverflow } from "swiper";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';


const Find_Pw = () => {

    return (
        <div className="flex flex-col h-full items-center justify-center mx-44  ">  {/*슬라이더 박스*/}

            <div className="flex justify-center flex-row w-[34rem] h-[23rem] mb-6 mt-20 items-center bg-violet-400">
                <h1>로그인창</h1>
            </div>
            <div className="flex justify-center flex-row w-[34rem] h-[6rem]  items-center bg-green-400">
                <h1>sns로그인</h1>
            </div>
        </div>

    )
}

export default Find_Pw;