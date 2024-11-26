import React, { useState, useEffect } from "react";
import axios from "axios";

const ChargePopup = ({ userProfile, closePopup, confirmCharge, setMoney }) => {
    const [chargeAmount, setChargeAmount] = useState(""); // 충전 금액 상태
    const [initialMoney, setInitialMoney] = useState(0);  // 초기 금액 상태

    // 금액에 쉼표 추가하는 함수
    const formatAmount = (amount) => {
        return Number(amount).toLocaleString(); // 천 단위 쉼표 추가
    };

    useEffect(() => {
        const fetchUserMoney = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/userinfo', {
                    withCredentials: true  // 세션 쿠키를 함께 전송
                });
                if (response.data.success) {
                    const money = response.data.money;
                    setInitialMoney(money);
                    setMoney(money); // 부모 상태에 업데이트
                    sessionStorage.setItem("money", money); // 세션 스토리지에 저장
                } else {
                    alert("사용자 정보 불러오기 실패");
                }
            } catch (error) {
                console.error("초기 금액 불러오기 오류:", error);
                alert("서버 오류, 다시 시도해 주세요.");
            }
        };

        if (userProfile?.userId) {
            fetchUserMoney();
        }
    }, [userProfile?.userId, setMoney]);



    const handleConfirm = async () => {
        if (chargeAmount) {
            try {
                // 쉼표를 제거하고 숫자로 변환
                const amount = Number(chargeAmount.replace(/,/g, ''));

                if (isNaN(amount) || amount <= 0) {
                    alert("올바른 금액을 입력해 주세요.");
                    return;
                }

                // 서버에 충전 요청 보내기
                const response = await axios.post("http://localhost:8080/api/charge", {
                    userId: userProfile.userId,  // userProfile에서 userId 가져오기
                    chargeAmount: amount,  // 숫자로 변환된 금액
                });

                if (response.data.success) {
                    confirmCharge(chargeAmount);  // 부모 컴포넌트로 충전된 금액 전달
                    setMoney((prevMoney) => {
                        const newMoney = prevMoney + amount;
                        sessionStorage.setItem("money", newMoney); // 충전 후 새 금액을 세션 스토리지에 저장
                        return newMoney;
                    }); // 충전된 금액을 업데이트
                    setChargeAmount(""); // 입력값 초기화
                    closePopup(); // 팝업 닫기
                } else {
                    alert("충전 실패");
                }
            } catch (error) {
                console.error("충전 요청 오류:", error);
                alert("서버 오류, 다시 시도해 주세요.");
            }
        } else {
            alert("충전 금액을 입력해 주세요.");
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl w-[20rem] h-auto p-6 shadow-lg flex flex-col">
                <div className="text-lg font-bold text-center text-red-400 mb-4">충전</div>
                <div className="mb-4">
                    <div className="bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-800">
                        {userProfile?.userId}님
                    </div>
                </div>
                <div className="mb-4">
                    <p className="text-gray-600">충전 금액</p>
                    <input
                        type="text"
                        value={chargeAmount}
                        onChange={(e) => {
                            let value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 입력
                            if (value) {
                                value = formatAmount(value); // 쉼표 추가
                            }
                            setChargeAmount(value);  // 업데이트된 금액 상태 설정
                        }}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                        placeholder="금액 입력"
                    />
                </div>
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
