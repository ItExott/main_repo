import React, { useState, useEffect } from "react";
import axios from "axios";
import userCard from "../components/userCard.jsx";
import {useNavigate} from "react-router-dom";
import {useRecoilSnapshot} from "recoil";
import UserCard from "../components/userCard.jsx";
import ReactPaginate from "react-paginate";
import AdminCard from "../components/AdminCard.jsx";


const AdminPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSection, setSelectedSection] = useState("products"); // 관리 모드 상태 추가
    const [users, setUsers] = useState([]); // 유저 목록 상태 추가
    const itemsPerPage = 6;  // 한 페이지에 표시할 카드 수
    const [currentPage, setCurrentPage] = useState(0);  // 현재 페이지
    const [currentItems, setCurrentItems] = useState([]);  // 현재 페이지에 표시할 아이템들

    useEffect(() => {
        // 현재 페이지에 맞는 아이템을 설정
        const offset = currentPage * itemsPerPage;
        setCurrentItems(products.slice(offset, offset + itemsPerPage));
    }, [currentPage, products]);

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const handleDeleteProduct = async (prodid) => {
        try {
            const response = await axios.delete('http://localhost:8080/product/admindelete', {
                params: { prodid },
                withCredentials: true,
            });

            if (response.status === 200) {
                alert('상품이 삭제되었습니다.');
                // 삭제 후 상품 목록 업데이트
                setProducts(prevProducts => prevProducts.filter(product => product.prodid !== prodid));
            } else {
                alert('상품 삭제 실패');
            }
        } catch (error) {
            console.error('상품 삭제 실패:', error.response || error);
            alert('상품 삭제에 실패했습니다.');
        }
    };

    // 제품 데이터 가져오기
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/productsadmin");
                setProducts(response.data); // 받아온 데이터로 상태 갱신
                setLoading(false); // 데이터 로딩 완료
            } catch (error) {
                console.error("제품 정보를 가져오는 데 실패했습니다:", error);
                setLoading(false); // 에러가 나도 로딩 종료
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/usersadmin"); // 유저 API 경로 추가
                setUsers(response.data);
            } catch (error) {
                console.error("유저 정보를 가져오는 데 실패했습니다:", error);
            }
        };

        fetchProducts();
        fetchUsers();
    }, []);

    const saveRecentlyViewed = (id) => {
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        if (!recentlyViewed.includes(id)) {
            recentlyViewed.push(id);
        }
        if (recentlyViewed.length > 5) {
            recentlyViewed.shift();
        }
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    };


    const handleClickprodid = (id) => {
        // Save to local storage (optional)
        saveRecentlyViewed(id);
        navigate(`/productAdmin/${id}`);  // Navigate to the product detail page
    };
    const handleClickuserid = (id) => {
        // Save to local storage (optional)
        saveRecentlyViewed(id);
        navigate(`/UserAdmin/${id}`);  // Navigate to the product detail page
    };

    return (
        <div className="flex justify-center items-center flex-col">
            <a className="flex items-center mt-[1rem] text-red-400 w-[62rem] font-bold text-xl justify-center">
                관리자 페이지
            </a>
            <div className="w-[56cd     rem] border-b-2 border-red-400 mt-4"></div>
            <div className="flex justify-start w-[54rem] mt-10">
                <div className="flex flex-row justify-start items-start">
                    <div className="flex justify-center items-center flex-col mr-[1rem]">
                        {/* 제품관리 버튼 클릭 시 */}
                        <button
                            className="bg-red-400 hover:bg-white hover:border hover:border-red-400 hover:text-red-400 hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500 text-white px-4 py-2 rounded mb-4"
                            onClick={() => setSelectedSection("products")}
                        >
                            제품관리
                        </button>
                        {/* 유저관리 버튼 클릭 시 */}
                        <button
                            className="bg-red-400 hover:bg-white hover:border hover:border-red-400 hover:text-red-400 hover:scale-110 cursor-pointer transition-transform ease-in-out duration-500 text-white px-4 py-2 rounded"
                            onClick={() => setSelectedSection("users")}
                        >
                            유저관리
                        </button>
                    </div>

                    <div>
                        {selectedSection === "products" ? (
                            <div>
                                {/* 3개의 카드가 한 줄에 배치되도록 설정 */}
                                <div className="grid grid-cols-3 gap-4">
                                    {loading ? (
                                        <p>로딩 중...</p>
                                    ) : (
                                        currentItems.map((product) => (
                                            <AdminCard
                                                key={product.prodid}
                                                id={product.prodid}
                                                prodtitle={product.prodtitle}
                                                prodprice={product.prodprice}
                                                prodaddress={product.prodaddress}
                                                prodrating={product.prodrating}
                                                iconpicture={product.iconpicture}
                                                onClick={() => handleClickprodid(product.prodid)}
                                                className="flex"
                                                onDelete={handleDeleteProduct}
                                            />
                                        ))
                                    )}
                                </div>

                                {/* 페이지네이션 추가 */}
                                <div className="flex justify-center mt-4">
                                    <ReactPaginate
                                        previousLabel={"이전"}
                                        nextLabel={"다음"}
                                        pageCount={Math.ceil(products.length / itemsPerPage)}
                                        onPageChange={handlePageChange}
                                        containerClassName={"flex space-x-4"}
                                        pageClassName={"cursor-pointer px-4 py-2 border border-gray-300 rounded-md"}
                                        activeClassName={"bg-red-400 text-white"}
                                        disabledClassName={"text-red-400 flex items-center"}
                                        previousClassName={"flex items-center"} // 이전 버튼 스타일
                                        nextClassName={"flex items-center"} // 다음 버튼 스타일
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-4">
                                {users.map((user) => (
                                    <UserCard
                                        key={user.userid}
                                        id={user.userid}
                                        name={user.name}
                                        profileimg={user.profileimg}
                                        onClick={() => handleClickuserid(user.userid)} // 콜백 함수 전달
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;