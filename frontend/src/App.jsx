import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
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
import MBL_CRTFC from "./pages/MBL_CRTFC.jsx";  // app.css 파일을 import

function App() {
    const [loginStatus, setLoginStatus] = useState(false); // Track login status

    return (
        <div className="App">
            <Navbar loginStatus={loginStatus} setLoginStatus={setLoginStatus} /> {/* Pass loginStatus to Navbar */}
            <Routes>
                <Route path="/Cart" element={<Cart/>} />
                <Route path="/Find_Id" element={<Find_Id/>} />
                <Route path="/Find_Id_Check" element={<Find_Id_Check/>} />
                <Route path="/Find_Pw" element={<Find_Pw/>} />
                <Route path="/Find_Pw_Check" element={<Find_Pw_Check/>} />
                <Route path="/Agree_to_terms/MBL_CRTFC" element={<MBL_CRTFC/>} />
                <Route path="/Agree_to_terms/MBL_CRTFC/SignUp" element={<SignUp/>} />
                <Route path="/Complete_SignUp" element={<Complete_SignUp/>} />
                <Route path="/Agree_to_terms" element={<Agree_to_terms/>} />
                <Route path="/Product_Main/:category" element={<Product_Main/>} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/" element={<Home/>} />
            </Routes>
        </div>
    );
}

export default App;