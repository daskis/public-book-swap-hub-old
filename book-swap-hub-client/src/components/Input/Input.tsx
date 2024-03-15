import React, {ChangeEvent, useState} from 'react';
import { InputProps } from './Input.props';
import cls from './Input.module.scss';
import {Input as InputTag, Typography} from "antd"
const Input: React.FC<InputProps> = ({ type = 'text', placeholder, value, change }) => {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (change) {
            change(e.currentTarget.value);
        }
    };

    return (
        <div className={cls.wrapper}>
            <label className={cls.placeholder}>{placeholder}</label>
            <InputTag
                size={"large"}
                type={type}
                className={cls.input}
                // placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default Input;
