import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useRecoilValue} from "recoil";
import { FaLocationDot } from "react-icons/fa6";
import { MdNavigateNext } from "react-icons/md";
import { GiTowel } from "react-icons/gi";
import { FaShower } from "react-icons/fa6";
import { FaHandsWash } from "react-icons/fa";
import { FaWifi } from "react-icons/fa";
import { FaParking } from "react-icons/fa";
import { PiLockersFill } from "react-icons/pi";
import { FaCircleUser } from "react-icons/fa6";

const Product= () => {

    return (
        <div className="flex flex-col h-full items-center justify-center mx-44">  {/*슬라이더 박스*/}
            <div
                className="flex justify-start flex-row rounded-3xl border-2 border-gray-950 w-[62rem] h-[22rem] mt-6 items-center">
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
                            <input type="radio" name="rating-1" className="mask mask-star" checked="checked"/>
                            <input type="radio" name="rating-1" className="mask mask-star"/>
                            <input type="radio" name="rating-1" className="mask mask-star"/>
                        </div>
                        <a className="flex text-xs mt-[0.28rem] font-bold ml-[0.5em]">4.5 (19)</a>
                        <a className="flex text-xs mt-[0.28rem] text-blue-500 font-bold ml-[0.9em] cursor-pointer">후기
                            더보기</a>
                        <MdNavigateNext className="flex mt-[0.28rem] fill-blue-500"/>
                    </div>
                </div>
            </div>
            <div className="flex flex-col bg-gray-200 w-[62rem] h-full mt-14 justify-start">
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
                            <a className="flex text-xl font-bold ml-[43rem] mt-[0.8rem] whitespace-nowrap">130,000원</a>
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
                            회원권 담기
                        </div>
                    </div>
                </div>
                <div className="flex flex-col"> {/*하단 소개글*/}
                    <div
                        className="flex text-sm mx-auto flex-col bg-gray-300 shadow-xl border-[0.1rem] border-gray-600 mt-[3rem] items-center justify-center rounded-lg w-[50rem] h-[9rem]">
                        <a className="text-lg font-bold">마천동 Mining 클라이밍짐</a>
                        <a className="flex mt-[1rem]">안녕하세요! Mining 클라이밍짐를 소개합니다!</a>
                        <a>퍼즐처럼 예쁜 벽에서 등반하고 싶다면, 바로 여기 Mining 클라이밍짐으로 오시면 됩니다!</a>
                        <a>Mining 클라이밍 짐에서 새로운 도전을 시작해 보세요!</a>
                    </div>
                </div>
                <div className="flex divider divide-gray-600 ml-[1rem] w-[60rem]"></div>
                <div
                    className="flex mx-auto text-sm flex-col bg-gray-300 shadow-xl border-[0.1rem] border-gray-600 items-center justify-center rounded-lg w-[50rem] h-[9rem]">
                    <a className="font-bold text-lg">운영 시간 및 이용 안내</a>
                    <div className="flex flex-row ml-[5.4rem]">
                        <div className="flex flex-col">
                            <a>[ 평 일 ]</a>
                            <a>11:00~22:00</a>
                        </div>
                        <div className="flex flex-col">
                            <a className="ml-[4rem]">[ 주 차 ]</a>
                            <a className="ml-[3rem]">1시간 무료</a>
                            <a className="ml-[3rem]">1시간 이후 시간당 1000원</a>
                        </div>
                    </div>
                    <a className="mr-[9rem]">[ 주말 및 공휴일 ]</a>
                    <a className="mr-[9rem]">11:00~20:00</a>
                </div>
                <div className="flex divider divide-gray-600 ml-[1rem] w-[60rem]"></div>
                <div
                    className="flex mx-auto flex-col bg-gray-300 shadow-xl border-[0.1rem] border-gray-600 items-center justify-center rounded-lg w-[50rem] h-[9rem]">
                    <a className="text-lg font-bold">운영 프로그램</a>
                    <a className="flex mt-[1rem]">안녕하세요! Mining 클라이밍짐를 소개합니다!</a>
                    <a>퍼즐처럼 예쁜 벽에서 등반하고 싶다면, 바로 여기 Mining 클라이밍짐으로 오시면 됩니다!</a>
                    <a>Mining 클라이밍 짐에서 새로운 도전을 시작해 보세요!</a>
                </div>
                <div className="flex divider divide-gray-600 ml-[1rem] w-[60rem]"></div>
                <div
                    className="flex mx-auto flex-col bg-gray-300 shadow-xl border-[0.1rem] border-gray-600 rounded-lg w-[50rem] h-[9rem]">
                    <a className="text-lg font-bold mt-[0.5rem] ml-[1rem]">편의 시설</a>
                    <div className="flex flex-row">
                        <div className="flex flex-col">
                            <GiTowel className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>
                            <a className="font-bold text-sm mt-[0.4rem] ml-[3.1rem]">수건</a>
                        </div>
                        <div className="flex flex-col">
                            <FaShower className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>
                            <a className="font-bold text-sm mt-[0.4rem] ml-[2.2rem]">샤워시설</a>
                        </div>
                        <div className="flex flex-col">
                            <FaHandsWash className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>
                            <a className="font-bold text-sm mt-[0.4rem] ml-[2.2rem]">세족시설</a>
                        </div>
                        <div className="flex flex-col">
                            <FaWifi className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>
                            <a className="font-bold text-sm mt-[0.4rem] ml-[3.1rem]">Wifi</a>
                        </div>
                        <div className="flex flex-col">
                            <FaParking className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>
                            <a className="font-bold text-sm mt-[0.4rem] ml-[3rem]">주차</a>
                        </div>
                        <div className="flex flex-col">
                            <PiLockersFill className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>
                            <a className="font-bold text-sm mt-[0.4rem] ml-[2.2rem]">개인락커</a>
                        </div>
                    </div>
                </div>
                <div className="flex divider divide-gray-600 ml-[1rem] w-[60rem]"></div>
                <a className="flex ml-[7rem] text-lg font-bold">시설사진</a>
                <div className="flex flex-row space-x-7 ml-[6.2rem] mt-[1.5rem]">{/*시설사진*/}
                    <div className="flex w-[11rem] h-[10rem] bg-indigo-500"></div>
                    <div className="flex w-[11rem] h-[10rem] bg-indigo-500"></div>
                    <div className="flex w-[11rem] h-[10rem] bg-indigo-500"></div>
                    <div className="flex w-[11rem] h-[10rem] bg-indigo-500"></div>
                </div>
                <div className="flex flex-row space-x-7 ml-[6.2rem] mt-[1rem]">{/*시설사진*/}
                    <div className="flex w-[11rem] h-[10rem] bg-indigo-500"></div>
                    <div className="flex w-[11rem] h-[10rem] bg-indigo-500"></div>
                    <div className="flex w-[11rem] h-[10rem] bg-indigo-500"></div>
                    <div className="flex w-[11rem] h-[10rem] bg-indigo-500"></div>
                </div>
                <div className="flex divider divide-gray-600 ml-[1rem] w-[60rem]"></div>
                <div
                    className="flex mx-auto flex-col bg-gray-300 shadow-xl border-[0.1rem] border-gray-600 rounded-lg w-[50rem] h-[9rem]">
                    <a className="text-lg font-bold mt-[0.5rem] ml-[1rem]">이용 후기</a>
                    <div className="flex flex-row">
                        <div className="flex flex-col">
                            <a className="ml-[3.8rem] mt-[1rem] font-bold text-xl">4.5 (19개)</a>
                            <div className="rating ml-[3.2rem]">
                                <input type="radio" name="rating-1" className="mask mask-star"/>
                                <input type="radio" name="rating-1" className="mask mask-star"/>
                                <input type="radio" name="rating-1" className="mask mask-star"/>
                                <input type="radio" name="rating-1" className="mask mask-star" checked="checked"/>
                                <input type="radio" name="rating-1" className="mask mask-star"/>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <div className="flex flex-row ml-[28rem]">
                                <a className="whitespace-nowrap text-xs">5점</a>
                                <input type="range" min={0} max="100" value="90"
                                       className="ml-[0.4rem] h-[0.8rem] mt-[0.15rem] range range-lg"/>
                            </div>
                            <div className="flex flex-row ml-[28rem]">
                                <a className="whitespace-nowrap text-xs">4점</a>
                                <input type="range" min={0} max="100" value="10"
                                       className="ml-[0.4rem] h-[0.8rem] mt-[0.15rem] range range-lg"/>
                            </div>
                            <div className="flex flex-row ml-[28rem]">
                                <a className="whitespace-nowrap text-xs">3점</a>
                                <input type="range" min={0} max="100" value="0"
                                       className="ml-[0.4rem] h-[0.8rem] mt-[0.15rem] range range-lg"/>
                            </div>
                            <div className="flex flex-row ml-[28rem]">
                                <a className="whitespace-nowrap text-xs">2점</a>
                                <input type="range" min={0} max="100" value="0"
                                       className="ml-[0.4rem] h-[0.8rem] mt-[0.15rem] range range-lg"/>
                            </div>
                            <div className="flex flex-row ml-[28rem]">
                                <a className="whitespace-nowrap text-xs">1점</a>
                                <input type="range" min={0} max="100" value="0"
                                       className="ml-[0.4rem] h-[0.8rem] mt-[0.15rem] range range-lg"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex divider divide-gray-600 ml-[1rem] w-[60rem]"></div>
                <a className="flex ml-[7rem] text-lg font-bold">사용자 리뷰</a>
                <div
                    className="flex mx-auto flex-row mt-[1rem] bg-gray-300 shadow-xl border-[0.1rem] border-gray-600 rounded-lg w-[50rem] h-[9rem]">
                    <FaCircleUser className="ml-[1.5rem] mt-[1.4rem] h-[4rem] w-[4rem]"/>
                    <div className="flex flex-col">
                        <a className="font-bold text-sm ml-[1.5rem] mt-[1.4rem]">난 리치 클라이머</a>
                        <div className="rating mt-[0.2rem] ml-[1.5rem]">
                            <input type="radio" name="rating-1" className="mask mask-star"/>
                            <input type="radio" name="rating-1" className="mask mask-star"/>
                            <input type="radio" name="rating-1" className="mask mask-star"/>
                            <input type="radio" name="rating-1" className="mask mask-star"/>
                            <input type="radio" name="rating-1" className="mask mask-star" checked="checked"/>
                        </div>
                        <a className="text-xs ml-[1.5rem] mt-[0.6rem] font-bold text-gray-700">일일이용</a>
                        <a className="text-xs ml-[1.5rem] mt-[0.5rem]">직원분들도 엄청 친절하고 시설이 깔끔하고 아주 좋았어요!</a>
                    </div>
                </div>
                <div className="flex h-[20rem]"></div>
            </div>
        </div>

    )
}

export default Product;