import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import {FaPlaystation, FaRegSquareCheck} from "react-icons/fa6";

const Buyform = ({ money, setMoney }) => {
    const location = useLocation(); // To get the state passed via navigate
    const queryParams = new URLSearchParams(location.search);
    const [cartProducts, setCartProducts] = useState([]);
    const [activePaymentMethod, setActivePaymentMethod] = useState("무통장");
    const [selectedBank, setSelectedBank] = useState("농협은행");
    const [startDate, setStartDate] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGender, setSelectedGender] = useState("남성"); // 성별 선택 상태
    const [selectedCoupon, setSelectedCoupon] = useState(""); // 선택된 쿠폰
    const [isCouponPopupOpen, setIsCouponPopupOpen] = useState(false); // 쿠폰 팝업 상태
    const [activeSimplePayment, setActiveSimplePayment] = useState("");
    const [receiptType, setReceiptType] = useState(""); // State for receipt type
    const [phoneNumber, setPhoneNumber] = useState("");
    const [totalPrice, setTotalPrice] = useState(0); // 총 상품 금액
    const [discountPrice, setDiscountPrice] = useState(0); // 할인 금액
    const [name, setName] = useState(""); // 추가된 상태
    const [isUserInfoFilled, setIsUserInfoFilled] = useState(false);
    const [isbuyModalOpen, setIsbuyModalOpen] = useState(false);  // 팝업 상태
    const [prodlist, setProdlist] = useState([]);
    const signal = queryParams.get('signal'); // 'buy' 또는 'cart'
    const { prodid } = useParams(); // To get the product ID from the URL if needed


    const fetchUserData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/userinfo", { withCredentials: true });
            if (response.data.success) {
                const { name, phonenumber, money } = response.data;
                setName(name); // 이름 업데이트
                setMoney(money);
                setPhoneNumber(phonenumber); // 전화번호 업데이트
            } else {
                // 성공하지 않은 응답 처리
                console.error("Failed to fetch user info:", response.data.message);
                alert(response.data.message || "사용자 정보를 가져오는 데 실패했습니다.");
            }
        } catch (err) {
            console.error("Error fetching user info:", err);
            alert("서버와의 연결에 문제가 발생했습니다.");
        }
    };

    const { prodid: passedProdid, prodtitle, prodprice } = location.state || {};

    const [productDetails, setProductDetails] = useState({
        prodid: passedProdid || '',
        prodtitle: prodtitle || '',
        prodprice: prodprice || ''
    });

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!productDetails.prodid) return;

            try {
                const response = await axios.get(`http://localhost:8080/product/${productDetails.prodid}`);
                setProductDetails(response.data); // Update the state with the fetched data
            } catch (error) {
                console.error("Error fetching product details:", error);
                setError("상품 정보를 불러오는 데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductDetails();
    }, [productDetails.prodid]);

    useEffect(() => {
    const fetchMoneyData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/userinfo", { withCredentials: true });
            if (response.data.success) {
                const { money} = response.data;
                setMoney(money);
            } else {
                // 성공하지 않은 응답 처리
                console.error("Failed to fetch user info:", response.data.message);
                alert(response.data.message || "사용자 정보를 가져오는 데 실패했습니다.");
            }
        } catch (err) {
            console.error("Error fetching user info:", err);
            alert("서버와의 연결에 문제가 발생했습니다.");
        }
    };
    fetchMoneyData();
    }, []);

    const [isClicked, setIsClicked] = useState(false);  // 클릭 상태를 관리하는 state

    const handleClick = () => {
        setIsClicked(!isClicked);  // 클릭 시 클릭 상태를 토글
    };

    const handleUseCurrentUserInfo = async () => {
        if (!isUserInfoFilled) {
            // Fill the user information
            await fetchUserData();
            setIsUserInfoFilled(true);  // Mark user info as filled
        } else {
            // Reset the user information
            setName("");  // Reset name
            setPhoneNumber("");  // Reset phone number
            setIsUserInfoFilled(false);  // Mark user info as reset
        }
    };

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        const formattedValue = formatPhoneNumber(value);

        // Check if the value contains only numbers or dashes, and prevent non-numeric input
        if (/[^0-9-]/.test(value)) {
            alert("숫자만 입력 가능합니다.");
            return; // Prevent the change if the value is invalid
        }

        setPhoneNumber(formattedValue);
    };

    useEffect(() => {
        const calculatePrices = () => {
            const total = cartProducts.reduce((sum, product) => {
                const price = parseInt(product.prodprice.replace(/,/g, ''), 10) || 0; // 문자열을 숫자로 변환
                return sum + price;
            }, 0);

            const discount = 120000; // 할인 금액 고정값 (변경 가능)
            setTotalPrice(total);
            setDiscountPrice(discount);
        };

        calculatePrices();
    }, [cartProducts]);

    const formatPhoneNumber = (value) => {
        // Remove all non-digit characters to ensure we only have numbers
        const digits = value.replace(/\D/g, "");

        // Format the phone number with dashes
        if (digits.length <= 3) {
            return digits;
        } else if (digits.length <= 7) {
            return `${digits.slice(0, 3)}-${digits.slice(3)}`;
        } else {
            return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
        }
    };


    const coupons = ["쿠폰 1", "쿠폰 2", "쿠폰 3"]; // 쿠폰 목록

    const toggleCouponPopup = () => {
        setIsCouponPopupOpen(!isCouponPopupOpen); // 팝업 열기/닫기
    };

    const handleCouponSelect = (coupon) => {
        if (coupon === null) {
            // 선택을 초기화하는 경우
            setSelectedCoupon(null);
        } else {
            setSelectedCoupon(coupon); // 선택된 쿠폰을 저장
        }
    };


    const handleSimplePaymentClick = (payment) => {
        if (activeSimplePayment === payment) {
            setActiveSimplePayment("");
        } else {
            setActiveSimplePayment(payment);
        }
    };

    // 백엔드에서 장바구니 제품 정보 가져오기
    const fetchCartProducts = async () => {
        try {
            const response = await axios.get("http://localhost:8080/cart-products", {
                withCredentials: true, // Ensure session cookie is sent
            });
            setCartProducts(response.data); // 장바구니 제품 정보 설정
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching cart products:", error);
            setError("장바구니 제품을 불러오는 데 실패했습니다.");
            setIsLoading(false);
        }
    };

    // 구매 정보 (buylist) 불러오기
    const fetchBuyProduct = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/buy-product", {
                withCredentials: true,
            });

            console.log('API Response:', response.data); // 응답 데이터 구조 확인

            // 응답 데이터가 객체일 경우 배열로 감싸기
            if (Array.isArray(response.data)) {
                setCartProducts(response.data); // 이미 배열이면 그대로 처리
            } else {
                setCartProducts([response.data]); // 객체라면 배열로 감싸서 처리
            }

            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching buy product:", error);
            setError("구매할 제품 정보를 불러오는 데 실패했습니다.");
            setIsLoading(false);
        }
    };

    // 신호에 따라 적절한 데이터를 불러오는 로직
    useEffect(() => {
        setIsLoading(true); // 로딩 상태 시작
        setError(null); // 이전 에러 초기화

        if (signal === 'cart') {
            fetchCartProducts(); // 장바구니 데이터 불러오기
        } else if (signal === 'buy') {
            fetchBuyProduct(); // buylist 데이터 불러오기
        } else {
            setError("잘못된 요청입니다."); // 잘못된 신호 처리
            setIsLoading(false);
        }
    }, [signal]);

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

    const handleSubmit = () => {
        // 필수 입력값 체크
        if (!name || !phoneNumber) {
            alert("구매자 정보 입력이 다되지 않았습니다.");
            return; // 알림 후 함수 종료
        }
        if (!isClicked) {
            alert("결제 수단을 선택해주세요");
            return; // 알림 후 함수 종료
        }
        if (!startDate) {
            alert("시작 날짜를 입력해주세요");
            return; // 알림 후 함수 종료
        }

        // 모든 체크가 완료되었을 때 팝업 열기
        setIsbuyModalOpen(true);
    };

    const handleAgree = async () => {
        try {
            const amountToDeduct = totalPrice - discountPrice; // The final payment amount
            const response = await axios.post("http://localhost:8080/api/deductMoney",
                {
                    amount: amountToDeduct,
                    products: cartProducts.map((product) => product.prodid),
                    startDate: startDate
                },
                { withCredentials: true }
            );

            // 서버가 결제 성공을 응답했을 경우
            if (response.data.success) {
                const updatedMoney = sessionStorage.getItem("money") - amountToDeduct;
                sessionStorage.setItem("money", updatedMoney);
                setMoney(updatedMoney); // 부모 상태 업데이트
                alert("결제가 완료 되었습니다.");
                setIsbuyModalOpen(false); // 팝업 닫기
                navigate("/"); // 홈으로 이동
            } else {
                // 결제 실패 메시지 출력
                alert(response.data.message || "결제 실패");
            }
        } catch (error) {
            console.error("Error during payment:", error);

            // 서버에서 '잔액이 부족합니다' 오류를 응답했을 경우 처리
            if (error.response && error.response.status === 400 && error.response.data.message === '잔액이 부족합니다.') {
                alert("잔액이 부족합니다. 결제를 진행할 수 없습니다.");
            } else {
                // 다른 오류 처리
                alert("결제 중 문제가 발생했습니다.");
            }
        }
    };


    const navigate = useNavigate();

    const handleDisagree = () => {
        // 미동의 버튼 클릭 시 팝업 닫기
        alert("결제가 취소되었습니다.");
        setIsbuyModalOpen(false);  // 팝업 닫기
    };

    return (
        <div className="flex flex-col mt-[1rem] h-full items-center justify-center mx-28">
            <a className="flex items-center text-red-400 w-[62rem] font-bold text-xl justify-center">구매 / 결제</a>
            <div className="w-[62rem] border-b-2 border-red-400 mt-4"></div>

            {/* 로딩 또는 에러 처리 */}
            {isLoading ? (
                <p className="text-center mt-4">로딩 중...</p>
            ) : error ? (
                <p className="text-center mt-4 text-red-500">{error}</p>
            ) : (
                <>
                    {/* 제품 리스트 */}
                    <div className="flex flex-wrap border-[0.15rem] shadow-xl border-red-400 rounded-xl p-4 w-[62rem] mt-[2rem] gap-4 justify-center items-center">
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
                    <div
                        className="flex flex-col w-[62rem] mt-[2rem] shadow-xl border-[0.15rem] p-[2rem] rounded-xl border-red-400">
                        <p className="font-bold text-lg text-red-400">구매자 정보</p>
                        <div className="flex flex-col gap-2 mt-[1.5rem]">
                            <div className="flex flex-row gap-2">
                                <input
                                    type="text"
                                    placeholder="이름"
                                    value={name} // 사용자 이름 상태와 바인딩
                                    onChange={(e) => setName(e.target.value)} // 수동 입력도 가능하게 처리
                                    className="border p-2 rounded-lg w-2/5"
                                />
                                {/* 성별 선택 */}
                                <div className="flex gap-4 w-1/5">
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
                                {/* 현재 사용자 정보 체크 버튼 */}
                                <div
                                    className={`cursor-pointer flex items-center justify-center p-2 border rounded-lg ${isUserInfoFilled ? "bg-red-400 text-white" : ""}`}
                                    onClick={handleUseCurrentUserInfo} // 사용자 정보 자동 입력 실행
                                >
                                    {isUserInfoFilled ? (
                                        <>
                                            <FaRegSquareCheck className="mr-2 flex mb-[0.1rem]"/> {/* Icon for "사용" */}
                                            현재 사용자 정보
                                        </>
                                    ) : (
                                        <>
                                            <MdCheckBoxOutlineBlank
                                                className="mr-2 mb-[0.1rem]"/> {/* Icon for "사용 안함" */}
                                            현재 사용자 정보
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* 휴대폰 번호 */}
                            <input
                                type="text"
                                placeholder="휴대폰 번호"
                                value={phoneNumber} // 사용자 전화번호 상태와 바인딩
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="border p-2 rounded-lg w-full"
                            />

                            {/* 쿠폰 선택 */}
                            <div
                                className="flex items-center h-[5rem] border-[0.15rem] border-red-400 rounded-xl justify-between w-full">
                                <div className="text-lg ml-[0.9rem] font-bold whitespace-nowrap">할인 쿠폰</div>
                                <div className="h-[3.5rem] border-l-[0.15rem] border-red-400 ml-[0.9rem]"></div>
                                <div className="flex items-center justify-center w-full mx-4">
                                    {selectedCoupon ? (
                                        <div className="font-bold text-lg">{selectedCoupon}</div>
                                    ) : (
                                        <div className="text-gray-400">선택된 쿠폰이 없습니다.</div>
                                    )}
                                </div>
                                <div
                                    className="cursor-pointer bg-red-400 whitespace-nowrap text-white font-bold py-6 px-4 border rounded-lg"
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
                                        {/* 기존 쿠폰 리스트 */}
                                        {coupons.map((coupon, index) => (
                                            <div
                                                key={index}
                                                className="cursor-pointer p-2 mb-2 border rounded-lg hover:bg-gray-200"
                                                onClick={() => {
                                                    handleCouponSelect(coupon);  // 선택된 쿠폰 저장
                                                    toggleCouponPopup();         // 팝업 닫기
                                                }}
                                            >
                                                {coupon}
                                            </div>
                                        ))}
                                        {/* 선택 안 함 */}
                                        <div
                                            className="cursor-pointer p-2 mb-2 border rounded-lg hover:bg-gray-200"
                                            onClick={() => {
                                                handleCouponSelect(null);  // 선택 초기화
                                                toggleCouponPopup();       // 팝업 닫기
                                            }}
                                        >
                                            선택 안 함
                                        </div>
                                        <div
                                            className="cursor-pointer mt-4 text-center p-2 bg-red-400 text-white rounded-lg"
                                            onClick={toggleCouponPopup} // 닫기 버튼
                                        >
                                            닫기
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    <div
                        className="flex flex-col w-full h-full mt-[1rem] shadow-xl border-[0.15rem] p-[0.6rem] rounded-xl border-red-400">
                        <p className="font-bold text-xl mt-[1rem] text-red-400">결제 수단</p>
                        <div className="flex flex-row w-full h-full">
                            <div className="flex flex-col w-full h-[20rem] max-w-[20rem] mr-[2rem]">
                                {/* 무통장 입금 */}
                                <div>
                                    <div
                                        className={`cursor-pointer font-bold text-xl mt-[1.5rem] items-center justify-center flex h-[4rem] rounded-xl 
                        ${activePaymentMethod === "무통장" ? "bg-red-400 text-white" : "bg-transparent text-red-400 bg-gray-100"} 
                        transition-all duration-300 ease-in-out`}
                                        onClick={() => handlePaymentClick("무통장")}
                                    >
                                        <a className="hover:scale-105 transition-transform ease-in-out duration-500 cursor-pointer">무통장 입금</a>
                                    </div>
                                </div>

                                {/* 카드 결제 */}
                                <div>
                                    <div
                                        className={`cursor-pointer font-bold text-xl mt-[0.5rem] items-center justify-center flex h-[4rem] rounded-xl 
                        ${activePaymentMethod === "카드" ? "bg-red-400 text-white" : "bg-transparent text-red-400 bg-gray-100"} 
                        transition-all duration-300 ease-in-out`}
                                        onClick={() => handlePaymentClick("카드")}
                                    >
                                        <a className="hover:scale-110 transition-transform ease-in-out duration-500 cursor-pointer">카드 결제</a>
                                    </div>
                                </div>

                                {/* 간편 결제 */}
                                <div>
                                    <div
                                        className={`cursor-pointer font-bold text-xl mt-[0.5rem] items-center justify-center flex h-[4rem] rounded-xl 
                        ${activePaymentMethod === "간편" ? "bg-red-400 text-white" : "bg-transparent text-red-400 bg-gray-100"} 
                        transition-all duration-300 ease-in-out`}
                                        onClick={() => handlePaymentClick("간편")}
                                    >
                                        <a className="hover:scale-110 transition-transform ease-in-out duration-500 cursor-pointer">간편 결제</a>
                                    </div>
                                </div>

                                {/* 짐 머니 결제 */}
                                <div>
                                    <div
                                        className={`cursor-pointer font-bold text-xl mt-[0.5rem] items-center justify-center flex h-[4rem] rounded-xl 
                        ${activePaymentMethod === "짐머니" ? "bg-red-400 text-white" : "bg-transparent text-red-400 bg-gray-100"} 
                        transition-all duration-300 ease-in-out`}
                                        onClick={() => handlePaymentClick("짐머니")}
                                    >
                                        <a className="hover:scale-110 transition-transform ease-in-out duration-500 cursor-pointer">짐 머니 결제</a>
                                    </div>
                                </div>
                            </div>

                            {/* Right side: Payment details */}
                            <div className="w-full h-auto">
                                {activePaymentMethod === "무통장" && (
                                    <div
                                        className="flex flex-col mt-[0.5rem] p-4 rounded-lg overflow-hidden transition-all duration-300">
                                        <p className="text-lg text-red-400">무통장 입금</p>
                                        <select value={selectedBank} onChange={handleBankChange}
                                                className="border p-2 mt-[1rem] rounded-lg">
                                            {banks.map((bank) => (
                                                <option key={bank.name} value={bank.name}>
                                                    {bank.name} : {bank.account}
                                                </option>
                                            ))}
                                        </select>
                                        <input type="text" placeholder="입금자 명"
                                               className="border mt-[0.2rem] p-2 rounded-lg"/>

                                        {/* 현금 영수증 발급 / 신청 안함 */}
                                        <div className="mt-[1rem]">
                                            <div className="w-full border-b-[0.1rem] border-red-200"></div>
                                            <p className="text-lg text-red-400 mt-[0.5rem]">현금 영수증 발급</p>
                                            <div className="flex items-center space-x-4">
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="receipt"
                                                        value="발급"
                                                        onChange={() => setReceiptType("발급")}
                                                        checked={receiptType === "발급"}
                                                        className="mr-2 w-5 h-5 rounded-full border-2 border-gray-400 checked:bg-red-400"
                                                    />
                                                    발급
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="receipt"
                                                        value="신청 안함"
                                                        onChange={() => setReceiptType("신청 안함")}
                                                        checked={receiptType === "신청 안함"}
                                                        className="mr-2 w-5 h-5 rounded-full border-2 border-gray-400 checked:bg-red-400"
                                                    />
                                                    신청 안함
                                                </label>
                                            </div>

                                            {/* Display input for issuing number if '발급' is selected */}
                                            {receiptType === "발급" && (
                                                <div className="mt-[1rem]">
                                                    <input
                                                        type="text"
                                                        placeholder="전화번호 입력"
                                                        value={phoneNumber}
                                                        onChange={handlePhoneNumberChange} // Format and validate on every change
                                                        maxLength={13} // Limit the length to 13 characters
                                                        className="border p-2 rounded-lg w-full"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activePaymentMethod === "카드" && (
                                    <div
                                        className="flex flex-col mt-[0.5rem] p-4 rounded-lg overflow-hidden transition-all duration-300">
                                        <p className="text-lg text-red-400">카드 결제</p>
                                        <div className="flex flex-row h-[3rem] mt-[1rem]">
                                            <input type="text" placeholder="카드 번호" className="border w-2/3 rounded-lg"/>
                                            <input type="text" placeholder="CVC 번호"
                                                   className="border ml-[0.2rem] w-1/3 rounded-lg"/>
                                        </div>
                                        <input type="text" placeholder="이름" className="border mt-[0.3rem] rounded-lg"/>
                                        <input type="text" placeholder="이메일" className="border mt-[0.3rem] rounded-lg"/>
                                        <div className="flex flew-row items-center mt-[0.5rem]">
                                            <input className="mb-[0.1rem] checked:bg-red-400" type="checkbox"/> <p
                                            className="ml-[0.5rem]">이용 약관 동의</p>
                                        </div>
                                    </div>
                                )}

                                {activePaymentMethod === "간편" && (
                                    <div
                                        className="flex flex-col mt-[0.5rem] p-4 rounded-lg overflow-hidden transition-all duration-300">
                                        <p className="text-lg text-red-400">간편 결제</p>
                                        <div
                                            onClick={() => handleSimplePaymentClick("카카오페이")}
                                            className={`cursor-pointer mt-[1rem] items-center justify-center flex h-[4rem] text-lg p-2 rounded-lg mb-2 
                            ${activeSimplePayment === "카카오페이" ? "bg-red-400 text-white" : "bg-gray-200 text-black"}`}
                                        >
                                            카카오페이
                                        </div>
                                        <div
                                            onClick={() => handleSimplePaymentClick("신용카드")}
                                            className={`cursor-pointer text-lg p-2 items-center justify-center flex h-[4rem] rounded-lg mb-2 
                            ${activeSimplePayment === "신용카드" ? "bg-red-400 text-white" : "bg-gray-200 text-black"}`}
                                        >
                                            신용카드
                                        </div>
                                        <div
                                            onClick={() => handleSimplePaymentClick("Paypal")}
                                            className={`cursor-pointer text-lg p-2 items-center justify-center flex h-[4rem] rounded-lg mb-2 
                            ${activeSimplePayment === "Paypal" ? "bg-red-400 text-white" : "bg-gray-200 text-black"}`}
                                        >
                                            Paypal
                                        </div>
                                    </div>
                                )}

                                {activePaymentMethod === "짐머니" && (
                                    <div
                                        className="flex flex-col mt-[0.5rem] p-4 rounded-lg flow-hidden items-center transition-all duration-300">
                                        <p className="text-lg text-red-400">간편 결제</p>
                                        <div
                                            onClick={handleClick}
                                            className={`mt-[1rem] flex-col justify-center flex cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 h-[7rem] p-4 text-red-400 border-[0.1rem] border-red-400 rounded-xl w-[22rem] ${isClicked ? "bg-red-400 text-white" : "bg-white"}`}
                                        >
                                            <div className="flex flex-row mb-[1.3rem] items-center">
                                                <a className="text-sm">핏머니 ·</a>
                                                <FaPlaystation className="flex text-sm ml-[0.1rem]"/>
                                                <a className="text-sm">PLAY 증권</a>
                                            </div>
                                            <a className="flex text-xl">보유 핏머니: {money.toLocaleString()}원</a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 운동 시작일 */}
                    <div
                        className="flex flex-col border-[0.15rem] shadow-xl rounded-xl p-4 border-red-400 w-[62rem] mt-4">
                        <p className="font-bold text-lg mt-[0.5rem] text-red-400">운동 시작일</p>
                        <input
                            type="date"
                            value={startDate}
                            onChange={handleDateChange}
                            className="border p-2 rounded-lg mt-[1rem]"
                        />
                    </div>

                    <div className="w-[62rem] border-b-2 border-gray-950 mt-[2rem]"></div>

                    {/* 결제 요약 및 결제 버튼 */}
                    <div className="flex flex-col w-[62rem] mt-4">
                        <div className="flex justify-between">
                            <p>상품 금액</p>
                            <p>{totalPrice.toLocaleString()}원</p>
                        </div>
                        <div className="flex justify-between">
                            <p>총 할인 금액</p>
                            <p className="text-blue-500">{`-${discountPrice.toLocaleString()}원`}</p>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                            <p className="text-red-400 text-xl mt-[1rem]">최종 결제 금액</p>
                            <p className="text-red-400 text-xl mt-[1rem]">{`${(totalPrice - discountPrice).toLocaleString()}원`}</p>
                        </div>
                        <div
                            onClick={handleSubmit} className="flex justify-center mt-4 p-4 bg-red-400 text-white font-bold rounded-lg cursor-pointer hover:scale-105 transition-transform ease-in-out duration-500"
                        >
                            결제하기
                        </div>

                        {isbuyModalOpen && (
                            <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-[20rem] text-center">
                                    <h2 className="text-xl mb-4">동의 하시겠습니까?</h2>
                                    <div className="flex justify-around">
                                        <button
                                            onClick={handleAgree}
                                            className="bg-red-400 text-white w-[5rem] p-2 rounded-lg cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500"
                                        >
                                            동의
                                        </button>
                                        <button
                                            onClick={handleDisagree}
                                            className="text-red-400 border-[0.1rem] cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 border-red-400 w-[5rem] p-2 rounded-lg"
                                        >
                                            미동의
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Buyform;
