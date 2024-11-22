import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { LiaDumbbellSolid } from "react-icons/lia";

const ProductCard = ({ id, prodtitle, prodprice, prodaddress, prodrating, iconpicture, onClick }) => {

    return (
        <div onClick={() => onClick(id)} className="w-[20rem] h-[21.8rem] items-center flex flex-col cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 rounded overflow-hidden shadow-lg m-4 bg-white">
            <img className="flex w-[20rem] h-[15rem]" src={iconpicture} alt="Card image" />
            <div className="px-6 flex flex-col items-center pt-4 pb-2">
                <a className="flex font-bold text-lg">{prodtitle}</a>
                <div className="flex flex-row mt-[0.3rem] justify-center items-center">
                    <FaLocationDot />
                    <a className="flex ml-[0.1rem] text-xs">{prodaddress}</a>
                    <a className="flex text-sm font-semibold ml-[1rem]">{prodprice}원</a>
                    <a className="flex text-xs ml-[0.2rem]">~/월</a>
                </div>
                <div className="flex flex-row">
                    {/* 첫 번째 아이콘 */}
                    <LiaDumbbellSolid
                        className={`w-[1.5rem] h-[1.5rem] mt-[0.4rem] ${prodrating >= 0 ? "fill-black" : "fill-gray-300"}`}
                    />

                    {/* 두 번째 아이콘 */}
                    <LiaDumbbellSolid
                        className={`w-[1.5rem] h-[1.5rem] mt-[0.4rem] ${prodrating >= 3 ? "fill-black" : "fill-gray-300"}`}
                    />

                    {/* 세 번째 아이콘 */}
                    <LiaDumbbellSolid
                        className={`w-[1.5rem] h-[1.5rem] mt-[0.4rem] ${prodrating >= 6 ? "fill-black" : "fill-gray-300"}`}
                    />

                    {/* 네 번째 아이콘 */}
                    <LiaDumbbellSolid
                        className={`w-[1.5rem] h-[1.5rem] mt-[0.4rem] ${prodrating >= 9 ? "fill-black" : "fill-gray-300"}`}
                    />

                    <a className="text-sm mt-[0.3rem] font-bold items-center flex ml-[0.5rem]">{prodrating}</a>
                    <a className="text-xs items-center ml-[0.1rem] mt-[0.4rem] flex"> / 10</a>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;