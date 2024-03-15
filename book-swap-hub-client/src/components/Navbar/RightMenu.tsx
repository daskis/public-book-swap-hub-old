import React from "react";
import {Menu, Avatar, MenuProps, Button} from "antd";
import {UserOutlined, CodeOutlined, LogoutOutlined} from "@ant-design/icons";
import {useGetLogoutMutation} from "../../store/services/authApi";
import {useAppDispatch, useAppSelector} from "../../store";
import {setLogged} from "../../store/features/authSlice";
import {Link, useNavigate} from "react-router-dom";
import {getItem} from "../../utils";
import {useTheme} from "../../utils/ThemeProvider";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

export interface IMenu {
    mode: "horizontal" | "vertical" | "inline";
}


const RightMenu = ({mode}: IMenu) => {
    const [getLogout, {data}] = useGetLogoutMutation();
    const imageName = useAppSelector(state => state.auth.imageName)
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const {theme, toggleTheme} = useTheme()
    const username = useAppSelector(state => state.auth.user.name)
    const email = useAppSelector(state => state.auth.user.email)
    const handleLogout = () => {
        getLogout(null);
        localStorage.removeItem("token");
        dispatch(
            setLogged({
                isLogged: false,
                email: "",
                id: "",
                isActivated: undefined,
            })
        );
    };
    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        if (e.key === "profile") {
            navigate("/profile/main")
        }
        if (e.key === "log-out") {
            handleLogout()
        }
    };
    const items: MenuProps['items'] = [
        getItem((
            <span className="ant-dropdown-link">
                {imageName
                    ?
                    <img className="avatar" src={`${process.env.REACT_APP_SERVER_URL}/avatars/${imageName}`}
                         alt="avatar"/>
                    : <Avatar icon={<UserOutlined/>}/>}
                <span className="username">
                    {username ? username : email}
                </span>
             </span>
        ), 'username', null, [
            getItem('Мой профиль', 'profile', <UserOutlined/>),
            getItem('Выйти', 'log-out', <LogoutOutlined/>),
        ])
    ]
    return (
        <div className="menuWrapper">
            <Menu
                onClick={onClick}
                mode={mode}
                items={items}
            />
        </div>

    );
};

export default RightMenu;
