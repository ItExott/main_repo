import React, {useState, useEffect, useRef} from "react";
import {Link, useParams} from "react-router-dom";
import {useRecoilValue} from "recoil";
import axios from "axios";
{/*아이콘 import문*/}
import { FaLocationDot } from "react-icons/fa6";
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
import { PiSirenBold }   from "react-icons/pi";
import { LiaDumbbellSolid } from "react-icons/lia";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
{/*컴포넌트 동기화문*/}
import BottomBox from "../components/BottomBox.jsx";

const Product= () => {
    const PhotoSectionRef = useRef(null);
    const ReviewSectionRef = useRef(null);
    const InfoSectionRef = useRef(null);
    const RestSectionRef = useRef(null);
    const [showFullImages, setShowFullImages] = useState(false);
    const [activeTab, setActiveTab] = useState('전체 리뷰');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isExpanded1, setIsExpanded1] = useState(false);
    const [isExpanded2, setIsExpanded2] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    // 로그인 정보 불러오는 db문
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/userinfo', {
                    withCredentials: true, // 세션을 확인하려면 반드시 필요
                });

                if (response.data.success) {
                    setIsLoggedIn(true);
                    setUserId(response.data.userId);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('로그인 상태 확인 실패', error);
            }
        };

        checkLoginStatus();
    }, []);

    // 상품 정보 가져오는 db문
    const { id } = useParams();
    const [productData, setProductData] = useState({
        iconpicture: "",
        prodid: "",
        prodtitle: "",
        prodrating: "",
        address: "",
        prodpicture: "",
        prodcontent1: "",
        prodcontent2: "",
        prodcontent3: "",
        prodcontent4: "",
        prodsmtitle: "",
        facility_pictures: [] // Add a new field for facility pictures
    });
    useEffect(() => {
        // 데이터 요청
        axios.get(`http://localhost:8080/product/${id}`)
            .then(response => {
                console.log(response.data); // 백엔드에서 받은 데이터를 로그로 확인
                setProductData({
                    prodid: response.data.prodid,
                    iconpicture: response.data.iconpicture,
                    prodtitle: response.data.prodtitle,
                    prodrating: response.data.prodrating,
                    address: response.data.address,
                    prodpicture: response.data.prodpicture,
                    prodcontent1: response.data.prodcontent1,
                    prodcontent2: response.data.prodcontent2,
                    prodcontent3: response.data.prodcontent3,
                    prodcontent4: response.data.prodcontent4,
                    prodsmtitle: response.data.prodsmtitle,
                    facility_pictures: response.data.facility_pictures || [] // Set facility_pictures if available
                });
            })
            .catch(error => {
                console.error("Error fetching product data:", error);
            });
    }, [id]);

    {/*const문*/}
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
    const buttonData = [
        { text: "상품 정보", onClick: scrollToInfoSection },
        { text: "시설 사진", onClick: scrollToPhotoSection },
        { text: "편의 시설", onClick: scrollToRestSection },
        { text: "리뷰", onClick: scrollToReviewSection },
    ];

    return (
        <div className="flex flex-col h-full items-center justify-center mx-28">  {/*슬라이더 박스*/}
            <BottomBox productData={productData}/>
            <div
                className="flex justify-start flex-row rounded-3xl border-2 border-gray-950 w-[62rem] h-[22rem] mt-6 items-center">
                <div className="flex flex-row items-center w-[42rem] h-[22rem]"><img
                    className="flex w-[42rem] h-[21.8rem] rounded-l-3xl" src={productData.prodpicture}/></div>
                <div className="flex flex-col shadow-xl rounded-r-3xl items-center w-[20rem] h-[22rem]"> {/*타이틀 우측*/}
                    <div className="flex w-[10rem] mt-[2rem] h-[10rem]">
                        {productData.iconpicture ? (
                            <img className="rounded-full" src={productData.iconpicture} alt="Product Logo"/>
                        ) : (
                            <p>Loading...</p> // 데이터가 없을 때 보여줄 로더
                        )}
                    </div>
                    <a className="text-lg mt-[1rem] font-bold">{productData.prodtitle}</a>
                    <a className="text-sm">{productData.prodsmtitle}</a>
                    <div className="flex mt-[1rem] flex-row">
                        <FaLocationDot/>
                        <a className="text-sm font-bold">{productData.address}</a>
                    </div>
                    <div className="flex mt-[1rem] flex-row">
                        {[...Array(4)].map((_, index) => (
                            <LiaDumbbellSolid
                                key={index}
                                className={`w-[2rem] h-[2rem] ${productData.prodrating >= (index + 1) * 3 ? "fill-black" : "fill-gray-300"}`}
                            />
                        ))}
                        <a className="text-lg mt-[0.3rem] font-bold items-center flex ml-[0.5rem]">{productData.prodrating}</a>
                        <a className="text-xs items-center ml-[0.1rem] mt-[0.4rem] flex"> / 10</a>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center w-[68rem] h-full mt-[2rem]">
                <div
                    className="flex flex-row w-[24rem] mt-[1rem] mr-[38rem] h-[4rem] shadow-lg justify-center items-center">
                    {buttonData.map((button, index) => (
                        <div
                            key={index}
                            className={`flex w-[6rem] h-[4rem] ${index === 0 ? 'rounded-l-lg' : ''} ${index === buttonData.length - 1 ? 'rounded-r-lg' : ''} items-center justify-center border-[0.1rem] border-gray-950 text-sm hover:bg-gray-100 hover:scale-125 transition-transform ease-in-out duration-500 cursor-pointer font-semibold`}
                            onClick={button.onClick}
                        >
                            {button.text}
                        </div>
                    ))}
                </div>
                <div ref={InfoSectionRef} className="flex flex-col items-center w-[64rem] rounded-3xl h-full">
                    <div className="ml-[2rem] flex flex-row w-[64rem] h-full">
                        <div
                            className="relative flex flex-col items-center mr-[2rem] mt-[1rem] h-full rounded-xl w-[64rem] overflow-hidden">
                            {/* 이미지 컨테이너 */}
                            <div
                                className={`flex flex-col items-center ${showFullImages ? '' : 'h-[350px] overflow-hidden'}`}>
                                {/* 이미지들 */}
                                {[productData.prodcontent1, productData.prodcontent2, productData.prodcontent3, productData.prodcontent4]
                                    .slice(0, showFullImages ? 4 : 2)
                                    .map((src, index) => (
                                        <img
                                            key={index}
                                            className="flex mt-[2rem] rounded-xl h-full w-[50rem]"
                                            src={src}
                                            alt={`Image ${index + 1}`}
                                        />
                                    ))}
                            </div>
                            <div
                                className="flex mt-[1rem] border-[0.1rem] font-bold cursor-pointer hover:scale-90 hover:bg-gray-100 transition-transform ease-in-out duration-500 border-gray-950 bg-white text-gray-950 py-[1rem] px-[5rem] rounded z-30"
                                onClick={toggleShowImages}
                            >
                                {showFullImages ? '상품 정보 접기' : '상품 정보 더보기'}
                                {showFullImages ? (
                                    <TiArrowSortedUp className="w-[1.5rem] h-[1.5rem]"/>
                                ) : (
                                    <TiArrowSortedDown className="w-[1.5rem] h-[1.5rem]"/>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex divide-gray-600 ml-[4rem] w-[60rem]"></div>
                    <div className="flex flex-col">
                        {/* 하단 소개글 */}
                        <div
                            className="flex flex-row text-sm mx-auto mt-[2rem] bg-gray-100 shadow-xl border-[0.1rem] border-gray-600 items-center justify-center rounded-lg w-[50rem] h-[20rem]">

                            {/* 첫 번째 카드 */}
                            <div
                                className="flex flex-col rounded-3xl bg-white justify-center items-center h-[18rem] w-[18rem]">
                                <a className="flex text-sm bg-yellow-200 border-[0.2rem] border-yellow-200 items-center justify-center rounded-xl w-[12rem] font-bold mt-[1.2rem]">
                                    {productData.prodtitle}
                                </a>
                                <div className="flex items-center justify-center flex-col w-1/2">
                                    <div className="flex w-[8rem] mt-[1rem] h-[8rem]">
                                        <img className="rounded-full" src={productData.iconpicture} alt="Product Logo"/>
                                    </div>
                                    <div
                                        className="flex flex-col items-center justify-center bg-yellow-200 mt-[1rem] rounded-xl h-[5rem] w-[20rem]">
                                        <a className="text-xs font-semibold whitespace-nowrap">안녕하세요! Mining 클라이밍짐를
                                            소개합니다!</a>
                                        <a className="text-xs whitespace-nowrap">퍼즐처럼 예쁜 벽에서 등반하고 싶다면,</a>
                                        <a className="text-xs whitespace-nowrap">바로 여기 Mining 클라이밍짐으로 오시면 됩니다!</a>
                                        <a className="text-xs whitespace-nowrap">Mining 클라이밍 짐에서 새로운 도전을 시작해 보세요!</a>
                                    </div>
                                </div>
                            </div>

                            <div className="border-l border-gray-400 ml-[3.5rem] h-[16rem]"></div>

                            {/* 두 번째 카드 */}
                            <div
                                className="flex flex-col ml-[3.5rem] rounded-3xl bg-white items-center w-[18rem] h-[18rem]">
                                <a className="flex text-sm bg-yellow-200 border-[0.2rem] border-yellow-200 items-center justify-center rounded-xl w-[12rem] font-bold mt-[1.2rem]">
                                    운영 시간 및 이용 안내
                                </a>
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
                        className="flex mx-auto flex-col bg-gray-100 shadow-xl border-[0.1rem] border-gray-600 rounded-lg w-[50rem] h-[9rem]">
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
                            <div ref={PhotoSectionRef} className="flex flex-col">
                                <PiLockersFill className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>
                                <a className="font-bold text-sm mt-[0.4rem] ml-[2.2rem]">개인락커</a>
                            </div>
                        </div>
                    </div>
                    <div className="flex divider divide-gray-600 ml-[4rem] w-[60rem]"></div>
                    <div className="flex flex-col rounded-lg w-[50rem] h-[24rem]">
                        <a className="text-lg font-bold ml-[1rem]">시설 사진</a>
                        <div className="grid grid-cols-4 gap-7 mt-[1.2rem]">
                            {/* Map through the facility pictures */}
                            {productData.facility_pictures && productData.facility_pictures.length > 0 ? (
                                productData.facility_pictures.map((imageUrl, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-center items-center w-[11rem] h-[10rem] hover:scale-125 transition-transform ease-in-out duration-500">
                                        <img className="rounded-xl" src={imageUrl} alt={`Facility ${index + 1}`}/>
                                    </div>
                                ))
                            ) : (
                                <p>사진 데이터가 없습니다.</p>
                            )}
                        </div>
                    </div>
                    <div className="flex divider divide-gray-600 ml-[4rem] w-[60rem]"></div>
                    <div className="flex flex-col"> {/*하단 소개글*/}
                        <a className="text-lg font-bold ml-[1rem]">이용 후기</a>
                        <div
                            className="flex flex-row text-sm mx-auto mt-[1.2rem] bg-gray-100 shadow-xl border-[0.1rem] border-gray-600 items-center justify-center rounded-lg w-[28rem] h-[15rem]">
                            <div className="flex flex-col rounded-3xl items-center h-[15rem] w-[18rem]">
                                <a className="font-semibold text-[1rem] mt-[1.2rem]">사용자 총점</a>
                                <div className="flex mt-[0.2rem] flex-row"> {/*로고 하단 후기 박스*/}
                                    {/* 첫 번째 아이콘 */}
                                    <LiaDumbbellSolid
                                        className={`w-[2rem] h-[2rem] ${productData.prodrating >= 0 ? "fill-black" : "fill-gray-300"}`}
                                    />

                                    {/* 두 번째 아이콘 */}
                                    <LiaDumbbellSolid
                                        className={`w-[2rem] h-[2rem] ${productData.prodrating >= 3 ? "fill-black" : "fill-gray-300"}`}
                                    />

                                    {/* 세 번째 아이콘 */}
                                    <LiaDumbbellSolid
                                        className={`w-[2rem] h-[2rem] ${productData.prodrating >= 6 ? "fill-black" : "fill-gray-300"}`}
                                    />

                                    {/* 네 번째 아이콘 */}
                                    <LiaDumbbellSolid
                                        className={`w-[2rem] h-[2rem] ${productData.prodrating >= 9 ? "fill-black" : "fill-gray-300"}`}
                                    />
                                    <a className="text-lg mt-[0.3rem] font-bold items-center flex ml-[0.5rem]">{productData.prodrating}</a>
                                    <a className="text-xs items-center ml-[0.1rem] mt-[0.4rem] flex"> / 10</a>
                                </div>
                                <div className="flex flex-row items-center mt-[0.6rem]">
                                    <LiaDumbbellSolid className="w-[1.7rem] h-[1.7rem] mt-[0.2rem] fill-black"/>
                                    <LiaDumbbellSolid className="w-[1.7rem] h-[1.7rem] mt-[0.2rem] fill-black"/>
                                    <LiaDumbbellSolid className="w-[1.7rem] h-[1.7rem] mt-[0.2rem] fill-black"/>
                                    <LiaDumbbellSolid className="w-[1.7rem] h-[1.7rem] mt-[0.2rem] fill-gray-300"/>
                                    <progress className="progress flex w-[12rem] mt-[0.3rem] ml-[0.6rem]" value={88}
                                              max="100"></progress>
                                    <a className="flex text-xs ml-[0.6rem] mt-[0.25rem]">88%</a>
                                </div>
                                <div className="flex flex-row items-center mr-[0.4rem]">
                                    <LiaDumbbellSolid className="w-[1.7rem] h-[1.7rem] mt-[0.2rem] fill-black"/>
                                    <LiaDumbbellSolid className="w-[1.7rem] h-[1.7rem] mt-[0.2rem] fill-black"/>
                                    <LiaDumbbellSolid className="w-[1.7rem] h-[1.7rem] mt-[0.2rem] fill-black"/>
                                    <LiaDumbbellSolid className="w-[1.7rem] h-[1.7rem] mt-[0.2rem] fill-gray-300"/>
                                    <progress className="progress flex w-[12rem] mt-[0.3rem] ml-[0.6rem]" value={5}
                                              max="100"></progress>
                                    <a className="flex text-xs ml-[0.6rem] mt-[0.25rem]">5%</a>
                                </div>
                                <div className="flex flex-row items-center mr-[0.4rem]">
                                    <LiaDumbbellSolid className="w-[1.7rem] h-[1.7rem] mt-[0.2rem] fill-black"/>
                                    <LiaDumbbellSolid className="w-[1.7rem] h-[1.7rem] mt-[0.2rem] fill-black"/>
                                    <LiaDumbbellSolid className="w-[1.7rem] h-[1.7rem] mt-[0.2rem] fill-gray-300"/>
                                    <LiaDumbbellSolid className="w-[1.7rem] h-[1.7rem] mt-[0.2rem] fill-gray-300"/>
                                    <progress className="progress flex w-[12rem] mt-[0.3rem] ml-[0.6rem]" value={2}
                                              max="100"></progress>
                                    <a className="flex text-xs ml-[0.6rem] mt-[0.25rem]">2%</a>
                                </div>
                                <div className="flex flex-row items-center mr-[0.4rem]">
                                    <LiaDumbbellSolid className="w-[1.7rem] h-[1.7rem] mt-[0.4rem] fill-black"/>
                                    <LiaDumbbellSolid className="w-[1.7rem] h-[1.7rem] mt-[0.4rem] fill-gray-300"/>
                                    <LiaDumbbellSolid className="w-[1.7rem] h-[1.7rem] mt-[0.4rem] fill-gray-300"/>
                                    <LiaDumbbellSolid className="w-[1.7rem] h-[1.7rem] mt-[0.4rem] fill-gray-300"/>
                                    <progress className="progress flex w-[12rem] mt-[0.3rem] ml-[0.6rem]" value={6}
                                              max="100"></progress>
                                    <a className="flex text-xs ml-[0.6rem] mt-[0.25rem]">6%</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row space-x-4 mt-[2.5rem] mr-[40rem] border-b w-[8rem] border-gray-300">
                        <a
                            className={`text-sm font-bold pb-2 cursor-pointer transition-transform ease-in-out duration-500 ${
                                activeTab === '전체 리뷰'
                                    ? 'text-black scale-110 border-b-2 border-black'
                                    : 'text-gray-500 hover:scale-110'
                            }`}
                            onClick={() => setActiveTab('전체 리뷰')}
                        >
                            전체 리뷰
                        </a>
                        <a
                            className={`text-sm font-bold pb-2 cursor-pointer transition-transform ease-in-out duration-500 ${
                                activeTab === '상품 문의'
                                    ? 'text-black scale-110 border-b-2 border-black'
                                    : 'text-gray-500 hover:scale-110'
                            }`}
                            onClick={() => setActiveTab('상품 문의')}
                        >
                            상품 문의
                        </a>
                    </div>

                    <div className="mt-4 flex ">
                        {activeTab === '전체 리뷰' && (
                            <div>
                                <div ref={ReviewSectionRef}
                                     className="flex mx-auto flex-row items-center mt-[1rem] bg-gray-100 shadow-xl border-[0.1rem] border-gray-600 rounded-lg w-[50rem] h-[9rem]">
                                    <div
                                        className="flex flex-col h-[8rem] border-r-[0.1rem] border-gray-400 items-center w-[10rem]">
                                        <FaCircleUser className="flex mt-[1.4rem] h-[4rem] w-[4rem]"/>
                                        <a className="flex font-bold mt-[0.5rem] items-center text-xs">난 리치 클라이머</a>
                                    </div>
                                    <div className="flex flex-col w-[30rem]">
                                        <div className="flex flex-row">
                                            <a className="text-xs text-gray-500 ml-[1.6rem]">rlqo12*** | 2024.11.19</a>
                                            <div className="flex flex-row cursor-pointer">
                                                <PiSirenBold className="ml-[0.5rem]"/>
                                                <a className="text-xs text-gray-500 mb-[0.1rem]">신고</a>
                                            </div>
                                        </div>
                                        <div className="flex flex-row ml-[1.4rem]">
                                            <LiaDumbbellSolid className="w-[1.5rem] h-[1.5rem] mt-[0.4rem] fill-black"/>
                                            <LiaDumbbellSolid className="w-[1.5rem] h-[1.5rem] mt-[0.4rem] fill-black"/>
                                            <LiaDumbbellSolid className="w-[1.5rem] h-[1.5rem] mt-[0.4rem] fill-black"/>
                                            <LiaDumbbellSolid
                                                className="w-[1.5rem] h-[1.5rem] mt-[0.4rem] fill-gray-300"/>
                                        </div>
                                        <a className="text-xs ml-[1.2rem] w-[4rem] text-center rounded-xl border-[0.1rem] border-gray-400 mt-[0.3rem] font-bold text-gray-700">일일이용</a>
                                        <a className="text-xs ml-[1.4rem] mt-[0.5rem]">직원분들도 엄청 친절하고 시설이 깔끔하고 아주
                                            좋았어요!</a>
                                    </div>
                                    <div className="flex w-[10rem] items-center justify-center h-[9rem]">
                                        <img className="w-[7rem] h-[7rem] rounded-xl"
                                             src="https://ifh.cc/g/yfCrXk.png"/>
                                    </div>
                                </div>
                                <div
                                    className="flex mx-auto flex-row items-center mt-[1rem] bg-gray-100 shadow-xl border-[0.1rem] border-gray-600 rounded-lg w-[50rem] h-[9rem]">
                                    <div
                                        className="flex flex-col h-[8rem] border-r-[0.1rem] border-gray-400 items-center w-[10rem]">
                                        <FaCircleUser className="flex mt-[1.4rem] h-[4rem] w-[4rem]"/>
                                        <a className="flex font-bold mt-[0.5rem] items-center text-xs">클라이밍 맨</a>
                                    </div>
                                    <div className="flex flex-col w-[30rem]">
                                        <div className="flex flex-row">
                                            <a className="text-xs text-gray-500 ml-[1.6rem]">world2** | 2024.10.08</a>
                                            <div className="flex flex-row cursor-pointer">
                                                <PiSirenBold className="ml-[0.5rem]"/>
                                                <a className="text-xs text-gray-500 mb-[0.1rem]">신고</a>
                                            </div>
                                        </div>
                                        <div className="flex flex-row ml-[1.4rem]">
                                            <LiaDumbbellSolid className="w-[1.5rem] h-[1.5rem] mt-[0.4rem] fill-black"/>
                                            <LiaDumbbellSolid className="w-[1.5rem] h-[1.5rem] mt-[0.4rem] fill-black"/>
                                            <LiaDumbbellSolid className="w-[1.5rem] h-[1.5rem] mt-[0.4rem] fill-black"/>
                                            <LiaDumbbellSolid className="w-[1.5rem] h-[1.5rem] mt-[0.4rem] fill-black"/>
                                        </div>
                                        <a className="text-xs ml-[1.2rem] w-[4rem] text-center rounded-xl border-[0.1rem] border-gray-400 mt-[0.3rem] font-bold text-gray-700">일일이용</a>
                                        <a className="text-xs ml-[1.4rem] mt-[0.5rem]">클라이밍 너무 좋아하는데 자주 올게요 ~</a>
                                    </div>
                                    <div className="flex w-[10rem] items-center justify-center h-[9rem]">
                                        <img className="w-[7rem] h-[7rem] rounded-xl"
                                             src="https://ifh.cc/g/CoJTAC.png"/>
                                    </div>
                                </div>
                                <div
                                    className="flex mx-auto flex-row items-center mt-[1rem] bg-gray-100 shadow-xl border-[0.1rem] border-gray-600 rounded-lg w-[50rem] h-[9rem]">
                                    <div
                                        className="flex flex-col h-[8rem] border-r-[0.1rem] border-gray-400 items-center w-[10rem]">
                                        <FaCircleUser className="flex mt-[1.4rem] h-[4rem] w-[4rem]"/>
                                        <a className="flex font-bold mt-[0.5rem] items-center text-xs">지나가던 행인</a>
                                    </div>
                                    <div className="flex flex-col w-[30rem]">
                                        <div className="flex flex-row">
                                            <a className="text-xs text-gray-500 ml-[1.6rem]">want2*** | 2024.09.16</a>
                                            <div className="flex flex-row cursor-pointer">
                                                <PiSirenBold className="ml-[0.5rem]"/>
                                                <a className="text-xs text-gray-500 mb-[0.1rem]">신고</a>
                                            </div>
                                        </div>
                                        <div className="flex flex-row ml-[1.4rem]">
                                            <LiaDumbbellSolid className="w-[1.5rem] h-[1.5rem] mt-[0.4rem] fill-black"/>
                                            <LiaDumbbellSolid
                                                className="w-[1.5rem] h-[1.5rem] mt-[0.4rem] fill-gray-300"/>
                                            <LiaDumbbellSolid
                                                className="w-[1.5rem] h-[1.5rem] mt-[0.4rem] fill-gray-300"/>
                                            <LiaDumbbellSolid
                                                className="w-[1.5rem] h-[1.5rem] mt-[0.4rem] fill-gray-300"/>
                                        </div>
                                        <a className="text-xs ml-[1.2rem] w-[4rem] text-center rounded-xl border-[0.1rem] border-gray-400 mt-[0.3rem] font-bold text-gray-700">일일이용</a>
                                        <a className="text-xs ml-[1.4rem] mt-[0.5rem]">저랑은 안맞는 클라이밍 장 같네요</a>
                                    </div>
                                    <div className="flex w-[10rem] items-center justify-center h-[9rem]">
                                        <img className="w-[7rem] h-[7rem] rounded-xl"
                                             src="https://ifh.cc/g/yfCrXk.png"/>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === '상품 문의' && (
                            <div>
                                <div onClick={() => setIsExpanded(!isExpanded)}
                                     className="flex mx-auto flex-row items-center mt-[1rem] hover:bg-gray-200 cursor-pointer bg-gray-100 shadow-xl border-[0.1rem] border-gray-600 rounded-lg w-[50rem] h-[7rem]">
                                    <div
                                        className="flex flex-col h-[6rem] border-r-[0.1rem] border-gray-400 items-center w-[10rem]">
                                        <FaCircleUser className="flex mt-[0.6rem] h-[4rem] w-[4rem]"/>
                                        <a className="flex font-bold mt-[0.5rem] items-center text-xs">김기사</a>
                                    </div>
                                    <div className="flex flex-col w-[30rem]">
                                        <div className="flex flex-row">
                                            <a className="text-xs font-semibold text-gray-600 ml-[1.3rem]">환불 / 구매</a>
                                        </div>
                                        <a className="text-sm font-bold ml-[1.3rem] mt-[0.3rem]">환불 문의 드립니다.</a>
                                        <div className="flex flex-row w-[20rem]">
                                            <a className="text-xs font-bold text-gray-500 ml-[1.4rem] mt-[0.2rem]">답변
                                                완료</a>
                                            <a className="text-xs font-bold text-gray-500 ml-[0.2rem] mt-[0.2rem]">·
                                                pjk***</a>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        {isExpanded ? (
                                            <FaAngleUp
                                                className="flex items-center justify-center w-[2rem] h-[2rem] ml-[5rem]"/>
                                        ) : (
                                            <FaAngleDown
                                                className="flex items-center justify-center w-[2rem] h-[2rem] ml-[5rem]"/>
                                        )}
                                    </div>
                                </div>
                                {isExpanded && (
                                    <div
                                        className="mt-2 bg-gray-50 border-[0.1rem] border-gray-300 rounded-lg p-4 w-[50rem] mx-auto shadow-md">
                                        <p className="text-sm text-gray-700">
                                            안녕하세요, 고객님. 환불 관련 문의 사항에 대해 답변드립니다. 환불 절차는 구매일로부터 7일 이내에 신청 가능합니다.
                                        </p>
                                        <p className="text-sm text-gray-700 mt-2">
                                            자세한 내용은 고객센터로 문의해 주세요. 감사합니다.
                                        </p>
                                        <div
                                            className="mt-[1rem] bg-gray-50 border-[0.1rem] border-gray-300 rounded-lg p-4 w-[48rem] mx-auto shadow-md">
                                            <div className="flex items-center flex-row">
                                                <FaCheckCircle/>
                                                <a className="text-xm ml-[0.3rem] text-gray-700">답변 내용</a>
                                            </div>
                                            <p className="text-sm mt-2 text-gray-700">
                                                안녕하세요, 고객님. 환불 관련 문의 사항에 대해 답변드립니다. 환불 절차는 구매일로부터 7일 이내에 신청 가능합니다.
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                자세한 내용은 고객센터로 문의해 주세요. 감사합니다.
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <div onClick={() => setIsExpanded1(!isExpanded1)}
                                     className="flex mx-auto flex-row items-center mt-[1rem] hover:bg-gray-200 cursor-pointer bg-gray-100 shadow-xl border-[0.1rem] border-gray-600 rounded-lg w-[50rem] h-[7rem]">
                                    <div
                                        className="flex flex-col h-[6rem] border-r-[0.1rem] border-gray-400 items-center w-[10rem]">
                                        <FaCircleUser className="flex mt-[0.6rem] h-[4rem] w-[4rem]"/>
                                        <a className="flex font-bold mt-[0.5rem] items-center text-xs">김기사</a>
                                    </div>
                                    <div className="flex flex-col w-[30rem]">
                                        <div className="flex flex-row">
                                            <a className="text-xs font-semibold text-gray-600 ml-[1.3rem]">환불 / 구매</a>
                                        </div>
                                        <a className="text-sm font-bold ml-[1.3rem] mt-[0.3rem]">환불 문의 드립니다.</a>
                                        <div className="flex flex-row w-[20rem]">
                                            <a className="text-xs font-bold text-gray-500 ml-[1.4rem] mt-[0.2rem]">답변
                                                완료</a>
                                            <a className="text-xs font-bold text-gray-500 ml-[0.2rem] mt-[0.2rem]">·
                                                pjk***</a>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        {isExpanded1 ? (
                                            <FaAngleUp
                                                className="flex items-center justify-center w-[2rem] h-[2rem] ml-[5rem]"/>
                                        ) : (
                                            <FaAngleDown
                                                className="flex items-center justify-center w-[2rem] h-[2rem] ml-[5rem]"/>
                                        )}
                                    </div>
                                </div>
                                {isExpanded1 && (
                                    <div
                                        className="mt-2 bg-gray-50 border-[0.1rem] border-gray-300 rounded-lg p-4 w-[50rem] mx-auto shadow-md">
                                        <p className="text-sm text-gray-700">
                                            안녕하세요, 고객님. 환불 관련 문의 사항에 대해 답변드립니다. 환불 절차는 구매일로부터 7일 이내에 신청 가능합니다.
                                        </p>
                                        <p className="text-sm text-gray-700 mt-2">
                                            자세한 내용은 고객센터로 문의해 주세요. 감사합니다.
                                        </p>
                                    </div>
                                )}
                                <div onClick={() => setIsExpanded2(!isExpanded2)}
                                     className="flex mx-auto flex-row items-center mt-[1rem] hover:bg-gray-200 cursor-pointer bg-gray-100 shadow-xl border-[0.1rem] border-gray-600 rounded-lg w-[50rem] h-[7rem]">
                                    <div
                                        className="flex flex-col h-[6rem] border-r-[0.1rem] border-gray-400 items-center w-[10rem]">
                                        <FaCircleUser className="flex mt-[0.6rem] h-[4rem] w-[4rem]"/>
                                        <a className="flex font-bold mt-[0.5rem] items-center text-xs">김기사</a>
                                    </div>
                                    <div className="flex flex-col w-[30rem]">
                                        <div className="flex flex-row">
                                            <a className="text-xs font-semibold text-gray-600 ml-[1.3rem]">환불 / 구매</a>
                                        </div>
                                        <a className="text-sm font-bold ml-[1.3rem] mt-[0.3rem]">환불 문의 드립니다.</a>
                                        <div className="flex flex-row w-[20rem]">
                                            <a className="text-xs font-bold text-gray-500 ml-[1.4rem] mt-[0.2rem]">답변
                                                완료</a>
                                            <a className="text-xs font-bold text-gray-500 ml-[0.2rem] mt-[0.2rem]">·
                                                pjk***</a>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        {isExpanded2 ? (
                                            <FaAngleUp
                                                className="flex items-center justify-center w-[2rem] h-[2rem] ml-[5rem]"/>
                                        ) : (
                                            <FaAngleDown
                                                className="flex items-center justify-center w-[2rem] h-[2rem] ml-[5rem]"/>
                                        )}
                                    </div>
                                </div>
                                {isExpanded2 && (
                                    <div
                                        className="mt-2 bg-gray-50 border-[0.1rem] border-gray-300 rounded-lg p-4 w-[50rem] mx-auto shadow-md">
                                        <p className="text-sm text-gray-700">
                                            안녕하세요, 고객님. 환불 관련 문의 사항에 대해 답변드립니다. 환불 절차는 구매일로부터 7일 이내에 신청 가능합니다.
                                        </p>
                                        <p className="text-sm text-gray-700 mt-2">
                                            자세한 내용은 고객센터로 문의해 주세요. 감사합니다.
                                        </p>
                                    </div>
                                )}
                            </div>

                        )}
                    </div>
                    <div className="flex divider divide-gray-600 ml-[4rem] w-[60rem]"></div>
                    <div className="flex h-[20rem]"></div>
                </div>
            </div>
        </div>

    )
}

export default Product;