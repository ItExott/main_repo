import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useRecoilValue} from "recoil";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay, EffectCoverflow } from "swiper";

const ProductCard = ({text,sor}) => {
    return (
        <div className="w-[20rem] h-[20rem] cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 rounded overflow-hidden shadow-lg m-4 bg-white">
            <img className="flex w-max h-[15rem]" src={sor} alt="Card image"/>
            <div>
                <div className="font-bold text-lg">{text}</div>

            </div>
            <div className="px-6 pt-4 pb-2">

            </div>
        </div>
    );
};

export default ProductCard;