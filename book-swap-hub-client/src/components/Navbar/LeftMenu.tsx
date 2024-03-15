import React from "react";
import {Button, Menu} from "antd";
import {Link} from "react-router-dom";
import {useTheme} from "../../utils/ThemeProvider";

export interface IMenu {
    mode: "horizontal" | "vertical" | "inline";
}

const LeftMenu = ({mode}: IMenu) => {
    const menuItems = [
        {key: "upload", label: <Link to={"/upload"}>Загрузка книг</Link>},

    ];

    return (
        <Menu mode={mode} items={menuItems}/>
    );
};

export default LeftMenu;
