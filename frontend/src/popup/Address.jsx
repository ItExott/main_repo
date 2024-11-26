import React, { useState } from "react";
import DaumPostcode from 'react-daum-postcode';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


const Address = () => {
    const [openPostcode, setOpenPostcode] = useState(false);

    const handle = {
// 버튼 클릭 이벤트
        clickButton: () => {
            setOpenPostcode(current => !current);
        },

// 주소 선택 이벤트
        selectAddress: () => {

            setOpenPostcode(false);
        },
    }

    return(
    <DaumPostcode
        onComplete={handle.selectAddress}  // 값을 선택할 경우 실행되는 이벤트
        autoClose={false} // 값을 선택할 경우 사용되는 DOM을 제거하여 자동 닫힘 설정

    />
    );

};


export default Address;