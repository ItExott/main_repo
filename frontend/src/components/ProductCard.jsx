import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useRecoilValue} from "recoil";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay, EffectCoverflow } from "swiper";
import {FaLocationDot} from "react-icons/fa6";

const ProductCard = ({text, price, address,sor}) => {
    return (
        <div className="w-[20rem] h-[20rem] items-center flex flex-col cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 rounded overflow-hidden shadow-lg m-4 bg-white">
            <img className="flex w-max h-[15rem]" src={sor} alt="Card image"/>
            <div className="px-6 flex flex-col items-center pt-4 pb-2">
                <a className="flex font-bold text-lg">{text}</a>
                <div className="flex flex-row mt-[0.3rem] justify-center items-center">
                    <FaLocationDot/>
                    <a className="flex ml-[0.1rem] text-xs">{address}</a>
                    <a className="flex text-sm font-semibold ml-[1rem]">{price}</a>
                    <a className="flex text-xs ml-[0.2rem]">~/월</a>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;