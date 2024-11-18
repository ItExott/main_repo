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
            <div className="flex flex-col justify-start flex-row w-[28rem] h-[27rem] mb-6 mt-40 items-center">
                <h2 className="mb-9 font-bold font-sans text-3xl">Complete</h2>
                <CiCircleCheck size="150" className="ml-3 cursor-pointer mt-[0.06rem]" />
                <h2 className="flex mt-4 mb-2 font-bold text-2xl">회원가입이 완료 되었습니다.</h2>
                <h2 className="mb-14">{name}님 가입을 축하드립니다</h2>
                <button
                    className="bg-black text-white font-bold py-2 px-12 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    onClick={handleLoginRedirect}
                >
                    LOGIN
                </button>
            </div>
        </div>
    );
};

export default Complete_SignUp;
