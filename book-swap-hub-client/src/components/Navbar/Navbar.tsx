import React, {useEffect, useState} from "react";
import {Layout, Button, Drawer} from "antd";
import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";
import {MenuOutlined} from "@ant-design/icons";
import {Link, useLocation} from "react-router-dom";
import "./Navbar.scss";
import {useAppSelector} from "../../store";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const showDrawer = () => {
        setVisible(!visible);
    };
    const isLogged = useAppSelector((state) => state.auth.isLogged);

    const location = useLocation();
    useEffect(() => {
        setVisible(false);
    }, [location]);

    return (
        <nav className="navbar">
            <Layout>
                <Layout.Header className="nav-header">
                    <div className="logo">
                        <h3 className="brand-font">
                            <Link to={"/"}>Book-swap-hub</Link>
                        </h3>
                    </div>

                    <div className="navbar-menu">
                        <div className="leftMenu">
                            <LeftMenu mode={"horizontal"}/>
                        </div>
                        <Button className="menuButton" type="text" onClick={showDrawer}>
                            <MenuOutlined/>
                        </Button>
                        <div className="rightMenu">
                            {isLogged ? (
                                <RightMenu mode={"horizontal"}/>
                            ) : (
                                <Link to={"/auth/login"}>
                                    <Button type={"primary"}>
                                        Войти
                                    </Button>
                                </Link>

                            )}
                        </div>

                        <Drawer
                            title={"Brand Here"}
                            placement="right"
                            closable={true}
                            onClose={showDrawer}
                            open={visible}
                            style={{zIndex: 99999}}
                            bodyStyle={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 20,
                            }}
                        >
                            <LeftMenu mode={"inline"}/>
                            {isLogged ? (
                                <RightMenu mode={"inline"}/>
                            ) : (
                                <Link to={"/auth/login"}>
                                    <Button type={"primary"}>
                                        Войти
                                    </Button>
                                </Link>
                            )}
                        </Drawer>
                    </div>
                </Layout.Header>
            </Layout>
        </nav>
    );
};

export default Navbar;
