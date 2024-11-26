import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { BiSearch } from "react-icons/bi";
import { FaCaretDown } from "react-icons/fa";
import ProductCard from "../components/ProductCard.jsx";
import axios from "axios";

const Product_Main = () => {
    const [isFocused, setIsFocused] = useState(false); // 검색창 포커스 상태
    const [query, setQuery] = useState(""); // 검색어
    const [showSuggestions, setShowSuggestions] = useState(false); // 추천 검색어 박스 표시 여부
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

    // 검색어 입력 변화 처리
    const handleChange = (e) => {
        setQuery(e.target.value);
        setShowSuggestions(e.target.value.length > 0); // 입력이 있으면 추천 박스 표시
    };

    // 검색창에 포커스 처리
    const handleFocus = () => {
        setIsFocused(true); // 포커스 되면 추천 박스 보이기
        setShowSuggestions(true); // 추천 박스 표시
    };

    // 검색창에서 포커스를 벗어날 때
    const handleBlur = () => {
        setIsFocused(false); // 포커스를 벗어나면 추천 박스 숨기기
        setShowSuggestions(false);
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

    return (
        <div className="flex flex-col h-full items-center mt-[1rem] justify-center mx-56"> {/*전체 틀*/}
            <div
                className="flex flex-row h-14 w-[35rem] items-center justify-center shadow-xl rounded-xl relative"> {/*검색창*/}
                <FaLocationDot size="20" className="ml-3 cursor-pointer mt-[0.06rem]"/> {/* 로케이션 아이콘 */}
                <div className="flex flex-row w-1/5 cursor-pointer"> {/* 로케이션 박스 */}
                    <p className="text-sm font-bold text-nowrap ml-[0.5rem]">송파구 마천동</p>
                </div>
                <div className="flex flex-row w-4/5 ml-2"> {/* 검색 박스 */}
                    <input
                        ref={inputRef}
                        type="text"
                        className="grow border-0 text-center mt-1"
                        placeholder="검색"
                        value={query}
                        onFocus={handleFocus} // 포커스 시 이벤트
                        onBlur={handleBlur}   // 포커스 벗어나면 숨기기
                        onChange={handleChange} // 텍스트 입력 시
                    />
                </div>
                <BiSearch size="20"
                          className="mr-3 mt-1 cursor-pointer hover:scale-150 transition-transform ease-in-out duration-500"/>
                {/* 검색 아이콘 */}

                {/* 추천 검색어 박스 */}
                {isFocused && showSuggestions && (
                    <div className="absolute top-14 w-[35rem] bg-white border rounded-xl shadow-lg z-10 mt-2">
                        <div className="flex justify-between mx-3 mt-2">
                            <p>추천 검색어</p>
                            <p>전체삭제</p>
                        </div>

                        <ul>
                            <li className="p-2 hover:bg-gray-100 cursor-pointer">추천 검색어 1</li>
                            <li className="p-2 hover:bg-gray-100 cursor-pointer">추천 검색어 2</li>
                            <li className="p-2 hover:bg-gray-100 cursor-pointer">추천 검색어 3</li>
                            <li className="p-2 hover:bg-gray-100 cursor-pointer">추천 검색어 4</li>
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