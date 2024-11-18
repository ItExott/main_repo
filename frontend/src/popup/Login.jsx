import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { RiKakaoTalkFill } from "react-icons/ri";
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios from 'axios';

const Login = ({ setLoginStatus }) => {
    const [ID, GetId] = useState('');
    const [PW, GetPw] = useState('');
    const [error, setError] = useState(''); // 에러 메시지 상태 추가
    const navigate = useNavigate();

    const closeModal = () => {
        const modal = document.getElementById('my_modal_3');
        modal.close(); // dialog.close()로 모달을 닫음
    };

    const JoinUs = () => {
        navigate('/Agree_to_terms');
        closeModal();
    };

    // 로그인 요청 함수
    const handleLogin = async () => {
        try {
            // 여기에 실제 로그인 API를 호출합니다.
            const response = await axios.post('http://localhost:8080/api/login', {
                id: ID,
                password: PW,
            });

            // 로그인 성공 시
            if (response.data.success) {

                setLoginStatus(true);  // 로그인 상태를 true로 변경
                console.log("여기옴")
                closeModal();  // 모달 닫기
                navigate('/');  // 로그인 후 홈 화면으로 이동
            } else {
                alert('아이디 또는 비밀번호가 틀렸습니다.');  // 로그인 실패 시 오류 메시지 설정
            }
        } catch (error) {
            alert('서버 오류가 발생했습니다. 다시 시도해주세요.');  // API 호출 오류 처리
        }
    };

    return (
        <div className="flex flex-col h-[34rem] bg-white items-center justify-center">
            <IoIosCloseCircleOutline
                onClick={closeModal}
                className="flex h-[2rem] mb-[2rem] ml-[31rem] w-[2rem] cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500"
            />

            <div className="flex flex-row w-[35rem] h-[11rem]">
                <div className="flex flex-col w-full h-full items-center">
                    <a className="flex font-bold text-xl text-black items-center justify-center">LOGIN</a>
                    <a className="flex text-gray-400 text-sm whitespace-nowrap mt-[0.4rem] items-center justify-center">
                        로그인하시면 다양하고 특별한 혜택을 이용할 수 있습니다
                    </a>

                    <input
                        type="text"
                        value={ID}
                        onChange={(e) => GetId(e.target.value)}
                        className="flex border-2 border-gray-400 text-sm font-normal w-[24rem] h-[3rem] mt-[0.8rem] placeholder-gray-300"
                        placeholder="아이디"
                    />
                    <input
                        type="password"
                        value={PW}
                        onChange={(e) => GetPw(e.target.value)}
                        className="flex border-2 border-gray-400 text-sm font-normal w-[24rem] h-[3rem] mt-[0.2rem] placeholder-gray-300"
                        placeholder="비밀번호"
                    />
                </div>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>} {/* 로그인 실패 시 오류 메시지 표시 */}
            <div className="flex flex-row mb-[1rem]">
                <input type="checkbox" className="checkbox rounded-none w-[1rem] h-[1rem]" />
                <a className="flex text-xs font-black ml-[0.3rem]">아이디 저장</a>
                <a className="flex text-xs font-black ml-[12.5rem]">Find ID/Find PW</a>
            </div>
            <div className="flex flex-col mt-[1.3rem] items-center justify-center">
                <div
                    className="flex w-[16rem] h-[3rem] cursor-pointer hover:scale-105 transition-transform ease-in-out duration-500 bg-gray-950 border-[0.1rem] border-blue-400 items-center justify-center"
                >
                    <a onClick={handleLogin} className=" bg-black text-white text-[1rem]">
                        LOGIN
                    </a>
                </div>

                <div
                    className="flex w-[16rem] h-[3rem] mt-[0.3rem] cursor-pointer hover:scale-105 transition-transform ease-in-out duration-500 bg-white border-[0.1rem] border-gray-400 items-center justify-center"
                >
                    <a onClick={JoinUs} className="text-[1rem]">
                        JOIN US
                    </a>
                </div>
                <div className="flex divider font-normal mt-[1.5rem] w-[25rem]">SNS LOGIN</div>
                <div className="flex flex-row items-center justify-center">
                    <RiKakaoTalkFill
                        className="h-[2.3rem] w-[2.3rem] ml-[0.7rem] mr-[1rem] fill-black bg-auto bg-yellow-300 rounded-2xl cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500"
                    />
                    <img
                        className="h-[2.8rem] w-[2.8rem] mr-[0.3rem] cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500"
                        src="https://ifh.cc/g/47H8yK.png"
                    />
                    <img
                        className="h-[3.5rem] w-[3.5rem] cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500"
                        src="https://ifh.cc/g/o7mRQT.png"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
