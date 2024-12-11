import React, { useState } from "react";

const FAQPage = () => {
    // FAQ 데이터
    const [faqs, setFaqs] = useState([
        { category: "결제/환불", question: "취소/환불을 하고 싶어요.", answer: "환불은 구매 후 7일 이내에 가능합니다.", open: false },
        { category: "회원정보", question: "제가 구독한 짐을 확인하고 싶어요.", answer: "구독 짐 확인은 마이페이지 -> 구독 짐에서 확인 가능합니다.", open: false },
        { category: "회원정보", question: "아이디를 변경하고 싶어요.", answer: "아이디 변경은 고객센터에 문의해주세요.", open: false },
        { category: "등록/결제", question: "쿠폰을 사용하고 싶어요.", answer: "결제 페이지에서 쿠폰 코드를 입력하시면 적용됩니다.", open: false },
        { category: "회원정보", question: "회원을 탈퇴하고 싶어요.", answer: "마이페이지에서 회원 탈퇴 버튼을 클릭해주세요.", open: false },
        { category: "짐정보", question: "운동 시작일을 바꾸고 싶어요.", answer: "운동 시작일 변경은 마이페이지에서 가능합니다.", open: false },
    ]);

    const [filter, setFilter] = useState("주요질문"); // 카테고리 필터
    const [searchQuery, setSearchQuery] = useState(""); // 검색어
    const [openFAQ, setOpenFAQ] = useState(null); // 열린 FAQ를 추적

    // FAQ 클릭 핸들러
    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index); // 동일한 질문을 클릭하면 닫고, 다른 질문을 클릭하면 해당 질문을 열기
    };

    // 필터된 FAQ 리스트 - 질문만 검색
    const filteredFaqs = faqs.filter((faq) => {
        const matchesCategory =
            filter === "주요질문" || faq.category === filter;
        const matchesSearch = faq.question
            .toLowerCase()
            .includes(searchQuery.toLowerCase()); // 질문만 검색
        return matchesCategory && matchesSearch;
    });

    // 카테고리 필터 변경 시 FAQ 상태 초기화 (모든 FAQ 닫기)
    const handleCategoryChange = (category) => {
        setFilter(category);
        setOpenFAQ(null); // 카테고리 변경 시 열려 있는 FAQ를 닫음
    };

    return (
        <div className="min-h-screen bg-white py-6 shadow-lg">
            {/* 페이지 제목 */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-red-500">Q&A</h1>
                <p className="text-gray-500 mt-2">자주 묻는 질문을 확인해보세요.</p>
            </div>

            {/* 검색창 */}
            <div className="text-center mb-6">
                <input
                    type="text"
                    placeholder="무엇을 도와드릴까요?"
                    className="w-3/4 sm:w-1/2 p-2 bg-white border border-gray-300 rounded"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* 카테고리 필터 */}
            <div className="flex justify-center mb-4 space-x-4">
                {["주요질문", "결제/환불", "회원정보", "등록/결제", "짐정보"].map((cat) => (
                    <button
                        key={cat}
                        className={`px-4 py-2 text-sm font-semibold border-b-2 ${
                            filter === cat
                                ? "text-red-500 border-red-500"
                                : "text-gray-500 border-transparent"
                        }`}
                        onClick={() => handleCategoryChange(cat)} // 카테고리 변경 시 열려있는 FAQ 닫기
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* FAQ 목록 */}
            <div className="max-w-4xl mx-auto space-y-4">
                {filteredFaqs.map((faq, index) => (
                    <div
                        key={faq.question} // question을 고유한 key로 사용
                        className="border-b border-red-200 pb-2"
                    >
                        <button
                            className="w-full flex justify-between items-center text-left p-2 text-red-500 font-bold text-xl"
                            onClick={() => toggleFAQ(index)} // 클릭 시 해당 FAQ 열기/닫기
                        >
                            <span>Q. {faq.question}</span>
                            <span
                                className={`transition-transform transform ${
                                    openFAQ === index ? "rotate-180" : ""
                                }`}
                            >
                                ▼
                            </span>
                        </button>
                        {openFAQ === index && (
                            <p className="bg-white text-gray-700 p-4 ml-6 border border-gray-300 rounded-md shadow-sm">
                                {faq.answer}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQPage;
