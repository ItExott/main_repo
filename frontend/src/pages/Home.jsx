import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useRecoilValue} from "recoil";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay, EffectCoverflow } from "swiper";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';


const Home = () => {
    const [activeIndex, setActiveIndex] = useState(0);



    const tabContent =[
        {
            tabTitle: (
                <li
                    style={{
                        color: activeIndex === 0 ? 'blue' : 'black',
                        fontWeight: activeIndex === 0 ? 'bold' : 'normal',
                        cursor: 'pointer'
                    }}
                    onClick={() => tabClickHandler(0)}
                >
                    전체
                </li>
            ),
            tabCont: (
                <div><Bookbox tab={0}></Bookbox></div>
            )
        },
        {
            tabTitle: (
                <li
                    style={{
                        color: activeIndex === 1 ? 'blue' : 'black',
                        fontWeight: activeIndex === 1 ? 'bold' : 'normal',
                        cursor: 'pointer'
                    }}
                    onClick={() => tabClickHandler(1)}
                >
                    국내도서
                </li>
            ),
            tabCont: (
                <div><Bookbox tab={1}></Bookbox></div>
            )
        },
        {
            tabTitle: (
                <li
                    style={{
                        color: activeIndex === 2 ? 'blue' : 'black',
                        fontWeight: activeIndex === 2 ? 'bold' : 'normal',
                        cursor: 'pointer'
                    }}
                    onClick={() => tabClickHandler(2)}
                >
                    서양도서
                </li>
            ),
            tabCont: (
                <div><Bookbox tab={2}></Bookbox></div>
            )
        },
    ];

    const tabClickHandler = (index) => {
        setActiveIndex(index)
    }

    return (
        <div className="container mx-auto p-8">  {/*슬라이더 박스*/}
            <div className="container flex-auto p-6 shadow-xl rounded-xl">
                <Swiper className="styles.mainSwiper flex-auto rounded-xl"
                        modules={[Navigation, Pagination, A11y, Autoplay, EffectCoverflow]}
                        effect={"coverflow"}
                        centeredSlides={true}
                        slidesPerView={"auto"}
                        coverflowEffect={{
                            rotate: 50,
                            stretch: 0,
                            depth: 100,
                            modifier: 1,
                            slideShadows: false,
                        }}
                        spaceBetween={30}
                        loop={true}
                        pagination={true}
                        speed={400}
                        autoplay={{delay: 3000, disableOnInteraction: false}}
                >
                    <SwiperSlide className="shadow-xl rounded-xl"><img
                        className="transform transition-transform duration-300 hover:scale-105"
                        src="https://ifh.cc/g/xDrpN5.jpg"/></SwiperSlide>
                    <SwiperSlide className="shadow-xl rounded-xl"><img
                        className="transform transition-transform duration-300 hover:scale-105"
                        src="https://ifh.cc/g/H6nDSb.jpg"/></SwiperSlide>
                    <SwiperSlide className="shadow-xl rounded-xl"><img
                        className="transform transition-transform duration-300 hover:scale-105"
                        src="https://ifh.cc/g/9lpjrr.jpg"/></SwiperSlide>
                </Swiper>
            </div>
            <div className="mt-[3rem] space-x-7 flex flex-row items-center"> {/* 책 탭 페이지 1 */}
                <a className="text-black mr-[0.1rem] font-black text-[1.7rem] items-center">화제의 신상</a>
                <ul className="tabs is-boxed mt-[0.13rem] items-center justify-center flex space-x-7 text-gray-500 flex-row">
                    {tabContent.map((section, index) => {
                        return section.tabTitle
                    })}
                </ul>
            </div>
            <div>
                {tabContent[activeIndex].tabCont}
            </div>

        </div>
    )
}

export default Home;