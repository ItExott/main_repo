import React, { useState, useEffect } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BottomBox = () => {
    const { id } = useParams(); // URL 파라미터에서 상품 ID를 가져옴
    const [productData, setProductData] = useState({
        iconpicture: "",
        prodid: "",
        prodtitle: "",
        prodrating: "",
        address: "",
        prodpicture: "",
        prodprice: ""
    });

    const [isFilled, setIsFilled] = useState(false); // 별점 클릭 상태
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
    const [userId, setUserId] = useState(null); // 로그인된 유저 ID
    const [loading, setLoading] = useState(false); // 로딩 상태

    // 상품 데이터 가져오기
    useEffect(() => {
        axios.get(`http://localhost:8080/product/${id}`)
            .then(response => {
                setProductData(response.data);
            })
            .catch(error => {
                console.error("Error fetching product data:", error);
                alert("상품 정보를 불러오는 데 실패했습니다.");
            });
    }, [id]);

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

    // 별점 클릭 상태 토글 (로그인된 경우만 허용)
    const handleClick = () => {
        if (!isLoggedIn) {
            alert("로그인 후 별점을 남길 수 있습니다.");
            return;
        }
        setIsFilled(!isFilled);
    };

    // 장바구니 추가 클릭 시
    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            alert("로그인 후 장바구니에 추가할 수 있습니다.");
            return;
        }

        setLoading(true); // 로딩 상태 시작
        try {
            const response = await axios.post('http://localhost:8080/add-to-cart', {
                prodid: productData.prodid // 선택한 상품 ID
            }, {
                withCredentials: true // 세션 쿠키 전송 허용
            });

            alert(response.data.message); // 성공 메시지 표시
        } catch (error) {
            if (error.response) {
                alert(error.response?.data?.message || "서버 오류가 발생했습니다.");
            } else if (error.request) {
                alert("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
            } else {
                alert("알 수 없는 오류가 발생했습니다.");
            }
            console.error("Error adding to cart:", error);
        } finally {
            setLoading(false); // 로딩 상태 종료
        }
    };

    return (
        <div className="fixed z-10 bottom-0 left-0">
            <div className="flex flex-row items-center w-screen bg-white h-[5rem] outline outline-1 outline-gray-300">
                <p className="ml-[5rem] text-[1.5rem] text-red-500 font-semibold whitespace-nowrap">상품 금액</p>
                <p className="ml-[2.3rem] text-[1.5rem] text-black font-black whitespace-nowrap">{productData.prodprice}원</p>
                <p className="text-[1.5rem] text-black font-black whitespace-nowrap ml-[0.4rem]">~ / 월</p>

                {/* 별점 클릭 */}
                <div
                    className={`ml-[38rem] flex items-center hover:scale-110 transition-transform ease-in-out duration-500 justify-center cursor-pointer rounded-md outline outline-1 h-[3rem] w-[3rem] outline-gray-300 ${
                        !isLoggedIn && "cursor-not-allowed opacity-50"
                    }`}
                    onClick={handleClick}
                    aria-label={isFilled ? "별점 선택됨" : "별점 선택 안됨"}
                >
                    {isFilled ? (
                        <FaStar className="flex w-[1.3rem] h-[1.3rem] mb-[0.1rem] fill-red-400" />
                    ) : (
                        <FaRegStar className="flex w-[1.3rem] h-[1.3rem] mb-[0.1rem]" />
                    )}
                </div>

                {/* 장바구니 추가 버튼 */}
                <div
                    className={`flex ml-[0.5rem] hover:bg-gray-100 h-[2.9rem] w-[7.3rem] hover:scale-110 transition-transform ease-in-out duration-500 items-center justify-center cursor-pointer rounded-l-md ring-offset-0 ring-[0.04rem] ring-red-500 bg-white ${
                        (!isLoggedIn || loading) && "cursor-not-allowed opacity-50"
                    }`}
                    onClick={handleAddToCart}
                >
                    <p className="font-bold text-base flex mt-[0.1rem] text-red-500">{loading ? "로딩 중..." : "장바구니"}</p>
                </div>

                {/* 바로 구매 버튼 */}
                <div
                    className={`flex hover:bg-red-500 h-[3rem] w-[7.3rem] items-center hover:scale-110 transition-transform ease-in-out duration-500 justify-center cursor-pointer rounded-r-md bg-red-500 ring-offset-0 ring-0 ${
                        !isLoggedIn && "cursor-not-allowed opacity-50"
                    }`}
                >
                    <p className="font-bold text-base flex mt-[0.1rem] text-white">바로구매</p>
                </div>
            </div>
        </div>
    );
};

export default BottomBox;
