import React, {useState, useEffect, useRef} from "react";
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
import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";
import { MdDateRange } from "react-icons/md";
import BuyBox from "../components/BuyBox.jsx";

const Product= () => {
    const PhotoSectionRef = useRef(null);
    const ReviewSectionRef = useRef(null);
    const InfoSectionRef = useRef(null);
    const RestSectionRef = useRef(null);
    const [showFullImages, setShowFullImages] = useState(false);

    const toggleShowImages = () => {
        setShowFullImages(!showFullImages);
    };


    const scrollToPhotoSection = () => {

        if (PhotoSectionRef.current) {
            PhotoSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToInfoSection = () => {

        if (InfoSectionRef.current) {
            InfoSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToReviewSection = () => {

        if (ReviewSectionRef.current) {
            ReviewSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToRestSection = () => {

        if (RestSectionRef.current) {
            RestSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col h-full items-center justify-center mx-28">  {/*슬라이더 박스*/}
            <div className="flex justify-start flex-row rounded-3xl border-2 border-gray-950 w-[62rem] h-[22rem] mt-6 items-center">
                <div className="flex flex-row items-center w-[42rem] h-[22rem]">
                    <img className="flex w-[42rem] h-[21.8rem] rounded-l-3xl" src="https://ifh.cc/g/0F7mtd.jpg"/></div>
                <div className="flex flex-col shadow-xl rounded-r-3xl items-center w-[20rem] h-[22rem]">
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
            <div className="flex flex-col items-center w-[68rem] h-full mt-[2rem]">
                <div
                    className="flex flex-row w-[24rem] mt-[1rem] mr-[38rem] h-[4rem] shadow-lg justify-center items-center">
                    <div className="flex w-[6rem] h-[4rem] rounded-l-lg items-center justify-center border-[0.1rem] border-gray-600 hover:bg-gray-300 hover:scale-125 transition-transform ease-in-out duration-500 cursor-pointer text-gray-950 font-semibold text-sm" onClick={scrollToInfoSection}>상품정보</div>
                    <p className="text-gray-950 flex w-[6rem] h-[4rem] items-center justify-center border-[0.1rem] border-gray-600 text-sm hover:bg-gray-300 hover:scale-125 transition-transform ease-in-out duration-500 font-semibold cursor-pointer"
                       onClick={scrollToPhotoSection}>시설사진</p>
                    <p className="text-gray-950 flex w-[6rem] h-[4rem] items-center justify-center border-[0.1rem] border-gray-600 text-sm hover:bg-gray-300 hover:scale-125 transition-transform ease-in-out duration-500 cursor-pointer font-semibold" onClick={scrollToRestSection}>편의시설</p>
                    <p className="text-gray-950 flex w-[6rem] rounded-r-lg h-[4rem] items-center justify-center border-[0.1rem] hover:bg-gray-300 border-gray-600 text-sm font-semibold cursor-pointer hover:scale-125 transition-transform ease-in-out duration-500"
                       onClick={scrollToReviewSection}>리뷰</p>
                </div>
                <div ref={InfoSectionRef} className="flex flex-col items-center w-[64rem] rounded-3xl h-full">
                    <div className="ml-[2rem] flex flex-row w-[64rem] h-full">
                    <div className="relative flex flex-col items-center mr-[2rem] mt-[1rem] h-full rounded-xl w-[64rem] overflow-hidden">
                        {/* 컨테이너 */}
                        <div
                            className={`flex flex-col items-center ${showFullImages ? '' : 'h-[350px] overflow-hidden'}`}>
                            {/* 첫 번째 이미지 */}
                            <img
                                className="flex mt-[2rem] rounded-xl bg-teal-700 h-[15rem] w-[50rem]"
                                src="https://ifh.cc/g/wp3Na2.jpg"
                                alt="First"
                            />

                            {/* 두 번째 이미지 */}
                            <img
                                className="flex mt-[2rem] rounded-xl h-[15rem] w-[50rem]"
                                src="https://ifh.cc/g/NHBB1m.png"
                                alt="Second"
                            />

                            {/* 추가 이미지 */}
                            {showFullImages && (
                                <>
                                    <img
                                        className="flex rounded-xl mt-[2rem] h-[55rem] w-[50rem]"
                                        src="https://ifh.cc/g/F4OQvG.jpg"
                                        alt="Third"
                                    />
                                    <img
                                        className="flex rounded-xl mt-[2rem] h-[55rem] w-[50rem]"
                                        src="https://ifh.cc/g/V2Mo6W.png"
                                        alt="Fourth"
                                    />
                                </>
                            )}
                        </div>

                        {/* 버튼 */}
                        <div className="flex mt-[1rem] border-[0.1rem] font-bold cursor-pointer hover:scale-90 hover:bg-gray-400 hover:text-white transition-transform ease-in-out duration-500 border-gray-500 bg-white text-gray-600 py-[1rem] px-[5rem] rounded z-30"
                            onClick={toggleShowImages}
                        >
                            {showFullImages ? '상품 정보 접기' : '상품 정보 더보기'}
                            {showFullImages ? (
                                <TiArrowSortedUp className="w-[1.5rem] h-[1.5rem]" />
                            ) : (
                                <TiArrowSortedDown className="w-[1.5rem] h-[1.5rem]" />
                            )}
                        </div>
                    </div>
                    </div>
                    <div className="flex divide-gray-600 ml-[4rem] w-[60rem]"></div>
                <div className="flex flex-col"> {/*하단 소개글*/}
                    <div className="flex flex-row text-sm mx-auto mt-[2rem] bg-gray-300 shadow-xl border-[0.1rem] border-gray-600 items-center justify-center rounded-lg w-[50rem] h-[20rem]">
                        <div className="flex flex-col rounded-3xl bg-white justify-center items-center h-[18rem] w-[18rem]">
                            <a className="flex text-sm bg-yellow-200 border-[0.2rem] border-yellow-200 items-center justify-center rounded-xl w-[12rem] font-bold mt-[1.2rem]">Mining 클라이밍</a>
                            <div className="flex items-center justify-center flex-col w-1/2">
                                <div className="flex w-[8rem] mt-[1rem] h-[8rem]"><img className="rounded-full"
                                                                                         src="https://ifh.cc/g/XpkHf4.jpg"></img></div>
                                <div className="flex flex-col items-center justify-center bg-yellow-200 mt-[1rem] rounded-xl h-[5rem] w-[20rem]">
                                <a className="text-xs font-semibold whitespace-nowrap">안녕하세요! Mining 클라이밍짐를 소개합니다!</a>
                                <a className="text-xs whitespace-nowrap">퍼즐처럼 예쁜 벽에서 등반하고 싶다면,</a>
                                <a className="text-xs whitespace-nowrap">바로 여기 Mining 클라이밍짐으로 오시면 됩니다!</a>
                                    <a className="text-xs whitespace-nowrap">Mining 클라이밍 짐에서 새로운 도전을 시작해 보세요!</a>
                                </div>
                            </div>
                        </div>
                        <div className="border-l border-gray-400 ml-[3.5rem] h-[16rem]"></div>
                        <div className="flex flex-col ml-[3.5rem] rounded-3xl bg-white items-center w-[18rem] h-[18rem]">
                            <a className="flex text-sm bg-yellow-200 border-[0.2rem] border-yellow-200 items-center justify-center rounded-xl w-[12rem] font-bold mt-[1.2rem]">운영
                                시간 및 이용 안내</a>
                            <div className="flex flex-row justify-center mt-[2.8rem] w-[18rem] h-[18rem]">
                                <div ref={RestSectionRef} className="flex ml-[0.5rem] items-center flex-col w-1/2">
                                    <MdDateRange className="flex w-[3rem] h-[3rem]"/>
                                    <a className="flex font-semibold mt-[0.5rem]">[ 평일 ]</a>
                                    <a className="flex text-xs whitespace-nowrap">11:00 ~ 22:00</a>
                                    <a className="font-semibold mt-[0.5rem] whitespace-nowrap">[ 주말 및 공휴일 ]</a>
                                    <a className="whitespace-nowrap text-xs">11:00 ~ 20:00</a>
                                </div>
                                <div className="flex flex-col items-center mr-[0.5rem] w-1/2">
                                    <FaParking className="flex w-[3rem] h-[3rem]"/>
                                    <a className="font-semibold mt-[0.5rem]">[ 주차 ]</a>
                                    <a className="flex text-xs whitespace-nowrap">1시간 무료</a>
                                    <a className="flex text-xs whitespace-nowrap">이후 시간당 1000원</a>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    <div className="flex divider divide-gray-600 ml-[4rem] w-[60rem]"></div>
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
                        <div  ref={PhotoSectionRef} className="flex flex-col">
                            <PiLockersFill className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>
                            <a className="font-bold text-sm mt-[0.4rem] ml-[2.2rem]">개인락커</a>
                        </div>
                    </div>
                </div>
                <div  className="flex divider divide-gray-600 ml-[4rem] w-[60rem]"></div>
                <a className="flex text-lg font-bold">시설사진</a>
                <div className="flex flex-row space-x-7 mt-[1.5rem]">{/*시설사진*/}
                    <div className="flex w-[11rem] h-[10rem] hover:scale-125 transition-transform ease-in-out duration-500"><img className="rounded-xl" src="https://ifh.cc/g/CoJTAC.png"/></div>
                    <div className="flex w-[11rem] h-[10rem] hover:scale-125 transition-transform ease-in-out duration-500"><img className="rounded-xl"src="https://ifh.cc/g/ODqhnw.png"/>
                    </div>
                    <div className="flex w-[11rem] h-[10rem] hover:scale-125 transition-transform ease-in-out duration-500"><img className="rounded-xl" src="https://ifh.cc/g/fRFRkw.png"/>
                    </div>
                    <div className="flex w-[11rem] h-[10rem] hover:scale-125 transition-transform ease-in-out duration-500"><img className="rounded-xl" src="https://ifh.cc/g/Zf4TlH.png"/>
                    </div>
                </div>
                <div className="flex flex-row space-x-7 mt-[1rem]">{/*시설사진*/}
                    <div className="flex w-[11rem] h-[10rem] hover:scale-125 transition-transform ease-in-out duration-500"><img className="rounded-xl" src="https://ifh.cc/g/p8FalY.png"/>
                    </div>
                    <div className="flex w-[11rem] h-[10rem] hover:scale-125 transition-transform ease-in-out duration-500"><img className="rounded-xl" src="https://ifh.cc/g/yfCrXk.png"/>
                    </div>
                    <div className="flex w-[11rem] h-[10rem] hover:scale-125 transition-transform ease-in-out duration-500"><img className="rounded-xl" src="https://ifh.cc/g/4fpBhf.png"/>
                    </div>
                    <div className="flex w-[11rem] h-[10rem] hover:scale-125 transition-transform ease-in-out duration-500"><img className="rounded-xl" src="https://ifh.cc/g/oyVHYd.png"/>
                    </div>
                </div>
                <div className="flex divider divide-gray-600 ml-[4rem] w-[60rem]"></div>
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
                <div ref={ReviewSectionRef} className="flex divider divide-gray-600 ml-[4rem] w-[60rem]"></div>
                <a className="flex text-lg font-bold">사용자 리뷰</a>
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
        </div>

    )
}

export default Product;