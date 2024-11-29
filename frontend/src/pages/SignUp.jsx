import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import DaumPostcode from "react-daum-postcode";

const SignUp = () => {
    const [formData, setFormData] = useState({
        userId: "",
        userpw: "",
        passwordConfirm: "",
        address: "",
        phoneNumber: "",
        email: "",
        name: "",
        userType: "individual",
    });

    const [emailId, setemailid] = useState("");
    const [emailDomain, setemailDomain] = useState("other");
    const [firstaddress, setfirstaddress] = useState("");
    const [secondaddress, setsecondaddress] = useState("");
    const [isIdAvailable, setIsIdAvailable] = useState(null); // 아이디 사용 가능 여부
    const [idCheckMessage, setIdCheckMessage] = useState(""); // 중복 체크 메시지
    const location = useLocation();
    const [isadressModalOpen, setIsadressModalOpen] = useState(false);  // 팝업 상태
    const { phoneNumber } = location.state || { phoneNumber: "" }; // 전화번호 기본값 설정
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();  // useNavigate 훅을 사용해 페이지 이동 처리

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleChangeaddress = (e) => {
        const { value } = e.target;
        setsecondaddress(value); // 상세주소 상태 저장
    };

    const formatPhoneNumber = (number) => {
        if (number.length === 11 && /^\d{11}$/.test(number)) {
            return number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
        }
        return number;
    };

    const handleemailChange = (e) => {
        const { name, value } = e.target;

        if (name === "emailId") {
            setemailid(value);  // 이메일 아이디 업데이트
        } else if (name === "emailDomain") {
            setemailDomain(value);  // 이메일 도메인 업데이트
        }

        // emailId와 emailDomain을 결합하여 email 상태 업데이트
        setFormData({
            ...formData,
            email: emailId && emailDomain ? emailId + "@" + emailDomain : formData.email,
        });
    };

    const onaddress = () => {
        setIsadressModalOpen(true);
    };

    const handleSelectAddress = (data) => {
        const fullAddress = data.address;
        setfirstaddress(fullAddress);  // 주소를 firstaddress에 저장
        setIsadressModalOpen(false);  // 팝업 닫기
        setFormData({
            ...formData,
            address: fullAddress + " " + secondaddress,  // 상세주소와 합쳐서 업데이트
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.userId) newErrors.userId = "아이디를 입력하세요.";
        if (!formData.userpw) newErrors.userpw = "비밀번호를 입력하세요.";
        if (!formData.passwordConfirm) newErrors.passwordConfirm = "비밀번호 확인을 입력하세요.";
        if (!formData.name) newErrors.name = "이름을 입력하세요.";
        if (emailDomain === "other") newErrors.email = "이메일 주소를 입력해주세요";
        if (!emailId) {
            newErrors.email = "이메일을 입력하세요.";
        }

        if (!firstaddress || !secondaddress) {
            newErrors.address = "주소를 입력하세요.";
        }

        if (formData.userpw && formData.userpw !== formData.passwordConfirm) {
            newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
        }

        const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (formData.userpw && !passwordRegEx.test(formData.userpw)) {
            newErrors.userpw = "비밀번호는 대소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }


    const handleIdCheck = () => {
        if (!formData.userId) {
            setIdCheckMessage("아이디를 입력하세요.");
            setIsIdAvailable(false);
            return;
        }

        axios
            .post("http://localhost:8080/api/check-userId", { userId: formData.userId })
            .then((response) => {
                const { success, message } = response.data;
                setIdCheckMessage(message);
                setIsIdAvailable(success);
            })
            .catch((error) => {
                console.error("Error checking username:", error);
                if (error.response) {
                    // Handle error messages
                    setIdCheckMessage(error.response.data.message || "아이디 확인 중 오류가 발생했습니다.");
                } else {
                    setIdCheckMessage("아이디 확인 중 오류가 발생했습니다.");
                }
                setIsIdAvailable(false);
            });
    };





    const handleSubmit = (e) => {
        e.preventDefault();

        // 유효성 검사
        if (!validateForm()) {
            return;
        }

        const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

        setFormData({
            ...formData,
            address: firstaddress + " " + secondaddress,
            phoneNumber: formattedPhoneNumber,
        });


        // 백엔드로 데이터 전송
        axios.post("http://localhost:8080/api/signup", formData)
            .then(response => {
                if (response.data.success) {
                    navigate('/Complete_SignUp', {
                        state: { name: formData.name }
                    });
                } else {
                    alert("회원가입 실패");
                }
            })
            .catch(error => {
                console.error("회원가입 오류:", error);
                alert("회원가입 중 오류가 발생했습니다.");
            });
    };



    return (


            <div className="flex flex-col h-full items-center justify-center mx-[24rem] rounded-3xl ">


                    {isadressModalOpen && (
                        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 z-50 flex items-center justify-center">
                            <div className="bg-white p-4 rounded-xl shadow-lg w-[50%]">
                                <DaumPostcode
                                    onComplete={handleSelectAddress}  // 주소 선택 후 호출되는 이벤트
                                    autoClose={false} // 주소 선택 후 자동으로 모달을 닫지 않음
                                />
                                <button
                                    onClick={() => setIsadressModalOpen(false)}
                                    className="absolute top-2 right-2 text-red-500"
                                >
                                    X
                                </button>
                            </div>
                        </div>
                    )}

                <div
                    className="flex flex-col mb-[2rem] mt-[2rem] h-full items-center justify-center bg-white w-[65rem]  rounded-3xl ">
                    <div
                        className="border-gray-950 font-bold  flex flex-row mt-6 h-11 w-[35rem] items-center justify-center text-xl">

                        <a className="mb-[1rem] text-3xl font-bold">회원가입</a>
                    </div>
                    <ul className="w-[45rem] steps mb-[2rem]">
                        <li className=" step step-error">약관동의</li>
                        <li className="step step-error">본인인증</li>
                        <li className="step step-error">정보입력</li>
                        <li className="step">가입완료</li>
                    </ul>
                    <div className="flex w-[40rem] justify-center items-center shadow-xl border border-gray-100 rounded-lg">


                            <div className="flex flex-col w-[25rem] h-auto mt-6 p-4">
                                <div className="mb-4 items-start">
                                    <div className="text-left text-lg">회원구분</div>
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

                                <div className="flex mb-2">
                                    <a className="flex p-2 text-lg w-[8rem] text-gray-500">이름</a>
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
                                {errors.name && <p className="text-red-500">{errors.name}</p>}
                                <div className="flex mb-2">
                                    <a className="flex p-2 text-lg w-[8rem] text-gray-500">아이디</a>
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
                                    <button
                                        type="button"
                                        onClick={handleIdCheck}
                                        className="flex ml-[0.5rem] bg-red-400 text-white w-[5rem] p-2 rounded-md h-[3rem] items-center justify-center"
                                    >
                                        중복확인
                                    </button>

                                </div>
                                {idCheckMessage && (
                                    <div className={`text-sm ${isIdAvailable ? 'text-green-500' : 'text-red-500'}`}>
                                        {idCheckMessage}
                                    </div>)}
                                {errors.userId && <p className="text-red-500">{errors.userId}</p>}
                                <div className="flex mb-2">
                                    <a className="flex p-2 text-lg w-[8rem] text-gray-500">비밀번호</a>
                                    <div className="flex h-[1.5rem] border-l border-gray-300 mt-[0.5rem]"></div>
                                    <input
                                        placeholder="비밀번호"
                                        type="password"
                                        name="userpw"
                                        value={formData.userpw}
                                        onChange={handleChange}
                                        required
                                        className="flex border-none outline-none p-2 w-[15.9rem] focus:ring-red-500 rounded mr-[0.5rem] ml-2"

                                    />


                                </div>
                                {errors.userpw && <p className="text-red-500">{errors.userpw}</p>}

                                <div className="flex mb-2">
                                    <a className="flex p-2 text-lg w-[8rem] text-gray-500">비밀번호 확인</a>
                                    <div className="flex h-[1.5rem] border-l border-gray-300 mt-[0.5rem]"></div>
                                    <input
                                        placeholder="비밀번호 확인"
                                        type="password"
                                        name="passwordConfirm"
                                        value={formData.passwordConfirm}
                                        onChange={handleChange}
                                        required
                                        className="flex border-none outline-none p-2 w-[15.9rem] focus:ring-red-500 rounded mr-[0.5rem] ml-2"

                                    />


                                </div>
                                {errors.passwordConfirm && <p className="text-red-500">{errors.passwordConfirm}</p>}
                                <div className="flex-row flex h-[6rem]">
                                    <div className="flex-col flex mb-[0.3rem] border border-red-300 rounded ">

                                        <div className="  rounded h-1/2 border-b border-red-300 ">
                                            <a
                                                className=" flex border-none outline-none p-2 w-[15.9rem] focus:ring-red-500 rounded mt-[0.2rem]"
                                            >{firstaddress}</a>

                                        </div>






                                        <div className="flex h-1/2">

                                            <input
                                                placeholder="상세주소 입력"
                                                type="text"
                                                name="preciseaddress"
                                                value={secondaddress}
                                                onChange={handleChangeaddress}
                                                required
                                                className="flex border-none outline-none p-2 w-[16.5rem] focus:ring-red-500 rounded h-full"
                                            />



                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={onaddress}
                                    className="flex ml-[0.5rem] bg-red-400 text-white w-[5rem] p-2 rounded-md h-[3rem] items-center justify-center"
                                >
                                    주소 입력
                                </button>
                                </div>
                                {errors.address && <p className="text-red-500">{errors.address}</p>}
                                <div className="mb-2 mt-[1rem]">

                                    <div className="flex ">
                                        <a className="flex p-2 text-lg w-[5rem] text-gray-500">전화번호</a>
                                        <div
                                            className="flex h-[1.5rem] border-l border-gray-300 mt-[0.5rem] mr-[1rem] ml-[2.1rem]"></div>
                                        <a className="flex mt-[0.6rem]">{formatPhoneNumber(phoneNumber)}</a>
                                    </div>
                                    {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber}</p>}
                                </div>

                                {/* 이메일은 필수 항목에서 제외 */}
                                <div className="flex mt-2">
                                    <input
                                        type="text"
                                        name="emailId"
                                        value={emailId}  // emailId로 값 설정
                                        onChange={handleemailChange}
                                        className="flex p-2 w-40 focus:ring-red-500 rounded border-none outline-none"
                                        placeholder="이메일 입력"
                                    />
                                    <span className="mr-[0.5rem] ml-[0.5rem] mt-[0.3rem] text-2xl">@</span>
                                    {emailDomain === 'other' && (
                                        <input
                                            type="text"
                                            name="emailDomain"
                                            value={emailDomain}  // emailDomain으로 값 설정
                                            onChange={handleemailChange}
                                            className=" p-2 w-40 focus:ring-red-500 rounded border-none outline-none mr-[0.2rem]"
                                            placeholder="도메인 입력"
                                        />
                                    )}
                                    <select
                                        name="emailDomain"
                                        value={emailDomain}  // emailDomain으로 값 설정
                                        onChange={handleemailChange}
                                        className=" p-2 w-40 focus:ring-red-500 rounded border-none outline-none"
                                    >
                                        <option value="other">직접 입력</option>
                                        <option value="gmail.com">gmail.com</option>
                                        <option value="naver.com">naver.com</option>
                                        <option value="option.com">daum.net</option>
                                        <option value="option.com">hanmail.net</option>
                                        <option value="option.com">kakao.com</option>

                                    </select>
                                </div>
                                {errors.email && <p className="text-red-500">{errors.email}</p>}
                                <div className="flex flex-row w-full h-[7rem] items-center justify-center">
                                    <button type="submit" className=" bg-red-400 w-40 h-12 bg-black text-white" onClick={handleSubmit}>
                                        회원가입
                                    </button>
                                </div>
                            </div>


                    </div>

                </div>

            </div>

        );
    };

    export default SignUp;
