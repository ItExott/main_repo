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
    const [productData, setProductData] = useState(null);
    const [imageData, setImageData] = useState({
        prodpicture: '',
        iconpicture: '',
        facility_pictures: [],
    });
    const { id } = useParams();

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

                    // 기존 데이터 유지 및 업데이트
                    setImageData(prevState => ({
                        ...prevState,
                        [field]: filePath || prevState[field],
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
                prodpicture: imageData?.prodpicture || productData.prodpicture, // 기존 값 유지
                iconpicture: imageData?.iconpicture || productData.iconpicture, // 기존 값 유지
                facility_pictures: imageData?.facility_pictures && imageData.facility_pictures.some(pic => pic !== null && pic !== "")
                    ? imageData.facility_pictures // 업로드된 시설사진이 있을 때만 반영
                    : productData.facility_pictures // 없으면 기존 값 유지
            };

            console.log("Updated Product Data:", updatedProductData); // 전송되는 데이터 확인

            const response = await axios.put(`http://localhost:8080/api/product/update/${id}`, updatedProductData, {
                withCredentials: true,
            });

            if (response.data.success) {
                alert('상품이 성공적으로 업데이트되었습니다.');
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
                <div
                    className="flex justify-start flex-row rounded-3xl border-2 border-gray-950 w-[62rem] h-[22rem] mt-6 items-center">
                    <div className="flex relative items-center w-[42rem] h-[22rem]">
                        <img className="flex w-[42rem] h-[21.8rem] opacity-30 rounded-l-3xl" src={productData.prodpicture}/>
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
                                    <a className="flex text-sm text-gray-400 bg-yellow-200 border-[0.2rem] border-yellow-200 items-center justify-center rounded-xl w-[12rem] font-bold mt-[1.2rem]">
                                        {productData.prodtitle}
                                    </a>
                                    <div className="flex items-center justify-center flex-col w-1/2">
                                        <div className="flex w-[8rem] mt-[1rem] h-[8rem]">
                                            <img className="rounded-full opacity-30" src={productData.iconpicture}
                                                 alt="Product Logo"/>
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
                                <div
                                    className="flex flex-col ml-[3.5rem] rounded-3xl bg-white items-center w-[18rem] h-[18rem]">
                                    <a className="flex text-sm bg-yellow-200 border-[0.2rem] border-yellow-200 items-center justify-center rounded-xl w-[12rem] font-bold mt-[1.2rem]">
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
                                <div className="flex flex-col">
                                    <PiLockersFill className="mt-[0.5rem] ml-[2.5rem] w-[3rem] h-[3rem]"/>
                                    <a className="font-bold text-sm mt-[0.4rem] ml-[2.2rem]">개인락커</a>
                                </div>
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

            </div>

        )
}

export default Fixproduct;