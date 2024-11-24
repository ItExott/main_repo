import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Product_Main from "./pages/Product_Main.jsx";
import Agree_to_terms from "./pages/Agree_to_terms.jsx";
import Complete_SignUp from "./pages/Complete_SignUp.jsx";
import SignUp from "./pages/SignUp.jsx";
import Find_Id from "./pages/Find_Id.jsx";
import Find_Id_Check from "./pages/Find_Id_Check.jsx";
import Find_Pw from "./pages/Find_Pw.jsx";
import Find_Pw_Check from "./pages/Find_Pw_Check.jsx";
import Product from "./pages/Product.jsx";
import "./app.css";
import Cart from "./pages/Cart.jsx";
import MBL_CRTFC from "./pages/MBL_CRTFC.jsx";
import Buyform from "./pages/Buyform.jsx";

function App() {
    const [loginStatus, setLoginStatus] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [money, setMoney] = useState(0);

    // 로그인 상태 확인 및 userInfo 가져오기
    useEffect(() => {
        const storedLoginStatus = sessionStorage.getItem("loginStatus");
        const storedUserProfile = JSON.parse(sessionStorage.getItem("userProfile"));

        if (storedLoginStatus === "true" && storedUserProfile) {
            setLoginStatus(true);
            setUserProfile(storedUserProfile);
            // 사용자 정보 API에서 가져오기
            fetchUserInfo(); // 사용자 정보 가져오는 함수 호출
        } else {
            setLoginStatus(false);
            setUserProfile(null);
            setMoney(0); // 로그인하지 않으면 money는 0으로 초기화
        }
    }, []); // 컴포넌트 마운트 시 한번만 실행


    // API 호출로 사용자 정보 (money와 profileimg) 가져오기
    const fetchUserInfo = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/userinfo", { withCredentials: true });
            console.log(response.data); // Log the response to check if profileimg is present

            // 로그인 성공 여부 확인
            if (response.data.success) {
                setMoney(response.data.money); // API 응답에서 money 값을 상태로 설정
                setUserProfile({
                    profileimg: response.data.profileimg, // 프로필 이미지를 상태로 설정
                    name: response.data.name, // 사용자 이름도 설정
                    userId: response.data.userId, // 사용자 아이디도 설정
                    ...response.data // 여기에 다른 사용자 정보를 포함할 수 있음
                });
                // sessionStorage에도 저장
                sessionStorage.setItem("money", response.data.money);
                sessionStorage.setItem("userProfile", JSON.stringify({
                    profileimg: response.data.profileimg,
                    name: response.data.name,
                    userId: response.data.userId,
                    ...response.data
                }));
            } else {
                setMoney(0); // 로그인되지 않은 경우 money는 0으로 설정
                setUserProfile(null); // 로그인되지 않으면 프로필 정보 삭제
            }
        } catch (error) {
            console.error("사용자 정보 가져오기 실패:", error);
            setMoney(0); // 오류 발생 시 money는 0으로 설정
            setUserProfile(null); // 오류 발생 시 프로필 정보 삭제
        }
    };

    return (
        <div className="App">
            <Navbar loginStatus={loginStatus} setLoginStatus={setLoginStatus} userProfile={userProfile} money={money}/>
            <Routes>
                <Route path="/Cart" element={<Cart/>}/>
                <Route path="/Buyform" element={<Buyform/>}/>
                <Route path="/Find_Id" element={<Find_Id/>}/>
                <Route path="/Find_Id_Check" element={<Find_Id_Check/>}/>
                <Route path="/Find_Pw" element={<Find_Pw/>}/>
                <Route path="/Find_Pw_Check" element={<Find_Pw_Check/>}/>
                <Route path="/Agree_to_terms/MBL_CRTFC" element={<MBL_CRTFC/>}/>
                <Route path="/Agree_to_terms/MBL_CRTFC/SignUp" element={<SignUp/>}/>
                <Route path="/Complete_SignUp" element={<Complete_SignUp/>}/>
                <Route path="/Agree_to_terms" element={<Agree_to_terms/>}/>
                <Route path="/Product_Main/:category" element={<Product_Main/>}/>
                <Route path="/product/:id" element={<Product/>}/>
                <Route path="/" element={<Home/>}/>
            </Routes>
        </div>
    );
}

export default App;
