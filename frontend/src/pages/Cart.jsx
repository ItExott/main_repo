import React, {useState, useEffect, useRef} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import axios from "axios";

const Cart= () => {
    const [selectedMonth, setSelectedMonth] = useState('1개월');
    const [activeTab, setActiveTab] = useState('tab1');
    const navigate = useNavigate();

    const handleClick = (month) => {
        setSelectedMonth(month);
        if (month === '1개월') {
            setActiveTab('tab1');
        } else if (month === '3개월') {
            setActiveTab('tab2');
        } else if (month === '6개월') {
            setActiveTab('tab3');
        } else if (month === '12개월') {
            setActiveTab('tab4');
        }
    };

    const gobuyform = () => {
        navigate("/Buyform");
    };

    return(
        <div className="flex flex-col mt-[1rem] h-full items-center justify-center mx-28"> {/*전체 틀*/}
            <a className="flex items-center w-[62rem] font-bold text-xl justify-center">장바구니</a>
            <div className="w-[62rem] border-b-2 border-gray-950 mt-4"></div>
            <div className="flex flex-col w-[62rem] h-full mt-[1rem]">
                <div className="flex flex-row">
                    <a className="text-red-400">2개 /</a>
                    <a className="ml-[0.4rem]">최대 3개</a>
                </div>
                <div className="flex flex-col bg-indigo-800 w-[62rem] h-[20rem] mt-[1rem]">{/*상품 목록들*/}

                </div>

                <div
                    className="flex flex-row w-[62rem] items-center justify-center shadow-xl h-[3rem] mt-[1rem] rounded-3xl bg-gray-300">
                    {/* 1개월 */}
                    <div className="flex h-full items-center justify-center w-1/4">
                        <a
                            className={`w-[14.3rem] cursor-pointer items-center justify-center flex rounded-3xl h-[2.5rem] transition-transform duration-300 ease-in-out transform ${
                                selectedMonth === '1개월' ? 'bg-gray-100 text-red-400 translate-x-0' : 'bg-gray-300 text-gray-500 translate-x-[10px]'
                            }`}
                            onClick={() => handleClick('1개월')}
                        >
                            1개월
                        </a>
                    </div>

                    {/* 3개월 */}
                    <div className="flex w-1/4 items-center justify-center h-full">
                        <a
                            className={`w-[14.3rem] cursor-pointer items-center justify-center flex rounded-3xl h-[2.5rem] transition-transform duration-300 ease-in-out transform ${
                                selectedMonth === '3개월' ? 'bg-gray-100 text-red-400 translate-x-0' : 'bg-gray-300 text-gray-500 translate-x-[10px]'
                            }`}
                            onClick={() => handleClick('3개월')}
                        >
                            3개월
                        </a>
                    </div>

                    {/* 6개월 */}
                    <div className="flex items-center justify-center w-1/4 h-full">
                        <a
                            className={`w-[14.3rem] cursor-pointer items-center justify-center flex rounded-3xl h-[2.5rem] transition-transform duration-300 ease-in-out transform ${
                                selectedMonth === '6개월' ? 'bg-gray-100 text-red-400 translate-x-0' : 'bg-gray-300 text-gray-500 translate-x-[10px]'
                            }`}
                            onClick={() => handleClick('6개월')}
                        >
                            6개월
                        </a>
                    </div>

                    {/* 12개월 */}
                    <div className="flex items-center justify-center w-1/4 h-full">
                        <a
                            className={`w-[14.3rem] cursor-pointer items-center justify-center flex rounded-3xl h-[2.5rem] transition-transform duration-300 ease-in-out transform ${
                                selectedMonth === '12개월' ? 'bg-gray-100 text-red-400 translate-x-0' : 'bg-gray-300 text-gray-500 translate-x-[10px]'
                            }`}
                            onClick={() => handleClick('12개월')}
                        >
                            12개월
                        </a>
                    </div>
                </div>
                <div className="w-[62rem] border-b-2 border-gray-200 mt-[2rem]"></div>
                {activeTab === 'tab1' && (
                    <div className="tab-content flex flex-col mt-[0.4rem] w-[62rem] h-[15rem]">
                        <div className="flex flex-col">
                            <div className="flex ml-[5rem] mt-[1.2rem] flex-row">
                                <div className="flex items-start text-gray-950 w-1/2 text-lg">상품금액</div>
                                <div className="flex justify-end mr-[7rem] text-gray-950 w-1/2">840,000원</div>
                            </div>
                            <div className="flex ml-[5rem] mt-[1rem] flex-row">
                                <div className="flex items-start text-gray-950 w-1/2 text-lg">회원가 할인</div>
                                <div className="flex justify-end mr-[7rem] text-blue-600 w-1/2">-120,000원</div>
                            </div>
                            <div className="flex flex-row w-[60rem] mt-[1rem] rounded-2xl items-center shadow-xl h-[2.5rem] bg-red-100">
                                <div className="flex ml-[4.8rem] items-start font-bold text-red-400 w-1/2 text-xl">결제 예정 금액</div>
                                <div className="flex justify-end mr-[5rem] text-xl font-bold text-red-400 w-1/2">685,000원</div>
                            </div>
                            <div className="flex flex-row items-center mt-[2rem] justify-center w-[60rem]">
                                <div
                                    className="flex ml-[1rem] w-[10rem] border-[0.1rem] border-red-400 h-[3rem] rounded-xl items-center justify-center shadow-xl hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500">
                                    <a className="text-red-400">전체 삭제</a>
                            </div>
                            <div onClick={gobuyform} className="flex ml-[1rem] w-[10rem] h-[3rem] rounded-xl items-center justify-center shadow-xl hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500 bg-red-400">
                                    <a className="text-white">결제하기</a></div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'tab2' && (
                    <div className="tab-content flex flex-col mt-[0.4rem] w-[62rem] h-[15rem]">
                        <div className="flex flex-col">
                            <div className="flex ml-[5rem] mt-[1.2rem] flex-row">
                                <div className="flex items-start text-gray-950 w-1/2 text-lg">상품금액</div>
                                <div className="flex justify-end mr-[7rem] text-gray-950 w-1/2">840,000원</div>
                            </div>
                            <div className="flex ml-[5rem] mt-[1rem] flex-row">
                                <div className="flex items-start text-gray-950 w-1/2 text-lg">회원가 할인</div>
                                <div className="flex justify-end mr-[7rem] text-blue-600 w-1/2">-220,000원</div>
                            </div>
                            <div
                                className="flex flex-row w-[60rem] mt-[1rem] rounded-2xl items-center shadow-xl h-[2.5rem] bg-red-100">
                                <div className="flex ml-[4.8rem] items-start font-bold text-red-400 w-1/2 text-xl">결제 예정
                                    금액
                                </div>
                                <div
                                    className="flex justify-end mr-[5rem] text-xl font-bold text-red-400 w-1/2">685,000원
                                </div>
                            </div>
                            <div className="flex flex-row items-center mt-[2rem] justify-center w-[60rem]">
                                <div
                                    className="flex ml-[1rem] w-[10rem] border-[0.1rem] border-red-400 h-[3rem] rounded-xl items-center justify-center shadow-xl hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500">
                                    <a className="text-red-400">전체 삭제</a>
                                </div>
                                <div
                                    onClick={gobuyform} className="flex ml-[1rem] w-[10rem] h-[3rem] rounded-xl items-center justify-center shadow-xl hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500 bg-red-400">
                                    <a className="text-white">결제하기</a></div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'tab3' && (
                    <div className="tab-content flex flex-col mt-[0.4rem] w-[62rem] h-[15rem]">
                        <div className="flex flex-col">
                            <div className="flex ml-[5rem] mt-[1.2rem] flex-row">
                                <div className="flex items-start text-gray-950 w-1/2 text-lg">상품금액</div>
                                <div className="flex justify-end mr-[7rem] text-gray-950 w-1/2">840,000원</div>
                            </div>
                            <div className="flex ml-[5rem] mt-[1rem] flex-row">
                                <div className="flex items-start text-gray-950 w-1/2 text-lg">회원가 할인</div>
                                <div className="flex justify-end mr-[7rem] text-blue-600 w-1/2">-120,000원</div>
                            </div>
                            <div
                                className="flex flex-row w-[60rem] mt-[1rem] rounded-2xl items-center shadow-xl h-[2.5rem] bg-red-100">
                                <div className="flex ml-[4.8rem] items-start font-bold text-red-400 w-1/2 text-xl">결제 예정
                                    금액
                                </div>
                                <div
                                    className="flex justify-end mr-[5rem] text-xl font-bold text-red-400 w-1/2">685,000원
                                </div>
                            </div>
                            <div className="flex flex-row items-center mt-[2rem] justify-center w-[60rem]">
                                <div
                                    className="flex ml-[1rem] w-[10rem] border-[0.1rem] border-red-400 h-[3rem] rounded-xl items-center justify-center shadow-xl hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500">
                                    <a className="text-red-400">전체 삭제</a>
                                </div>
                                <div
                                    onClick={gobuyform} className="flex ml-[1rem] w-[10rem] h-[3rem] rounded-xl items-center justify-center shadow-xl hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500 bg-red-400">
                                    <a className="text-white">결제하기</a></div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'tab4' && (
                    <div className="tab-content flex flex-col mt-[0.4rem] w-[62rem] h-[15rem]">
                        <div className="flex flex-col">
                            <div className="flex ml-[5rem] mt-[1.2rem] flex-row">
                                <div className="flex items-start text-gray-950 w-1/2 text-lg">상품금액</div>
                                <div className="flex justify-end mr-[7rem] text-gray-950 w-1/2">840,000원</div>
                            </div>
                            <div className="flex ml-[5rem] mt-[1rem] flex-row">
                                <div className="flex items-start text-gray-950 w-1/2 text-lg">회원가 할인</div>
                                <div className="flex justify-end mr-[7rem] text-blue-600 w-1/2">-120,000원</div>
                            </div>
                            <div
                                className="flex flex-row w-[60rem] mt-[1rem] rounded-2xl items-center shadow-xl h-[2.5rem] bg-red-100">
                                <div className="flex ml-[4.8rem] items-start font-bold text-red-400 w-1/2 text-xl">결제 예정
                                    금액
                                </div>
                                <div
                                    className="flex justify-end mr-[5rem] text-xl font-bold text-red-400 w-1/2">685,000원
                                </div>
                            </div>
                            <div className="flex flex-row items-center mt-[2rem] justify-center w-[60rem]">
                                <div
                                    className="flex ml-[1rem] w-[10rem] border-[0.1rem] border-red-400 h-[3rem] rounded-xl items-center justify-center shadow-xl hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500">
                                    <a className="text-red-400">전체 삭제</a>
                                </div>
                                <div onClick={gobuyform} className="flex ml-[1rem] w-[10rem] h-[3rem] rounded-xl items-center justify-center shadow-xl hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500 bg-red-400">
                                    <a className="text-white">결제하기</a></div>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    )
}

export default Cart;