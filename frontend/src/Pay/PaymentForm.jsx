import React, { useState } from 'react';
import OtherPayment from './OtherPayment.jsx';
import Address from './Address.jsx'

const PaymentForm = () => {
    const [address, setAddress] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('creditCard');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Payment submitted:', {
            address,
            cardNumber,
            expiryDate,
            cvv,
            paymentMethod
        });
    };

    return (
        <div className="justify-self-center w-2/3 ml-20 p-8">
        <h2 className="text-xl font-semibold mb-4">결제하기</h2>
            <form onSubmit={handleSubmit}>
                <div className="rounded-xl border-2 border-gray-400 p-8 mb-14">
                    <h3>주문 상품 목록</h3>
                    <div className="m-3 p-2 border-solid border-2">
                        <div className="flex h-100">
                            <div className=" inline-block align-middle w-20 ">
                                <figure>
                                    <img src='https://ifh.cc/g/lSsBcL.jpg'/>
                                </figure>
                            </div>
                            <div className="flex-auto w-60 p-11">
                                [국내도서] 구의 증명
                            </div>
                            <div className="flex-auto w-7 p-11">
                                1개
                            </div>
                            <div className="flex-auto w-10 p-11 value ='won'">
                                12,000원
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pb-10">
                    <h3 className="text-xl font-semibold mb-4">할인쿠폰</h3>
                    <div className="">
                        사용가능한 쿠폰이 없습니다.
                    </div>
                </div>

                <div className="mb-14">
                    <Address/>
                </div>

                <div className="mb-2">
                    <h3 className="text-xl font-semibold mb-4">결제 수단 선택</h3>
                    <div className="rounded-xl border-2 border-gray-400 p-8">
                        <div className="flex flex-row items-center cursor-pointer duration-300 hover:scale-105 p-4">
                            <input type="radio" name="radio-2" className="radio radio-primary" checked="checked"/>
                            <p className="ml-[0.4rem]">신용카드</p>
                        </div>
                        <div className="flex items-center p-4">
                            <input type="checkbox"
                                   name="test"
                                   value="kaoPay"
                                   className="checkbox"
                                   checked={paymentMethod === 'kaoPay'}
                                   onChange={(e) => setPaymentMethod(e.target.value)}/>
                            <img src="https://ifh.cc/g/ZcaDQh.png" className="w-20 ml-2"/>
                        </div>
                        <div className="flex items-center p-4">
                            <input type="checkbox"
                                   name="test"
                                   value="naiverPay"
                                   className="checkbox"
                                   checked={paymentMethod === 'naiverPay'}
                                   onChange={(e) => setPaymentMethod(e.target.value)}/>
                            <img src="https://ifh.cc/g/kJ6ZCH.jpg" className="w-20 ml-3"/>
                        </div>
                        <div className="items-center p-4">
                            <input type="checkbox"
                                   name="test"
                                   value="bank"
                                   className="checkbox"
                                   checked={paymentMethod === 'bank'}
                                   onChange={(e) => setPaymentMethod(e.target.value)}/>
                            <span className="m-3">다른 결제 수단</span>
                        </div>
                    </div>

                    {paymentMethod === 'creditCard' && (
                        <>
                            <div className="mb-10">
                                <label className="mb-10 w-max">카드 번호:</label><br/>
                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    className="w-full p-2 border-gray-800"
                                    required
                                />
                            </div>
                            <div className="wb-10 flex items-stretch ">
                                <div className="w-1/2">
                                    <label className="mb-2">유효기간:</label>
                                    <input
                                        type="text"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                        className="w-full p-2 border-gray-800"
                                        required
                                    />
                                </div>
                                <div className="w-1/2 ml-3">
                                    <label className="mb-2">CVV:</label>
                                    <input
                                        type="text"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                        className="w-full p-2 border-gray-800"
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
                {paymentMethod === 'bank' && (
                    <OtherPayment></OtherPayment>
                )}
                <div className="grid justify-items-center">
                    <button className="btn btn-primary w-40 p-3 mt-3">결제하기</button>
                </div>
            </form>
        </div>
    );
};

export default PaymentForm;
