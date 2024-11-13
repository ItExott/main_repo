// src/components/AttendancePopup.jsx

import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const Attendance = ({ isOpen, onClose, onDateSelect }) => {
    const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 상태

    useEffect(() => {
        // 팝업이 열릴 때마다 선택된 날짜를 초기화
        if (isOpen) {
            setSelectedDate(null); // 선택된 날짜 초기화
        }
    }, [isOpen]);

    const handleDateChange = (date) => {
        setSelectedDate(date); // 날짜 선택 시 상태 업데이트
        onDateSelect(date); // 부모 컴포넌트로 선택된 날짜 전달
        onClose(); // 팝업 닫기
    };

    if (!isOpen) return null; // 팝업이 열려 있을 때만 렌더링

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg relative">
                <h3 className="text-xl font-bold mb-4">출석체크</h3>
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                />
                <button
                    className="absolute top-2 right-2 text-xl"
                    onClick={onClose} // 팝업 닫기
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default Attendance;