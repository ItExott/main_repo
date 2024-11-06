import { BrowserRouter as Router,  Route, Routes } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Product_Main from "./pages/Product_Main.jsx";
import Login from "./pages/Login.jsx";
import Agree_to_terms from "./pages/Agree_to_terms.jsx";
import Complete_SignUp from "./pages/Complete_SignUp.jsx";
import SignUp from "./pages/SignUp.jsx";
import Find_Id from "./pages/Find_Id.jsx";
import Find_Id_Check from "./pages/Find_Id_Check.jsx";
import Find_Pw from "./pages/Find_Pw.jsx";
import Find_Pw_Check from "./pages/Find_Pw_Check.jsx";


function App() {
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/Login/Find_Id" element={<Find_Id/>}/>
                <Route path="/Login/Find_Id_Check" element={<Find_Id_Check/>}/>
                <Route path="/Login/Find_Pw" element={<Find_Pw/>}/>
                <Route path="/Login/Find_Pw_Check" element={<Find_Pw_Check/>}/>
                <Route path="/Login/Agree_to_terms/SignUp" element={<SignUp/>}/>
                <Route path="/Login/Complete_SignUp" element={<Complete_SignUp/>}/>
                <Route path="/Login/Agree_to_terms" element={<Agree_to_terms/>}/>
                <Route path="/Login" element={<Login/>}/>
                <Route path="/Product_Main" element={<Product_Main/>}/>
                <Route path="/" element={<Home/>}/>
            </Routes>
        </>
    );
}
/*
*/
export default App;