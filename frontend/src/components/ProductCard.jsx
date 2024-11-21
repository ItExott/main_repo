import React, {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useRecoilValue} from "recoil";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay, EffectCoverflow } from "swiper";
import {FaLocationDot} from "react-icons/fa6";
import axios from "axios";
import product from "../pages/Product.jsx";
import { TbHandClick } from "react-icons/tb";
import {LiaDumbbellSolid} from "react-icons/lia";

const ProductCard = ({id, onClick, price, address}) => {

    const [productData, setProductData] = useState({
        iconpicture: "",
        prodid: "",
        prodtitle: "",
        prodprice: "",
        prodview: "",
        prodrating: ""
    });

    useEffect(() => {
        // 데이터 요청
        axios.get(`http://localhost:8080/product/${id}`)
            .then(response => {
                console.log(response.data); // 백엔드에서 받은 데이터를 로그로 확인
                setProductData({
                    prodtitle: response.data.prodtitle,
                    prodid: response.data.prodid,      // 받은 데이터의 prodid로 설정
                    iconpicture: response.data.iconpicture,  // 받은 데이터의 iconpicture로 설정
                    prodprice: response.data.prodprice,
                    prodrating: response.data.prodrating,
                    prodview: response.data.prodview
                });
                console.log(productData.iconpicture);
            })
            .catch(error => {
                console.error("Error fetching product data:", error);
            });
    }, [id]); // id가 변경될 때마다 데이터 요청

    return (
        <div  onClick={() => onClick(id)} className="w-[20rem] h-[21.8rem] items-center flex flex-col cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 rounded overflow-hidden shadow-lg m-4 bg-white">
            <img className="flex w-[20rem] h-[15rem]" src={productData.iconpicture} alt="Card image"/>
            <div className="px-6 flex flex-col items-center pt-4 pb-2">
                <div className="flex flex-row items-center justify-center">
                    <a className="flex font-bold text-lg">{productData.prodtitle}</a>
                    <a className="text-sm justify-center font-semibold items-center flex mt-[0.2rem] ml-[0.3rem]"><TbHandClick
                        className="w-[1rem] h-[1rem]"/></a>
                    <a className="text-xs items-center flex ml-[0.1rem] mt-[0.4rem]">{productData.prodview}</a>
                </div>
                <div className="flex flex-row mt-[0.3rem] justify-center items-center">
                    <FaLocationDot/>
                    <a className="flex ml-[0.1rem] text-xs">{address}</a>
                    <a className="flex text-sm font-semibold ml-[1rem]">{productData.prodprice}</a>
                    <a className="flex text-xs ml-[0.2rem]">~/월</a>
                </div>
                <div className="flex flex-row">
                    {/* 첫 번째 아이콘 */}
                    <LiaDumbbellSolid
                        className={`w-[1.5rem] h-[1.5rem] mt-[0.4rem] ${productData.prodrating >= 0 ? "fill-black" : "fill-gray-300"}`}
                    />

                    {/* 두 번째 아이콘 */}
                    <LiaDumbbellSolid
                        className={`w-[1.5rem] h-[1.5rem] mt-[0.4rem] ${productData.prodrating >= 3 ? "fill-black" : "fill-gray-300"}`}
                    />

                    {/* 세 번째 아이콘 */}
                    <LiaDumbbellSolid
                        className={`w-[1.5rem] h-[1.5rem] mt-[0.4rem] ${productData.prodrating >= 6 ? "fill-black" : "fill-gray-300"}`}
                    />

                    {/* 네 번째 아이콘 */}
                    <LiaDumbbellSolid
                        className={`w-[1.5rem] h-[1.5rem] mt-[0.4rem] ${productData.prodrating >= 9 ? "fill-black" : "fill-gray-300"}`}
                    />

                    <a className="text-sm mt-[0.3rem] font-bold items-center flex ml-[0.5rem]">{productData.prodrating}</a>
                    <a className="text-xs items-center ml-[0.1rem] mt-[0.4rem] flex"> / 10</a>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;