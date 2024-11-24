import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios 추가
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
import Cartproduct from "./components/Cartproduct.jsx";
import Buyform from "./pages/Buyform.jsx";  // app.css 파일을 import

function App() {
    const [loginStatus, setLoginStatus] = useState(false);
    const [userProfile, setUserProfile] = useState(null);  // 사용자 프로필 정보 상태

    // 페이지 URL이 바뀔 때마다 로그인 상태 확인
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8080/check-session', { withCredentials: true });
                if (response.data.loggedIn) {
                    setLoginStatus(true);
                    setUserProfile(response.data.userId); // userId 또는 프로필 정보를 사용
                    localStorage.setItem("loginStatus", "true");
                    localStorage.setItem("userProfile", JSON.stringify(response.data.userId)); // 로컬스토리지에 저장
                } else {
                    setLoginStatus(false);
                    setUserProfile(null);
                    localStorage.setItem("loginStatus", "false");
                    localStorage.removeItem("userProfile");
                }
            } catch (error) {
                console.error('로그인 상태 확인 오류:', error);
                setLoginStatus(false);
                setUserProfile(null);
                localStorage.setItem("loginStatus", "false");
                localStorage.removeItem("userProfile");
            }
        };

        checkLoginStatus(); // 페이지 로드 시 로그인 상태 확인

    }, []); // 빈 배열로 설정하여 페이지가 처음 렌더링될 때만 실행되도록 함.

    return (
        <div className="App">
            <Navbar loginStatus={loginStatus} setLoginStatus={setLoginStatus} />
            <Routes>
                <Route path="/Cart" element={<Cart />} />
                <Route path="/Buyform" element={<Buyform />} />
                <Route path="/Find_Id" element={<Find_Id />} />
                <Route path="/Find_Id_Check" element={<Find_Id_Check />} />
                <Route path="/Find_Pw" element={<Find_Pw />} />
                <Route path="/Find_Pw_Check" element={<Find_Pw_Check />} />
                <Route path="/Agree_to_terms/MBL_CRTFC" element={<MBL_CRTFC />} />
                <Route path="/Agree_to_terms/MBL_CRTFC/SignUp" element={<SignUp />} />
                <Route path="/Complete_SignUp" element={<Complete_SignUp />} />
                <Route path="/Agree_to_terms" element={<Agree_to_terms />} />
                <Route path="/Product_Main/:category" element={<Product_Main />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </div>
    );
}

export default App;
