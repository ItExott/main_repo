import React, { useState, useEffect } from "react";
import 'react-calendar/dist/Calendar.css';
import { FaRegCircle } from "react-icons/fa6";
import axios from "axios";

const Attendance = ({ userId, isOpen, onClose, onDateSelect }) => {

    const [items, setItems] = useState(Array(32).fill(0)); // 0으로 초기화된 배열 (0~31)
    const [dontShowToday, setDontShowToday] = useState(false); // "오늘 하루 보지 않기" 상태

    // userId를 props로 직접 전달받았으므로, userProfile에서 가져오는 방식은 불필요
    // const userId = userProfile?.userId;  // 이 줄은 제거해야 함

    // userId가 없는 경우, 출석 데이터를 요청하지 않도록 방지
    useEffect(() => {
        if (!userId) return; // userId가 없으면 API 요청하지 않음
        fetchAttendanceData(); // userId가 있으면 출석 데이터 불러오기
        checkDontShowToday(); // 로그인 시 오늘 하루 보지 않기 설정 체크
    }, [userId]);

    // 오늘 하루 보지 않기 설정을 서버에서 가져오기
    const checkDontShowToday = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/attendance/today/${userId}`);
            if (response.data.success && response.data.today === 1) {
                setDontShowToday(true);
            }
        } catch (error) {
            console.error("오늘 하루 보지 않기 설정 로드 실패:", error);
        }
    };

    // 출석 데이터를 가져오는 함수
    const fetchAttendanceData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/attendance/${userId}`);
            if (response.data.success) {
                const attendanceDays = response.data.days; // 출석한 날짜 배열
                const updatedItems = Array(32).fill(0); // 모든 날짜를 0으로 초기화
                attendanceDays.forEach(day => {
                    if (day >= 1 && day <= 31) {
                        updatedItems[day] = 1; // 출석한 날짜를 1로 표시
                    }
                });
                setItems(updatedItems); // 배열 업데이트
            }
        } catch (error) {
            console.error("출석 데이터 로드 실패:", error);
        }
    };

    // "오늘 하루 보지 않기" 체크박스를 클릭했을 때 처리
    const handleDontShowTodayChange = async () => {
        const newDontShowToday = !dontShowToday;
        setDontShowToday(newDontShowToday);

        // "오늘 하루 보지 않기"를 체크한 경우, 서버에 저장
        try {
            await axios.post(`http://localhost:8080/api/attendance/today`, {
                userId,
                today: newDontShowToday ? 1 : 0
            });
        } catch (error) {
            console.error("오늘 하루 보지 않기 설정 저장 실패:", error);
        }
    };

    // "오늘 하루 보지 않기" 설정이 되어 있으면 모달을 띄우지 않음
    if (!isOpen || dontShowToday) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 w-[80rem] h-[40rem] max-w-4xl rounded-xl shadow-2xl relative flex flex-col justify-between items-center overflow-hidden">

                {/* 캘린더 래퍼 */}
                <div className="flex w-[38rem] h-[45rem] bg-no-repeat justify-start items-start overflow-auto bg-contain bg-[url('https://ifh.cc/g/v3LcXf.png')]">
                    <div className="ml-[3.7rem] mt-[14.3rem] gap-0 grid grid-cols-7 w-[29.2rem] h-[21rem] cursor-default">
                        {items.map((item, index) => (
                            <div key={index} className="w-[3rem] cursor-default  h-[3rem]">
                                <img

                                     src="https://ifh.cc/g/cS80R0.png"
                                    className={`cursor-default w-[3rem] ${item === 1 ? "visible" : "invisible"}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* "오늘 하루 보지 않기" 체크박스 */}
                <div className="flex items-center mt-4">
                    <input
                        type="checkbox"
                        checked={dontShowToday}
                        onChange={handleDontShowTodayChange}
                        className="mr-2"
                    />
                    <span>오늘 하루 보지 않기</span>
                </div>

                {/* 모달 닫기 버튼 */}
                <button className="absolute top-2 right-2 text-xl" onClick={onClose}>
                    &times;
                </button>
            </div>
        </div>
    );
};

export default Attendance;
