import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBarcode } from "react-icons/fa";
import { FaPlaystation } from "react-icons/fa6";
import {useNavigate} from "react-router-dom";

const Mypage = () => {
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState('subscriptions');
    const [recentItems, setRecentItems] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [likedItems, setLikedItems] = useState([]);
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const ClickCard = (prodid) => {
        const clickedItem = subscriptions.find(item => item.prodid === prodid);
        setSelectedItem(clickedItem);
        setIsPopupOpen(true); // Open the popup
    };

    const CloseCard = () => {
        setIsPopupOpen(false); // Close the popup
    };

    useEffect(() => {
        // 사용자 데이터 가져오기
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/userinfo', { withCredentials: true });
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };

        // 최근 상품 데이터 가져오기
        const fetchRecentItems = async () => {
            try {
                const response = await axios.get('http://localhost:8080/recent-products', { withCredentials: true });
                setRecentItems(response.data);  // 최근 상품을 상태에 저장
            } catch (error) {
                console.error("Error fetching recent items", error);
            }
        };

        // 구독 상품 목록 가져오기
        const fetchSubscriptions = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/user/subscriptions', { withCredentials: true });

                if (response.data && response.data.length > 0) {
                    // 구독 상품 데이터 저장
                    setSubscriptions(response.data);
                } else {
                    console.log('No subscriptions found');
                }
            } catch (error) {
                console.error("Error fetching subscriptions:", error);
            }
        };
            // 관심 짐 목록 가져오기
            const fetchLikedItems = async () => {
                try {
                    const response = await axios.get('http://localhost:8080/api/user/liked-items', { withCredentials: true });

                    if (response.data && response.data.length > 0) {
                        setLikedItems(response.data);  // 관심 제품 데이터를 상태에 저장
                    } else {
                        console.log('No liked items found');
                    }
                } catch (error) {
                    console.error("Error fetching liked items:", error);
                }
            };

            // API 호출
            fetchUserData();
            fetchRecentItems();
            fetchSubscriptions();  // 구독 상품 목록 추가
            fetchLikedItems();  // 관심 짐 목록 추가
        }, []);  // 데이터 가져오는 구문

    if (!userData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleClick = (id) => {
        navigate(`/product/${id}`);  // Navigate to the product detail page
    };

    const goChangeUser = () => navigate("/MyPage/ChangeUser");
    const goDeleteUser = () => navigate("/MyPage/DeleteUser");

    return (
        <div className="flex flex-col mt-[1rem] h-full items-center justify-center mx-28">
            <a className="flex items-center text-red-400 w-[62rem] font-bold text-xl justify-center">마이페이지</a>
            <div className="w-[62rem] border-b-2 border-red-400 mt-4"></div>
            {/*메인카드 부분*/}
            <div className="w-[50rem] h-[15rem] mt-6 shadow-xl flex items-center">
                <div className="w-[10rem] flex items-center ml-[3rem] h-full"><img
                    className="border-[0.15rem] shadow-mg hover:scale-110 transition-transform ease-in-out duration-500 border-red-400 rounded-full w-[10rem] h-[10rem]"
                    src={`http://localhost:8080${userData.profileimg}`}/></div>
                <div className="flex ml-[1rem] items-center w-[8rem]">
                    <div className="flex flex-col space-y-2 items-start">
                        <div
                            onClick={goChangeUser}
                            className="text-red-400 hover:bg-red-400 cursor-pointer hover:text-white hover:scale-110 transition-transform ease-in-out duration-500 border-b-[0.1rem] border-red-400 w-[6rem] h-[2.5rem] flex justify-center items-center">
                            <a>회원정보 수정</a></div>
                        <div
                            onClick={goDeleteUser}
                            className="text-red-400 border-b-[0.1rem] cursor-pointer hover:bg-red-400 hover:text-white hover:scale-110 transition-transform ease-in-out duration-500 border-red-400 w-[4rem] h-[2.5rem] flex justify-center items-center">
                            <a>회원 탈퇴</a></div>
                    </div>
                </div>
                <div
                    className="flex flex-col ml-[6rem] hover:scale-110 transition-transform ease-in-out duration-500 w-[20rem] p-4 border-[0.1rem] border-red-400 h-[10rem] rounded-2xl">
                    <div className="flex flex-row text-red-400">
                        <a className="text-sm mt-[0.1rem]">핏머니 ·</a>
                        <FaPlaystation className="mt-[0.1rem] ml-[0.1rem]"/>
                        <a className="text-sm mt-[0.1rem]">PLAY 증권</a>
                        <a className="flex text-lg text-red-400 ml-auto">{userData ? `${userData.name}님` : '로딩 중...'}</a>
                    </div>
                    <FaBarcode className="w-[2rem] h-[2rem] fill-red-400"/>
                    <div className="flex items-center flex-row mt-[2.3rem] justify-between">
                        <a className="flex text-xs mt-[0.1rem] text-red-200">현재 잔액</a>
                        <a className="flex text-xl text-red-400">{userData.money.toLocaleString()}원</a>
                    </div>
                </div>
            </div>

            <div className="flex mt-6 space-x-8 mb-6">
                <div
                    onClick={() => handleTabChange('subscriptions')}
                    className={`cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 ${activeTab === 'subscriptions' ? 'text-red-400 border-b-2 border-red-400' : 'text-red-400'}`}
                >
                    구독 짐
                </div>
                <div
                    onClick={() => handleTabChange('recentItems')}
                    className={`cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 ${activeTab === 'recentItems' ? 'text-red-400 border-b-2 border-red-400' : 'text-red-400'}`}
                >
                    최근 본 짐
                </div>
                <div
                    onClick={() => handleTabChange('likedItems')}
                    className={`cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 ${activeTab === 'likedItems' ? 'text-red-400 border-b-2 border-red-400' : 'text-red-400'}`}
                >
                    관심 짐
                </div>
            </div>
            {activeTab === 'subscriptions' && (
                <div className="w-full">
                    {/* Display subscriptions */}
                    <div className="grid grid-cols-3 gap-4">
                        {subscriptions.map((item, index) => (
                            <div key={`${item.id}-${index}`}
                                 onClick={() => ClickCard(item.prodid)} className="border cursor-pointer h-[12.5rem] rounded-lg shadow-md hover:scale-105 transition-transform duration-500">
                                <img src={item.iconpicture} className="w-full h-32 object-cover rounded-md"/>
                                <h3 className="text-lg text-red-400 mt-2">{item.prodtitle}</h3>
                                <a className="text-lg text-red-400 mt-2">운동 시작 일 : {new Date(item.startdate).toLocaleDateString('ko-KR')}</a>
                            </div>
                        ))}
                    </div>
                    {isPopupOpen && selectedItem && (
                        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                            <div className="bg-white justify-center p-6 rounded-lg shadow-lg w-[42rem] h-[28rem] flex flex-col">
                                <div className="flex justify-end w-full h-[1rem] items-center cursor-pointer">
                                    <div
                                        onClick={CloseCard}
                                        className="text-red-400 w-[2rem] mb-[3rem] h-[2rem] items-center justify-center flex hover:bg-red-400 hover:text-white rounded-full font-bold text-lg"
                                    >
                                        X
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <img
                                        src={selectedItem.iconpicture}
                                        alt={selectedItem.prodtitle}
                                        className="w-[20rem] ml-[2rem] h-[20rem] rounded-full"
                                    />
                                    <div className="flex flex-col ml-[3rem] mt-[3rem]">
                                        <h3 className="text-xl text-red-400">{selectedItem.prodtitle}</h3>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            )}
            {activeTab === 'recentItems' && (
                <div className="w-full">
                    {/* Display recent items */}
                    <div className="grid grid-cols-3 gap-4">
                        {recentItems.map((item, index) => (
                            <div key={`${item.id}-${index}`} onClick={() => handleClick(item.prodid)} className="border cursor-pointer h-[11rem] rounded-lg shadow-md hover:scale-105 transition-transform duration-500">
                                <img src={item.iconpicture} alt={item.name} className="w-full h-32 object-cover rounded-md" />
                                <h3 className="text-lg text-red-400 mt-2">{item.prodtitle}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {activeTab === 'likedItems' && (
                <div className="w-full">
                    {/* 관심 짐 목록을 표시 */}
                    <div className="grid grid-cols-3 gap-4">
                        {likedItems.map((item, index) => (
                            <div key={`${item.id}-${index}`} onClick={() => handleClick(item.prodid)} className="border cursor-pointer h-[11rem] rounded-lg shadow-md hover:scale-105 transition-transform duration-500">
                                <img src={item.iconpicture} alt={item.prodtitle} className="w-full h-32 object-cover rounded-md" />
                                <h3 className="text-lg text-red-400 mt-2">{item.prodtitle}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default Mypage;
