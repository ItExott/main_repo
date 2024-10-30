import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useRecoilValue} from "recoil";
import { BiSearch } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Scrollbar } from "swiper";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/scrollbar';
import MainCard from "../components/MainCard.jsx";

const Home = () => {

    return (
        <div className="flex flex-col h-full items-center justify-center mx-56">  {/*전체 틀*/}
            <div className="flex flex-row h-14 w-[35rem] items-center justify-center shadow-xl rounded-xl"> {/*검색창*/}
                <FaLocationDot size="20" className="ml-3 cursor-pointer mt-[0.06rem]"/> {/* 로케이션 아이콘 */}
                <div className="flex flex-row w-1/5 cursor-pointer"> {/* 로케이션 박스 */}
                <p className="text-sm font-bold text-nowrap ml-[0.5rem]">송파구 마천동</p>
                </div>
                <div className="flex flex-row w-4/5 ml-2"> {/* 검색 박스 */}
                <input type="text" className="grow border-0 text-center mt-1" placeholder="검색"/>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70">
                </svg>
                </div>
                <BiSearch size="20" className="mr-3 mt-1 cursor-pointer hover:scale-150 transition-transform ease-in-out duration-500"/>
                {/* 검색 아이콘 */}
            </div>
            <div className="flex flex-row w-[60rem] h-[20rem] mt-6 items-center justify-center">
                <Swiper
                    pagination={{
                        dynamicBullets: true,
                    }}
                    modules={[Pagination, Autoplay]}
                    className="shadow-xl rounded-xl"
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    loop:true
                >
                    <SwiperSlide>Slide 1</SwiperSlide>
                    <SwiperSlide>Slide 2</SwiperSlide>
                    <SwiperSlide>Slide 3</SwiperSlide>
                </Swiper>
            </div>
            <div className="flex flex-row w-[60rem] h-[20rem] mt-6 items-center justify-center shadow-xl rounded-xl">
                <Swiper
                    slidesPerView="auto"
                    spaceBetween={-120}
                    centeredSlides={false}
                    scrollbar={{
                        hide: false,
                        draggable: true,
                        dragSize: 200,
                    }}
                    modules={[Scrollbar]}
                    className="flex w-full"
                >
                    <SwiperSlide className="flex justify-center w-auto h-auto "><MainCard/></SwiperSlide>
                    <SwiperSlide className="flex justify-center w-auto h-auto"><MainCard/></SwiperSlide>
                    <SwiperSlide className="flex justify-center w-auto h-auto"><MainCard/></SwiperSlide>
                    <SwiperSlide className="flex justify-center w-auto h-auto"><MainCard/></SwiperSlide>
                    <SwiperSlide className="flex justify-center w-auto h-auto"><MainCard/></SwiperSlide>
                </Swiper>
            </div>
        </div>

    )
}

export default Home;