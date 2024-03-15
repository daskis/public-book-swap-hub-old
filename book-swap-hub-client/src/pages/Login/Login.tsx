import React, {FormEvent, useEffect, useMemo, useState} from 'react';
import {useGetLoginMutation, useGetRegistrationMutation} from "../../store/services/authApi";
import Input from "../../components/Input/Input";
import cls from "./Login.module.scss"
import {Button, notification, Typography, Input as InputTag} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {LoadingOutlined} from "@ant-design/icons";
import {useAppDispatch, useAppSelector} from "../../store";
import {setLogged} from "../../store/features/authSlice";

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;
const Context = React.createContext({name: 'Default'});
const {Title} = Typography

const Login = () => {
    const [getLogin, {data, isError, error, isLoading}] = useGetLoginMutation()
    const dispatch = useAppDispatch()
    const [api, contextHolder] = notification.useNotification();
    const contextValue = useMemo(() => ({name: 'Ant Design'}), []);
    const [info, setInfo] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate()
    const isLogged = useAppSelector(state => state.auth.isLogged)

    useEffect(() => {
        if (isError && error) {
            //@ts-ignore
            openNotification("error", error.data.message)
        }
        if (data) {
            openNotification("success")
            if (window.localStorage) {
                localStorage.setItem("token", data.accessToken)
                console.log(data)
                dispatch(setLogged({
                    token: data.accessToken,
                    isLogged: true,
                    email: data.user.email,
                    id: data.user.id,
                    isActivated: data.user.isActivated

                }))
                navigate("/")

            }
        }
    }, [data, isError])
    const openNotification = (type: string, message: string = "Вы успешно вошли в аккаунт") => {
        switch (type) {
            case "success":
                api.success({
                    message: `Успех!`,
                    description: message,
                    placement: "bottomRight",
                });
                break;
            case "error":
                api.error({
                    message: `Ошибка!`,
                    description: message,
                    placement: "bottomRight",
                });
                break;
        }

    };


    const handleChange = (key: keyof typeof info) => (value: string) => {
        setInfo(prevState => ({
            ...prevState,
            [key]: value
        }));
    };
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        getLogin(info);
    }


    return (
        <div className={cls.container}>
            {isLogged ? <Title level={2}>Вы уже зарегистрированы</Title> :
                <Context.Provider value={contextValue}>
                    {contextHolder}
                    <form
                        className={cls.form}
                    >
                        <Title level={2}>Авторизация</Title>
                        <Input
                            value={info.email}
                            change={handleChange('email')}
                            placeholder="Email"
                            type="email"
                        />
                        <Input
                            value={info.password}
                            change={handleChange('password')}
                            placeholder="Password"
                            type="password"
                        />
                        <div className={cls.entry}>
                            <Button onClick={handleSubmit} size={"large"} type={"primary"}>Отправить</Button>
                            <p>Нет аккаунта?&nbsp;
                                <Link to={"/auth/registration"}>
                                    Создать
                                </Link>
                            </p>
                        </div>
                    </form>
                </Context.Provider>
            }
        </div>
    );
};

export default Login;