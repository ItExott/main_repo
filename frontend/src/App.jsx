import { BrowserRouter as Router,  Route, Routes } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Product_Main from "./pages/Product_Main.jsx";
import Login from "./pages/Login.jsx";
import Agree_to_terms from "./pages/Agree_to_terms.jsx";
import Complete_SignUp from "./pages/Complete_SignUp.jsx";
import SignUp from "./pages/SignUp.jsx";


function App() {
    return (
        <>
            <Navbar/>
            <Routes>
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