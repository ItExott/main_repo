import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { LiaDumbbellSolid } from "react-icons/lia";

const SearchCard = ({ id, prodtitle, prodprice, prodaddress, prodrating, iconpicture, onClick }) => {

    return (
        <div onClick={() => onClick(id)}
             className="w-[14rem] h-[16rem] items-center flex flex-col cursor-pointer hover:scale-105 transition-transform ease-in-out duration-500 rounded overflow-hidden shadow-lg m-2 bg-white">
            <img className="flex w-[14rem] h-[10rem]" src={iconpicture} alt="Card image"/>
            <div className="px-3 flex flex-col items-center pt-2 pb-2">
                <a className="flex font-bold text-sm">{prodtitle}</a>
                <div className="flex flex-row mt-[0.3rem] justify-center items-center">
                    <FaLocationDot/>
                    <a className="flex ml-[0.1rem] text-xs">{prodaddress}</a>
                </div>
                <div className="flex flex-row">

                <a className="flex text-xs font-semibold ml-[0.6rem]">{prodprice}원</a>
                    <a className="flex text-xs ml-[0.2rem]">~/월</a>
                </div>
            </div>
        </div>
    );
};

export default SearchCard;