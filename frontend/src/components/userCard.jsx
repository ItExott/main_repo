import React from "react";
import { FaLocationDot } from "react-icons/fa6";

const UserCard = ({ id, profileimg, name, onClick }) => {
    return (
        <div
            onClick={() => onClick(id)} // 클릭 시 onClick 이벤트 핸들러 호출
            className="w-[14rem] h-[16rem] items-center flex flex-col cursor-pointer hover:scale-105 transition-transform ease-in-out duration-500 rounded overflow-hidden shadow-lg m-2 bg-white"
        >
            <img className="flex w-[14rem] h-[10rem]" src={`http://localhost:8080${profileimg}`} alt="Card image" />
            <div className="px-3 flex flex-col items-center pt-2 pb-2">
                <a className="flex ml-[0.1rem] text-xs">{id}</a>
                <div className="flex flex-row mt-[0.3rem] justify-center items-center">
                    <a className="flex font-bold text-sm">{name}</a>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
