import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useRecoilValue} from "recoil";
import { FaRegCheckCircle } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay, EffectCoverflow } from "swiper";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import MainCard from "../components/MainCard.jsx";


const Complete_SignUp = () => {

    return (
        <div className="flex flex-col h-full items-center justify-center mx-44  ">  {/*슬라이더 박스*/}

            <div
                className="flex  flex-col  justify-start flex-row w-[28rem] h-[27rem] mb-6 mt-24 items-center">
                <h2 className="mb-9 text-xl">Complete</h2>
                <FaRegCheckCircle size="50" className="ml-3 cursor-pointer mt-[0.06rem]"/>
                <h2 className="flex mt-4 mb-2">회원가입이 완료 되었습니다.</h2>
                <h2 className="mb-14">000님 가입을 축하드립니다</h2>
                <button className="bg-blue-500 text-white font-bold py-4 px-12 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"></button>
            </div>

        </div>


    )
}

export default Complete_SignUp;