import React, {useEffect} from 'react';
import Registration from "./pages/Registration/Registration";
import {Route, Routes} from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import {useGetMeQuery} from "./store/services/authApi";
import {useAppDispatch, useAppSelector} from "./store";
import {setLogged} from "./store/features/authSlice";
import Profile from "./pages/Profile/Profile";
import Upload from "./pages/Upload/Upload";
import Book from "./pages/Book/Book";
import Books from "./pages/Books/Books";
import User from "./pages/User/User";
import {useTheme} from "./utils/ThemeProvider";
import {classNames} from "./utils/classNames/classNames";
import {ConfigProvider, theme as antdTheme} from "antd";
import Read from "./pages/Read/Read";
import Footer from "./components/Footer/Footer";
const App = () => {
    // const {data, isLoading} = useGetMeQuery(null)
    const dispatch = useAppDispatch()
    // useEffect(() => {
    //     if (data) {
    //         dispatch(setLogged({
    //             imageName: data.image,
    //             token: data.token,
    //             isLogged: true,
    //             email: data.user.email,
    //             id: data.user.id,
    //             isActivated: data.user.isActivated
    //         }))
    //     }
    // }, [data])
    const routes = [
        {
            path: "/",
            element: <Books/>,
            key: 1
        },
        {
            path: "/auth/registration",
            element: <Registration/>,
            key: 2
        },
        {
            path: "/auth/login",
            element: <Login/>,
            key: 3
        },
        {
            path: "/profile/*",
            element: <Profile/>,
            key: 4
        },
        {
            path: "/upload/",
            element: <Upload/>,
            key: 5
        },
        {
            path: "/book/:id",
            element: <Book/>,
            key: 6
        },
        {
            path: "/user/:id/*",
            element: <User/>,
            key: 7
        },
        {
            path: "/book/:id/read",
            element: <Read/>,
            key: 8
        }
    ]
    const {theme} = useTheme();
    const textColor = useAppSelector(state => state.bookSettings.color)
    return (
        <div className={classNames("app", {}, [theme])}>
            <ConfigProvider
                theme={{
                    algorithm: theme === "light" ? antdTheme.defaultAlgorithm : antdTheme.darkAlgorithm,
                    token: {

                        // Seed Token
                        // @ts-ignore
                        colorPrimary: theme === "dark" ? "#3e2069" : "#2b4acb",
                        colorBgBase: theme === "light" ? "#fff" : "#111a2c",
                        colorBgMask: theme === "light" ? "#fff" : "#111a2c",
                        colorBgLayout: theme === "light" ? "#fff" : "#111a2c",
                        colorText: theme === "light" ? "#000" : "#fff",
                        // Alias Token
                    },
                    components: {

                        Menu: {
                            colorPrimary:  theme === "light" ? "#000" : "#fff"
                        },
                        Typography: {
                            colorPrimary: theme === "light" ? "#000" : "#fff"
                        },
                        Button: {
                            colorText: "white",
                            colorPrimary: theme === "dark" ? "#3e2069" : "#2b4acb",
                        }

                    }
                }}
            >
                <Navbar/>
                <main className="main">
                    <Routes>
                        {routes.map((item, i) => (
                            <Route {...item}/>
                        ))}
                    </Routes>
                </main>
                <Footer/>
            </ConfigProvider>
        </div>
    );
};

export default App;