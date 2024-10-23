import React from 'react';

const OtherPayment = ({ OtherPayment, setOtherPayment }) => {
    const handleOtherPaymentChange = (method) => {
        setOtherPayment(method);
    };

    return (
        <div className="mb-6">
            <div className="grid grid-cols-5 gap-3">
                <button
                    type="button"
                    className="bg-white"
                    onClick={() =>handleOtherPaymentChange('kbPay')}
                >
                    <span className="font-bold">KB pay</span>
                </button>
                <button
                    type="button"
                    className="bg-white "
                    onClick={() => handleOtherPaymentChange('tossPay')}
                >
                    <img src="https://ifh.cc/g/blzLZp.png" alt="Toss Pay" className="w-20 h-8 ml-4" />
                </button>
                <button
                    type="button"
                    className="bg-white"
                    onClick={() => handleOtherPaymentChange('Payco')}
                >
                    <img src="https://ifh.cc/g/CLlzaC.png" alt="Payco" className="w-20 h-4 ml-5" />
                </button>
                <button
                    type="button"
                    className="bg-white"
                    onClick={() => handleOtherPaymentChange('SamsungPay')}
                >
                    <img src="https://ifh.cc/g/MkHHwJ.png" alt="Samsung Pay" className="w-20 h-9 ml-4" />
                </button>
                <button
                    type="button"
                    className="bg-white"
                    onClick={() => handleOtherPaymentChange('realTimeTransfer')}
                >
                    <span className="font-bold">실시간계좌이체</span>
                </button>
            </div>
        </div>
    );
};

export default OtherPayment;
