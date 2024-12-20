import React from "react";
import { useNavigate } from "react-router-dom";
import { CiCircleCheck } from "react-icons/ci";

const Complete_SignUp = () => {
    const navigate = useNavigate();
    const { name } = { name: "사용자" }; // 임시 이름 (실제 데이터는 백엔드에서 받아옵니다)

    const handleLoginRedirect = () => {
        // 로그인 페이지로 이동하면서 state로 로그인 모달 열기 정보를 전달
        navigate("/", { state: { openLoginModal: true } });
    };

    return (
        <div className="flex flex-col h-full items-center justify-center mx-44">
            <div className="flex flex-col justify-start w-[28rem] h-[40rem] mb-6 mt-[4rem] items-center">
                <h2 className="mb-5 font-bold font-sans text-3xl">가입완료</h2>
                <ul className="w-[45rem] steps">
                    <li className=" step step-error">약관동의</li>
                    <li className="step step-error">본인인증</li>
                    <li className="step step-error">정보입력</li>
                    <li className="step step-error">가입완료</li>
                </ul>
                <div className="flex items-center justify-center flex-col mt-[2rem]">

                    <img className="flex mb-[0.5rem]" src="/IMG/Complete_ICON.png"></img>
                    <h2 className="flex mt-4 mb-2 font-bold text-2xl">회원가입이 완료 되었습니다.</h2>
                    <h2 className="mb-14">{name}님 가입을 축하드립니다</h2>
                    <button
                        className="bg-red-400 text-white font-bold py-2 px-12 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        onClick={handleLoginRedirect}
                    >
                        LOGIN
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Complete_SignUp;
