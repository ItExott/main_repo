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


const SignUp = () => {

    return (
        <div className="flex flex-col h-full items-center justify-center mx-56">  {/*슬라이더 박스*/}
            <div className="flex flex-row mt-6  h-11 w-[35rem] items-center justify-center text-xl">
                회원가입
            </div>
            <div className="flex flex-row w-[60rem] h-[60rem] mt-6 items-center justify-center bg-indigo-700">
                회원가입 기입DIV
            </div>
            <div className="flex flex-row w-[60rem] h-[7rem] items-center justify-center bg-red-300">
                완료 취소 버튼
            </div>

        </div>

    )
}

export default SignUp;