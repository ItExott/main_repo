import React from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Scrollbar} from "swiper";
import MainCard from "./MainCard.jsx";

const MainBox = () => {

    return (
        <div className="flex flex-row w-full h-[16rem] border-2 border-red-400 items-center justify-center shadow-xl rounded-md">
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
                <SwiperSlide className="maincard-slide flex ml-[5rem] justify-center w-auto h-auto"><MainCard text="카드1"
                                                                                               sor="https://ifh.cc/g/QqVy3C.png"/></SwiperSlide>
                <SwiperSlide className="maincard-slide flex ml-[14rem] justify-center w-auto h-auto"><MainCard text="카드2"
                                                                                                sor="https://ifh.cc/g/M0Yaqq.png"/></SwiperSlide>
            </Swiper>
        </div>
    )
}

export default MainBox;