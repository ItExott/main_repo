import React, {useState} from "react";
import {Link} from "react-router-dom";

const SignUp = () => {
    const [formData, setFormData] = useState({
        userType: "individual",
        phoneAuth: false,
        id: "",
        password: "",
        passwordConfirm: "",
        address: "",
        phoneNumber: "",
        email: "",
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 제출 처리 로직 추가
        console.log(formData);
    };

    return (
        <div className="flex flex-col h-full items-center justify-center mx-56">
            <div className="flex flex-row mt-6 h-11 w-[35rem] items-center justify-center text-xl">
                회원가입
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col w-[60rem] h-auto mt-6 p-4 border border-gray-300">
                    <div className="border border-grey-300">
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
                        <div className="mb-4">
                            <label>회원인증</label>
                            <div className="flex flex-col items-start mt-2">
                                <button className="mb-2">휴대폰 인증</button>
                                <label>본인 명의의 휴대폰으로 본인인증이 진행됩니다.</label>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full h-16"></div>
                    <h2 className="text-lg">기본 정보</h2>
                    <div className="border border-gray-300">

                        <div className="mb-4 mt-3">
                            <label>아이디</label>
                            <input
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 p-2 w-full"
                            />
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
                        </div>
                        <div className="mb-4">
                            <label>주소</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="border border-gray-300 p-2 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label>휴대전화</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="border border-gray-300 p-2 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label>이메일</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 p-2 w-full"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-row w-full h-[7rem] items-center justify-center  ">
                    <button type="submit" className="w-40 h-12 bg-black text-white">
                        submit
                    </button>

                </div>
            </form>

        </div>
    );
};

export default SignUp;
