import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { BiSearch } from "react-icons/bi";
import { FaCaretDown } from "react-icons/fa";
import ProductCard from "../components/ProductCard.jsx";
import axios from "axios";
import SearchCard from "../components/SearchCard.jsx";

const Product_Main = () => {
    const suggestionsRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false); // 검색창 포커스 상태
    const [query, setQuery] = useState(""); // 검색어
    const [suggestions, setSuggestions] = useState([]); // 추천 검색어
    const [showSuggestions, setShowSuggestions] = useState(false); // 추천 검색어 표시 여부
    const [selectedOption, setSelectedOption] = useState('평점 순');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen); // 현재 드롭다운 상태 반전
    };
    const inputRef = useRef(null);
    const [categoryData, setCategoryData] = useState({
        category: "",
        sportlogo: "",
        sporttitle: "",
        sportdetail: ""
    });

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { category } = useParams(); // URL 파라미터에서 category를 가져옴

    const navigate = useNavigate();

    // 백엔드에서 제품 목록을 가져오는 함수
    const fetchProducts = async (option, category) => {
        setLoading(true); // 로딩 시작
        try {
            const response = await axios.get(`http://localhost:8080/product_Main/${category}?sort=${option === '평점 순' ? 'prodrating' : 'prodprice'}`);

            if (response.data) {
                setProducts(response.data.products); // 제품 목록 업데이트
                setCategoryData({
                    category: response.data.category.category,
                    sportlogo: response.data.category.sportlogo,
                    sporttitle: response.data.category.sporttitle,
                    sportdetail: response.data.category.sportdetail
                });
            }
        } catch (error) {
            console.error('제품을 가져오는 데 실패했습니다:', error.message);
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    // 페이지 로드 시 기본 제품 목록을 가져옴
    useEffect(() => {
        if (category) {
            fetchProducts(selectedOption, category); // 카테고리에 맞는 제품 목록을 가져옴
        }
    }, [selectedOption, category]);

    const handleSelectOption = (option) => {
        setSelectedOption(option);  // 선택된 옵션으로 상태 변경
        setIsDropdownOpen(false);   // 드롭다운 닫기
    };

    const saveRecentlyViewed = (id) => {
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        if (!recentlyViewed.includes(id)) {
            recentlyViewed.push(id);
        }
        if (recentlyViewed.length > 5) {
            recentlyViewed.shift();
        }
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    };

    const handleClick = (id) => {
        // Save to local storage (optional)
        saveRecentlyViewed(id);
        navigate(`/product/${id}`);  // Navigate to the product detail page
    };
    const handleChangesearch = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);

        if (newQuery.length > 0) {
            setShowSuggestions(true);  // 검색어가 있을 때만 추천 검색어를 표시
            fetchSuggestions(newQuery); // 추천 검색어 가져오기
        } else {
            setShowSuggestions(false); // 검색어가 없으면 추천 검색어 숨기기
            setSuggestions([]); // 검색어가 없을 때는 추천 검색어 리스트도 초기화
        }
    };

    const fetchSuggestions = async (query) => {
        try {
            const response = await axios.get("http://localhost:8080/api/suggestions", {
                params: { query },
            });
            setSuggestions(response.data.suggestions);  // 서버에서 받은 추천 검색어로 상태 업데이트
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);  // 오류가 발생하면 추천 검색어 리스트를 비웁니다
        }
    };
    const handleClearSuggestions = () => {
        setQuery('');  // 검색어 초기화
        setSuggestions([]);  // 추천 검색어 초기화
    };
    const handleClickid = (id) => {
        // Save to local storage (optional)
        saveRecentlyViewed(id);
        navigate(`/product/${id}`);  // Navigate to the product detail page
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col h-full items-center mt-[1rem] justify-center mx-56"> {/*전체 틀*/}
            <div className="flex flex-row h-14 w-[35rem] items-center justify-center shadow-md rounded-xl relative">
                <div className="flex flex-row w-1/5 cursor-pointer">
                    <FaLocationDot size="20" className="ml-3 cursor-pointer mt-[0.05rem]"/>
                    <p className="text-sm text-nowrap ml-[0.5rem]">송파구 마천동</p>
                </div>
                <div className="flex flex-row w-4/5 ml-2">
                    <input
                        ref={inputRef}
                        type="text"
                        className="grow border-0 text-center mt-1"
                        placeholder="검색"
                        value={query}
                        onChange={handleChangesearch} // 텍스트 입력 시
                    />
                </div>
                <BiSearch size="20"
                          className="mr-3 mt-1 cursor-pointer hover:scale-150 transition-transform ease-in-out duration-500"/>

                {/* 추천 검색어 박스 */}
                {showSuggestions && (
                    <div
                        className="absolute top-14 w-[49rem] bg-white border bg-opacity-70 rounded-xl shadow-lg z-10 mt-2"
                        ref={suggestionsRef}>
                        <div className="flex justify-between items-center mx-3 mt-2">
                            <p className="flex-grow ml-[4rem] text-center">추천 검색어</p>
                            <p
                                onClick={handleClearSuggestions} // 전체삭제 클릭 시 추천 검색어와 입력란 초기화
                                className="text-blue-500 cursor-pointer ml-4"
                            >
                                전체삭제
                            </p>
                        </div>
                        <ul className="flex flex-wrap">
                            {suggestions.length > 0 ? (
                                suggestions.map((product) => (
                                    <li key={product.prodid} className="w-1/3 p-2 hover:bg-gray-100 cursor-pointer">
                                        <SearchCard
                                            key={product.prodid}
                                            id={product.prodid}
                                            prodtitle={product.prodtitle}
                                            prodprice={product.prodprice}
                                            prodaddress={product.prodaddress}
                                            prodrating={product.prodrating}
                                            iconpicture={product.iconpicture}
                                            onClick={() => handleClickid(product.prodid)}
                                            className="flex"
                                        />
                                    </li>
                                ))
                            ) : (
                                <li className="p-2 text-gray-500">추천 검색어가 없습니다.</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>

            <div className="flex justify-start w-[62rem] h-[22rem] mt-[4rem] items-center">
                <div className="flex items-center w-[24rem] h-[18rem] ml-[6rem]">
                    <img className="rounded-3xl shadow-xl" src={categoryData.sportlogo} alt={categoryData.sporttitle}/>
                </div>
                <div
                    className="flex flex-col border-[0.01rem] border-gray-100 justify-center rounded-r-full shadow-xl w-[29rem] h-[18rem]">
                    <a className="text-[1.5rem] font-semibold">{categoryData.sporttitle}</a>
                    <a className="text-sm font-semibold mt-3 text-balance">{categoryData.sportdetail}</a>
                </div>
            </div>
            <div className="flex mt-[3rem] items-center justify-end w-[56rem] h-[2rem]">
                <div className="relative">
                    <div
                        className="flex flex-row border-[0.1rem] rounded-xl h-[2.5rem] w-[7rem] items-center justify-center border-gray-950 cursor-pointer"
                        onClick={toggleDropdown}
                    >
                        <a className="mt-[0.1rem]">{selectedOption}</a>
                        <FaCaretDown className="ml-[0.1rem]"/>
                    </div>

                    {isDropdownOpen && (
                        <div
                            className="absolute top-full right-0 w-[7rem] bg-white border border-gray-300 rounded-xl shadow-lg z-10">
                            {selectedOption === '평점 순' && (
                                <div
                                    className="p-2 hover:bg-gray-100 flex flex-row items-center justify-center rounded-xl cursor-pointer"
                                    onClick={() => handleSelectOption('가격 순')}
                                >
                                    가격 순
                                    <FaCaretDown className="ml-[0.1rem]"/>
                                </div>
                            )}

                            {selectedOption === '가격 순' && (
                                <div
                                    className="p-2 hover:bg-gray-100 flex flex-row items-center justify-center rounded-xl cursor-pointer"
                                    onClick={() => handleSelectOption('평점 순')}
                                >
                                    평점 순
                                    <FaCaretDown className="ml-[0.1rem]"/>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Displaying Products */}
            <div className="flex flex-row w-[62rem] h-[35rem]">
                {loading ? (
                    <div>로딩 중...</div>  // 로딩 중일 때 표시
                ) : (
                    products.map((product) => (
                        <ProductCard
                            key={product.prodid}
                            id={product.prodid}
                            prodtitle={product.prodtitle}
                            prodprice={product.prodprice}
                            prodaddress={product.prodaddress}
                            prodrating={product.prodrating}
                            iconpicture={product.iconpicture}
                            onClick={handleClick}
                            className="flex"
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Product_Main;