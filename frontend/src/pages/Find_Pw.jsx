import React, {useState, useEffect} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import Complete_Find_Pw from "../popup/Complete_Find_Pw.jsx";
import axios from "axios";


const Find_Pw = () => {
    const navigate = useNavigate();
    const [iscodegeneration, setcodegeneration] = useState(false)
    const [formData, setFormData] = useState({
        userId : "",
        name: "",
        phoneNumber:  "",
        inputCode: '',
        verificationCode: '',
        userType: "individual",
        tempPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const [iscompleteFindPw, setcompleteFindPw] = useState(false);
    const [errors, setErrors] = useState({});
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [codeGenerationTime, setCodeGenerationTime] = useState(null); // 인증 코드 생성 시간
    const [timeLeft, setTimeLeft] = useState(180); // 3분 (180초)

    // 인증번호 생성 함수
    const generateVerificationCode = () => {
        if(validatePhoneNumber(formData.phoneNumber)){
            const randomCode = Math.floor(100000 + Math.random() * 900000); // 6자리 숫자
            alert(randomCode);

            setFormData({ ...formData, verificationCode: randomCode.toString() });
            setCodeGenerationTime(Date.now()); // 코드 생성 시간 기록
            setTimeLeft(180); // 타이머 초기화 (3분)
            setcodegeneration(true);
        }else{
            alert("전화번호를 다시 입력해주세요");
        }


    };
    const formatPhoneNumber = (number) => {
        if (number.length === 11 && /^\d{11}$/.test(number)) {
            return number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
        }
        return number;
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
                setFormData({ ...formData, phoneNumber:formatPhoneNumber(formData.phoneNumber) })
                setIsCodeVerified(true);
                setErrors({ ...errors, inputCode: "인증되었습니다" });
            } else {
                setIsCodeVerified(false);
                setErrors({ ...errors, inputCode: "인증번호가 일치하지 않습니다." });
            }
        }



    };

    // 폼 검증 함수

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

    const handleSubmit = async () => {
        if (!isCodeVerified) {
            alert("인증되지 않았습니다. 다시 인증해주십시오.");
            return;
        }
        if (!formData.userId || !formData.name || !formData.phoneNumber) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        try {
            // 임시 비밀번호 생성 함수
            const generateTempPassword = () => {
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let password = '';
                for (let i = 0; i < 6; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    password += characters[randomIndex];
                }
                return password;
            };

            // 임시 비밀번호 생성
            const crttempPassword = generateTempPassword();

            // 서버에 POST 요청
            const response = await axios.post("http://localhost:8080/api/resetPassword", {
                userId: formData.userId,
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                tempPassword: crttempPassword, // 생성된 임시 비밀번호
            });

            console.log("요청 데이터:", {
                userId: formData.userId,
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                tempPassword: crttempPassword,
            });

            if (response.data.success) {
                setFormData({ ...formData, tempPassword: crttempPassword }); // formData에 임시 비밀번호 추가
                setcompleteFindPw(true);
            } else {
                alert(response.data.message || "아이디, 이름, 전화번호가 일치하지 않습니다.");
            }
        } catch (error) {
            console.error("API 호출 중 오류 발생:", error);
            alert("비밀번호 재설정 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };
    const handlegoFindId = () =>{
        navigate('/Find_Id')
    }


    return (


        <div>
            < Complete_Find_Pw
                isOpen={iscompleteFindPw}
                onClose={() => setcompleteFindPw(false)} // 팝업 닫기
                userPw={formData.tempPassword}
            />
            <div className="flex flex-col items-center w-full px-4 mt-[3rem]">

                <div className="flex flex-row items-center justify-center">
                    <a onClick={handlegoFindId} className="text-gray-400 text-xl  cursor-pointer font-bold mt-8 mb-6">아이디 찾기</a>
                    <h1 className="text-red-400 text-xl font-bold mt-8 mb-6 ml-[2rem] mr-[2rem]">/</h1>
                    <a className="text-red-400  cursor-pointer text-xl font-bold mt-8 mb-6">비밀번호 찾기</a>
                </div>
                <div className="bg-white shadow-md rounded-md p-6 w-[33rem]">
                    <div className="mb-4 items-start">
                        <div className="text-left text-2xl">회원구분</div>
                        <div className="flex flex-row items-start mt-2">
                            <label className="mr-4">
                                <input type="radio"
                                       name="userType"
                                       className="radio radio-error"
                                       value="individual"

                                       checked={formData.userType === "individual"}
                                       onChange={handleChange} defaultChecked/>


                                <a className="text-xs ml-[0.2rem]"> 개인회원</a>
                            </label>
                            <label>
                                <input type="radio"
                                       name="userType"
                                       value="gymManager"
                                       className="radio radio-error "
                                       onChange={handleChange}
                                       checked={formData.userType === "gymManager"}/>

                                <a className="text-xs  ml-[0.2rem]"> GYM 관리자</a>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex mb-2 ml-[3.6rem]">
                            <a className="flex p-2 text-lg w-[4rem] text-gray-500">아이디</a>
                            <div className="flex h-[1.5rem] border-l border-gray-300 mt-[0.5rem]"></div>
                            <input
                                placeholder="아이디"
                                type="text"
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                required
                                className="flex border-none outline-none p-2 w-[15.9rem] focus:ring-red-500 rounded mr-[0.5rem] ml-2"

                            />


                        </div>
                        <div className="flex mb-2 ml-[3.6rem]">
                            <a className="flex p-2 text-lg w-[4rem] text-gray-500">이름</a>
                            <div className="flex h-[1.5rem] border-l border-gray-300 mt-[0.5rem]"></div>
                            <input
                                placeholder="이름"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="flex border-none outline-none p-2 w-[15.9rem] focus:ring-red-500 rounded mr-[0.5rem] ml-2"

                            />


                        </div>


                        <div className="flex mb-2">
                            <h2 className="flex p-2 text-lg w-[7.6rem] text-gray-500">휴대전화번호</h2>
                            <div className="flex h-[1.5rem] border-l border-gray-300 mt-[0.5rem]"></div>
                            <input
                                type="text"
                                placeholder="숫자만 입력하여 주십시오"
                                className="flex border-none outline-none p-2 w-[15.9rem] focus:ring-red-500 rounded mr-[0.5rem] ml-2"
                                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                            />
                            <button className="flex bg-gray-300 text-gray-700 px-4 py-2 rounded"
                                    onClick={generateVerificationCode}>
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


                        <div className={`flex mb-2 ${iscodegeneration ? "visible" : "invisible"}`}>
                            <h2 className="flex ml-[2.1rem] p-2 text-xl w-[5.5rem] text-gray-500">인증번호</h2>
                            <div className="flex h-[1.5rem] border-l border-gray-300 mt-[0.5rem]"></div>
                            <input
                                type="text"
                                placeholder="입력하세요"
                                className="ml-[0.1rem] flex border-none outline-none p-2 w-[14.6rem] focus:ring-red-500 rounded mr-[0.5rem] ml-2"
                                onChange={(e) => setFormData({...formData, inputCode: e.target.value})}
                            />
                            <button className="flex bg-gray-300 text-gray-700 px-4 py-2 rounded"
                                    onClick={handleVerifyCode}>
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

                        <div className="flex justify-center items-center">
                            <button
                                className="flex bg-red-500 justify-center w-[9rem] text-white rounded"
                                onClick={handleSubmit}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Find_Pw;