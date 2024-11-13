import { BrowserRouter as Router,  Route, Routes } from 'react-router-dom';
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

function App() {
    const [loginStatus, setLoginStatus] = useState(false);
    return (
        <>
            <Navbar loginStatus={loginStatus} setLoginStatus={setLoginStatus} />
            <Routes>
                <Route path="/Find_Id" element={<Find_Id/>}/>
                <Route path="/Find_Id_Check" element={<Find_Id_Check/>}/>
                <Route path="/Find_Pw" element={<Find_Pw/>}/>
                <Route path="/Find_Pw_Check" element={<Find_Pw_Check/>}/>
                <Route path="/Agree_to_terms/SignUp" element={<SignUp/>}/>
                <Route path="/Complete_SignUp" element={<Complete_SignUp/>}/>
                <Route path="/Agree_to_terms" element={<Agree_to_terms/>}/>
                <Route path="/Product_Main" element={<Product_Main/>}/>
                <Route path="/Product" element={<Product/>}/>
                <Route path="/" element={<Home/>}/>
            </Routes>
        </>
    );
}
/*
*/
export default App;