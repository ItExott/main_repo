import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay, EffectCoverflow } from "swiper";
import {FaLocationDot} from "react-icons/fa6";
import axios from "axios";

const ProductCard = ({id, onClick, text, price, address}) => {
    const [productData, setProductData] = useState({
        main_logo: "",
        text: "",
        price: "",
        address: ""
    });

    useEffect(() => {
        // 데이터 요청
        axios
            .get(`http://localhost:8080/product/${id}`) // Node.js 서버에서 데이터 가져오기
            .then((response) => {
                setProductData(response.data); // 서버에서 받은 데이터를 상태에 저장
            })
            .catch((error) => {
                console.error("Error fetching product data:", error);
            });
    }, [id]);


    const navigate = useNavigate();

    return (
        <div  onClick={() => onClick(id)} className="w-[20rem] h-[20rem] items-center flex flex-col cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 rounded overflow-hidden shadow-lg m-4 bg-white">
            <img className="flex w-max h-[15rem]" src={productData.main_logo} alt="Card image"/>
            <div className="px-6 flex flex-col items-center pt-4 pb-2">
                <a className="flex font-bold text-lg">{text}</a>
                <div className="flex flex-row mt-[0.3rem] justify-center items-center">
                    <FaLocationDot/>
                    <a className="flex ml-[0.1rem] text-xs">{address}</a>
                    <a className="flex text-sm font-semibold ml-[1rem]">{price}</a>
                    <a className="flex text-xs ml-[0.2rem]">~/월</a>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;