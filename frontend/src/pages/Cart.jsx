import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cartproduct from "../components/Cartproduct.jsx";

const Cart = () => {
    const [selectedMonth, setSelectedMonth] = useState('1개월');
    const [activeTab, setActiveTab] = useState('tab1');
    const [cartProducts, setCartProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);  // 로딩 상태 관리
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 (로그인 여부)
    const [error, setError] = useState(null); // Error state
    const [totalPrice, setTotalPrice] = useState(0); // 총 상품 금액
    const [discountPrice, setDiscountPrice] = useState(0); // 할인 금액

    // 로그인 상태 확인
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/userinfo', {
                    withCredentials: true, // 세션을 확인하려면 반드시 필요
                });

                if (response.data.success) {
                    setIsLoggedIn(true); // 로그인 상태 업데이트
                    setUserId(response.data.userId); // 유저 ID 저장
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('로그인 상태 확인 실패', error);
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus();
    }, []);

    useEffect(() => {
        const calculatePrices = () => {
            const total = cartProducts.reduce((sum, product) => {
                let price = 0;
                if (activeTab === 'tab1') {
                    price = parseInt(product.prodprice.replace(/,/g, ''), 10) || 0; // prodprice 필드 사용
                } else if (activeTab === 'tab2') {
                    price = parseInt(product.prodprice2.replace(/,/g, ''), 10) || 0; // prodprice2 필드 사용
                } else if (activeTab === 'tab3') {
                    price = parseInt(product.prodprice3.replace(/,/g, ''), 10) || 0;
                } else if (activeTab === 'tab4') {
                    price = parseInt(product.prodprice4.replace(/,/g, ''), 10) || 0;
                }
                return sum + price;
            }, 0);

            const discount = 120000; // 할인 금액 고정값 (변경 가능)
            setTotalPrice(total);
            setDiscountPrice(discount);
        };

        calculatePrices();
    }, [cartProducts, activeTab]);

    useEffect(() => {
        const fetchCartProducts = async () => {
            try {
                // Ensure credentials (cookies) are included in the request
                const response = await axios.get('http://localhost:8080/cart-products', {
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

    const handleRemoveProduct = async (prodid) => {
        try {
            const response = await axios.delete(`http://localhost:8080/cart-products/${prodid}`, {
                withCredentials: true,
            });

            if (response.data.message === "Product removed from cart") {
                // 서버로부터 최신 prodlist 받아오기
                const updatedProdlist = response.data.updatedProdlist;

                // 로컬 상태에서 업데이트된 prodlist로 상태 갱신
                setCartProducts(updatedProdlist);

                // 페이지 새로고침
                window.location.reload(); // 페이지를 새로고침
            }
        } catch (error) {
            console.error("Error removing product:", error);
            if (error.response) {
                setError(`서버 오류: ${error.response.data.message}`);
            } else {
                setError("네트워크 오류가 발생했습니다.");
            }
        }
    };

    const handleClick = (month) => {
        setSelectedMonth(month);
        if (month === '1개월') {
            setActiveTab('tab1');
        } else if (month === '3개월') {
            setActiveTab('tab2');
        } else if (month === '6개월') {
            setActiveTab('tab3');
        } else if (month === '12개월') {
            setActiveTab('tab4');
        }
    };

    const gobuyform = () => {
        if (cartProducts.length === 0) {
            alert('구매할 상품이 없습니다.');
        } else {
            // cartProducts를 JSON.stringify()로 문자열로 변환하여 저장
            sessionStorage.setItem("prodlist", JSON.stringify(cartProducts)); // cartProducts를 저장

            // Buyform으로 이동 시 signal=cart를 쿼리 파라미터로 추가
            navigate("/Buyform?signal=cart");
        }
    };

    return (
        <div className="flex flex-col mt-[1rem] h-full items-center justify-center mx-28">
            <a className="flex items-center w-[62rem] text-red-400 font-bold text-xl justify-center">장바구니</a>
            <div className="w-[62rem] border-b-2 border-red-400 mt-4"></div>
            <div className="flex flex-col w-[62rem] h-full mt-[1rem]">
                <div className="flex flex-row">
                    <a className="text-red-400">{cartProducts.length}개 /</a> {/* 장바구니 아이템 수 표시 */}
                    <a className="ml-[0.4rem]">최대 3개</a>
                </div>
                <div className="flex flex-col space-y-[0.5rem] w-[62rem] h-full mt-[1rem]">
                    {cartProducts.length === 0 ? (
                        <p>장바구니에 제품이 없습니다.</p> // If no products in cart, show this message
                    ) : (
                        cartProducts.map((item, index) => (
                            <Cartproduct key={index} item={item} onRemoveProduct={handleRemoveProduct} /> // Pass each item to the Cartproduct component
                        ))
                    )}
                </div>

                {/* 선택한 기간에 맞는 탭들 */}
                <div
                    className="flex flex-row w-[62rem] items-center justify-center shadow-xl h-[3rem] mt-[1rem] rounded-3xl bg-red-400">
                    <div className="flex h-full items-center justify-center w-1/4">
                        <a
                            className={`w-[14.3rem] cursor-pointer items-center justify-center flex rounded-3xl h-[2.5rem] transition-transform duration-300 ease-in-out transform ${
                                selectedMonth === '1개월' ? 'bg-gray-100 text-red-400 translate-x-0' : 'bg-red-400 text-white translate-x-[10px]'
                            }`}
                            onClick={() => handleClick('1개월')}
                        >
                            1개월
                        </a>
                    </div>

                    <div className="flex w-1/4 items-center justify-center h-full">
                        <a
                            className={`w-[14.3rem] cursor-pointer items-center justify-center flex rounded-3xl h-[2.5rem] transition-transform duration-300 ease-in-out transform ${
                                selectedMonth === '3개월' ? 'bg-gray-100 text-red-400 translate-x-0' : 'bg-red-400 text-white translate-x-[10px]'
                            }`}
                            onClick={() => handleClick('3개월')}
                        >
                            3개월
                        </a>
                    </div>

                    <div className="flex items-center justify-center w-1/4 h-full">
                        <a
                            className={`w-[14.3rem] cursor-pointer items-center justify-center flex rounded-3xl h-[2.5rem] transition-transform duration-300 ease-in-out transform ${
                                selectedMonth === '6개월' ? 'bg-gray-100 text-red-400 translate-x-0' : 'bg-red-400 text-white translate-x-[10px]'
                            }`}
                            onClick={() => handleClick('6개월')}
                        >
                            6개월
                        </a>
                    </div>

                    <div className="flex items-center justify-center w-1/4 h-full">
                        <a
                            className={`w-[14.3rem] cursor-pointer items-center justify-center flex rounded-3xl h-[2.5rem] transition-transform duration-300 ease-in-out transform ${
                                selectedMonth === '12개월' ? 'bg-gray-100 text-red-400 translate-x-0' : 'bg-red-400 text-white translate-x-[10px]'
                            }`}
                            onClick={() => handleClick('12개월')}
                        >
                            12개월
                        </a>
                    </div>
                </div>
                <div className="w-[62rem] border-b-2 border-red-400 mt-[2rem]"></div>

                {/* 결제 금액 관련 탭 내용들 */}
                {activeTab === 'tab1' && (
                    <div className="tab-content flex flex-col mt-[0.4rem] w-[62rem] h-[15rem]">
                        <div className="flex flex-col">
                            <div className="flex ml-[5rem] mt-[1.2rem] flex-row">
                                <div className="flex items-start text-gray-950 w-1/2 text-lg">상품금액</div>
                                <div className="flex justify-end mr-[7rem] text-gray-950 w-1/2">{totalPrice.toLocaleString()}원</div>
                            </div>
                            <div className="flex ml-[5rem] mt-[1rem] flex-row">
                                <div className="flex items-start text-gray-950 w-1/2 text-lg">회원가 할인</div>
                                <div className="flex justify-end mr-[7rem] text-blue-500 w-1/2">{`-${discountPrice.toLocaleString()}원`}</div>
                            </div>
                            <div
                                className="flex flex-row w-[60rem] mt-[1rem] rounded-2xl items-center shadow-xl h-[2.5rem] bg-red-100">
                                <div className="flex ml-[4.8rem] items-start font-bold text-red-400 w-1/2 text-xl">결제 예정
                                    금액
                                </div>
                                <div className="flex justify-end mr-[5rem] text-xl font-bold text-red-400 w-1/2"> {`${(totalPrice - discountPrice).toLocaleString()}원`}
                                </div>
                            </div>
                            <div className="flex flex-row items-center mt-[2rem] justify-center w-[60rem]">
                                <div
                                    className="flex ml-[1rem] w-[10rem] border-[0.1rem] border-red-400 h-[3rem] rounded-xl items-center justify-center shadow-xl hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500">
                                    <a className="text-red-400">전체 삭제</a>
                                </div>
                                <div onClick={gobuyform}
                                     className="flex ml-[1rem] w-[10rem] h-[3rem] rounded-xl items-center justify-center shadow-xl hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500 bg-red-400">
                                    <a className="text-white">결제하기</a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'tab2' && (
                    <div className="tab-content flex flex-col mt-[0.4rem] w-[62rem] h-[15rem]">
                        <div className="flex flex-col">
                            <div className="flex ml-[5rem] mt-[1.2rem] flex-row">
                                <div className="flex items-start text-gray-950 w-1/2 text-lg">상품금액</div>
                                <div className="flex justify-end mr-[7rem] text-gray-950 w-1/2">{totalPrice.toLocaleString()}원</div>
                            </div>
                            <div className="flex ml-[5rem] mt-[1rem] flex-row">
                                <div className="flex items-start text-gray-950 w-1/2 text-lg">회원가 할인</div>
                                <div className="flex justify-end mr-[7rem] text-blue-500 w-1/2">{`-${discountPrice.toLocaleString()}원`}</div>
                            </div>
                            <div
                                className="flex flex-row w-[60rem] mt-[1rem] rounded-2xl items-center shadow-xl h-[2.5rem] bg-red-100">
                                <div className="flex ml-[4.8rem] items-start font-bold text-red-400 w-1/2 text-xl">결제 예정
                                    금액
                                </div>
                                <div
                                    className="flex justify-end mr-[5rem] text-xl font-bold text-red-400 w-1/2">{`${(totalPrice - discountPrice).toLocaleString()}원`}
                                </div>
                            </div>
                            <div className="flex flex-row items-center mt-[2rem] justify-center w-[60rem]">
                                <div
                                    className="flex ml-[1rem] w-[10rem] border-[0.1rem] border-red-400 h-[3rem] rounded-xl items-center justify-center shadow-xl hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500">
                                    <a className="text-red-400">전체 삭제</a>
                                </div>
                                <div onClick={gobuyform}
                                     className="flex ml-[1rem] w-[10rem] h-[3rem] rounded-xl items-center justify-center shadow-xl hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500 bg-red-400">
                                    <a className="text-white">결제하기</a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'tab3' && (
                    <div className="tab-content flex flex-col mt-[0.4rem] w-[62rem] h-[15rem]">
                        <div className="flex flex-col">
                            <div className="flex ml-[5rem] mt-[1.2rem] flex-row">
                                <div className="flex items-start text-gray-950 w-1/2 text-lg">상품금액</div>
                                <div className="flex justify-end mr-[7rem] text-gray-950 w-1/2">{totalPrice.toLocaleString()}원</div>
                            </div>
                            <div className="flex ml-[5rem] mt-[1rem] flex-row">
                                <div className="flex items-start text-gray-950 w-1/2 text-lg">회원가 할인</div>
                                <div className="flex justify-end mr-[7rem] text-blue-500 w-1/2">{`-${discountPrice.toLocaleString()}원`}</div>
                            </div>
                            <div
                                className="flex flex-row w-[60rem] mt-[1rem] rounded-2xl items-center shadow-xl h-[2.5rem] bg-red-100">
                                <div className="flex ml-[4.8rem] items-start font-bold text-red-400 w-1/2 text-xl">결제 예정
                                    금액
                                </div>
                                <div
                                    className="flex justify-end mr-[5rem] text-xl font-bold text-red-400 w-1/2">{`${(totalPrice - discountPrice).toLocaleString()}원`}
                                </div>
                            </div>
                            <div className="flex flex-row items-center mt-[2rem] justify-center w-[60rem]">
                                <div
                                    className="flex ml-[1rem] w-[10rem] border-[0.1rem] border-red-400 h-[3rem] rounded-xl items-center justify-center shadow-xl hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500">
                                    <a className="text-red-400">전체 삭제</a>
                                </div>
                                <div onClick={gobuyform}
                                     className="flex ml-[1rem] w-[10rem] h-[3rem] rounded-xl items-center justify-center shadow-xl hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500 bg-red-400">
                                    <a className="text-white">결제하기</a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'tab4' && (
                    <div className="tab-content flex flex-col mt-[0.4rem] w-[62rem] h-[15rem]">
                        <div className="flex flex-col">
                            <div className="flex ml-[5rem] mt-[1.2rem] flex-row">
                                <div className="flex items-start text-gray-950 w-1/2 text-lg">상품금액</div>
                                <div className="flex justify-end mr-[7rem] text-gray-950 w-1/2">{totalPrice.toLocaleString()}원</div>
                            </div>
                            <div className="flex ml-[5rem] mt-[1rem] flex-row">
                                <div className="flex items-start text-gray-950 w-1/2 text-lg">회원가 할인</div>
                                <div className="flex justify-end mr-[7rem] text-blue-500 w-1/2">{`-${discountPrice.toLocaleString()}원`}</div>
                            </div>
                            <div
                                className="flex flex-row w-[60rem] mt-[1rem] rounded-2xl items-center shadow-xl h-[2.5rem] bg-red-100">
                                <div className="flex ml-[4.8rem] items-start font-bold text-red-400 w-1/2 text-xl">결제 예정
                                    금액
                                </div>
                                <div
                                    className="flex justify-end mr-[5rem] text-xl font-bold text-red-400 w-1/2">{`${(totalPrice - discountPrice).toLocaleString()}원`}
                                </div>
                            </div>
                            <div className="flex flex-row items-center mt-[2rem] justify-center w-[60rem]">
                                <div
                                    className="flex ml-[1rem] w-[10rem] border-[0.1rem] border-red-400 h-[3rem] rounded-xl items-center justify-center shadow-xl hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500">
                                    <a className="text-red-400">전체 삭제</a>
                                </div>
                                <div onClick={gobuyform}
                                     className="flex ml-[1rem] w-[10rem] h-[3rem] rounded-xl items-center justify-center shadow-xl hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500 bg-red-400">
                                    <a className="text-white">결제하기</a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
