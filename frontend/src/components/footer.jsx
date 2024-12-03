import React from "react";

const Footer = () => {
    return (
        <footer className="shadow-md mt-[10rem] py-8">
            <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-start gap-8">

                {/* ABOUT US */}
                <div className="flex-1 min-w-[200px] text-center md:text-left">
                    <h4 className="text-lg font-semibold text-red-400 mb-2">ABOUT US</h4>
                    <p className="text-gray-600">㈜ FIT PLAY</p>
                    <p className="text-gray-600">서울시 성남구 광명로 377 롯데타워 750층</p>
                    <p className="text-gray-600">대표이사: 하성훈</p>
                    <p className="text-gray-600">사업자번호: 220-81-35247</p>
                    <p className="text-gray-600">통신판매번호: 제2024-서울성남구-2114호</p>
                </div>

                {/* C/S CENTER */}
                <div className="flex-1 min-w-[200px] text-center md:text-left">
                    <h4 className="text-lg font-semibold text-red-400 mb-2">C/S CENTER</h4>
                    <p className="text-gray-600">1800-2401</p>
                    <p className="text-gray-600">OPEN 09:00~18:00</p>
                    <p className="text-gray-600">BREAK 12:00~13:00</p>
                    <p className="text-gray-600">KAKAOTALK 상담 가능</p>
                </div>

                {/* 계좌 정보 */}
                <div className="flex-1 min-w-[200px] text-center md:text-left">
                    <h4 className="text-lg font-semibold text-red-400 mb-2">C/S CENTER</h4>
                    <p className="text-gray-600">국민 424002-01-400907 &nbsp;&nbsp;&nbsp;&nbsp;우리 1002-750-900451</p>
                    <p className="text-gray-600">기업 30219-42-3045-51 &nbsp;&nbsp;&nbsp;&nbsp;기업 100-101-50089</p>
                    <p className="text-gray-600">신한 1320-997-84116&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;카카오 3333-22-4114142</p>
                    <p className="text-gray-600">예금주: ㈜ FIT PLAY</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
