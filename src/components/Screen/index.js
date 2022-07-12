import React from 'react';

const Screen = (props) => {
    const { formular, output } = props;
    // const resFieldRef = useRef();
    // useImperativeHandle(ref, ()=>({
    //     innerText(){
    //         return resFieldRef.current.innerText;
    //     }
    // }))
    return (
        <div className="screen__container w-full text-right">
            <div className="screen__container__formular min-h-[20px] w-full text-orange-500 break-all mb-1 text-[20px] leading-5">
                {formular}
            </div>
            <div className="screen__container__output min-h-[30px] text-white text-[28px] leading-8">{output}</div>
        </div>
    );
};

export default Screen;
//2 cai xet dua tren cung 1 val
//truyen data qua router
