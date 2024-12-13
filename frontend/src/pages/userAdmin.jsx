import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const UserAdmin = () => {
    const { id } = useParams(); // 유저 ID를 URL 파라미터에서 받아옴
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 유저 정보 불러오기
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/useradmin/${id}`); // 해당 ID의 유저 데이터
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

    const handleEdit = (id) => {
        if (id) {
            navigate(`/userEditAdm/${id}`);
        }
        console.log("유효하지 않은 ID:", id);
    };

    const handleDelete = async () => {
        // 삭제 확인 창 띄우기
        const isConfirmed = window.confirm("정말 삭제하시겠습니까?");
        if (isConfirmed) {
            // 확인 시 유저 정보 삭제 로직
            try {
                const response = await axios.delete(`http://localhost:8080/api/useradmindelete/${id}`);
                if (response.status === 200) {
                    console.log("유저 정보 삭제 성공");
                    // 삭제 후 리디렉션 또는 상태 업데이트 추가 가능
                }
            } catch (error) {
                console.error("유저 정보 삭제 실패:", error);
            }
        } else {
            console.log("삭제 취소");
        }
    };

    if (loading) {
        return <div className="text-center text-xl">로딩 중...</div>;
    }

    if (!userData) {
        return <div className="text-center text-xl text-red-500">유저 정보를 불러올 수 없습니다.</div>;
    }

    return (
        <div className="max-w-4xl mt-[4rem] mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-center font-bold text-3xl mb-6">유저 정보</h1>
            <div className="flex items-center justify-center mb-6">
                <img
                    src={`http://localhost:8080${userData.profileimg}` || 'default-avatar.png'} // 프로필 이미지가 없으면 기본 이미지 사용
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                />
            </div>
            <div className="space-y-4">
                <p className="text-lg"><strong>User Type:</strong> {userData.userType || '없음'}</p>
                <p className="text-lg"><strong>User ID:</strong> {userData.userid || '없음'}</p>
                <p className="text-lg"><strong>User PW:</strong> {userData.userpw || '없음'}</p>
                <p className="text-lg"><strong>Name:</strong> {userData.name || '없음'}</p>
                <p className="text-lg"><strong>Phone Number:</strong> {userData.phonenumber || '없음'}</p>
                <p className="text-lg"><strong>Address:</strong> {userData.address || '없음'}</p>
                <p className="text-lg"><strong>Email:</strong> {userData.email || '없음'}</p>
            </div>
            <div className="flex justify-between mt-8">
                <button
                    onClick={() => handleEdit(userData.userid)} // 함수 래핑을 통해 클릭 시에만 실행
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    유저 정보 수정
                </button>
                <button
                    onClick={handleDelete}
                    className="bg-red-400 text-white px-6 py-2 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                    유저 정보 삭제
                </button>
            </div>
        </div>
    );
};

export default UserAdmin;