import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBarcode } from "react-icons/fa";
import { FaPlaystation } from "react-icons/fa6";
import {useNavigate} from "react-router-dom";

const Mypage = () => {
    const [userData, setUserData] = useState(null);  // User data for profile (name, etc.)
    const [activeTab, setActiveTab] = useState('recentItems');
    const [recentItems, setRecentItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/userinfo', { withCredentials: true });
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };

        const fetchRecentItems = async () => {
            try {
                const response = await axios.get('http://localhost:8080/recent-products', { withCredentials: true });
                setRecentItems(response.data);  // Set recent items in state
            } catch (error) {
                console.error("Error fetching recent items", error);
            }
        };

        fetchRecentItems();
        fetchUserData();
    }, []);
    // Return loading state while user data is being fetched
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

    return (
        <div className="flex flex-col mt-[1rem] h-full items-center justify-center mx-28">
            <a className="flex items-center text-red-400 w-[62rem] font-bold text-xl justify-center">마이페이지</a>
            <div className="w-[62rem] border-b-2 border-red-400 mt-4"></div>
            {/*메인카드 부분*/}
            <div className="w-[50rem] h-[15rem] mt-6 shadow-xl flex items-center">
                <div className="w-[10rem] flex items-center ml-[3rem] h-full"><img
                    className="border-[0.15rem] shadow-mg hover:scale-110 transition-transform ease-in-out duration-500 border-red-400 rounded-full w-[10rem] h-[10rem]"
                    src={userData.profileimg}/></div>
                <div className="flex ml-[1rem] items-center w-[8rem]">
                    <div className="flex flex-col space-y-2 items-start">
                        <div
                            className="text-red-400 hover:bg-red-400 cursor-pointer hover:text-white hover:scale-110 transition-transform ease-in-out duration-500 border-b-[0.1rem] border-red-400 w-[6rem] h-[2.5rem] flex justify-center items-center">
                            <a>개인정보 변경</a></div>
                        <div
                            className="text-red-400 border-b-[0.1rem] cursor-pointer hover:bg-red-400 hover:text-white hover:scale-110 transition-transform ease-in-out duration-500 border-red-400 w-[4rem] h-[2.5rem] flex justify-center items-center">
                            <a>PW 변경</a></div>
                        <div
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
                        <a className="flex text-lg text-red-400 ml-[6.6rem]">{userData ? `${userData.name}님` : '로딩 중...'}</a>
                    </div>
                    <FaBarcode className="w-[2rem] h-[2rem] fill-red-400"/>
                    <div className="flex items-center flex-row mt-[2.3rem]">
                        <a className="flex text-xs mt-[0.1rem] text-red-200">현재 잔액</a>
                        <a className="flex text-xl ml-[9.1rem] text-red-400">{userData.money.toLocaleString()}원</a>
                    </div>
                </div>
            </div>

            <div className="flex mt-6 space-x-8 mb-6">
                <div
                    onClick={() => handleTabChange('recentItems')}
                    className={`cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 ${activeTab === 'recentItems' ? 'text-red-400 border-b-2 border-red-400' : 'text-red-400'}`}
                >
                    최근 본 짐
                </div>
                <div
                    onClick={() => handleTabChange('subscriptions')}
                    className={`cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 ${activeTab === 'subscriptions' ? 'text-red-400 border-b-2 border-red-400' : 'text-red-400'}`}
                >
                    구독 짐
                </div>
                <div
                    onClick={() => handleTabChange('likedItems')}
                    className={`cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 ${activeTab === 'likedItems' ? 'text-red-400 border-b-2 border-red-400' : 'text-red-400'}`}
                >
                    관심 짐
                </div>
            </div>
            {activeTab === 'recentItems' && (
                <div className="w-full">
                    {/* Display recent items */}
                    <div className="grid grid-cols-3 gap-4">
                        {recentItems.map(item => (
                            <div key={item.id} onClick={() => handleClick(item.prodid)} className="border h-[11rem] rounded-lg shadow-md hover:scale-105 transition-transform duration-500">
                                <img src={item.iconpicture} alt={item.name} className="w-full h-32 object-cover rounded-md" />
                                <h3 className="text-lg text-red-400 mt-2">{item.prodtitle}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {activeTab === 'subscriptions' && (
                <div className="w-full h-full">

                </div>
            )}
             {activeTab === 'likedItems' && (
            <div className="w-full">
                ss
            </div>
        )}


        </div>
    );
};

export default Mypage;
