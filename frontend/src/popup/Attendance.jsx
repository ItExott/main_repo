import React, { useState, useEffect } from "react";
import 'react-calendar/dist/Calendar.css';
import { FaRegCircle } from "react-icons/fa6";
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

    const items = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,1,1,2,3];

    if (!isOpen) return null; // 팝업이 열려 있을 때만 렌더링

    return (
        /*다시보지 않음 체크창-시간설정 닫기버튼까지 아이콘변경 db에서 0부터 31까지 만든뒤 만약 db에 13이있다면 13번째 배열에 1넣고 아니라면 0*/
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 w-[80rem] h-[40rem] max-w-4xl rounded-xl shadow-2xl relative flex flex-col justify-between items-center overflow-hidden">
                <h3 className="text-xl font-bold mb-6 absolute top-4 left-1/2 transform -translate-x-1/2">출석체크</h3>

                {/* 캘린더 래퍼 */}
                <div
                    className="flex mt-[2.4rem] w-[35rem] h-[45rem] bg-no-repeat justify-center items-center overflow-auto bg-contain bg-[url('https://ifh.cc/g/xD2kY4.jpg')] ">

                    <div className="flex ml-[1.5rem] mt-[7.5rem] gap-0 grid grid-cols-7 w-[110rem] h-[25rem]"
                         >
                        {items.map((item, index) => (
                            <div
                                key={index} // 고유 키 필요
                                className="flex mb-[2rem]"
                            >
                                <FaRegCircle
                                    size="55"
                                    className={`text-black cursor-pointer ${item == 0  ? "invisible" : "visible"}`}
                                />

                            </div>
                        ))}
                    </div>
                </div>

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
