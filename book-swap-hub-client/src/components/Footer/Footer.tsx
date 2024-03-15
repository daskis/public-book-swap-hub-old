import React from 'react';
import cls from "./Footer.module.scss"
import {Typography} from "antd";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";


const {Text, Title} = Typography
const Footer = () => {
    return (
        <footer className={cls.footer}>
            <div>
                <Title level={4}>Book-swap-hub ©2023</Title>
                <Text>Проект создан для показа в портфолио и общего использования</Text>
            </div>
            <div className={cls.info}>
                <ThemeSwitcher/>
                <div>
                    <a target="_blank" href="https://t.me/abramoffanton">
                        <img src="./telegram.svg" alt=""/>
                    </a>
                    <a target="_blank" href="mailto:abramoff.job@gmail.com">
                        <img src="./gmail.svg" alt=""/>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;