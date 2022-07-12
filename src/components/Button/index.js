import React, { memo } from 'react';

const Button = (props) => {
    console.log('re-render');
    const { value, onClick, btnType, size, className } = props;
    const getSizeClass = () => {
        if (size === 'double-width') return 'w-doubleWidth h-[65px]';
        if (size === 'double-height') return 'w-20 h-[131px]';
        if (size === 'double-height-width') return 'w-doubleWidth h-[131px]';
        if (size === 'normal') return 'w-20 h-[65px]';
    };
    const getTypeClass = () => {
        if (btnType === 'ac') return 'bg-acBg';
        if (btnType === 'number' || btnType === 'decimal') return 'bg-numBg';
        if (btnType === 'operator') return 'bg-operatorBg';
        if (btnType === 'equal') return 'bg-equalBg';
    };
    return (
        <div
            className={`btn shrink-0 ${
                className ? className : ''
            } ${getTypeClass()} ${getSizeClass()} flex items-center justify-center font-base text-2xl text-white m-0.5 font-['Share Tech Mono] hover:outline outline-1 outline-gray-400 hover:text-black`}
            onClick={onClick}
        >
            {value}
        </div>
    );
};

export default memo(Button);
