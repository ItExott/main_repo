import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useState, useEffect, useRef} from "react";
import {useRecoilValue} from "recoil";
import axios from "axios";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

const BottomBox = () => {
    const { id } = useParams(); // URL 파라미터에서 id를 가져옴

    const [productData, setProductData] = useState({
        iconpicture: "",
        prodid: "",
        prodtitle: "",
        prodrating: "",
        address: "",
        prodpicture: "",
        prodprice: ""
    });

    useEffect(() => {
        // 데이터 요청
        axios.get(`http://localhost:8080/product/${id}`)
            .then(response => {
                console.log(response.data); // 백엔드에서 받은 데이터를 로그로 확인
                setProductData({
                    prodid: response.data.prodid,      // 받은 데이터의 prodid로 설정
                    iconpicture: response.data.iconpicture,  // 받은 데이터의 iconpicture로 설정
                    prodtitle: response.data.prodtitle,
                    prodrating: response.data.prodrating,
                    address: response.data.address,
                    prodpicture: response.data.prodpicture,
                    prodprice: response.data.prodprice
                });
                console.log(productData.iconpicture);
            })
            .catch(error => {
                console.error("Error fetching product data:", error);
            });
    }, [id]); // id가 변경될 때마다 데이터 요청

    const [count, setCount] = useState(1);

    // 감소 함수
    const handleMinus = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    // 증가 함수
    const handlePlus = () => {
        setCount(count + 1);
    };

    const [isFilled, setIsFilled] = useState(false);

    // 클릭 시 상태를 토글하는 함수
    const handleClick = () => {
        setIsFilled(!isFilled);
    };


    return(
        <div className="fixed z-10 bottom-0 left-0">
            <div
                className="flex flex-row items-center w-screen bg-white h-[5rem] outline outline-1 outline-gray-300"> {/* 고정 박스 */}
                <p className="ml-[5rem] text-[1.5rem] text-red-500 font-semibold whitespace-nowrap">상품 금액</p>
                <p className="ml-[2.3rem] text-[1.5rem] text-black font-black whitespace-nowrap">{productData.prodprice}원</p>
                <p className="text-[1.5rem] text-black font-black whitespace-nowrap ml-[0.4rem]">~ / 월</p>
                <div
                    className="ml-[38rem] flex items-center hover:scale-110 transition-transform ease-in-out duration-500 justify-center cursor-pointer rounded-md outline outline-1 h-[3rem] w-[3rem] outline-gray-300"
                    onClick={handleClick}
                >
                    {/* 클릭 시 상태에 따라 아이콘 변경 */}
                    {isFilled ? (
                        <FaStar className="flex w-[1.3rem] h-[1.3rem] mb-[0.1rem] fill-red-400"/>
                    ) : (
                        <FaRegStar className="flex w-[1.3rem] h-[1.3rem] mb-[0.1rem]"/>
                    )}
                </div>
                <div
                    className="flex ml-[0.5rem] hover:bg-gray-100 h-[2.9rem] w-[7.3rem] hover:scale-110 transition-transform ease-in-out duration-500 items-center justify-center cursor-pointer rounded-l-md ring-offset-0 ring-[0.04rem] ring-red-500 bg-white">
                    {/* 장바구니 */}
                    <p className="font-bold text-base flex mt-[0.1rem] text-red-500">장바구니</p>
                </div>
                <div
                    className="flex hover:bg-red-500 h-[3rem] w-[7.3rem] items-center hover:scale-110 transition-transform ease-in-out duration-500 justify-center cursor-pointer rounded-r-md bg-red-500 ring-offset-0 ring-0">
                    {/* 바로구매 */}
                    <p className="font-bold text-base flex mt-[0.1rem] text-white">바로구매</p>
                </div>
            </div>
        </div>


    )
}
export default BottomBox;