import React, {useState} from "react";
import { FaLocationDot } from "react-icons/fa6";
import { LiaDumbbellSolid } from "react-icons/lia";
import {FaEdit, FaTrashAlt} from "react-icons/fa";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const AdminCard = ({ id, prodtitle, prodprice, prodaddress, prodrating, iconpicture, onDelete }) => {

    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    const handleEditProduct = (id) => {
        navigate(`/Fixproduct/${id}`);
    };

    const handleDeleteProduct = (prodid) => {
        onDelete(prodid);  // 부모에서 전달된 삭제 함수 호출
    };

    return (
        <div
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
            <div className="flex justify-between mt-4 absolute bottom-4 left-4 right-4">
                <FaEdit
                    className="text-red-400 cursor-pointer hover:scale-110"
                    onClick={() => handleEditProduct(id)}
                />
                <FaTrashAlt
                    className="text-red-400 cursor-pointer hover:scale-110"
                    onClick={() => handleDeleteProduct(id)}
                />
            </div>
        </div>
    );
};

export default AdminCard;