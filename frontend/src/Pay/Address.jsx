import React, { useState } from 'react';

const Address = () => {
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [message, setMessage] = useState('');
    const [gateCode, setGateCode] = useState('');
    const [isCodeOpen, setIsCodeOpen] = useState(false);

    const handleAddressChange = (e) => setAddress(e.target.value);
    const handleContactChange = (e) => setContact(e.target.value);
    const handleMessageChange = (e) => setMessage(e.target.value);
    const handleGateCodeChange = (e) => setGateCode(e.target.value);

    return (
        <div>
            <div className="bg-base-100">
                <div>
                    <h2 className="card-title text-xl font-semibold mb-4">배송지 정보</h2>
                    <div className="flex flex-col gap-4 rounded-xl border-2 border-gray-400 p-8">
                        <div>
                            <label className="label">
                                <span className="label-text">받는 사람</span>
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={handleAddressChange}
                                className="input input-bordered w-1/2"
                                placeholder="이름입력"
                            />
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">주소</span>
                            </label>
                            <input
                                type="text"
                                value={contact}
                                onChange={handleContactChange}
                                className="input input-bordered w-1/2"
                                placeholder="주소입력"
                            />
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">배송요청사항</span>
                            </label>
                            <input
                                type="text"
                                value={message}
                                onChange={handleMessageChange}
                                className="input input-bordered w-1/2"
                                placeholder="메시지 입력"
                            />
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">공동현관 출입방법</span>
                            </label>
                            <div className="flex items-center space-x-4">
                                <label className="cursor-pointer label">
                                    <input
                                        type="radio"
                                        name="gateOption"
                                        className="radio checked:bg-blue-500"
                                        checked={!isCodeOpen}
                                        onChange={() => setIsCodeOpen(false)}
                                    />
                                    <span className="label-text">자유출입 가능</span>
                                </label>
                                <label className="cursor-pointer label">
                                    <input
                                        type="radio"
                                        name="gateOption"
                                        className="radio checked:bg-blue-500"
                                        checked={isCodeOpen}
                                        onChange={() => setIsCodeOpen(true)}
                                    />
                                    <span className="label-text">공동현관 비밀번호</span>
                                </label>
                            </div>
                            {isCodeOpen && (
                                <input
                                    type="text"
                                    value={gateCode}
                                    onChange={handleGateCodeChange}
                                    className="input input-bordered w-full mt-2"
                                    placeholder="공동현관 번호"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Address;
