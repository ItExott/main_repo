import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCamera } from "react-icons/fa";
import {useNavigate} from "react-router-dom";

const ChangeUser = () => {
    const [userData, setUserData] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [emailId, setEmailId] = useState('');
    const [emailDomain, setEmailDomain] = useState('other');
    const [isPWOpen, setIsPWOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const navigate = useNavigate();

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handlePWToggle = () => {
        setIsPWOpen(!isPWOpen);
    };

    const handlePasswordChange = async () => {
        // 현재 비밀번호가 일치하는지 서버에서 확인
        const isCurrentPasswordCorrect = await checkCurrentPassword(currentPassword);
        if (!isCurrentPasswordCorrect) {
            setErrorMessage("현재 비밀번호가 일치하지 않습니다.");
            setIsMessageVisible(true);
            setTimeout(() => {
                setIsMessageVisible(false);
                setErrorMessage('');
            }, 3000); // 3초 후에 메시지 지우기
            return;
        }

        // 새 비밀번호와 확인 비밀번호가 일치하는지 확인
        if (newPassword !== confirmPassword) {
            setErrorMessage("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
            setIsMessageVisible(true);
            setTimeout(() => {
                setIsMessageVisible(false);
                setErrorMessage('');
            }, 3000);
            return;
        }

        // 새 비밀번호 길이 체크 (옵션)
        if (newPassword.length < 6) {
            setErrorMessage("새 비밀번호는 최소 6자 이상이어야 합니다.");
            setIsMessageVisible(true);
            setTimeout(() => {
                setIsMessageVisible(false);
                setErrorMessage('');
            }, 3000);
            return;
        }

        // 비밀번호 변경 요청
        try {
            const response = await axios.put('http://localhost:8080/api/updatePassword', {
                currentPassword,
                newPassword,
            }, {
                withCredentials: true,
            });

            if (response.status === 200) {
                // 비밀번호 변경 성공
                setIsPWOpen(false);

                setUserData((prevData) => ({
                    ...prevData,
                    userpw: newPassword,  // 새로운 비밀번호로 userpw 업데이트
                }));
            } else {
                setErrorMessage("비밀번호 변경에 실패했습니다.");
                setIsMessageVisible(true);
                setTimeout(() => {
                    setIsMessageVisible(false);
                    setErrorMessage('');
                }, 3000);
            }
        } catch (error) {
            console.error("Error updating password:", error);
            setErrorMessage("비밀번호 업데이트 중 오류가 발생했습니다.");
            setIsMessageVisible(true);
            setTimeout(() => {
                setIsMessageVisible(false);
                setErrorMessage('');
            }, 3000);
        }
    };

// 서버에서 현재 비밀번호가 맞는지 확인하는 함수
    const checkCurrentPassword = async (password) => {
        try {
            const response = await axios.post('http://localhost:8080/api/checkPassword', {
                currentPassword: password,
            }, {
                withCredentials: true,
            });

            return response.data.isCorrect; // 서버에서 받은 값이 맞는지 확인
        } catch (error) {
            console.error("Error checking current password:", error);
            return false;
        }
    };

    const handleEmailToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    useEffect(() => {
        // 유저 데이터 불러오기
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/userinfo', {withCredentials: true});
                setUserData(response.data);
                setEmailId(response.data.email.split('@')[0]);
                setEmailDomain(response.data.email.split('@')[1]);
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };
        fetchUserData();
    }, []);

    const handleEmailChange = (event) => {
        const { name, value } = event.target;
        if (name === "emailId") {
            setEmailId(value);  // 이메일 아이디 업데이트
        } else if (name === "emailDomain") {
            setEmailDomain(value);  // 이메일 도메인 업데이트
        }
    };

    const handleSaveEmail = async () => {
        const newEmail = `${emailId}@${emailDomain}`;  // 이메일 아이디와 도메인 결합
        console.log("새로운 이메일:", newEmail);  // 이메일 값 확인

        try {
            const response = await axios.put('http://localhost:8080/api/updateEmail', {
                email: newEmail,  // 새로운 이메일 주소
            }, {
                withCredentials: true,  // 쿠키가 포함된 요청
            });

            if (response.status === 200) {
                // 이메일 업데이트 성공
                setUserData((prevData) => ({
                    ...prevData,
                    email: newEmail,
                }));
                handleEmailToggle();  // 모달 닫기
                alert("이메일이 성공적으로 변경되었습니다.");
            } else {
                alert("이메일 변경에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error updating email:", error);
            alert("이메일 업데이트 중 오류가 발생했습니다.");
        }
    };

    const handleImageChange = async (event) => {
        const formData = new FormData();
        formData.append("profileImg", event.target.files[0]);

        try {
            // 이미지 업로드
            const response = await axios.post('http://localhost:8080/api/upload', formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,  // 세션 쿠키를 전달하려면 필요합니다.
            });

            const imageUrl = response.data.url;

            // DB에 경로 업데이트
            await axios.put('http://localhost:8080/api/updateProfile', {
                profileimg: imageUrl
            }, { withCredentials: true });

            // 세션 값 갱신 (현재 클라이언트에 있는 사용자 정보 업데이트)
            setUserData((prevData) => ({ ...prevData, profileimg: imageUrl }));

        } catch (error) {
            console.error("Error uploading image", error);
        }
    };


    if (!userData) {
        return <div>Loading...</div>; // userData가 로드되기 전까지는 로딩 화면 표시
    }

    const formatPhoneNumber = (phoneNumber) => {
        const cleaned = ('' + phoneNumber).replace(/\D/g, ''); // 숫자만 남기고 제거
        const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`; // 010-1234-1234 형식
        }
        return phoneNumber; // 유효하지 않으면 원래 값을 반환
    };

    const formattedPhoneNumber = formatPhoneNumber(userData.phonenumber);

    const goMyPage = () => navigate("/MyPage");

    return(
        <div className="flex flex-col mt-[1rem] h-full items-center justify-center mx-28"> {/* 전체 틀 */}
            <a className="flex items-center text-red-400 w-[62rem] font-bold text-xl justify-center">회원정보
                수정</a> {/* 상단 바 */}
            <div className="w-[62rem] border-b-2 border-red-400 mt-4"></div>
            {/* 상단 라인 */}

            <div className="flex flex-col w-[50rem] h-full shadow-xl mt-6"> {/* 세부 내용 틀 */}
                <div className="flex flex-col w-full h-[15rem] items-center justify-center"> {/* 프로필 이미지 칸 */}
                    <img className="flex w-[10rem] h-[10rem] border border-red-400 shadow-md rounded-full"
                         src={`http://localhost:8080${userData.profileimg}`}/> {/* 프로필 이미지 */}
                    <div
                        onClick={() => document.getElementById('fileInput').click()}
                        className="flex w-[8rem] h-[2rem] mt-2 border border-red-400 rounded-lg items-center justify-center cursor-pointer hover:fill-white hover:text-white hover:bg-red-400 hover:scale-110 transition-transform ease-in-out duration-500"> {/* 사진 업로드 버튼 */}
                        <FaCamera className="w-[1.5rem] h-[1.5rem] mr-[0.5rem]"/>
                        <a className="mt-[0.185rem]">사진 올리기</a>
                    </div>
                    <input
                        id="fileInput"
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                </div>
                <div className="flex flex-col w-full rounded-3xl h-full mt-[1rem] shadow-md"> {/* 개인정보 변경 칸 */}
                    <div className="flex flex-row h-[4rem] shadow-md rounded-3xl items-center">
                        <div className="flex w-[8rem] h-full items-center justify-center"><a
                            className="flex mt-[0.1rem] items-center text-red-400 justify-center text-xl">이름</a>
                        </div>
                        <div className="flex border-r-2 h-[2rem] border-red-400"></div>
                        <a className="ml-[2rem] mt-[0.1rem] text-xl">{userData.name}</a>
                    </div>
                    <div className="flex flex-row h-[4rem] shadow-md rounded-3xl items-center ">
                        <div className="flex w-[8rem] h-full items-center justify-center"><a
                            className="flex mt-[0.1rem] items-center text-red-400 justify-center text-xl">전화번호</a>
                        </div>
                        <div className="flex border-r-2 h-[2rem] border-red-400"></div>
                        <a className="ml-[2rem] mt-[0.1rem] text-xl">{formattedPhoneNumber}</a>
                    </div>
                    <div className="flex flex-row h-[4rem] shadow-md rounded-3xl items-center ">
                        <div className="flex w-[8rem] h-full items-center justify-center"><a
                            className="flex mt-[0.1rem] items-center text-red-400 justify-center text-xl">이메일</a>
                        </div>
                        <div className="flex border-r-2 h-[2rem] border-red-400"></div>
                        <a className="ml-[2rem] mt-[0.1rem] text-xl">{userData.email}</a>
                        <div
                            onClick={handleEmailToggle}
                            className="flex h-[2rem] w-[6rem] ml-auto mr-[2rem] items-center justify-center text-white bg-red-400 hover:bg-white hover:text-red-400 rounded-xl hover:border hover:border-red-400 cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500">
                            <a>이메일 변경</a></div>
                    </div>
                    {isModalOpen && (
                        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white w-[30rem] p-6 rounded-lg shadow-lg flex flex-col items-center">
                                <h2 className="text-xl font-bold text-red-400 mb-4">이메일 변경</h2>

                                <div className="flex border border-gray-300 rounded-lg p-2 w-full mb-4">
                                    <input
                                        type="text"
                                        name="emailId"
                                        value={emailId}  // emailId로 값 설정
                                        onChange={handleEmailChange}
                                        className="flex p-2 w-full focus:ring-red-500 rounded border-none outline-none"
                                        placeholder="이메일 입력"
                                    />
                                    <span className="mr-[0.5rem] ml-[0.5rem] mt-[0.3rem] text-2xl">@</span>
                                    {emailDomain === 'other' && (
                                        <input
                                            type="text"
                                            name="emailDomain"
                                            value={emailDomain}  // emailDomain으로 값 설정
                                            onChange={handleEmailChange}
                                            className=" p-2 w-full focus:ring-red-500 rounded border-none outline-none mr-[0.2rem]"
                                            placeholder="도메인 입력"
                                        />
                                    )}
                                    <select
                                        name="emailDomain"
                                        value={emailDomain}  // emailDomain으로 값 설정
                                        onChange={handleEmailChange}
                                        className=" p-2 w-full focus:ring-red-500 rounded border-none outline-none"
                                    >
                                        <option value="other">직접 입력</option>
                                        <option value="gmail.com">gmail.com</option>
                                        <option value="naver.com">naver.com</option>
                                        <option value="option.com">daum.net</option>
                                        <option value="option.com">hanmail.net</option>
                                        <option value="option.com">kakao.com</option>

                                    </select>
                                </div>
                                <div className="flex justify-end w-full">
                                    <button
                                        onClick={handleEmailToggle}
                                        className="bg-white border border-red-400 hover:scale-110 transition-transform ease-in-out duration-500 text-red-400 hover:bg-red-400 hover:text-white py-2 px-4 rounded-lg mr-2"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={handleSaveEmail}
                                        className="bg-red-400 hover:bg-white hover:text-red-400 hover:scale-110 transition-transform ease-in-out duration-500 text-white py-2 px-4 rounded-lg"
                                    >
                                        저장
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {isPWOpen && (
                        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white w-[30rem] p-6 rounded-lg shadow-lg flex flex-col items-center">
                                <h2 className="text-xl font-bold text-red-400 mb-4">비밀번호 변경</h2>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full p-2 mb-4 border rounded"
                                    placeholder="현재 비밀번호"
                                />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-2 mb-4 border rounded"
                                    placeholder="새 비밀번호"
                                />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-2 mb-4 border rounded"
                                    placeholder="비밀번호 확인"
                                />
                                <div className="w-full flex justify-center">
                                    <div
                                        onClick={handlePasswordChange}
                                        className="flex w-[8rem] h-[2rem] bg-red-400 rounded-xl items-center justify-center cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500">
                                        <a className="text-white">변경</a>
                                    </div>
                                </div>
                                {isMessageVisible && (
                                    <div className="text-red-400 mt-2 text-center">
                                        {errorMessage}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="flex flex-row h-[4rem] shadow-md rounded-3xl items-center ">
                        <div className="flex w-[8rem] h-full items-center justify-center"><a
                            className="flex mt-[0.1rem] items-center text-red-400 justify-center text-xl">아이디</a>
                        </div>
                        <div className="flex border-r-2 h-[2rem] border-red-400"></div>
                        <a className="ml-[2rem] mt-[0.1rem] text-xl">{userData.userId}</a>
                    </div>
                    <div className="flex flex-row h-[4rem] shadow-md rounded-3xl items-center ">
                        <div className="flex w-[8rem] h-full items-center justify-center"><a
                            className="flex mt-[0.1rem] items-center text-red-400 justify-center text-xl">비밀번호</a>
                        </div>
                        <div className="flex border-r-2 h-[2rem] border-red-400"></div>
                        <a className="ml-[2rem] mt-[0.1rem] text-xl">{userData.userpw}</a>
                        <div
                            onClick={handlePWToggle}
                            className="flex h-[2rem] w-[6rem] ml-auto mr-[2rem] items-center justify-center text-white bg-red-400 hover:bg-white hover:text-red-400 rounded-xl hover:border hover:border-red-400 cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500">
                            <a>비밀번호 변경</a></div>
                    </div>
                    <div className="flex flex-row h-[5rem] shadow-md rounded-3xl items-center">
                        <div className="flex w-[8rem] h-full items-center justify-center"><a
                            className="flex mt-[0.1rem] items-center text-red-400 justify-center text-xl">수신설정</a>
                        </div>
                        <div className="flex border-r-2 h-[2rem] border-red-400"></div>
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center h-full ml-[2rem]">
                                <input type="checkbox" className="checkbox checkbox-error"/>
                                <a className="text-lg ml-[1rem]">마케팅 목적의 개인정보 수집 및 이용 동의함</a>
                            </div>
                            <div className="flex flex-row items-center h-full ml-[2rem]">
                                <input type="checkbox" onChange={handleCheckboxChange}
                                       className="checkbox checkbox-error"/>
                                <a className="text-lg ml-[1rem]">광고성 정보 수신 동의함</a>
                                {isChecked && (
                                    <div className="flex flex-row ml-[1rem]">
                                        <input type="radio" name="radio-8"
                                               className="radio radio-error checked:bg-red-400"
                                               defaultChecked/>
                                        <a className="text-lg ml-[0.5rem]">SNS</a>
                                        <input type="radio" name="radio-8"
                                               className="radio radio-error ml-[1rem] checked:bg-red-400"/>
                                        <a className="text-lg ml-[0.5rem]">E-MAIL</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-[8rem] h-[5rem] items-center justify-center">
                <div
                    onClick={goMyPage}
                    className="flex items-center w-[8rem] h-[3rem] justify-center bg-red-400 rounded-xl text-white hover:bg-white hover:text-red-400 hover:border hover:border-red-400 cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500">
                    <a className="text-xl">수정정보 저장</a></div>
            </div>
        </div>
    )
}

export default ChangeUser;