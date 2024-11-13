import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Agree_to_terms = () => {
    const [isAgreeAll, setIsAgreeAll] = useState(false);
    const [isAgreeTerms1, setIsAgreeTerms1] = useState(false);
    const [isAgreeTerms2, setIsAgreeTerms2] = useState(false);
    const navigate = useNavigate();

    // 전체 동의 체크박스를 클릭하면, 개별 약관도 모두 체크됨
    const handleAgreeAllChange = () => {
        const newValue = !isAgreeAll;
        setIsAgreeAll(newValue);
        setIsAgreeTerms1(newValue);
        setIsAgreeTerms2(newValue);
    };

    // 개별 약관 체크박스 변경 시
    const handleTermsChange = (type) => {
        if (type === 1) {
            setIsAgreeTerms1(!isAgreeTerms1);
        } else if (type === 2) {
            setIsAgreeTerms2(!isAgreeTerms2);
        }
    };

    // '다음' 버튼 클릭 시 처리
    const handleNext = () => {
        if (isAgreeTerms1 && isAgreeTerms2) {
            navigate("/SignUp"); // 회원가입 페이지로 이동
        } else {
            alert("모든 약관에 동의해야 합니다.");
        }
    };

    return (
        <div className="flex flex-col h-full items-center justify-center mx-56 mt-6">
            {/* 약관 동의 제목 */}
            <div className="text-xl font-bold mb-4">
                <span>약관 동의</span>
            </div>

            {/* 약관 본문 */}
            <div
                className="flex flex-col w-full h-[60rem] mt-4 items-center justify-start border border-gray-300 rounded-lg p-6">
                {/* 전체 동의 체크박스 */}


                {/* 약관 1 */}
                <div className="flex flex-col w-full mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <input
                            type="checkbox"
                            checked={isAgreeTerms1}
                            onChange={() => handleTermsChange(1)}
                            className="checkbox"
                        />
                        <label className="text-md">이용약관</label>
                    </div>
                    {/* 빨간 박스 (약관 내용 표시) */}
                    <div className="w-full h-[20rem] bg-red-300 flex items-center justify-center p-4 rounded-lg">
                        <span className="text-white text-lg">이용약관 내용이 여기에 들어갑니다.</span>
                    </div>
                </div>

                {/* 약관 2 */}
                <div className="flex flex-col w-full mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <input
                            type="checkbox"
                            checked={isAgreeTerms2}
                            onChange={() => handleTermsChange(2)}
                            className="checkbox"
                        />
                        <label className="text-md">개인정보 처리방침</label>
                    </div>
                    {/* 빨간 박스 (약관 내용 표시) */}
                    <div className="w-full h-[20rem] bg-red-300 flex items-center justify-center p-4 rounded-lg">
                        <span className="text-white text-lg">개인정보 처리방침 내용이 여기에 들어갑니다.</span>
                    </div>
                </div>
                <div className="flex items-center space-x-2 mb-6">
                    <input
                        type="checkbox"
                        checked={isAgreeAll}
                        onChange={handleAgreeAllChange}
                        className="checkbox"
                    />
                    <label className="text-lg">전체 동의</label>
                </div>
            </div>

            {/* '다음' 버튼 */}
            <div className="flex w-full items-center justify-center mt-6">
                <button
                    onClick={handleNext}
                    type="button"
                    className="w-40 h-12 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default Agree_to_terms;