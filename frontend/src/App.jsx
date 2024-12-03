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
import MyPage from "./pages/MyPage.jsx";
import ChangeUser from "./pages/ChangeUser.jsx";
import DeleteUser from "./pages/DeleteUser.jsx";
import Attendance from "./popup/Attendance.jsx";

function App() {
    const [loginStatus, setLoginStatus] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [money, setMoney] = useState(0);

    // 로그인 상태 확인 및 userInfo 가져오기
    useEffect(() => {
        const storedLoginStatus = sessionStorage.getItem("loginStatus");
        const storedUserProfile = sessionStorage.getItem("userProfile");

        if (storedLoginStatus === "true" && storedUserProfile) {
            const parsedUserProfile = JSON.parse(storedUserProfile);
            setLoginStatus(true);
            setUserProfile(parsedUserProfile);
            setMoney(Number(sessionStorage.getItem("money"))); // sessionStorage에서 금액을 가져와 상태에 반영
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

            // 로그인 성공 여부 확인
            if (response.data.success) {
                const data = response.data;
                setMoney(data.money); // 금액 상태 업데이트
                setUserProfile({
                    profileimg: data.profileimg,
                    name: data.name,
                    userId: data.userId,
                    ...data
                });
                // sessionStorage에도 저장
                sessionStorage.setItem("money", data.money); // sessionStorage에 금액 저장
                sessionStorage.setItem("userProfile", JSON.stringify(data)); // sessionStorage에 사용자 정보 저장
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

    useEffect(() => {
        if (loginStatus && !userProfile) { // 로그인 상태인데 사용자 프로필이 없을 경우에만 fetchUserInfo 호출
            fetchUserInfo();
        }
    }, [loginStatus, userProfile]); // loginStatus가 true일 때만 fetchUserInfo를 호출

    const handleLogout = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/logout", {}, { withCredentials: true });
            if (response.data.success) {
                setLoginStatus(false);
                setUserProfile(null); // 프로필 이미지 및 사용자 정보 초기화
                setMoney(0); // 금액 초기화
                sessionStorage.removeItem("loginStatus");
                sessionStorage.removeItem("userProfile");
                sessionStorage.removeItem("money");
            }
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    return (
        <div className="App">
            <Navbar
                loginStatus={loginStatus}
                setLoginStatus={setLoginStatus}
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                money={money}
                setMoney={setMoney}
                handleLogout={handleLogout}
            />
            <Routes>
                <Route path="/" element={<Home />} /> {/* 홈 */}
                <Route path="/Agree_to_terms" element={<Agree_to_terms />} />  {/* 회원가입 시작 */}
                <Route path="/Agree_to_terms/MBL_CRTFC" element={<MBL_CRTFC />} />
                <Route path="/Agree_to_terms/MBL_CRTFC/SignUp" element={<SignUp />} />
                <Route path="/Complete_SignUp" element={<Complete_SignUp />} />  {/* 회원가입 끝 */}
                <Route path="/Find_Id" element={<Find_Id />} /> {/* 각종 개인정보 찾기 */}
                <Route path="/Find_Id_Check" element={<Find_Id_Check />} />
                <Route path="/Find_Pw" element={<Find_Pw />} />
                <Route path="/Find_Pw_Check" element={<Find_Pw_Check />} />  {/* 각종 개인정보 찾기 끝 */}
                <Route path="/MyPage/ChangeUser" element={<ChangeUser />}/> {/* 개인정보 변경 */}
                <Route path="/Product_Main/:category" element={<Product_Main />} /> {/* 카테고리별 제품 */}
                <Route path="/product/:id" element={<Product userProfile={userProfile} />} /> {/* 제품 상세 */}
                <Route path="/Cart" element={<Cart />} /> {/* 장바구니 */}
                <Route path="/Buyform" element={<Buyform money={money} setMoney={setMoney} />} /> {/* 결제 창 */}
                <Route path="/MyPage" element={<MyPage/>} /> {/* 마이페이지 */}
                <Route path="/MyPage/DeleteUser" element={<DeleteUser/>} /> {/* 마이페이지 */}
            </Routes>
        </div>
    );
}

export default App;
