import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import {FaHandsWash, FaParking, FaWifi} from "react-icons/fa";
import {FaShower} from "react-icons/fa6";
import {GiTowel} from "react-icons/gi";
import {PiLockersFill} from "react-icons/pi";

const AddProduct = ({userProfile}) => {
    const [productName, setProductName] = useState("");
    const navigate = useNavigate();
    const [icon, setIcon] = useState(null);
    const [logo, setLogo] = useState(null);
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [detailedAddress, setDetailedAddress] = useState("");
    const [pricing, setPricing] = useState({
        oneMonth: "",
        threeMonths: "",
        sixMonths: "",
        twelveMonths: "",
    });
    const [introductionImages, setIntroductionImages] = useState([]);
    const [facilityImages, setFacilityImages] = useState([]);
    const [selectedFacilities, setSelectedFacilities] = useState([]);

    const handleCheckFacility = (facility) => {
        setSelectedFacilities((prevSelectedFacilities) => {
            if (prevSelectedFacilities.includes(facility)) {
                // 이미 선택되어 있으면, 배열에서 해당 시설을 제거
                return prevSelectedFacilities.filter((item) => item !== facility);
            } else {
                // 선택되지 않았다면 배열에 추가
                return [...prevSelectedFacilities, facility];
            }
        });
    };

    const handleImageUpload = (e, setImageState, maxCount) => {
        const files = Array.from(e.target.files);
        if (files.length > maxCount) {
            alert(`최대 ${maxCount}개의 이미지만 업로드할 수 있습니다.`);
            return;
        }
        setImageState(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 필수 입력 값들이 모두 채워졌는지 확인
        if (!productName || !category || !address || !detailedAddress || !pricing.oneMonth) {
            alert("모든 제품 정보를 입력해 주세요.");
            return;
        }

        // FormData 생성
        const formData = new FormData();

        // 텍스트 필드 추가
        formData.append("prodtitle", productName);
        formData.append("category", category);
        formData.append("prodsmtitle", description);
        formData.append("prodaddress", address);
        formData.append("address", detailedAddress);
        formData.append("prodprice", pricing.oneMonth);
        formData.append("prodprice2", pricing.threeMonths);
        formData.append("prodprice3", pricing.sixMonths);
        formData.append("prodprice4", pricing.twelveMonths);

        // 파일 추가
        if (icon) formData.append("iconpicture", icon);
        if (logo) formData.append("prodpicture", logo);

        // 제품 소개 이미지 추가
        introductionImages.forEach((img, index) => {
            formData.append(`prodcontent${index + 1}`, img);
        });

        // 시설 사진 JSON 배열 생성
        const facilityImagesArray = facilityImages.map((img) => `/uploads/${img.name}`);
        formData.append("facility_pictures", JSON.stringify(facilityImagesArray));

        formData.append("facilities", JSON.stringify(selectedFacilities));

        if (userProfile) {
            formData.append("userId", userProfile.userId);
        }

        try {
            // 서버로 데이터 전송
            const response = await fetch("http://localhost:8080/api/products", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("제품이 성공적으로 등록되었습니다.");
                navigate("/");
            } else {
                alert("제품 등록에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error uploading data:", error);
            alert("서버와 통신 중 문제가 발생했습니다.");
        }
    };


    return (
        <div className="flex flex-col mt-[1rem] h-full items-center justify-center mx-28">
            <a className="flex items-center text-red-400 w-[62rem] font-bold text-xl justify-center">
                제품 등록
            </a>
            <div className="w-[62rem] border-b-2 border-red-400 mt-4"></div>

            <form onSubmit={handleSubmit}>
                {/* 제품 이름 및 아이콘 */}
                <div className="flex items-center mt-[2rem] mb-4">
                    <div className="flex flex-col w-1/2 pr-2">
                        <label className="font-semibold mb-1">제품 이름</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="p-2 border rounded-lg"
                            placeholder="제품 이름 입력"
                        />
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label className="font-semibold mb-1">아이콘</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setIcon(e.target.files[0])}
                            className="p-2 border rounded-lg"
                        />
                    </div>
                </div>

                {/* 메인 로고 및 카테고리 */}
                <div className="flex items-center mb-4">
                    <div className="flex flex-col w-1/2 pr-2">
                        <label className="font-semibold mb-1">메인 로고</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setLogo(e.target.files[0])}
                            className="p-2 border rounded-lg"
                        />
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label className="font-semibold mb-1">카테고리</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="p-2 border rounded-lg"
                        >
                            <option value="" disabled>
                                카테고리 선택
                            </option>
                            <option value="climbing">클라이밍</option>
                            <option value="pilates">필라테스</option>
                            <option value="swim">수영</option>
                            <option value="crossfit">크로스핏</option>
                            <option value="weight">헬스</option>
                            <option value="package">묶음 상품</option>
                        </select>
                    </div>
                </div>

                {/* 운동 시설 설명 및 주소 */}
                <div className="flex flex-col mb-4">
                    <label className="font-semibold mb-1">운동 시설 설명</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="p-2 border rounded-lg h-28"
                        placeholder="운동 시설 설명 입력"
                    />
                </div>
                <div className="flex mb-4">
                    <div className="flex flex-col w-1/2 pr-2">
                        <label className="font-semibold mb-1">주소</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="p-2 border rounded-lg"
                            placeholder="주소 입력"
                        />
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label className="font-semibold mb-1">상세 주소</label>
                        <input
                            type="text"
                            value={detailedAddress}
                            onChange={(e) => setDetailedAddress(e.target.value)}
                            className="p-2 border rounded-lg"
                            placeholder="상세 주소 입력"
                        />
                    </div>
                </div>

                {/* 금액 설정 */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {["1개월", "3개월", "6개월", "1년"].map((label, idx) => {
                        const key = ["oneMonth", "threeMonths", "sixMonths", "twelveMonths"][idx];
                        return (
                            <div key={key} className="flex flex-col">
                                <label className="font-semibold mb-1">{label} 금액</label>
                                <input
                                    type="number"
                                    value={pricing[key]}
                                    onChange={(e) =>
                                        setPricing((prev) => ({...prev, [key]: e.target.value}))
                                    }
                                    className="p-2 border rounded-lg"
                                    placeholder={`${label} 금액 입력`}
                                />
                            </div>
                        );
                    })}
                </div>
                <div className="flex flex-row h-full justify-center items-center border border-gray-500 mb-4 w-full p-2 gap-8 rounded-xl">
                    <div className="flex flex-col items-center">
                        <FaParking className="w-[2rem] h-[2rem]"/>
                        <input
                            type="checkbox"
                            checked={selectedFacilities.includes('parking')}
                            onChange={() => handleCheckFacility('parking')}
                            className="ml-2 checked:bg-red-400 mt-1 mr-2"
                        />
                        <label className="ml-2 mr-2">주차</label>
                    </div>
                    <div className="flex flex-col items-center">
                        <FaWifi className="w-[2rem] h-[2rem]"/>
                        <input
                            type="checkbox"
                            checked={selectedFacilities.includes('wifi')}
                            onChange={() => handleCheckFacility('wifi')}
                            className="ml-2 checked:bg-red-400 mt-1 mr-2"
                        />
                        <label className="ml-2 mr-2">Wifi</label>
                    </div>
                    <div className="flex flex-col items-center">
                        <FaHandsWash className="w-[2rem] h-[2rem]"/>
                        <input
                            type="checkbox"
                            checked={selectedFacilities.includes('wash')}
                            onChange={() => handleCheckFacility('wash')}
                            className="ml-2 checked:bg-red-400 mt-1"
                        />
                        <label className="ml-2">세족시설</label>
                    </div>
                    <div className="flex flex-col items-center">
                        <FaShower className="w-[2rem] h-[2rem]"/>
                        <input
                            type="checkbox"
                            checked={selectedFacilities.includes('shower')}
                            onChange={() => handleCheckFacility('shower')}
                            className="ml-2 checked:bg-red-400 mt-1"
                        />
                        <label className="ml-2">샤워시설</label>
                    </div>
                    <div className="flex flex-col items-center">
                        <GiTowel className="w-[2rem] h-[2rem]"/>
                        <input
                            type="checkbox"
                            checked={selectedFacilities.includes('towel')}
                            onChange={() => handleCheckFacility('towel')}
                            className="ml-2 checked:bg-red-400 mt-1"
                        />
                        <label className="ml-2">수건</label>
                    </div>
                    <div className="flex flex-col items-center">
                        <PiLockersFill className="w-[2rem] h-[2rem]"/>
                        <input
                            type="checkbox"
                            checked={selectedFacilities.includes('locker')}
                            onChange={() => handleCheckFacility('locker')}
                            className="ml-2 checked:bg-red-400 mt-1"
                        />
                        <label className="ml-2">개인락커</label>
                    </div>
                </div>


                {/* 제품 소개 이미지 */}
                <div className="flex flex-col mb-4">
                    <label className="font-semibold mb-1">제품 소개 이미지 (최대 4장)</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e, setIntroductionImages, 4)}
                        className="p-2 border rounded-lg"
                    />
                </div>

                {/* 시설 사진 */}
                <div className="flex flex-col mb-4">
                    <label className="font-semibold mb-1">시설 사진 (최대 8장)</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e, setFacilityImages, 8)}
                        className="p-2 border rounded-lg"
                    />
                </div>

                {/* 제출 버튼 */}
                <button
                    type="submit"
                    className="w-full py-2 bg-red-400 text-white font-bold rounded-lg hover:bg-white hover:border hover:border-red-400 hover:text-red-400 hover:scale-110 transition-transform ease-in-out duration-500"
                >
                    제품 등록하기
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
