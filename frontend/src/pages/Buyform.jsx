import React, {useState, useEffect, useRef} from "react";
import {Link, useParams,useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import axios from "axios";

const Buyform= () => {

    return(
        <div className="flex flex-col mt-[2rem] h-full items-center justify-center mx-28 ">
            <a className="flex items-center w-[62rem] font-bold text-xl justify-center">주문 / 결제</a>
            <div className="w-[62rem] border-b-2 border-gray-950 mt-4"></div>
            <div className="flex w-[62rem] mt-[1rem] h-[20rem]">
                <a className="text-red-400">2개 /</a>
                <a className="ml-[0.4rem]">최대 3개</a>
            </div>
        </div>
    )
}

export default Buyform;