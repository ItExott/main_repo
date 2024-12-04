import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const DeleteUser = ({ handleLogout }) => {
    const [isChecked, setIsChecked] = useState(false); // 체크박스 상태
    const [selectedReason, setSelectedReason] = useState(""); // 라디오 버튼 상태
    const [showPopup, setShowPopup] = useState(false);
    const [userId, setUserId] = useState(null); // 사용자 ID 상태
    const navigate = useNavigate();

    const isButtonEnabled = isChecked && selectedReason !== ""; // 버튼 활성화 조건

    useEffect(() => {
        // 유저 데이터 불러오기
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/userinfo', {withCredentials: true});
                setUserId(response.data.userId);
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };
        fetchUserData();
    }, []);

    const handleDelete = async () => {
        try {
            const response = await axios.delete("http://localhost:8080/api/users", { withCredentials: true });
            if (response.status === 200) {
                alert("회원 탈퇴가 완료되었습니다.");
                // 추가 후처리 (예: 리다이렉트)
            }
        } catch (error) {
            console.error("회원 탈퇴 중 오류 발생:", error);
            alert("오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    const goHome = () => navigate("/");

    return (
        <div className="flex flex-col mt-[1rem] h-full items-center justify-center mx-28">
            {/* 전체 틀 */}
            <a className="flex items-center text-red-400 w-[62rem] font-bold text-xl justify-center">회원탈퇴</a>

            <div className="flex flex-col items-start p-8 w-[50rem] h-full shadow-xl">
                {/* 세부 내용 */}
                <a className="text-red-400 ml-[1rem] mt-[2rem] text-lg flex">회원탈퇴 주의사항</a>
                <div className="w-full border-b-2 border-red-400 mt-[0.5rem]"></div>
                <a className="mt-[1rem] ml-[2rem] text-lg flex">탈퇴 후 제한</a>
                <ul className="list-disc flex flex-col items-start text-gray-500 mt-[0.5rem] ml-[3rem] text-lg">
                    <li>회원탈퇴 후 15일 내에 로그인하시면 <a className="text-red-400">회원탈퇴 취소가 가능</a>합니다.</li>
                    <li>회원탈퇴 처리된 ID는 <a className="text-red-400">30일 동안 재사용이 불가</a>합니다.</li>
                    <li>보유한 쿠폰과 짐머니는 <a className="text-red-400">탈퇴 시 소멸</a>되며 <a className="text-red-400">재발행이 불가능</a>합니다.
                    </li>
                    <li>작성한 이용후기는 탈퇴 후에도 삭제되지 않습니다.</li>
                </ul>
                <div className="w-full border-b-2 border-red-400 mt-[0.5rem]"></div>
                <a className="mt-[1rem] ml-[2rem] text-lg flex">삭제되는 이용기록</a>
                <a className="text-gray-500 mt-[0.5rem] text-lg ml-[2rem]">
                    이름, 주소, 성별, 휴대폰 번호, 이메일, 닉네임, 결제정보, 찜한 시설, 쿠폰, 짐머니
                </a>
                <div className="w-full border-b-2 border-red-400 mt-[1em]"></div>
                <a className="mt-[1rem] ml-[2rem] text-lg flex">탈퇴 사유</a>
                <div className="flex flex-row mt-[0.5rem] ml-[2rem]">
                    <input
                        type="radio"
                        name="radio-8"
                        className="radio radio-error"
                        onChange={() => setSelectedReason("no-facility")}
                    />
                    <a className="ml-[0.5rem] text-gray-500 mt-[0.05rem]">원하는 제휴 시설이 없음</a>
                    <input
                        type="radio"
                        name="radio-8"
                        className="radio radio-error ml-[2rem]"
                        onChange={() => setSelectedReason("low-usage")}
                    />
                    <a className="ml-[0.5rem] text-gray-500 mt-[0.05rem]">사용 빈도가 낮음</a>
                    <input
                        type="radio"
                        name="radio-8"
                        className="radio radio-error ml-[2rem]"
                        onChange={() => setSelectedReason("service-issue")}
                    />
                    <a className="ml-[0.5rem] text-gray-500 mt-[0.05rem]">고객 응대에 불만이 있음</a>
                    <input
                        type="radio"
                        name="radio-8"
                        className="radio radio-error ml-[2rem]"
                        onChange={() => setSelectedReason("other")}
                    />
                    <a className="ml-[0.5rem] text-gray-500 mt-[0.05rem]">기타</a>
                </div>
                <div className="w-full border-b-2 border-red-400 mt-[1rem]"></div>
                <div className="flex flex-row w-full mt-[1rem] justify-center">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-error"
                        onChange={(e) => setIsChecked(e.target.checked)}
                    />
                    <a className="text-red-400 mt-[0.05rem] m-[1rem]">위 내용을 모두 확인하였으며, 회원 탈퇴합니다</a>
                </div>
                <div className="w-full flex justify-center">
                    <div
                        className={`flex items-center w-[8rem] h-[3rem] mt-[1rem] justify-center rounded-xl text-white cursor-pointer transition-transform ease-in-out duration-500 ${
                            isButtonEnabled
                                ? 'bg-red-400 hover:bg-white hover:text-red-400 hover:border hover:border-red-400 hover:scale-110'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={() => {
                            if (isButtonEnabled) {
                                setShowPopup(true); // 팝업 표시
                            }
                        }}
                    >
                        <a className="text-xl">회원 탈퇴</a>
                    </div>
                </div>
            </div>
            {showPopup && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center w-[25rem]">
                        <p className="text-lg font-bold mb-4">정말 탈퇴하시겠습니까?</p>
                        <div className="flex justify-around mt-4">
                            <button
                                className="px-8 py-2 bg-red-400 text-white rounded hover:bg-white hover:text-red-400 hover:scale-110 transition-transform ease-in-out duration-500"
                                onClick={() => {
                                    setShowPopup(false); // 팝업 닫기
                                    handleDelete(); // 탈퇴 실행
                                    goHome();
                                    handleLogout();
                                }}
                            >
                                예
                            </button>
                            <button
                                className="px-6 py-2 bg-white border border-red-400 text-red-400 hover:bg-red-400 hover:text-white rounded hover:scale-110 transition-transform ease-in-out duration-500"
                                onClick={() => setShowPopup(false)} // 팝업 닫기
                            >
                                아니오
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteUser;
