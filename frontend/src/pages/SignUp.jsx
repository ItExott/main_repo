import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
    const [formData, setFormData] = useState({
        userType: "individual",  // 기본값을 개인회원으로 설정
        userId: "",
        password: "",
        passwordConfirm: "",
        address: "",
        phoneNumber: "",
        email: "",  // 이메일은 필수 항목에서 제외
        name: "",
        phonePrefix: "010", // 전화번호 앞자리 선택 초기화
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();  // useNavigate 훅을 사용해 페이지 이동 처리

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePhonePrefixChange = (e) => {
        const { value } = e.target;
        setFormData({
            ...formData,
            phonePrefix: value,  // 앞자리 변경
            phoneNumber: `${value}-${formData.phoneNumber.split('-')[1]}`,  // 앞자리 변경 시 뒤에도 반영
        });
    };

    const validateForm = () => {
        const newErrors = {};

        // 필수 항목 체크
        if (!formData.userId) newErrors.userId = "아이디를 입력하세요.";
        if (!formData.password) newErrors.password = "비밀번호를 입력하세요.";
        if (!formData.passwordConfirm) newErrors.passwordConfirm = "비밀번호 확인을 입력하세요.";
        if (!formData.address) newErrors.address = "주소를 입력하세요.";
        if (!formData.phoneNumber) newErrors.phoneNumber = "휴대전화 번호를 입력하세요.";
        if (!formData.name) newErrors.name = "이름을 입력하세요.";

        // 비밀번호 확인
        if (formData.password && formData.password !== formData.passwordConfirm) {
            newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
        }

        // 비밀번호 강도 체크 (대소문자, 숫자, 특수문자 포함 8자 이상)
        const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (formData.password && !passwordRegEx.test(formData.password)) {
            newErrors.password = "비밀번호는 대소문자, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.";
        }

        // 휴대폰 번호 체크 (010-xxxx-xxxx 형태)
        const phoneRegEx = /^\d{3}-\d{4}-\d{4}$/;
        if (formData.phoneNumber && !phoneRegEx.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "올바른 휴대전화 번호 형식을 입력하세요. (예: 010-1234-5678)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 유효성 검사
        if (!validateForm()) {
            return;
        }

        // 백엔드로 데이터 전송
        axios.post("http://localhost:8080/api/signup", formData)
            .then(response => {
                if (response.data.success) {
                    // 성공적으로 회원가입 후 Complete_SignUp 페이지로 이동하면서 이름 전달
                    navigate('/Complete_SignUp', {
                        state: { name: formData.name }  // state로 이름 전달
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
        <div className="flex flex-col h-full items-center justify-center mx-56">
            <div className="flex flex-row mt-6 h-11 w-[35rem] items-center justify-center text-xl">
                회원가입
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col w-[60rem] h-auto mt-6 p-4 border border-gray-300">
                    <div className="mb-4 border border-gray-300 p-4 items-start">
                        <div className="text-left">회원구분</div>
                        <div className="flex flex-row items-start mt-2">
                            <label className="mr-4">
                                <input
                                    type="radio"
                                    name="userType"
                                    value="individual"
                                    checked={formData.userType === "individual"}
                                    onChange={handleChange}
                                />
                                개인회원
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="userType"
                                    value="gymManager"
                                    checked={formData.userType === "gymManager"}
                                    onChange={handleChange}
                                />
                                GYM 관리자
                            </label>
                        </div>
                    </div>

                    <div className="mb-4 mt-3">
                        <label>이름</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 p-2 w-full"
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>

                    <div className="mb-4 mt-3">
                        <label>사용자 아이디 (로그인 아이디)</label>
                        <input
                            type="text"
                            name="userId"
                            value={formData.userId}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 p-2 w-full"
                        />
                        {errors.userId && <p className="text-red-500">{errors.userId}</p>}
                    </div>

                    <div className="mb-4">
                        <label>비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 p-2 w-full"
                        />
                        {errors.password && <p className="text-red-500">{errors.password}</p>}
                    </div>

                    <div className="mb-4">
                        <label>비밀번호 확인</label>
                        <input
                            type="password"
                            name="passwordConfirm"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 p-2 w-full"
                        />
                        {errors.passwordConfirm && <p className="text-red-500">{errors.passwordConfirm}</p>}
                    </div>

                    <div className="mb-4">
                        <label>주소</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 p-2 w-full"
                        />
                        {errors.address && <p className="text-red-500">{errors.address}</p>}
                    </div>

                    <div className="mb-4">
                        <label>휴대전화</label>
                        <div className="flex">
                            <select
                                name="phonePrefix"
                                value={formData.phonePrefix}
                                onChange={handlePhonePrefixChange}
                                className="border border-gray-300 p-2 w-24"
                            >
                                <option value="010">010</option>
                                <option value="011">011</option>
                                <option value="016">016</option>
                                <option value="017">017</option>
                                <option value="018">018</option>
                                <option value="019">019</option>
                            </select>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                maxLength="13"
                                placeholder="1234-5678"
                                className="border border-gray-300 p-2 w-full ml-2"
                            />
                        </div>
                        {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber}</p>}
                    </div>

                    {/* 이메일은 필수 항목에서 제외 */}
                    <div className="mb-4">
                        <label>이메일</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full"
                        />
                    </div>
                </div>

                <div className="flex flex-row w-full h-[7rem] items-center justify-center">
                    <button type="submit" className="w-40 h-12 bg-black text-white">
                        회원가입
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignUp;
