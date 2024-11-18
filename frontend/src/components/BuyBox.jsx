import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const BuyBox = () => {
    return (
        <div className="fixed top-0 right-0 p-4 lg:p-24 z-10">
            <div className="w-full flex justify-end">
                <div
                    className="flex flex-col border border-gray-400 bg-gray-300 shadow-xl rounded-xl w-[17rem] h-[48rem]">
                    {/* 이용 금액 표시란 */}
                    <a className="flex font-bold justify-center mt-[1rem]">회원가</a>
                    <div
                        className="flex flex-col bg-gray-200 shadow-xl ml-[2vw] border border-gray-600 mt-[0.5rem] rounded-lg w-[13rem] h-[4.3rem]">
                        <a className="flex mt-[0.5rem] font-semibold justify-center">자유이용권</a>
                        <a className="flex text-sm justify-center whitespace-nowrap">91,660원~ / 월</a>
                    </div>
                    <div
                        className="flex flex-col bg-gray-200 shadow-xl ml-[2vw] border border-gray-600 mt-[0.5rem] rounded-lg w-[13rem] h-[5.2rem]">
                        <a className="flex mt-[1rem] font-semibold justify-center">1개월권</a>
                        <a className="flex text-sm justify-center whitespace-nowrap">130,000원</a>
                    </div>
                    <div
                        className="flex flex-col bg-gray-200 shadow-xl ml-[2vw] border border-gray-600 mt-[0.5rem] rounded-lg w-[13rem] h-[5.2rem]">
                        <a className="flex mt-[0.5rem] font-semibold justify-center">3개월권</a>
                        <a className="flex text-sm justify-center whitespace-nowrap">300,000원</a>
                        <a className="flex text-xs mt-[0.2rem] justify-center text-red-400">25% 할인가</a>
                    </div>
                    <div
                        className="flex flex-col bg-gray-200 shadow-xl ml-[2vw] border border-gray-600 mt-[0.5rem] rounded-lg w-[13rem] h-[5.2rem]">
                        <a className="flex mt-[0.5rem] font-semibold justify-center">6개월권</a>
                        <a className="flex text-sm justify-center whitespace-nowrap">550,000원</a>
                        <a className="flex text-xs mt-[0.2rem] justify-center text-red-400">25% 할인가</a>
                    </div>
                    <div
                        className="flex flex-col bg-gray-200 shadow-xl ml-[2vw] border border-gray-600 mt-[0.5rem] rounded-lg w-[13rem] h-[5.2rem]">
                        <a className="flex mt-[0.5rem] font-semibold justify-center">1년권</a>
                        <a className="flex text-sm justify-center whitespace-nowrap">1,100,000원</a>
                        <a className="flex text-xs mt-[0.2rem] justify-center text-red-400">25% 할인가</a>
                    </div>
                    <div className="flex divider divide-gray-600 w-[17rem]"></div>
                    <a className="flex font-bold justify-center">비회원가</a>
                    <div
                        className="flex flex-col bg-gray-200 shadow-xl ml-[2vw] border border-gray-600 mt-[0.5rem] rounded-lg w-[13rem] h-[5.3rem]">
                        <a className="flex mt-[0.5rem] font-semibold justify-center">당일권</a>
                        <a className="flex justify-center text-xs whitespace-nowrap">1회 입장 제한 / 신발 대여 별도</a>
                        <a className="flex justify-center text-sm font-semibold mt-[0.4rem] whitespace-nowrap">20,000원</a>
                    </div>
                    <div className="flex flex-row mt-[2vh] justify-center items-center">
                        <div
                            className="flex justify-center items-center border cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 border-gray-500 w-[8rem] text-white hover:text-black hover:bg-white bg-gray-500 rounded-xl h-[3rem] text-sm">
                            회원권 담기
                        </div>
                    </div>
                </div>
            </div>
</div>
)
    ;
}


export default BuyBox;