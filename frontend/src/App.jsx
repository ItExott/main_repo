import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";


function App() {
    return (
        <>
            <Routes>
                <Route path="/Navbar" element={<Navbar/>} />
                <Route path="/" element={<Home/>}/>
            </Routes>
        </>
    );
}
/*
*/
export default App;