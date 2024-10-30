import { BrowserRouter as Router,  Route, Routes } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Product_Main from "./pages/Product_Main.jsx";


function App() {
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/Product_Main" element={<Product_Main/>}/>
                <Route path="/" element={<Home/>}/>
            </Routes>
        </>
    );
}
/*
*/
export default App;