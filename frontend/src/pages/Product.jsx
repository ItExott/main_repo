import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useRecoilValue} from "recoil";
import { FaLocationDot } from "react-icons/fa6";
import { MdNavigateNext } from "react-icons/md";

const Product= () => {

    return (
        <div className="flex flex-col h-full items-center justify-center mx-44  ">  {/*슬라이더 박스*/}
            <div className="flex justify-start flex-row rounded-3xl border-2 border-gray-950 w-[62rem] h-[22rem] mt-6 items-center">
                <div className="flex flex-row items-center w-[42rem] h-[22rem]">그림 부분</div>
                <div className="flex flex-col shadow-xl rounded-3xl items-center w-[20rem] h-[22rem]">
                    <div className="flex w-[10rem] mt-[2rem] h-[10rem]"><img className="rounded-full"
                                                                             src="https://ifh.cc/g/XpkHf4.jpg"></img>
                    </div>
                    <a className="text-lg mt-[1rem] font-bold">Mining 클라이밍</a>
                    <a className="text-sm">서울시 송파구 마천동에 위치한 실내 클라이밍 짐</a>
                    <div className="flex mt-[1rem] flex-row"> {/*로고 하단 위치 박스*/}
                        <FaLocationDot/>
                        <a className="text-sm font-bold">서울시 송파구 마천동 123-45 2층</a>
                    </div>
                    <div className="flex mt-[1rem] flex-row"> {/*로고 하단 후기 박스*/}
                        <div className="rating">
                            <input type="radio" name="rating-1" className="mask mask-star"/>
                            <input type="radio" name="rating-1" className="mask mask-star"/>
                            <input type="radio" name="rating-1" className="mask mask-star"/>
                            <input type="radio" name="rating-1" className="mask mask-star" checked="checked"/>
                            <input type="radio" name="rating-1" className="mask mask-star"/>
                        </div>
                        <a className="flex text-xs mt-[0.28rem] font-bold ml-[0.5em]">4.5 (19)</a>
                        <a className="flex text-xs mt-[0.28rem] text-blue-500 font-bold ml-[0.9em]">후기 더보기</a>
                        <MdNavigateNext className="flex mt-[0.28rem] fill-blue-500"/>
                    </div>
                </div>
            </div>
            <div className="flex flex-col bg-gray-200 w-[62rem] h-[80rem] mt-14 justify-start">
                <div
                    className="flex flex-col bg-gray-300 ml-[2rem] mt-[2.5rem] shadow-xl rounded-xl w-[58rem] h-[10rem]"> {/*이용 금액 표시란*/}
                    <a className="flex font-bold ml-[2rem] mt-[1.2rem]">회원가</a>
                    <div
                        className="flex flex-col bg-gray-200 shadow-xl ml-[2rem] border-[0.1rem] border-gray-600 mt-[1rem] rounded-lg w-[54rem] h-[5rem]">
                        <a className="flex font-bold ml-[1.2rem] mt-[0.5rem]">자유이용권</a>
                        <div className="flex flex-row">
                            <a className="flex text-xs ml-[1.3rem] mt-[0.6rem]">현장가</a>
                            <a className="flex text-xl font-bold ml-[41.5rem] mt-[0.6rem] whitespace-nowrap">91,660원~</a>
                            <a className="flex text-sm mt-[0.85rem]">/월</a>
                        </div>
                    </div>
                </div>
                <div className="flex divider divide-gray-600 ml-[1rem] w-[60rem]"></div>
                <div
                    className="flex flex-col bg-gray-300 ml-[2rem] shadow-xl rounded-xl w-[58rem] h-[10rem]"> {/*이용 금액 표시란*/}
                    <a className="flex font-bold ml-[2rem] mt-[1.2rem]">비회원가</a>
                    <div
                        className="flex flex-col bg-gray-200 shadow-xl ml-[2rem] border-[0.1rem] border-gray-600 mt-[1rem] rounded-lg w-[54rem] h-[5rem]">
                        <a className="flex font-bold ml-[1.2rem] mt-[0.5rem]">당일권</a>
                        <div className="flex flex-row">
                            <a className="flex text-xs ml-[1.3rem] mt-[0.6rem] whitespace-nowrap">1회 입장 제한 / 신발 대여비
                                별도</a>
                            <a className="flex text-xl font-bold ml-[34rem] mt-[0.6rem] whitespace-nowrap">20,000원</a>
                        </div>
                    </div>
                </div>
                <div className="flex divider divide-gray-600 ml-[1rem] w-[60rem]"></div>
                <div
                    className="flex flex-col bg-gray-300 ml-[2rem] shadow-xl rounded-xl w-[58rem] h-[37rem]"> {/*개월권 표시란*/}
                    <div
                        className="flex flex-col bg-gray-200 shadow-xl ml-[2rem] border-[0.1rem] border-gray-600 mt-[2rem] rounded-lg w-[54rem] h-[6rem]">
                        <a className="flex font-bold ml-[1.2rem] mt-[1rem]">1일권</a>
                        <div className="flex flex-row">
                            <a className="flex text-xs ml-[1.3rem] mt-[0.6rem]">현장가</a>
                            <a className="flex text-xl font-bold ml-[43rem] whitespace-nowrap">130,000원</a>
                        </div>
                    </div>
                    <div
                        className="flex flex-col bg-gray-200 shadow-xl ml-[2rem] border-[0.1rem] border-gray-600 mt-[1rem] rounded-lg w-[54rem] h-[6rem]">
                        <a className="flex font-bold ml-[1.2rem] mt-[1rem]">3개월</a>
                        <div className="flex flex-row">
                            <a className="flex text-xs mt-[0.6rem] ml-[1.3rem] whitespace-nowrap">현장가</a>
                            <a className="flex text-xl font-bold ml-[43rem] whitespace-nowrap">300,000원</a>
                        </div>
                        <a className="flex text-xs ml-[47.2rem] mb-[2rem] whitespace-nowrap">100,000원 / 월</a>
                    </div>
                    <div
                        className="flex flex-col bg-gray-200 shadow-xl ml-[2rem] border-[0.1rem] border-gray-600 mt-[1rem] rounded-lg w-[54rem] h-[6rem]">
                        <a className="flex font-bold ml-[1.2rem] mt-[1rem]">6개월</a>
                        <div className="flex flex-row">
                            <a className="flex text-xs ml-[1.3rem] mt-[0.6rem]">현장가</a>
                            <a className="flex text-xl font-bold ml-[43rem] whitespace-nowrap">550,000원</a>
                        </div>
                            <a className="flex text-xs ml-[47.6rem] mb-[2rem] whitespace-nowrap">91,600원 / 월</a>
                    </div>
                    <div
                        className="flex flex-col bg-gray-200 shadow-xl ml-[2rem] border-[0.1rem] border-gray-600 mt-[1rem] rounded-lg w-[54rem] h-[6rem]">
                        <a className="flex font-bold ml-[1.2rem] mt-[1rem]">1일권</a>
                        <div className="flex flex-row">
                            <a className="flex text-xs ml-[1.3rem] mt-[0.6rem]">현장가</a>
                            <a className="flex text-xl font-bold ml-[42rem] whitespace-nowrap">1,110,000원</a>
                        </div>
                            <a className="flex text-xs ml-[47.6rem] mb-[2rem] whitespace-nowrap">91,600원 / 월</a>
                    </div>
                    <div className="flex flex-row mt-[2rem] ml-[1rem] items-center">
                    <MdNavigateNext className="rotate-180 w-[4rem] h-[4rem]"/>
                        <div className="flex justify-center items-center border-[0.1rem] cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500
                        border-gray-500 w-[9rem] text-white bg-gray-950 rounded-xl h-[3rem] ml-[41rem] text-lg">
                            회원권 담기</div>
                    </div>
                </div>
            </div>

        </div>

    )
}

export default Product;