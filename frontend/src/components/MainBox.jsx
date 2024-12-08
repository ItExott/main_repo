import React from "react";


const MainBox = ({ iconpicture, prodtitle, onClick  }) => {
    return (
            <div onClick={onClick} className="w-[15rem] border-2 shadow-md border-red-500 rounded-3xl m-8 cursor-pointer hover:scale-110 transition-transform ease-in-out duration-500 overflow-hidden">
                <img
                    src={iconpicture}
                    className="flex w-full h-[10rem]"
                />
                <div>
                    <div className="font-bold w-full items-center flex  justify-center h-[2.5rem] text-lg">{prodtitle}</div>
                </div>
            </div>
    );
};

export default MainBox;