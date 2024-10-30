import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useRecoilValue} from "recoil";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay, EffectCoverflow } from "swiper";

const MainCard = () => {
    return (
        <div className="max-w-32 rounded overflow-hidden shadow-lg m-4 bg-white">
            <img className="flex w-max h-32" src="https://via.placeholder.com/400" alt="Card image"/>
            <div>
                <div className=" font-bold text-lg">카드 제목</div>

            </div>
            <div className="px-6 pt-4 pb-2">

            </div>
        </div>
    );
};

export default MainCard;