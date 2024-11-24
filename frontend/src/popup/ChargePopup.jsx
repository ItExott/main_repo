import React, { useState } from "react";
import axios from "axios";



const ChargePopup = ({ userId, closePopup, confirmCharge }) => {
    const [chargeAmount, setChargeAmount] = useState("");


    const handleConfirm = () => {
        if (chargeAmount) {
            confirmCharge(chargeAmount); // 입력된 금액을 전달
            setChargeAmount(""); // 팝업 확인 후 입력값 초기화 (선택 사항)
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl w-[20rem] h-auto p-6 shadow-lg flex flex-col">
                {/* 팝업 헤더 */}
                <div className="text-lg font-bold text-center text-red-400 mb-4">충전</div>

                {/* 유저 ID */}
                <div className="mb-4">
                    <div className="bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-800">
                        {userId}님
                    </div>
                </div>

                {/* 충전 금액 입력 */}
                <div className="mb-4">
                    <p className="text-gray-600">충전 금액</p>
                    <input
                        type="number"
                        value={chargeAmount}
                        onChange={(e) => {
                            const value = Math.max(0, Number(e.target.value)); // 1 이상만 허용
                            setChargeAmount(value);
                        }}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                        placeholder="금액 입력"
                    />
                </div>

                {/* 버튼 */}
                <div className="flex">
                    <div
                        className="w-1/2 text-red-400 bg-white border-[0.1rem] hover:scale-125 transition-transform ease-in-out duration-500 border-red-400 text-center py-2 rounded-l-md cursor-pointer hover:bg-red-400 hover:text-white"
                        onClick={closePopup}
                    >
                        닫기
                    </div>
                    <div
                        className="w-1/2 bg-red-400 hover:text-red-400 hover:bg-white hover:border-[0.1rem] hover:border-red-400 hover:scale-125 transition-transform ease-in-out duration-500 text-white text-center py-2 rounded-r-md cursor-pointer"
                        onClick={handleConfirm}
                    >
                        확인
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChargePopup;
