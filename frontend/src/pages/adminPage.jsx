import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchCard from "../components/SearchCard.jsx";
import userCard from "../components/userCard.jsx";
import {useNavigate} from "react-router-dom";
import {useRecoilSnapshot} from "recoil";
import UserCard from "../components/userCard.jsx";
const AdminPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSection, setSelectedSection] = useState("products"); // 관리 모드 상태 추가
    const [users, setUsers] = useState([]); // 유저 목록 상태 추가
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
            <h1 className="text-center font-bold text-2xl mt-[2rem]">ADMIN PAGE</h1>
            <div className="flex justify-start w-[54rem] mt-10">
                <div className="flex flex-row justify-start items-start">
                    <div className="flex justify-center items-center flex-col mr-[1rem]">
                        {/* 제품관리 버튼 클릭 시 */}
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                            onClick={() => setSelectedSection("products")}
                        >
                            제품관리
                        </button>
                        {/* 유저관리 버튼 클릭 시 */}
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => setSelectedSection("users")}
                        >
                            유저관리
                        </button>
                    </div>

                    {/* 조건부 렌더링 */}
                    <div>
                        {selectedSection === "products" ? (
                            <div className="grid grid-cols-3 gap-4"> {/* 3개의 카드가 한 줄에 배치되도록 설정 */}
                                {loading ? (
                                    <p>로딩 중...</p>
                                ) : (
                                    products.map((product) => (
                                        <SearchCard
                                            key={product.prodid}
                                            id={product.prodid}
                                            prodtitle={product.prodtitle}
                                            prodprice={product.prodprice}
                                            prodaddress={product.prodaddress}
                                            prodrating={product.prodrating}
                                            iconpicture={product.iconpicture}
                                            onClick={() => handleClickprodid(product.prodid)}
                                            className="flex"
                                        />
                                    ))
                                )}
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