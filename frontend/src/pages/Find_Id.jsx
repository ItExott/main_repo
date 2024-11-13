import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useRecoilValue} from "recoil";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay, EffectCoverflow } from "swiper";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';


const Find_Id = () => {

    return (

        <div className="flex flex-col h-full items-center justify-center mx-44  ">  {/*슬라이더 박스*/}

            <div className="flex lfex-row w-max items-center justify-center mt-16 mb-10">
                <span className="text-3xl font-bold">FIND ID</span>
                <span className="text-3xl font-bold ml-7 mr-7">|</span>
                <span className="text-3xl font-bold text-gray-400">FIND PW</span>
            </div>

            <div className="flex justify-start w-[34rem] h-[23rem] flex-col mb-6 items-center">
                <div className="flex w-full justify-start flex-col ml-[12rem] h-6">
                    <p>이름</p>
                </div>
                <div className="flex w-full justify-start flex-col h-6 ">
                    <p>이름</p>
                </div>
            </div>

        </div>

    )
}

export default Find_Id;