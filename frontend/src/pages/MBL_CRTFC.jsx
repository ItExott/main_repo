import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MBL_CRTFC = () => {
    const [formData, setFormData] = useState({
        phoneNumber: '',
        inputCode: '',
        verificationCode: '',
    });

    const [errors, setErrors] = useState({});
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [codeGenerationTime, setCodeGenerationTime] = useState(null); // 인증 코드 생성 시간
    const [timeLeft, setTimeLeft] = useState(180); // 3분 (180초)
    const navigate = useNavigate();

    // 인증번호 생성 함수
        const generateVerificationCode = () => {
            if(validatePhoneNumber(formData.phoneNumber)){
                const randomCode = Math.floor(100000 + Math.random() * 900000); // 6자리 숫자
                alert(randomCode);

                setFormData({ ...formData, verificationCode: randomCode.toString() });
                setCodeGenerationTime(Date.now()); // 코드 생성 시간 기록
                setTimeLeft(180); // 타이머 초기화 (3분)
            }else{
                alert("전화번호를 다시 입력해주세요");
            }


        };

    const validatePhoneNumber = (phoneNumber) => {
        const phoneNumberRegex = /^010\d{8}$/;// 형식: 010-0000-0000 또는 010-000-0000

        return phoneNumberRegex.test(phoneNumber);
    };

    // 인증번호 확인 함수
    const handleVerifyCode = () => {
        const inputCodeNumber = Number(formData.inputCode); // 문자열을 숫자로 변환
        const verificationCodeNumber = Number(formData.verificationCode); // 문자열을 숫자로 변환
        if(formData.phoneNumber == '' || validatePhoneNumber(formData.phoneNumber) !== true  ){
            if(validatePhoneNumber(formData.phoneNumber) !== true){
                alert("전화번호를 올바르게 입력하십시오 전화번호 양식01000000000");
            }else{
                alert("전화번호를 입력하십시오.");
            }

        }else if(formData.verificationCode == ''){

            alert("인증번호가 입력되지않았습니다");

        }else{
            if (inputCodeNumber == verificationCodeNumber) {
                setIsCodeVerified(true);
                setErrors({ ...errors, inputCode: "인증되었습니다" });
            } else {
                setIsCodeVerified(false);
                setErrors({ ...errors, inputCode: "인증번호가 일치하지 않습니다." });
            }
        }



    };

    // 폼 검증 함수
    const validateForm = () => {
        const newErrors = {};

        if (!formData.phoneNumber) newErrors.phoneNumber = "휴대전화번호를 입력하세요.";
        if (!formData.inputCode) newErrors.inputCode = "인증번호를 입력하세요.";

        // 인증번호 확인
        if (formData.inputCode !== formData.verificationCode) {
            newErrors.inputCode = "인증번호가 일치하지 않습니다.";
        }

        // 인증번호 유효시간 체크 (3분)
        if (codeGenerationTime && Date.now() - codeGenerationTime > 180000) {
            newErrors.phoneNumber = "인증번호가 만료되었습니다. 다시 인증해주세요.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const generateRandomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 13; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    };

    // 시간 업데이트: 타이머가 0초까지 줄어들 때까지 매초 업데이트
    useEffect(() => {
        let timer;
        if (timeLeft > 0 && codeGenerationTime) {
            timer = setInterval(() => {
                const timePassed = Math.floor((Date.now() - codeGenerationTime) / 1000);
                setTimeLeft(180 - timePassed); // 남은 시간 계산
                const remainingTime = 180 - timePassed;
                if (remainingTime <= 0) {
                    setTimeLeft(0);
                    setFormData({ ...formData, verificationCode:generateRandomCode() }); // 인증번호 만료
                    clearInterval(timer); // 타이머 종료
                } else {
                    setTimeLeft(remainingTime); // 남은 시간 업데이트
                }
            }, 1000);
        }

        // 타이머 종료 후 정리
        if (timeLeft <= 0) {
            clearInterval(timer);
        }

        return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 클리어
    }, [timeLeft, codeGenerationTime]);

    const backpage = () => {
        navigate(-1);
    }
    const handleSubmit = () => {


        if(validatePhoneNumber(formData.phoneNumber) == false || isCodeVerified == false){
            if(validatePhoneNumber(formData.phoneNumber) == false){
                    alert("전화번호를 올바르게 입력하십시오.");
            }else if(isCodeVerified == false){
                    alert("인증되지 않았습니다 다시 인증해주십시오.")
            }

        }else{
            if (isCodeVerified) {
                navigate('/Agree_to_terms/MBL_CRTFC/SignUp', { state: { phoneNumber: formData.phoneNumber } });
            }else {
                alert("인증번호를 다시 확인해주십시오");
            }
        }




        // 여기서 회원가입 API 호출



    };

    return (
        <div className="flex flex-col h-full items-center justify-center mx-[24rem] rounded-3xl ">
            <div className="flex flex-col mb-[2rem] mt-[2rem] h-full items-center justify-center bg-white w-[65rem]  rounded-3xl ">
                <div className=" mb-4 font-bold  flex flex-row mt-6 h-11 w-[35rem] items-center justify-center text-xl">
                    <a className="mb-[1rem] font-bold">회원가입</a>
                </div>
                <ul className="w-[45rem] steps mb-[3rem]">
                    <li className="step step-error">약관동의</li>
                    <li className="step step-error">본인인증</li>
                    <li className="step">정보입력</li>
                    <li className="step">가입완료</li>
                </ul>
                <div className="flex flex-col bg-white p-3 rounded-xl shadow-md w-[30rem]">
                    <div className="flex mb-2 border-b w-full">
                        <h2 className="flex text-red-500 text-xl text-center mb-4 ml-[1.5rem] mt-[1.5rem]">전화번호 인증하기</h2>
                    </div>
                    <div className="flex mb-2">
                        <h2 className="flex p-2 text-xl w-[7.6rem] text-gray-500">휴대전화번호</h2>
                        <div className="flex h-[1.5rem] border-l border-gray-300 mt-[0.5rem]"></div>
                        <input
                            type="text"
                            placeholder="숫자만 입력하여 주십시오"
                            className="flex border-none outline-none p-2 w-[15.9rem] focus:ring-red-500 rounded mr-[0.5rem] ml-2"
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        />
                        <button className="flex bg-gray-300 text-gray-700 px-4 py-2 rounded" onClick={generateVerificationCode}>
                            인증
                        </button>
                    </div>

                    {/* 시간 표시 */}
                    {codeGenerationTime && timeLeft > 0 && (
                        <div className="text-sm text-gray-500 mt-2">
                            인증번호 유효시간: {Math.floor(timeLeft / 60)}분 {timeLeft % 60}초
                        </div>
                    )}
                    {timeLeft <= 0 && <div className="text-red-500 text-sm mt-2">인증번호가 만료되었습니다. 다시 인증해주세요.</div>}

                    <div className="flex mb-2">
                        <h2 className="flex ml-[2.1rem] p-2 text-xl w-[5.5rem] text-gray-500">인증번호</h2>
                        <div className="flex h-[1.5rem] border-l border-gray-300 mt-[0.5rem]"></div>
                        <input
                            type="text"
                            placeholder="입력하세요"
                            className="ml-[0.1rem] flex border-none outline-none p-2 w-[14.6rem] focus:ring-red-500 rounded mr-[0.5rem] ml-2"
                            onChange={(e) => setFormData({ ...formData, inputCode: e.target.value })}
                        />
                        <button className="flex bg-gray-300 text-gray-700 px-4 py-2 rounded" onClick={handleVerifyCode}>
                            인증확인
                        </button>
                    </div>


                    {
                        isCodeVerified === true ? (
                            <div className="text-blue-500 text-sm">{errors.inputCode}</div>
                        ) : isCodeVerified === false ? (
                            <div className="text-red-500 text-sm">{errors.inputCode}</div>
                        ) : null // 기본적으로 반환할 값이 없을 경우 null을 반환
                    }
                    <div className="flex justify-center">
                        <button className="flex bg-gray-300 justify-center text-gray-700 w-[9rem] rounded mr-[2rem]"
                                onClick={backpage}>&lt; 이전</button>
                        <button
                            className="flex bg-red-500 justify-center w-[9rem] text-white rounded"
                            onClick={handleSubmit}
                        >
                            다음 &gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MBL_CRTFC;
