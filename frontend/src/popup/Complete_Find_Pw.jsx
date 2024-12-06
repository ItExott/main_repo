import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
const  Complete_Find_Pw = ({ userPw, isOpen  }) => {


    const navigate = useNavigate();
    // userId를 props로 직접 전달받았으므로, userProfile에서 가져오는 방식은 불필요
    // const userId = userProfile?.userId;  // 이 줄은 제거해야 함


    const handlegoFindPw = () => {
        navigate('/Find_Pw');
    }


    const handlegoLogin = () => {
        // 모달 표시
        const modal = document.getElementById("my_modal_3");
        if (modal) {
            modal.showModal(); // 모달 열기
        } else {
            console.error("my_modal_3 ID를 가진 모달을 찾을 수 없습니다.");
        }

        // 페이지 이동
        navigate('/');
    };

    // "오늘 하루 보지 않기" 설정이 되어 있으면 모달을 띄우지 않음
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="text-center bg-white p-6 rounded shadow-md w-[20rem]">
                <p className="text-red-400 text-sm mb-2">본인 인증이 완료되었습니다.</p>
                <p className="text-gray-700 mb-2">
                    고객님의 비밀번호는 <span className="text-red-500 font-bold text-lg">{userPw}</span> 입니다.
                </p>
                <p className="text-gray-400 text-sm mb-2">임시 비밀번호는 꼭 회원정보 수정에서 <br/>비밀번호를 변경해주시길 바랍니다.</p>
                <button onClick={handlegoLogin}
                        className="bg-red-400 text-white py-2 px-6 rounded-md hover:bg-red-500 mb-3">
                    로그인
                </button>
            </div>
        </div>
    );
};

export default Complete_Find_Pw;