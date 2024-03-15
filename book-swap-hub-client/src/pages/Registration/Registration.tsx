import React, {FormEvent, useEffect, useMemo, useState} from 'react';
import {useGetRegistrationMutation} from "../../store/services/authApi";
import Input from "../../components/Input/Input";
import {LoadingOutlined} from '@ant-design/icons';
import cls from "./Registration.module.scss"
import {Alert, Button, notification, Spin, Typography} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {NotificationPlacement} from "antd/es/notification/interface";
import {setLogged} from "../../store/features/authSlice";
import {useAppDispatch, useAppSelector} from "../../store";
import {stat} from "fs";

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;
const {Title} = Typography
const Context = React.createContext({name: 'Default'});

const Registration = () => {
    const contextValue = useMemo(() => ({name: 'Ant Design'}), []);
    const [getRegistration, {data, error, isError, isLoading}] = useGetRegistrationMutation();
    const [api, contextHolder] = notification.useNotification();
    const [info, setInfo] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
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
    const handleChange = (key: keyof typeof info) => (value: string) => {
        setInfo(prevState => ({
            ...prevState,
            [key]: value
        }));
    };
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        getRegistration(info);

    }
    const openNotification = (type: string, message: string = "Вы успешно вошли в аккаунт! Проверьте почту для активации аккаунта") => {
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


    return (
        <div className={cls.container}>
            {isLogged ? <Title level={2}>Вы уже зарегистрированы</Title> :
                <Context.Provider value={contextValue}>
                    {contextHolder}
                    <form
                        className={cls.form}
                    >
                        <Title level={2}>Регистрация</Title>
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
                            <Button onClick={handleSubmit} size={"large"} type={"primary"}>
                                {isLoading ? <Spin indicator={antIcon}/> : "Отправить"}
                            </Button>
                            <p>Есть аккаунт?&nbsp;
                                <Link to={"/auth/login"}>
                                    Войти
                                </Link>
                            </p>
                        </div>
                    </form>
                </Context.Provider>
            }
        </div>

    );
};

export default Registration;