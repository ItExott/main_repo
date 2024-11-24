import React, { useState, useEffect } from "react";
import axios from "axios";

const Buyform = () => {
    const [cartProducts, setCartProducts] = useState([]);
    const [activePaymentMethod, setActivePaymentMethod] = useState(null);
    const [selectedBank, setSelectedBank] = useState("농협은행");
    const [startDate, setStartDate] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGender, setSelectedGender] = useState("남성"); // 성별 선택 상태
    const [selectedCoupon, setSelectedCoupon] = useState(""); // 선택된 쿠폰
    const [isCouponPopupOpen, setIsCouponPopupOpen] = useState(false); // 쿠폰 팝업 상태

    const coupons = ["쿠폰 1", "쿠폰 2", "쿠폰 3"]; // 쿠폰 목록

    const toggleCouponPopup = () => {
        setIsCouponPopupOpen(!isCouponPopupOpen); // 팝업 열기/닫기
    };

    const handleCouponSelect = (coupon) => {
        setSelectedCoupon(coupon); // 쿠폰 선택
        setIsCouponPopupOpen(false); // 팝업 닫기
    };

    // 백엔드에서 장바구니 제품 정보 가져오기
    useEffect(() => {
        const fetchCartProducts = async () => {
            try {
                // Ensure credentials (cookies) are included in the request
                const response = await axios.get("http://localhost:8080/cart-products", {
                    withCredentials: true, // Ensure session cookie is sent
                });
                setCartProducts(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching cart products:", error);
                setError("장바구니 제품을 불러오는 데 실패했습니다.");
                setIsLoading(false);
            }
        };

        fetchCartProducts();
    }, []);

    const handlePaymentClick = (method) => {
        setActivePaymentMethod(activePaymentMethod === method ? null : method);
    };

    const handleDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleBankChange = (e) => {
        setSelectedBank(e.target.value);
    };

    const banks = [
        { name: "농협은행", account: "123-456-7890" },
        { name: "우리은행", account: "234-567-8901" },
        { name: "수협은행", account: "345-678-9012" },
    ];

    const totalPrice = cartProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
    const discountPrice = 12000; // 할인 금액

    return (
        <div className="flex flex-col mt-[1rem] h-full items-center justify-center mx-28">
            <a className="flex items-center w-[62rem] font-bold text-xl justify-center">구매 / 결제</a>
            <div className="w-[62rem] border-b-2 border-gray-950 mt-4"></div>

            {/* 로딩 또는 에러 처리 */}
            {isLoading ? (
                <p className="text-center mt-4">로딩 중...</p>
            ) : error ? (
                <p className="text-center mt-4 text-red-500">{error}</p>
            ) : (
                <>
                    {/* 제품 리스트 */}
                    <div className="flex flex-wrap w-[62rem] mt-[1rem] gap-4 justify-center items-center">
                        {cartProducts.map((product, index) => (
                            <div
                                key={product.id || index}
                                className="flex items-center justify-center w-[18rem] h-[10rem] rounded-lg shadow-lg p-4"
                            >
                                {/* 이미지 (맨 왼쪽) */}
                                <img
                                    src={product.iconpicture}
                                    alt={`${product.prodtitle} 아이콘`}
                                    className="w-[7rem] h-[7rem] rounded-full shadow-xl mr-4"
                                />
                                {/* 제품 정보 (이름, 가격 세로 정렬) */}
                                <div className="flex flex-col mt-[1rem] justify-center items-start">
                                    <p className="text-lg font-bold">{product.prodtitle}</p>
                                    <p className="text-xs text-gray-400">{product.category}</p>
                                    <p className="text-lg mt-[1rem] text-red-400">{product.prodprice.toLocaleString()}원</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 구매자 정보 */}
                    <div className="flex flex-col w-[62rem] mt-[2rem]">
                        <p className="font-bold text-lg">구매자 정보</p>
                        <div className="w-[62rem] border-b-2 border-gray-200 mt-[1rem]"></div>

                        <div className="flex flex-col gap-2 mt-[1.5rem]">
                            {/* 이름 입력란 (반 크기로 줄임) */}
                            <input type="text" placeholder="이름" className="border p-2 rounded-lg w-1/2"/>

                            {/* 성별 선택 */}
                            <div className="flex gap-4">
                                <div
                                    className={`cursor-pointer flex items-center justify-center w-1/2 p-2 border rounded-lg ${
                                        selectedGender === "남성" ? "bg-red-400 text-white" : ""
                                    }`}
                                    onClick={() => setSelectedGender("남성")}
                                >
                                    남성
                                </div>
                                <div
                                    className={`cursor-pointer flex items-center justify-center w-1/2 p-2 border rounded-lg ${
                                        selectedGender === "여성" ? "bg-red-400 text-white" : ""
                                    }`}
                                    onClick={() => setSelectedGender("여성")}
                                >
                                    여성
                                </div>
                            </div>

                            {/* 휴대폰 번호 */}
                            <input type="text" placeholder="휴대폰 번호" className="border p-2 rounded-lg w-full"/>

                            {/* 쿠폰 선택 */}
                            <div
                                className="flex items-center border-[0.15rem] border-red-400 rounded-xl justify-between w-[62rem] mt-4">
                                <div className="text-lg ml-[0.9rem] font-bold whitespace-nowrap">할인 쿠폰</div>
                                <div className="h-[2rem] border-l-[0.15rem] border-red-400 ml-[0.9rem]"></div>
                                <div className="flex items-center justify-center w-full mx-4">
                                    {selectedCoupon ? (
                                        <div className="font-bold text-lg">{selectedCoupon}</div>
                                    ) : (
                                        <div className="text-gray-400">선택된 쿠폰이 없습니다.</div>
                                    )}
                                </div>
                                <div
                                    className="cursor-pointer bg-red-400 whitespace-nowrap text-white font-bold py-2 px-4 border rounded-lg"
                                    onClick={toggleCouponPopup}
                                >
                                    쿠폰 적용
                                </div>
                            </div>

                            {/* 쿠폰 선택 팝업 */}
                            {isCouponPopupOpen && (
                                <div
                                    className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white p-4 rounded-lg shadow-lg w-[80%] sm:w-[40%]">
                                        <p className="font-bold mb-4">쿠폰 선택</p>
                                        {coupons.map((coupon, index) => (
                                            <div
                                                key={index}
                                                className="cursor-pointer p-2 mb-2 border rounded-lg hover:bg-gray-200"
                                                onClick={() => handleCouponSelect(coupon)}
                                            >
                                                {coupon}
                                            </div>
                                        ))}
                                        <div
                                            className="cursor-pointer mt-4 text-center p-2 bg-red-400 text-white rounded-lg"
                                            onClick={toggleCouponPopup}
                                        >
                                            닫기
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* 마일리지 사용 */}
                            <input type="text" placeholder="마일리지 사용" className="border p-2 rounded-lg w-full"/>
                        </div>
                    </div>

                    {/* 결제 수단 */}
                    <div className="flex flex-col w-[62rem] mt-[2rem]">
                        <p className="font-bold text-lg">결제 수단</p>
                        <div className="w-[62rem] border-b-2 border-gray-200 mt-[1rem]"></div>

                        {/* 무통장 입금 */}
                        <div>
                            <div
                                className={`cursor-pointer font-bold text-xl mt-[0.5rem] items-center justify-center flex h-[4rem] rounded-xl 
                ${activePaymentMethod === "무통장" ? "bg-red-400 text-white" : "bg-transparent bg-gray-100 text-black"}`}
                                onClick={() => handlePaymentClick("무통장")}
                            >
                                무통장 입금
                            </div>
                            <div
                                className={`flex flex-col mt-[0.5rem] p-4 bg-gray-100 rounded-lg overflow-hidden transition-all duration-300 ${
                                    activePaymentMethod === "무통장" ? "max-h-[500px] opacity-100 mt-[2rem]" : "max-h-0 opacity-0 mt-[0.5rem]"
                                }`}
                            >
                                <select value={selectedBank} onChange={handleBankChange} className="border p-2 rounded-lg">
                                    {banks.map((bank) => (
                                        <option key={bank.name} value={bank.name}>
                                            {bank.name} - {bank.account}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* 카드 결제 */}
                        <div>
                            <div
                                className={`cursor-pointer font-bold text-xl mt-[0.5rem] items-center justify-center flex h-[4rem] rounded-xl 
                ${activePaymentMethod === "카드" ? "bg-red-400 text-white" : "bg-transparent text-black"}`}
                                onClick={() => handlePaymentClick("카드")}
                            >
                                카드 결제
                            </div>
                            <div
                                className={`flex flex-col mt-[0.5rem] p-4 bg-gray-100 rounded-lg overflow-hidden transition-all duration-300 ${
                                    activePaymentMethod === "카드" ? "max-h-[500px] opacity-100 mt-[2rem]" : "max-h-0 opacity-0 mt-[0.5rem]"
                                }`}
                            >
                                <input type="checkbox" className="mr-2"/> 이용 약관 동의
                                <input type="text" placeholder="카드 번호" className="border p-2 rounded-lg"/>
                                <input type="text" placeholder="CVC 번호" className="border p-2 rounded-lg"/>
                                <input type="text" placeholder="이름" className="border p-2 rounded-lg"/>
                            </div>
                        </div>

                        {/* 간편 결제 */}
                        <div>
                            <div
                                className={`cursor-pointer font-bold text-xl mt-[0.5rem] items-center justify-center flex h-[4rem] rounded-xl 
                ${activePaymentMethod === "간편" ? "bg-red-400 text-white" : "bg-transparent text-black"}`}
                                onClick={() => handlePaymentClick("간편")}
                            >
                                간편 결제
                            </div>
                            <div
                                className={`flex flex-col mt-[0.5rem] p-4 bg-gray-100 rounded-lg overflow-hidden transition-all duration-300 ${
                                    activePaymentMethod === "간편" ? "max-h-[500px] opacity-100 mt-[2rem]" : "max-h-0 opacity-0 mt-[0.5rem]"
                                }`}
                            >
                                <select className="border p-2 rounded-lg">
                                    <option value="카카오페이">카카오페이</option>
                                    <option value="신용카드">신용카드</option>
                                    <option value="Paypal">Paypal</option>
                                </select>
                            </div>
                        </div>

                        {/* 짐 머니 결제 */}
                        <div>
                            <div
                                className={`cursor-pointer font-bold text-xl mt-[0.5rem] items-center justify-center flex h-[4rem] rounded-xl 
                ${activePaymentMethod === "짐머니" ? "bg-red-400 text-white" : "bg-transparent text-black"}`}
                                onClick={() => handlePaymentClick("짐머니")}
                            >
                                짐 머니 결제
                            </div>
                            <div
                                className={`flex flex-col mt-[0.5rem] p-4 bg-gray-100 rounded-lg overflow-hidden transition-all duration-300 ${
                                    activePaymentMethod === "짐머니" ? "max-h-[500px] opacity-100 mt-[2rem]" : "max-h-0 opacity-0 mt-[0.5rem]"
                                }`}
                            >
                                <p>보유 포인트: 5,000원</p>
                            </div>
                        </div>
                    </div>



                    <div className="w-[62rem] border-b-2 border-gray-950 mt-4"></div>

                    {/* 운동 시작일 */}
                    <div className="flex flex-col w-[62rem] mt-4">
                        <p className="font-bold text-lg">운동 시작일</p>
                        <input
                            type="date"
                            value={startDate}
                            onChange={handleDateChange}
                            className="border p-2 rounded-lg mt-2"
                        />
                    </div>

                    <div className="w-[62rem] border-b-2 border-gray-950 mt-4"></div>

                    {/* 결제 요약 및 결제 버튼 */}
                    <div className="flex flex-col w-[62rem] mt-4">
                        <div className="flex justify-between">
                            <p>상품 금액:</p>
                            <p>{totalPrice.toLocaleString()}원</p>
                        </div>
                        <div className="flex justify-between">
                            <p>총 할인 금액:</p>
                            <p>-{discountPrice.toLocaleString()}원</p>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                            <p>최종 결제 금액:</p>
                            <p>{(totalPrice - discountPrice).toLocaleString()}원</p>
                        </div>
                        <div
                            className="flex justify-center mt-4 p-4 bg-red-400 text-white font-bold rounded-lg cursor-pointer hover:scale-105"
                        >
                            결제하기
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Buyform;
