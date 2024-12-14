import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductManage = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]); // To store fetched products
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/userinfo', {
                    withCredentials: true, // 세션을 확인하려면 반드시 필요
                });

                if (response.data.success) {
                    setIsLoggedIn(true);
                    setUserData(response.data);
                    setUserId(response.data.userId);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('로그인 상태 확인 실패', error);
            }
        };

        checkLoginStatus();
    }, []);

    useEffect(() => {
        if (isLoggedIn && userId) {
            const fetchProducts = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/products?userId=${userId}`, {
                        withCredentials: true,
                    });
                    if (response.data) {
                        setProducts(response.data); // 받아온 상품 데이터를 상태에 저장
                    }
                } catch (error) {
                    console.error('상품 데이터 가져오기 실패', error);
                }
            };

            fetchProducts();
        }
    }, [isLoggedIn, userId]); // 로그인 상태와 userId가 변경될 때마다 실행


    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Close product details popup
    const closePopup = () => {
        setIsPopupOpen(false);
    };

    // Navigate to the edit product page
    const handleEditProduct = (prodid) => {
        navigate(`/Fixproduct/${prodid}`);
    };

    // Handle delete product
    const handleDeleteProduct = (prodid) => {
        if (!userId) {
            alert('로그인 후 삭제할 수 있습니다.');
            return;
        }

        // 삭제할 상품의 prodid와 userId를 백엔드로 전달
        axios.delete('http://localhost:8080/product/delete', {
            params: { prodid },  // prodid를 URL 쿼리 파라미터로 전송
            withCredentials: true, // 세션 쿠키 포함
        })
            .then(response => {
                if (response.status === 200) {
                    alert('상품이 삭제되었습니다.');
                    // 삭제 후 상품 목록 다시 불러오기
                    setProducts(products.filter(product => product.prodid !== prodid));
                } else {
                    alert('상품 삭제 실패');
                }
            })
            .catch(error => {
                console.error('상품 삭제 실패', error);
                alert('상품 삭제에 실패했습니다.');
            });

    };


    return (
        <div className="flex flex-col mt-[1rem] h-full items-center justify-center mx-28">
            <a className="flex items-center text-red-400 w-[62rem] font-bold text-xl justify-center">게시물 관리</a>
            <div className="w-[62rem] border-b-2 border-red-400 mt-4"></div>

            <div className="flex mt-6 space-x-8 mb-6">
                <div
                    onClick={() => handleTabChange('all')}
                    className={`cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 ${activeTab === 'all' ? 'text-red-400 border-b-2 border-red-400' : 'text-red-400'}`}
                >
                    전체 게시물
                </div>
            </div>

            {activeTab === 'all' && (
                <div className="w-full">
                    <div className="grid grid-cols-3 gap-4">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div key={product.prodid}  // 고유값을 key로 설정
                                     className="border cursor-pointer h-[12.5rem] rounded-lg shadow-md hover:scale-105 transition-transform duration-500 relative">
                                    <div className="w-full h-32 bg-gray-200 rounded-md flex justify-center items-center">
                                        <img src={product.iconpicture} className="object-cover w-full h-full" />
                                    </div>
                                    <h3 className="text-lg text-red-400 mt-2">{product.prodtitle}</h3>
                                    <p className="text-sm text-red-400 mt-2">{product.date}</p>

                                    {/* 아이콘 영역을 제목 아래로 이동 */}
                                    <div className="flex justify-between mt-4 absolute bottom-4 left-4 right-4">
                                        <FaEdit
                                            className="text-red-400 cursor-pointer hover:scale-110"
                                            onClick={() => handleEditProduct(product.prodid)}
                                        />
                                        <FaTrashAlt
                                            className="text-red-400 cursor-pointer hover:scale-110"
                                            onClick={() => handleDeleteProduct(product.prodid)}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-red-400">등록된 상품이 없습니다.</p>
                        )}
                    </div>
                </div>
            )}
            {isPopupOpen && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div className="bg-white justify-center p-6 rounded-lg shadow-lg w-[42rem] h-[28rem] flex flex-col">
                        <div className="flex justify-end w-full h-[1rem] items-center cursor-pointer">
                            <div
                                onClick={closePopup}
                                className="text-red-400 w-[2rem] mb-[3rem] h-[2rem] items-center justify-center flex hover:bg-red-400 hover:text-white rounded-full font-bold text-lg"
                            >
                                X
                            </div>
                        </div>
                        <div className="flex flex-row">
                            <div className="w-[20rem] ml-[2rem] h-[20rem] bg-gray-200 rounded-full"></div>
                            <div className="flex flex-col ml-[3rem] mt-[3rem]">
                                <h3 className="text-xl text-red-400">상품 제목</h3>
                                <p className="text-sm text-red-400">상품 설명...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManage;
