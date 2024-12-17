import React, {useState, useEffect, useRef} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
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
import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";
import { MdDateRange } from "react-icons/md";
import { LiaDumbbellSolid } from "react-icons/lia";
import { MdDriveFolderUpload } from "react-icons/md";
{/*컴포넌트 동기화문*/}


const Fixproduct = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userData, setUserData] = useState(null);
    const [showFullImages, setShowFullImages] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [selectedFacilities, setSelectedFacilities] = useState([]);
    const [currentFacility, setCurrentFacility] = useState('');
    const [facilityList, setFacilityList] = useState([]);
    const [productData, setProductData] = useState({
        div1Bg: "bg-yellow-200", // 초기 배경색
    });
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [targetDiv, setTargetDiv] = useState(null); // 클릭한 대상 div를 구분

    const handleCheckFacility = (facility) => {
        setSelectedFacilities((prev) =>
            prev.includes(facility)
                ? prev.filter((item) => item !== facility) // 이미 선택된 경우 해제
                : [...prev, facility] // 선택되지 않은 경우 추가
        );
    };

    useEffect(() => {
        // DB에서 가져온 데이터 예시
        const fetchedFacilities = ['towel', 'shower', 'wifi', 'parking', 'locker', 'wash']; // DB에서 가져온 데이터
        setFacilityList(fetchedFacilities);
    }, []);

    const handleOpenModal = (facility) => {
        setCurrentFacility(facility);
        setIsModalOpen(true);
    };

    const colors = ["bg-yellow-200", "bg-blue-200", "bg-red-200", "bg-green-200", "bg-purple-200"];

    const [imageData, setImageData] = useState({
        prodpicture: "",
        iconpicture: "",
        facility_pictures: [],
    });
    const { id } = useParams();

    const handleDivClick = (divKey) => {
        setTargetDiv(divKey);
        setIsPopupOpen(true);
    };

    // 색상 선택
    const handleColorSelect = (color) => {
        setProductData((prevData) => ({
            ...prevData,
            [targetDiv]: color, // 선택된 div에 색상 반영
        }));
        setIsPopupOpen(false); // 팝업 닫기
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

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/product/${id}`);
                setProductData(response.data);
                let fetchedFacilities = response.data.selectedFacilities;

                // selectedFacilities가 쉼표로 구분된 문자열이라면 이를 배열로 변환
                if (typeof fetchedFacilities === 'string') {
                    fetchedFacilities = fetchedFacilities.split(','); // 쉼표를 기준으로 배열로 변환
                }

                // 만약 fetchedFacilities가 배열이라면 상태에 설정
                if (Array.isArray(fetchedFacilities)) {
                    setFacilityList(fetchedFacilities); // 편의시설 목록을 배열로 저장
                    setSelectedFacilities(fetchedFacilities);
                } else {
                    setFacilityList([]); // 만약 배열이 아니면 빈 배열로 초기화
                }
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };

        fetchProductData();
    }, [id]);

    useEffect(() => {
        if (productData) {
            setImageData(prevState => ({
                ...prevState,
                facility_pictures: productData.facility_pictures || [null, null, null, null, null, null, null, null], // 기존 값 유지
            }));
        }
    }, [productData]); // productData가 업데이트 될 때마다 이미지 데이터 업데이트

    // 이미지 URL에 baseUrl 추가
    const baseUrl = "http://localhost:8080";
    const addBaseUrlIfNeeded = (url) => {
        if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
            return `${baseUrl}${url}`;
        }
        return url;
    };

    if (productData) {
        productData.iconpicture = addBaseUrlIfNeeded(productData.iconpicture);
        productData.prodpicture = addBaseUrlIfNeeded(productData.prodpicture);
        productData.prodcontent1 = addBaseUrlIfNeeded(productData.prodcontent1);
        productData.prodcontent2 = addBaseUrlIfNeeded(productData.prodcontent2);
        productData.prodcontent3 = addBaseUrlIfNeeded(productData.prodcontent3);
        productData.prodcontent4 = addBaseUrlIfNeeded(productData.prodcontent4);
    }

    const toggleShowImages = () => {
        setShowFullImages(!showFullImages);
    };

    const handleImageUpload = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            axios.post("http://localhost:8080/upload", formData)
                .then(response => {
                    const filePath = response.data.url.startsWith('/uploads')
                        ? response.data.url
                        : response.data.url.replace("http://localhost:8080", "");

                    // 상태 즉시 업데이트
                    setProductData(prevState => ({
                        ...prevState,
                        [field]: filePath, // prodpicture 또는 iconpicture 업데이트
                    }));
                })
                .catch(error => console.error("Image upload failed:", error));
        }
    };


    const handleFacilityImageUpload = (e, index) => {
        const file = e.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            axios.post("http://localhost:8080/upload", formData)
                .then(response => {
                    const filePath = response.data.url.startsWith('/uploads')
                        ? response.data.url
                        : response.data.url.replace("http://localhost:8080", "");

                    // 상태 업데이트: 해당 인덱스만 업데이트하고 나머지 이미지는 그대로 유지
                    setImageData(prevState => {
                        const updatedFacilities = [...prevState.facility_pictures]; // 기존 값 복사
                        updatedFacilities[index] = filePath; // 해당 인덱스에만 새로운 이미지 반영
                        return { ...prevState, facility_pictures: updatedFacilities };
                    });
                })
                .catch(error => console.error("Facility image upload failed:", error));
        } else {
            // 파일이 없으면 해당 인덱스를 배열에서 제거
            setImageData(prevState => {
                const updatedFacilities = prevState.facility_pictures.filter((_, i) => i !== index); // 해당 인덱스 삭제
                // 8개의 이미지 슬롯을 유지하려면 배열 길이를 8로 맞추기
                while (updatedFacilities.length < 8) {
                    updatedFacilities.push(null);
                }
                return { ...prevState, facility_pictures: updatedFacilities };
            });
        }
    };


    const handleInputChange = (e, field) => {
        const { value } = e.target;
        setProductData(prevData => ({
            ...prevData,
            [field]: value
        }));
    };

    const handleProdContentImageUpload = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            axios.post("http://localhost:8080/upload", formData)
                .then(response => {
                    // URL 형식을 "/uploads/..."로 통일
                    const filePath = response.data.url.startsWith('/uploads')
                        ? response.data.url
                        : response.data.url.replace("http://localhost:8080", "");

                    // 기존 데이터 유지 및 업데이트
                    setProductData(prevData => ({
                        ...prevData,
                        [`prodcontent${index + 1}`]: filePath || prevData[`prodcontent${index + 1}`],
                    }));
                })
                .catch(error => console.error("ProdContent image upload failed:", error));
        }
    };


    const handleSaveProduct = async () => {
        try {
            // 저장할 데이터 객체 생성
            const updatedProductData = {
                ...productData,
                prodpicture: imageData?.prodpicture || productData.prodpicture,
                iconpicture: imageData?.iconpicture || productData.iconpicture,
                facility_pictures: imageData?.facility_pictures && imageData.facility_pictures.some(pic => pic !== null && pic !== "")
                    ? imageData.facility_pictures
                    : productData.facility_pictures, // 업로드된 시설사진이 있을 때만 반영
                div1Bg: productData.div1Bg, // Div1 배경색 추가
                selectedFacilities: selectedFacilities // 선택된 편의시설 저장
            };

            console.log("Updated Product Data:", updatedProductData); // 전송되는 데이터 확인

            const response = await axios.put(`http://localhost:8080/api/product/update/${id}`, updatedProductData, {
                withCredentials: true,
            });

            if (response.data.success) {
                alert('상품 정보가 성공적으로 업데이트되었습니다.');
                navigate("/");
            } else {
                alert('상품 업데이트에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('상품 저장 중 오류가 발생했습니다.');
        }
    };


    if (!productData) {
        return <div>Loading...</div>;
    }

        return (
            <div className="flex flex-col h-full items-center justify-center mx-28">  {/*슬라이더 박스*/}
                <a className="flex items-center mt-[1rem] text-red-400 w-[62rem] font-bold text-xl justify-center">
                    제품 수정
                </a>
                <div className="w-[62rem] border-b-2 border-red-400 mt-4"></div>
                <div
                    className="flex justify-start flex-row rounded-3xl border-2 border-gray-950 w-[62rem] h-[22rem] mt-6 items-center">
                    <div className="flex relative items-center w-[42rem] h-[22rem]">
                        <img className="flex w-[42rem] h-[21.8rem] opacity-30 rounded-l-3xl"
                             src={productData.prodpicture}/>
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'prodpicture')}
                            id="product-image-upload"
                        />
                        <label htmlFor="product-image-upload"
                               className="absolute top-[8.5rem] text-white fill-white hover:bg-white hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500 hover:text-red-400 hover:border hover:border-red-400 left-1/2 transform -translate-x-1/2 mt-4 w-[8rem] rounded-xl h-[3rem] bg-red-400 flex items-center justify-center space-x-2">
                            <MdDriveFolderUpload className="h-full flex w-[2rem] mr-[0.2rem]"/>
                            <span className="text-xl mt-[0.2rem]">업로드</span>
                        </label>
                    </div>
                    <div className="flex flex-col shadow-xl rounded-r-3xl items-center w-[20rem] h-[22rem]">
                        <div className="flex relative w-[10rem] mt-[2rem] h-[10rem]">
                            <img className="rounded-full opacity-30" src={productData.iconpicture} alt="Product Logo"/>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, 'iconpicture')}
                                id="icon-image-upload"
                            />
                            <label htmlFor="icon-image-upload"
                                   className="absolute top-[2.8rem] text-white fill-white hover:bg-white hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500 hover:text-red-400 hover:border hover:border-red-400 left-1/2 transform -translate-x-1/2 mt-4 w-[8rem] rounded-xl h-[3rem] bg-red-400 flex items-center justify-center space-x-2">
                                <MdDriveFolderUpload className="h-full flex w-[2rem] mr-[0.2rem]"/>
                                <a className="text-xl mt-[0.2rem]">업로드</a>
                            </label>
                        </div>
                        <input
                            type="text"
                            className="text-lg h-[2rem] font-bold text-center"
                            onChange={(e) => handleInputChange(e, 'prodtitle')}
                            placeholder={productData.prodtitle}
                        />
                        <input
                            type="text"
                            className="text-sm w-[18rem] mt-[0.2rem] text-center"
                            onChange={(e) => handleInputChange(e, 'prodsmtitle')}
                            placeholder={productData.prodsmtitle}
                        />
                        <input
                            type="text"
                            className="text-sm h-[2rem] w-[16rem] font-bold text-center"
                            onChange={(e) => handleInputChange(e, 'address')}
                            placeholder={productData.address}
                        />
                        <div className="flex flex-row">
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
                    <div className="flex flex-col items-center w-[64rem] rounded-3xl h-full">
                        <div className="ml-[2rem] flex flex-row w-[64rem] h-full">
                            <div
                                className="relative flex flex-col items-center mr-[2rem] mt-[1rem] h-full rounded-xl w-[64rem] overflow-hidden">
                                <div
                                    className={`flex flex-col items-center ${showFullImages ? '' : 'h-[350px] overflow-hidden'}`}>
                                    {[productData.prodcontent1, productData.prodcontent2, productData.prodcontent3, productData.prodcontent4]
                                        .slice(0, showFullImages ? 4 : 2)
                                        .map((src, index) => (
                                            <div key={index} className="relative">
                                                {/* 현재 prodcontentX에 저장된 이미지 미리보기 */}
                                                <img
                                                    className="flex opacity-30 mt-[2rem] rounded-xl h-full w-[50rem]"
                                                    src={src || '/placeholder-image.jpg'} // 기본 이미지
                                                    alt={`ProdContent Image ${index + 1}`}
                                                />
                                                {/* 업로드 버튼 */}
                                                <div
                                                    className="absolute top-[50%] left-[40%] text-white fill-white hover:bg-white hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500 hover:text-red-400 hover:border hover:border-red-400 w-[8rem] rounded-xl h-[3rem] bg-red-400 flex items-center justify-center space-x-2">
                                                    <MdDriveFolderUpload className="h-full flex w-[2rem] mr-[0.2rem]"/>
                                                    <a className="text-xl mt-[0.2rem]">업로드</a>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        onChange={(e) => handleProdContentImageUpload(e, index)} // prodcontentX 필드 업로드
                                                        id={`prodcontent-upload-${index}`}
                                                    />
                                                    <label
                                                        htmlFor={`prodcontent-upload-${index}`}
                                                        className="absolute top-0 left-0 w-full h-full cursor-pointer"
                                                    />
                                                </div>
                                            </div>
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
                            <div
                                className="flex flex-row text-sm mx-auto mt-[2rem] bg-gray-100 shadow-xl border-[0.1rem] border-gray-600 items-center justify-center rounded-lg w-[50rem] h-[20rem]">
                                <div
                                    className="flex flex-col rounded-3xl bg-white justify-center items-center h-[18rem] w-[18rem]">
                                    {/* Div 1 */}
                                    <a
                                        className={`flex text-sm text-gray-400 ${productData.div1Bg} items-center justify-center rounded-xl w-[12rem] font-bold mt-[1.2rem]`}
                                        onClick={() => handleDivClick('div1Bg')}
                                    >
                                        {productData.prodtitle}
                                    </a>

                                    <div className="flex items-center justify-center flex-col w-1/2">
                                        <div className="flex w-[8rem] mt-[1rem] h-[8rem]">
                                            <img className="rounded-full opacity-30" src={productData.iconpicture}
                                                 alt="Product Logo"/>
                                        </div>

                                        <div
                                            className={`flex flex-col items-center justify-center ${productData.div1Bg} mt-[1rem] rounded-xl h-[5rem] w-[20rem]`}
                                            onClick={() => handleDivClick('div1Bg')}
                                        >
                                        <textarea
                                            className="text-xs whitespace-pre-wrap h-[3rem] w-full font-bold text-center"
                                            onChange={(e) => handleInputChange(e, 'description')}
                                            placeholder={productData.description}
                                        />
                                        </div>
                                    </div>
                                </div>

                                {isPopupOpen && (
                                    <div
                                        className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50 z-50">
                                        <div className="bg-white p-4 rounded-lg shadow-lg">
                                            <h3 className="text-lg font-bold mb-4">배경색 선택</h3>
                                            <div className="flex space-x-2">
                                                {colors.map((color) => (
                                                    <div
                                                        key={color}
                                                        className={`w-10 h-10 rounded-full cursor-pointer ${color}`}
                                                        onClick={() => handleColorSelect(color)}
                                                    ></div>
                                                ))}
                                            </div>
                                            <button
                                                className="mt-4 px-4 py-2 bg-red-400 text-white hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500 hover:bg-white hover:text-red-400 hover:border hover:border-red-400 rounded-lg"
                                                onClick={() => setIsPopupOpen(false)}
                                            >
                                                닫기
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="border-l border-gray-400 ml-[3.5rem] h-[16rem]"></div>
                                <div
                                    className="flex flex-col    ml-[3.5rem] rounded-3xl bg-white items-center w-[18rem] h-[18rem]">
                                    <a className={`flex text-sm ${productData.div1Bg} items-center justify-center rounded-xl w-[12rem] font-bold mt-[1.2rem]`}>
                                        운영 시간 및 이용 안내
                                    </a>
                                    <div className="flex flex-row justify-center mt-[2.8rem] w-[18rem] h-[18rem]">
                                        <div className="flex ml-[0.5rem] items-center flex-col w-1/2">
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
                            className="flex mx-auto flex-col bg-gray-100 shadow-xl border-[0.1rem] border-gray-600 rounded-lg w-[50rem] h-[9rem]"
                            onClick={() => handleOpenModal('facility')}>
                            <a className="text-lg font-bold mt-[0.5rem] ml-[1rem]">편의 시설</a>
                            <div className="flex flex-row">
                                {/* 수건 아이콘 (DB에 있는 경우만 표시) */}
                                {facilityList.includes('towel') && (
                                    <div className="flex flex-col" onClick={() => handleCheckFacility('towel')}>
                                        <GiTowel className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>
                                        <a className="font-bold text-sm mt-[0.4rem] ml-[3.1rem]">수건</a>
                                    </div>
                                )}

                                {/* 샤워시설 아이콘 (DB에 있는 경우만 표시) */}
                                {facilityList.includes('shower') && (
                                    <div className="flex flex-col" onClick={() => handleCheckFacility('shower')}>
                                        <FaShower className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>
                                        <a className="font-bold text-sm mt-[0.4rem] ml-[2.2rem]">샤워시설</a>
                                    </div>
                                )}

                                {/* 세족시설 아이콘 (DB에 있는 경우만 표시) */}
                                {facilityList.includes('wash') && (
                                    <div className="flex flex-col" onClick={() => handleCheckFacility('wash')}>
                                        <FaHandsWash className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>
                                        <a className="font-bold text-sm mt-[0.4rem] ml-[2.2rem]">세족시설</a>
                                    </div>
                                )}

                                {/* Wifi 아이콘 (DB에 있는 경우만 표시) */}
                                {facilityList.includes('wifi') && (
                                    <div className="flex flex-col" onClick={() => handleCheckFacility('wifi')}>
                                        <FaWifi className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>
                                        <a className="font-bold text-sm mt-[0.4rem] ml-[3.1rem]">Wifi</a>
                                    </div>
                                )}

                                {/* 주차 아이콘 (DB에 있는 경우만 표시) */}
                                {facilityList.includes('parking') && (
                                    <div className="flex flex-col" onClick={() => handleCheckFacility('parking')}>
                                        <FaParking className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>
                                        <a className="font-bold text-sm mt-[0.4rem] ml-[3rem]">주차</a>
                                    </div>
                                )}

                                {/* 개인락커 아이콘 (DB에 있는 경우만 표시) */}
                                {facilityList.includes('locker') && (
                                    <div className="flex flex-col" onClick={() => handleCheckFacility('locker')}>
                                        <PiLockersFill className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>
                                        <a className="font-bold text-sm mt-[0.4rem] ml-[2.2rem]">개인락커</a>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex divider divide-gray-600 ml-[4rem] w-[60rem]"></div>
                        <div className="flex flex-col rounded-lg w-[50rem] h-[24rem]">
                            <a className="text-lg font-bold ml-[1rem]">시설 사진</a>
                            <div className="grid grid-cols-4 gap-7 mt-[1.2rem]">
                                {Array.from({length: 8}).map((_, index) => {
                                    const imageUrl = imageData.facility_pictures ? imageData.facility_pictures[index] : null;
                                    return (
                                        <div key={index}
                                             className="relative flex justify-center items-center w-[11rem] h-[10rem] hover:scale-125 transition-transform ease-in-out duration-500">
                                            {/* 이미지가 없으면 기본 이미지 또는 빈 공간 처리 */}
                                            <img className={`rounded-xl ${imageUrl ? 'opacity-30' : 'opacity-30'}`}
                                                 src={imageUrl || '/path/to/default-image.jpg'}
                                                 alt={`Facility ${index + 1}`}/>

                                            {/* 파일 업로드 버튼 */}
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => handleFacilityImageUpload(e, index)}
                                                id={`facility-image-upload-${index}`}
                                            />
                                            {/* 삭제 버튼 */}
                                            <button
                                                onClick={() => handleFacilityImageUpload({target: {files: [null]}}, index)} // 삭제 버튼 클릭 시
                                                className="absolute top-2 right-2 bg-red-400 items-center flex justify-center w-[1.5rem] h-[1.5rem] hover:text-red-400 text-white rounded-full p-1 hover:bg-white transition-colors"
                                            >
                                                <a className="flex mt-[0.1rem]">X</a>
                                            </button>

                                            {/* 업로드 버튼 */}
                                            <label htmlFor={`facility-image-upload-${index}`}
                                                   className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-white fill-white hover:bg-white hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500 hover:text-red-400 hover:border hover:border-red-400 w-[8rem] rounded-xl h-[3rem] bg-red-400 flex items-center justify-center space-x-2">
                                                <MdDriveFolderUpload className="h-full flex w-[2rem] mr-[0.2rem]"/>
                                                <span className="text-xl mt-[0.2rem]">업로드</span>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>


                        </div>
                        <div className="flex divider divide-gray-600 ml-[4rem] w-[60rem]"></div>
                        <div className="mt-8">
                            <button
                                onClick={handleSaveProduct}
                                className="text-white fill-white hover:bg-white hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500 hover:text-red-400 hover:border hover:border-red-400 w-[8rem] rounded-xl h-[3rem] bg-red-400 flex items-center justify-center space-x-2"
                            >
                                <span className="text-xl mt-[0.2rem]">저장하기</span>
                            </button>
                        </div>
                    </div>
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                        <div className="bg-white p-5 rounded-xl w-[30rem]">
                            <h2 className="font-bold text-xl mb-4">편의 시설 선택</h2>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center">
                                    <FaParking className="w-[2rem] h-[2rem]"/>
                                    <input
                                        type="checkbox"
                                        checked={selectedFacilities.includes('parking')}
                                        onChange={() => handleCheckFacility('parking')}
                                        className="ml-2 checked:bg-red-400"
                                    />
                                    <label className="ml-2">주차</label>
                                </div>
                                <div className="flex items-center">
                                    <FaWifi className="w-[2rem] h-[2rem]"/>
                                    <input
                                        type="checkbox"
                                        checked={selectedFacilities.includes('wifi')}
                                        onChange={() => handleCheckFacility('wifi')}
                                        className="ml-2 checked:bg-red-400"
                                    />
                                    <label className="ml-2">Wifi</label>
                                </div>
                                <div className="flex items-center">
                                    <FaHandsWash className="w-[2rem] h-[2rem]"/>
                                    <input
                                        type="checkbox"
                                        checked={selectedFacilities.includes('wash')}
                                        onChange={() => handleCheckFacility('wash')}
                                        className="ml-2 checked:bg-red-400"
                                    />
                                    <label className="ml-2">세족시설</label>
                                </div>
                                <div className="flex items-center">
                                    <FaShower className="w-[2rem] h-[2rem]"/>
                                    <input
                                        type="checkbox"
                                        checked={selectedFacilities.includes('shower')}
                                        onChange={() => handleCheckFacility('shower')}
                                        className="ml-2 checked:bg-red-400"
                                    />
                                    <label className="ml-2">샤워시설</label>
                                </div>
                                <div className="flex items-center">
                                    <GiTowel className="w-[2rem] h-[2rem]"/>
                                    <input
                                        type="checkbox"
                                        checked={selectedFacilities.includes('towel')}
                                        onChange={() => handleCheckFacility('towel')}
                                        className="ml-2 checked:bg-red-400"
                                    />
                                    <label className="ml-2">수건</label>
                                </div>
                                <div className="flex items-center">
                                    <PiLockersFill className="w-[2rem] h-[2rem]"/>
                                    <input
                                        type="checkbox"
                                        checked={selectedFacilities.includes('locker')}
                                        onChange={() => handleCheckFacility('locker')}
                                        className="ml-2 checked:bg-red-400"
                                    />
                                    <label className="ml-2">개인락커</label>
                                </div>
                            </div>
                            <button
                                className="mt-2 bg-red-400 text-white hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500 hover:bg-white hover:text-red-400 hover:border hover:border-red-400 rounded-lg"
                                onClick={() => setIsModalOpen(false)} // 취소 버튼 클릭 시 모달 닫기
                            >
                                저장
                            </button>
                        </div>
                    </div>
                )}
            </div>

        )
}

export default Fixproduct;