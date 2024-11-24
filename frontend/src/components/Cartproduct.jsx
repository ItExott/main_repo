import React from "react";
import { IoClose } from "react-icons/io5";

// Cartproduct component to display each product in the cart
const Cartproduct = ({ item, onRemoveProduct }) => {
    return (
        <div className="flex flex-row w-[62rem] shadow-xl items-center rounded-2xl h-[10rem] bg-white">
            <div className="w-[9rem] flex ml-[1rem] h-[9rem]">
                <img
                    className="border-[0.1rem] border-gray-200 rounded-3xl shadow-xl"
                    src={item.iconpicture} // Dynamically set the image source
                    alt={item.prodtitle}  // Add alt for better accessibility
                />
            </div>
            <div className="ml-[2rem] mt-[2rem] items-start h-[9rem] flex flex-col">
                <a className="text-lg">{item.prodtitle}</a> {/* Dynamically set product title */}
                <a className="text-xs text-gray-400">{item.category}</a> {/* Dynamically set category */}
                <a className="text-lg mt-[3rem] text-red-400">{item.prodprice}원</a> {/* Dynamically set product price */}
            </div>
            <div className="flex ml-auto justify-center items-center h-full pr-[3rem]">
                <IoClose
                    className="w-[2rem] h-[2rem] fill-gray-500 hover:scale-125 cursor-pointer transition-transform ease-in-out duration-500"
                    onClick={() => onRemoveProduct(item.prodid)}
                />
            </div>
        </div>
    );
};

export default Cartproduct;
