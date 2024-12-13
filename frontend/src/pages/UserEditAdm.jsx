import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UserEditAdm = () => {
    const { id } = useParams(); // URL에서 유저 ID 받아오기
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: '',
        phonenumber: '',
        address: '',
        email: '',
        userType: '',
        profileimg: '',
        userpw: '' // 비밀번호 추가
    });
    const [loading, setLoading] = useState(true);

    // 유저 정보 불러오기
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/useradmin/${id}`);
                if (response.data) {
                    setUserData(response.data); // 유저 데이터를 상태에 저장
                } else {
                    console.error("유저 정보가 없습니다.");
                }
                setLoading(false);
            } catch (error) {
                console.error("유저 정보 불러오기 실패:", error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // 페이지 리로드 방지
        try {
            const response = await axios.put(`http://localhost:8080/api/usereditadmin/${id}`, userData);
            console.log(response);  // 응답 상태 확인
            if (response.status === 200) {
                alert("유저 정보가 수정되었습니다.");
                navigate(`/userAdmin/${id}`); // 수정 완료 후 해당 유저 페이지로 리디렉션
            } else {
                console.error("수정이 실패했습니다: 상태 코드", response.status);
            }
        } catch (error) {
            console.error("유저 정보 수정 실패:", error);
            alert("유저 정보 수정에 실패했습니다.");
        }
    };

    if (loading) {
        return <div className="text-center text-xl">로딩 중...</div>;
    }

    return (
        <div className="max-w-4xl mt-[4rem] mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-center font-bold text-3xl mb-6">유저 정보 수정</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-lg">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="phonenumber" className="block text-lg">Phone Number:</label>
                    <input
                        type="text"
                        id="phonenumber"
                        name="phonenumber"
                        value={userData.phonenumber}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="address" className="block text-lg">Address:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={userData.address}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-lg">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="userType" className="block text-lg">User Type:</label>
                    <select
                        id="userType"
                        name="userType"
                        value={userData.userType}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    >
                        <option value="gymManager">GymManager</option>
                        <option value="individual">User</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="profileimg" className="block text-lg">Profile Image URL:</label>
                    <input
                        type="text"
                        id="profileimg"
                        name="profileimg"
                        value={userData.profileimg}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="userpw" className="block text-lg">Password:</label>
                    <input
                        type="password"
                        id="userpw"
                        name="userpw"
                        value={userData.userpw}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="flex justify-between mt-8">

                    <button
                        type="button"
                        onClick={() => navigate(`/userAdmin/${id}`)}
                        className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                        취소
                    </button>

                    <button
                        type="submit"
                        className="bg-red-400 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        수정 완료
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserEditAdm;