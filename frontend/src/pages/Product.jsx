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

const Product= ({ userProfile }) => {
    const PhotoSectionRef = useRef(null);
    const ReviewSectionRef = useRef(null);
    const InfoSectionRef = useRef(null);
    const RestSectionRef = useRef(null);
    const [showFullImages, setShowFullImages] = useState(false);
    const [activeTab, setActiveTab] = useState('전체 리뷰');
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [inquiries, setInquiries] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isinquiryOpen, setIsinquiryOpen] = useState(false);
    const [isreviewOpen, setIsreviewOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const { id } = useParams();
    const [category, setCategory] = useState("");
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState(0);
    const [question, setQuestion] = useState("");
    const [filePath, setFilePath] = useState('');
    const [reviews, setReviews] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 열기 상태
    const [selectedInquiry, setSelectedInquiry] = useState(null); // 선택된 문의
    const [ansertitle, setAnsertitle] = useState(''); // 답변 제목 상태
    const [ansercontent, setAnsercontent] = useState(''); // 답변 내용 상태


    const handleAnswer = (inquiry) => {
        setSelectedInquiry(inquiry); // 선택된 문의를 상태로 설정
        setIsPopupOpen(true); // 팝업 열기
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false); // 팝업 닫기
    };

    const handleSubmitAnswer = async () => {
        // 문의글 num을 기준으로 답변 제목, 내용, 상태 업데이트
        const updatedInquiry = {
            num: selectedInquiry.num, // num 값을 이용해 해당 문의글을 찾습니다
            ansertitle: ansertitle, // 답변 제목
            ansercontent: ansercontent, // 답변 내용
            status: '답변 완료', // 상태를 '답변 완료'로 변경
        };

        try {
            // API 호출 (서버로 업데이트 요청)
            const response = await axios.post('http://localhost:8080/api/answer', updatedInquiry);

            if (response.status === 200) {
                // 성공적으로 업데이트된 경우, 팝업 닫기 및 상태 업데이트
                alert("답변이 제출되었습니다.");
                handleClosePopup(); // 팝업 닫기
                setAnsertitle(''); // 답변 제목 초기화
                setAnsercontent(''); // 답변 내용 초기화
                // 추가적으로 state나 UI 업데이트가 필요할 경우 작성
                window.location.reload();
            } else {
                alert("답변 제출 실패");
            }
        } catch (error) {
            console.error("답변 제출 중 오류가 발생했습니다:", error);
            alert("서버 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    };

    const handleinquiryToggle = () => {
        setIsinquiryOpen(!isinquiryOpen);
    };

    const handlereviewToggle = () => {
        setIsreviewOpen(!isreviewOpen);
    };

    useEffect(() => {
        // API 호출로 리뷰 데이터 가져오기
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/review/${id}`);
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, [id]);


    const facilityNames = {
        towel: '수건',
        shower: '샤워시설',
        wash: '세족시설',
        wifi: 'Wi-Fi',
        parking: '주차',
        locker: '개인락커'
    };

    const handleReviewSubmit = async () => {

        const createdate = new Date().toISOString().slice(0, 19).replace("T", " ");
        // 리뷰 데이터 생성
        const reviewData = {
            userId: userId, // 사용자 ID
            name: userData.name, // 사용자 이름
            typeofuse: category, // 이용 유형
            reviewtitle: title, // 문의 제목
            rating: rating.toString(), // 평점
            reviewcontent: question, // 문의 내용
            prodid: id, // 상품 ID
            imagePath: filePath, // 업로드된 이미지 경로
            createdate
        };

        try {
            const response = await axios.post('http://localhost:8080/reviewsubmit', reviewData);
            if (response.data.success) {
                alert('리뷰가 성공적으로 작성되었습니다.');
                setIsreviewOpen(false); // 폼 닫기
            } else {
                alert('리뷰 작성에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('리뷰 작성 중 오류가 발생했습니다.');
        }
    };

    const handleFileUpload = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // FormData 생성
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            // 서버에 이미지 업로드 요청
            const response = await axios.post('http://localhost:8080/reviewupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // 업로드 성공 시 데이터 처리
            console.log('File uploaded:', response.data.filePath);
            setFilePath(response.data.filePath); // 파일 경로 상태 업데이트
            alert('사진이 성공적으로 업로드되었습니다!');
        } catch (error) {
            console.error('File upload failed:', error);
            alert('사진 업로드에 실패했습니다.');
        }
    };

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                // 요청 시작 시 로그 출력
                console.log("Fetching inquiries for product ID:", id);

                const response = await axios.get(`http://localhost:8080/api/product_inquiry/${id}`);

                // 응답을 받았을 때 전체 응답을 로그로 출력
                console.log("Response received:", response);

                // 응답 데이터가 배열인지 확인하고 상태를 업데이트
                if (Array.isArray(response.data)) {
                    console.log("Inquiries data:", response.data);
                    setInquiries(response.data); // 응답이 배열인 경우 바로 설정
                } else if (response.data && Array.isArray(response.data.data)) {
                    console.log("Inquiries data inside data:", response.data.data);
                    setInquiries(response.data.data); // 응답이 객체 내부에 배열인 경우
                } else {
                    console.error("Unexpected data format:", response.data);
                    setInquiries([]); // 데이터를 초기화
                }
            } catch (error) {
                // 오류가 발생했을 때 오류 메시지를 로그로 출력
                console.error("Error fetching inquiries:", error);
                setInquiries([]); // 에러 발생 시 초기화
            }
        };

        fetchInquiries();
    }, [id]);

    const handleSubmitInquiry = async () => {
        // 모든 필드가 채워졌는지 확인
        if (!category || !title || !question) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        const inqdate = new Date().toISOString().slice(0, 19).replace("T", " ");

        const inquiryData = {
            userId,
            phone: userData.phonenumber,
            category,
            inqtitle: title,
            inqcontent: question,
            inqdate,
            id,
            status: "미답변",
        };

        try {
            const response = await axios.post(
                "http://localhost:8080/api/inquiry",
                inquiryData,
                { withCredentials: true }
            );

            if (response.data.success) {
                alert("문의가 성공적으로 저장되었습니다.");
                setIsinquiryOpen(false); // 성공적으로 저장되면 모달 닫기
            } else {
                alert("문의 저장에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("문의 저장 오류:", error);
            alert("문의 저장 중 오류가 발생했습니다.");
        }
    };

    // 로그인 정보 불러오는 db문
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/userinfo', {
                    withCredentials: true, // 세션을 확인하려면 반드시 필요
                });

                if (response.data.success) {
                    setIsLoggedIn(true);
                    setUserData(response.data);
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
    const [productData, setProductData] = useState({
        iconpicture: "",
        prodid: "",
        prodtitle: "",
        prodrating: "",
        description: "",
        address: "",
        prodpicture: "",
        prodcontent1: "",
        prodcontent2: "",
        prodcontent3: "",
        prodcontent4: "",
        prodsmtitle: "",
        facility_pictures: [],
        selectedFacilities: [],
        div1Bg: "",
        userid: "",
    });

    useEffect(() => {
        // 데이터 요청
        axios.get(`http://localhost:8080/product/${id}`)
            .then(response => {
                const product = response.data;

                console.log("Fetched product data:", product);
                setProductData({
                    prodid: response.data.prodid,
                    iconpicture: response.data.iconpicture,
                    prodtitle: response.data.prodtitle,
                    description : response.data.description,
                    prodrating: response.data.prodrating,
                    address: response.data.address,
                    prodpicture: response.data.prodpicture,
                    prodcontent1: response.data.prodcontent1,
                    prodcontent2: response.data.prodcontent2,
                    prodcontent3: response.data.prodcontent3,
                    prodcontent4: response.data.prodcontent4,
                    prodsmtitle: response.data.prodsmtitle,
                    facility_pictures: response.data.facility_pictures || [],
                    selectedFacilities: response.data.selectedFacilities || [],
                    div1Bg: response.data.div1Bg || "",
                    userid: product.userid,
                });

                if (userProfile && userProfile.userId) {
                    axios
                        .post("http://localhost:8080/recently-viewed", {
                            productId: response.data.prodid,
                            userId: userProfile.userId,
                        }, { withCredentials: true })
                .then((response) => {
                            console.log("Product saved to recently viewed:", response.data);
                        })
                        .catch((error) => {
                            console.error("Error saving recently viewed product:", error);
                        });
                }
            })
            .catch((error) => {
                console.error("Error fetching product data:", error);
            });
    }, [id, userProfile]);


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
                                <a className={`flex text-sm ${productData.div1Bg} items-center justify-center rounded-xl w-[12rem] font-bold mt-[1.2rem]`}>
                                    {productData.prodtitle}
                                </a>
                                <div className="flex items-center justify-center flex-col w-1/2">
                                    <div className="flex w-[8rem] mt-[1rem] h-[8rem]">
                                        <img className="rounded-full" src={productData.iconpicture} alt="Product Logo"/>
                                    </div>
                                    <div
                                        className={`flex flex-col items-center p-2 justify-center ${productData.div1Bg} mt-[1rem] rounded-xl h-[5rem] w-[20rem]`}>
                                        <a className="text-xs font-semibold whitespace-pre-wrap">{productData.description}</a>
                                    </div>
                                </div>
                            </div>

                            <div className="border-l border-gray-400 ml-[3.5rem] h-[16rem]"></div>

                            {/* 두 번째 카드 */}
                            <div
                                className="flex flex-col ml-[3.5rem] rounded-3xl bg-white items-center w-[18rem] h-[18rem]">
                                <a className={`flex text-sm ${productData.div1Bg} items-center justify-center rounded-xl w-[12rem] font-bold mt-[1.2rem]`}>
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
                            {/* Map through facilities that exist in selectedFacilities */}
                            {productData.selectedFacilities && productData.selectedFacilities.map(facility => (
                                <div className="flex flex-col" key={facility}>
                                    {/* Facility Icon */}
                                    {facility === 'towel' &&
                                        <GiTowel className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>}
                                    {facility === 'shower' &&
                                        <FaShower className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>}
                                    {facility === 'wash' &&
                                        <FaHandsWash className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>}
                                    {facility === 'wifi' &&
                                        <FaWifi className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>}
                                    {facility === 'parking' &&
                                        <FaParking className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>}
                                    {facility === 'locker' &&
                                        <PiLockersFill className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>}

                                    <a className="font-bold text-sm mt-[0.4rem] ml-[2.2rem]">
                                        {facilityNames[facility] || facility.charAt(0).toUpperCase() + facility.slice(1)} {/* 한글 변환 */}
                                    </a>
                                </div>
                            ))}
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
                                {reviews.map((review, index) => (
                                    <div
                                        key={index}
                                        ref={ReviewSectionRef}
                                        className="flex mx-auto flex-row items-center mt-[1rem] bg-gray-100 shadow-xl border-[0.1rem] border-gray-600 rounded-lg w-[50rem] min-h-[9rem]"
                                    >
                                        <div className="flex flex-col h-[8rem] border-r-[0.1rem] border-gray-400 items-center w-[10rem]">
                                            <FaCircleUser className="flex mt-[1.4rem] h-[4rem] w-[4rem]" />
                                            <a className="flex font-bold mt-[0.5rem] items-center text-xs">{review.name}</a>
                                        </div>
                                        <div className="flex flex-col w-[30rem]">
                                            <div className="flex flex-row">
                                                <a className="text-xs text-gray-500 ml-[1.6rem]">
                                                    {review.userid} |&nbsp;
                                                    {new Date(review.createdate).toLocaleString('ko-KR', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                    })}
                                                </a>
                                                <div className="flex flex-row cursor-pointer">
                                                    <PiSirenBold className="ml-[0.5rem]"/>
                                                    <a className="text-xs text-gray-500 mb-[0.1rem]">신고</a>
                                                </div>
                                            </div>
                                            <div className="flex flex-row ml-[1.4rem]">
                                                {Array.from({length: 4}).map((_, idx) => (
                                                    <LiaDumbbellSolid
                                                        key={idx}
                                                        className={`w-[1.5rem] h-[1.5rem] mt-[0.05rem] ${idx < review.rating ? 'fill-black' : 'fill-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <a className="text-xs ml-[1.2rem] w-[4rem] text-center rounded-xl border-[0.1rem] border-gray-400 mt-[0.3rem] font-bold text-gray-700">
                                                {review.typeofuse}
                                            </a>
                                            <a className="text-sm ml-[1.4rem] mt-[0.3rem] text-start"><a className="text-red-400">제목 : </a>{review.reviewtitle}</a>
                                            <a className="text-xs ml-[1.4rem] mt-[0.5rem] whitespace-pre-line break-words">{review.reviewcontent}</a>
                                        </div>
                                        <div className="flex w-[10rem] items-center justify-center h-[9rem]">
                                            <img className="w-[7rem] h-[7rem] rounded-xl" src={review.reviewpicture} />
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-end items-center mt-4 w-full h-[3rem]">
                                    <div
                                        onClick={handlereviewToggle}
                                        className="flex h-[3rem] w-[6rem] items-center justify-center rounded-xl border border-red-400 text-red-400 hover:bg-red-400 hover:text-white cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500"
                                    >
                                        <a className="flex">리뷰 작성하기</a>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === '상품 문의' && (
                            <div className="flex flex-col">
                                {inquiries.map((inquiry, index) => (
                                    <div key={index} className="flex flex-col">
                                        <div
                                            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                                            className="flex mx-auto flex-row items-center mt-[1rem] hover:bg-gray-200 cursor-pointer bg-gray-100 shadow-xl border-[0.1rem] border-gray-600 rounded-lg w-[50rem] h-full"
                                        >
                                            <div
                                                className="flex flex-col h-[6rem] border-r-[0.1rem] border-gray-400 items-center w-[10rem]">
                                                <FaCircleUser className="flex mt-[0.6rem] h-[4rem] w-[4rem]"/>
                                                <a className="flex font-bold mt-[0.5rem] items-center text-xs">{inquiry.name}</a>
                                            </div>
                                            <div className="flex flex-col h-full w-[30rem] mt-[2rem]">
                                                <div className="flex flex-row items-center h-[1rem]">
                                                    <a className="flex text-xs font-semibold text-red-400 ml-[1.3rem]">{inquiry.category} •</a>
                                                    <a className="flex text-xs font-semibold text-red-400 mb-[0.2rem] ml-[0.2rem]">{inquiry.userid}</a>
                                                    <a className="flex text-xs font-bold text-red-400 ml-[0.2rem]">
                                                        • {inquiry.status}
                                                    </a>
                                                    {inquiry.status === '미답변' && productData.prodid === inquiry.prodid && productData.userid === userId && (
                                                        <div className="flex ml-[0.5rem] mb-[0.1rem]">
                                                            <button
                                                                onClick={() => handleAnswer(inquiry)} // 답변 버튼 클릭 시 팝업 열기
                                                                className="flex h-[1rem] text-xs items-center justify-center bg-red-400 hover:scale-110 transition-transform ease-in-out duration-500 text-white hover:bg-white hover:text-red-400 cursor-pointer"
                                                            >
                                                                답변하기
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <a className="flex text-sm font-bold ml-[1.3rem]">{inquiry.inqtitle}</a>
                                                <a className="flex text-xs font-bold ml-[1.3rem] mt-[0.3rem]">{inquiry.inqcontent}</a>
                                                <a className="flex text-xs font-bold ml-[1.3rem] mt-[0.3rem]">
                                                    작성 일자 : {new Date(inquiry.inqdate).toLocaleString('ko-KR', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false,
                                                })}
                                                </a>
                                            </div>
                                            <div className="flex">
                                                {expandedIndex === index ? (
                                                    <FaAngleUp
                                                        className="flex items-center justify-center w-[2rem] h-[2rem] ml-[5rem]"/>
                                                ) : (
                                                    <FaAngleDown
                                                        className="flex items-center justify-center w-[2rem] h-[2rem] ml-[5rem]"/>
                                                )}
                                            </div>
                                        </div>
                                        {expandedIndex === index && inquiry.status === '답변' && (
                                            <div
                                                className="mt-[1rem] flex flex-col bg-gray-50 border-[0.1rem] border-gray-300 rounded-lg p-4 w-[48rem] mx-auto shadow-md">
                                                <div className="flex items-center flex-row">
                                                    <FaCheckCircle/>
                                                    <a className="text-xm ml-[0.3rem] text-gray-700">답변 내용</a>
                                                    <a className="text-xm ml-[14rem] text-gray-700">
                                                        {inquiry.ansertitle}
                                                    </a>
                                                </div>
                                                <a className="text-sm mt-2 text-gray-700">
                                                    {inquiry.ansercontent}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div className="flex justify-end items-center mt-4 w-full h-[3rem]">
                                    <div
                                        onClick={handleinquiryToggle}
                                        className="flex h-[3rem] w-[6rem] items-center justify-center rounded-xl border border-red-400 text-red-400 hover:bg-red-400 hover:text-white cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500"
                                    >
                                        <a className="flex">문의 작성하기</a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {isinquiryOpen && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-[50rem] p-6 rounded-lg shadow-lg">
                        {/* Title */}
                        <h2 className="text-2xl font-bold text-red-400">상품 문의</h2>
                        <div className="w-full border-b-2 border-red-400 mt-4"></div>
                        {/* Form */}
                        <div className="space-y-4 p-6">
                            <div
                                className="flex flex-row w-[15rem] h-full border border-red-400 rounded-xl items-center">
                                <a className="text-red-400 items-start w-[6rem] ml-[1rem] flex">아이디</a>
                                <div className="w-[10rem] flex items-center justify-center h-[2.5rem] rounded-lg">
                                    <a className="flex w-full">{userId}</a>
                                </div>
                            </div>
                            <div
                                className="flex flex-row w-[20rem] h-full border border-red-400 rounded-xl items-center">
                                <a className="text-red-400 items-start w-[5rem] ml-[1rem] flex">전화번호</a>
                                <div className="w-[10rem] flex items-center justify-center h-[2.5rem] rounded-lg">
                                    <a className="flex w-full">{userData.phonenumber}</a>
                                </div>
                            </div>
                            <div
                                className="flex flex-row w-[20rem] h-full border border-red-400 rounded-xl items-center">
                                <a className="text-red-400 items-start w-[4.3rem] ml-[1rem] flex">카테고리</a>
                                <select
                                    id="category"
                                    value={category} // 상태 바인딩
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-[15rem] flex items-center border-none justify-center h-[2.5rem] rounded-xl">
                                    <option value="" disabled selected>
                                        카테고리를 선택하세요
                                    </option>
                                    <option value="결제 문의">결제 문의</option>
                                    <option value="등록 문의">등록 문의</option>
                                    <option value="기간 문의">기간 문의</option>
                                    <option value="환불 / 취소 문의">환불 / 취소 문의</option>
                                </select>
                            </div>
                            <div
                                className="flex flex-row w-full h-full border border-red-400 rounded-xl items-center">
                                <a className="text-red-400 items-start w-[5rem] ml-[1rem] flex">문의 제목</a>
                                <input
                                    id="title"
                                    type="text"
                                    value={title} // 상태 바인딩
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full flex items-start border-none justify-center h-[2.5rem] rounded-xl"
                                    placeholder="제목을 입력하세요"
                                    required
                                />
                            </div>

                            {/* Question */}
                            <div className="flex flex-col w-full h-full border border-red-400 rounded-xl items-center">
                                <div className="flex flex-row w-full h-full">
                                    <a className="text-red-400 w-[5rem] ml-[1rem] items-center flex">문의 내용</a>
                                    <textarea
                                        id="question"
                                        rows="5"
                                        value={question} // 상태 바인딩
                                        onChange={(e) => setQuestion(e.target.value)}
                                        className="w-full h-[13rem] flex border-none justify-center rounded-xl"
                                        placeholder="문의 내용을 입력하세요"
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">
                                아래 영역을 드래그하여 입력창 크기를 조절할 수 있습니다.
                            </p>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 border border-red-400 hover:scale-110 transition-transform ease-in-out duration-500 text-red-400 rounded-lg hover:bg-red-400 hover:text-white"
                                    onClick={() => setIsinquiryOpen(false)}
                                >
                                    닫기
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-400 hover:scale-110 hover:text-red-400 hover:bg-white hover:border-red-400 hover:border transition-transform ease-in-out duration-500 text-white rounded-lg"
                                    onClick={handleSubmitInquiry}
                                >
                                    작성완료
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isreviewOpen && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-[50rem] p-6 rounded-lg shadow-lg">
                        {/* Title */}
                        <h2 className="text-2xl font-bold text-red-400">상품 문의</h2>
                        <div className="w-full border-b-2 border-red-400 mt-4"></div>
                        {/* Form */}
                        <div className="space-y-4 p-6">
                            <div className="flex flex-row">
                                <div className="flex flex-col space-y-4">
                                    <div
                                        className="flex flex-row w-[14.2rem] h-full border border-red-400 rounded-xl items-center">
                                        <a className="text-red-400 items-start w-[6rem] ml-[1rem] flex">아이디</a>
                                        <div
                                            className="w-[10rem] flex items-center justify-center h-[2.5rem] rounded-lg">
                                            <a className="flex w-full">{userId}</a>
                                        </div>
                                    </div>
                                    <div
                                        className="flex flex-row w-[14.2rem] h-full border border-red-400 rounded-xl items-center">
                                        <a className="text-red-400 items-start w-[5rem] ml-[1rem] flex">이름</a>
                                        <div
                                            className="w-[10rem] flex items-center justify-center h-[2.5rem] rounded-lg">
                                            <a className="flex w-full">{userData.name}</a>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="flex items-center justify-center ml-[0.5rem] w-full h-[6.5rem] border border-dashed border-red-400 rounded-xl">
                                    <button
                                        onClick={() => document.getElementById('fileInput').click()}
                                        className="text-red-400 bg-white hover:text-red-700 transition-colors duration-300 px-2 py-1 rounded-lg"
                                    >
                                        사진 업로드
                                    </button>
                                    <input
                                        id="fileInput"
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                        accept="image/*"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row space-x-2">
                                <div
                                    className="flex flex-row w-[15rem] h-full border border-red-400 rounded-xl items-center">
                                    <a className="text-red-400 items-center w-[4rem] ml-[1rem] flex">이용 유형</a>
                                    <select
                                        id="category"
                                        value={category} // 상태 바인딩
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-[9rem] flex items-center border-none justify-center h-[2.5rem] rounded-xl">
                                        <option value="" disabled selected>
                                            이용유형 선택
                                        </option>
                                        <option value="일일 이용">일일 이용</option>
                                        <option value="월간 이용">월간 이용</option>
                                        <option value="연도 이용">연도 이용</option>
                                    </select>
                                </div>
                                <div
                                    className="flex flex-row w-full h-full border border-red-400 rounded-xl items-center">
                                    <a className="text-red-400 items-start w-[5rem] ml-[1rem] flex">문의 제목</a>
                                    <input
                                        id="title"
                                        type="text"
                                        value={title} // 상태 바인딩
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full flex items-start border-none justify-center h-[2.5rem] rounded-xl"
                                        placeholder="제목을 입력하세요"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row w-[20rem] h-full border border-red-400 p-2 rounded-xl">
                                <a className="flex text-red-400 ml-[0.5rem]">평점 작성</a>
                                <div className="flex flex-row ml-[1.4rem]">
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <LiaDumbbellSolid
                                            key={value}
                                            onClick={() => setRating(value)} // 클릭 시 평점 업데이트
                                            className={`w-[1.5rem] h-[1.5rem] cursor-pointer ${
                                                value <= rating ? 'fill-black' : 'fill-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <div className="flex text-red-400 ml-[1rem] mt-[0.1rem]">
                                    {rating === 1 && <p>매우 나쁨</p>}
                                    {rating === 2 && <p>나쁨</p>}
                                    {rating === 3 && <p>보통</p>}
                                    {rating === 4 && <p>좋음</p>}
                                    {rating === 5 && <p>매우 좋음</p>}
                                </div>
                            </div>
                            {/* Question */}
                            <div className="flex flex-col w-full h-full border border-red-400 rounded-xl items-center">
                                <div className="flex flex-row w-full h-full">
                                    <a className="text-red-400 w-[5rem] ml-[1rem] items-center flex">문의 내용</a>
                                    <textarea
                                        id="question"
                                        rows="5"
                                        value={question} // 상태 바인딩
                                        onChange={(e) => setQuestion(e.target.value)}
                                        className="w-full h-[13rem] flex border-none justify-center rounded-xl"
                                        placeholder="문의 내용을 입력하세요"
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">
                                아래 영역을 드래그하여 입력창 크기를 조절할 수 있습니다.
                            </p>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 border border-red-400 hover:scale-110 transition-transform ease-in-out duration-500 text-red-400 rounded-lg hover:bg-red-400 hover:text-white"
                                    onClick={() => setIsreviewOpen(false)}
                                >
                                    닫기
                                </button>
                                <button
                                    onClick={handleReviewSubmit}
                                    className="px-4 py-2 bg-red-400 hover:scale-110 hover:text-red-400 hover:bg-white hover:border-red-400 hover:border transition-transform ease-in-out duration-500 text-white rounded-lg"
                                >
                                    작성완료
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isPopupOpen && selectedInquiry && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-[50rem] p-6 rounded-lg shadow-lg">
                        {/* Title */}
                        <h2 className="text-2xl font-bold text-red-400">답변 작성</h2>
                        <div className="w-full border-b-2 border-red-400 mt-4"></div>

                        {/* Form */}
                        <div className="space-y-4 p-6">
                            {/* 답변 제목 */}
                            <div className="flex flex-row w-full h-full border border-red-400 rounded-xl items-center">
                                <a className="text-red-400 items-start w-[6rem] ml-[1rem] flex">답변 제목</a>
                                <input
                                    type="text"
                                    value={ansertitle}
                                    onChange={(e) => setAnsertitle(e.target.value)}
                                    className="w-full p-2 border-none justify-center h-[2.5rem] rounded-xl"
                                    placeholder="답변 제목을 입력하세요"
                                    required
                                />
                            </div>

                            {/* 답변 내용 */}
                            <div className="flex flex-row w-full h-full border border-red-400 rounded-xl items-center">
                                <a className="text-red-400 items-start w-[6rem] ml-[1rem] flex">답변 내용</a>
                                <textarea
                                    value={ansercontent}
                                    onChange={(e) => setAnsercontent(e.target.value)}
                                    className="w-full p-2 border-none h-[10rem] rounded-xl"
                                    placeholder="답변 내용을 입력하세요"
                                    required
                                />
                            </div>

                            {/* 버튼들 */}
                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    onClick={handleClosePopup}
                                    className="px-4 py-2 border border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-transform ease-in-out duration-500 rounded-lg"
                                >
                                    닫기
                                </button>
                                <button
                                    onClick={handleSubmitAnswer}
                                    className="px-4 py-2 bg-red-400 text-white hover:bg-white hover:text-red-400 hover:border-red-400 hover:border transition-transform ease-in-out duration-500 rounded-lg"
                                >
                                    제출
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>

    )
}

export default Product;