import React, {useEffect, useMemo, useState} from 'react';
import cls from './MainInfo.module.scss';
import {Avatar, Button, Input, notification, Radio} from 'antd';
import {EditOutlined, UserOutlined} from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";
import {useAppDispatch, useAppSelector} from "../../../store";
import {useGetChangeUserInfoMutation, useGetUserMutation} from "../../../store/services/authApi";
import {setInfo} from "../../../store/features/authSlice";
import {useNavigate} from "react-router-dom";

enum enabledEnum {
    name = 'name',
    email = 'email',
    city = "city",
    sex = "sex",
    about = "about",
    password = "password",
    confirmPassword = "confirmPassword"
}

type UserInfo = {
    id: string;
    name: string;
    email: string;
    city: string;
    sex: string;
    about: string;
    password: string;
    confirmPassword: string;
    [key: string]: string;
};

interface IEnabledInputs {
    type: enabledEnum;
    value?: string;
}

const Context = React.createContext({name: 'Default'});

const MainInfo = () => {
    const [image, setImage] = useState(null)
    const dispatch = useAppDispatch()
    const email = useAppSelector(state => state.auth.user.email)
    const [getUser, {data}] = useGetUserMutation()
    const [getChangeUser, {data: changeUserData}] = useGetChangeUserInfoMutation()
    const id = useAppSelector(state => state.auth.user.id)
    const [api, contextHolder] = notification.useNotification();
    const contextValue = useMemo(() => ({name: 'Ant Design'}), []);
    const imageName = useAppSelector(state => state.auth.imageName)
    const [changedInputs, setChangedInputs] = useState({
        name: "",
        email: "",
        city: "",
        sex: "",
        about: "",
        password: "",
        confirmPassword: ""
    })
    const [enabledInputs, setEnabledInputs] = useState({
        name: false,
        email: false,
        city: false,
        sex: false,
        about: false,
        password: false,
        confirmPassword: false
    });
    const navigate = useNavigate()
    const user = useAppSelector(state => state.auth.user)
    useEffect(() => {
        if (email) {
            const req = {email}
            getUser(req)
        }
    }, [email])
    useEffect(() => {
        if (data) {
            setChangedInputs((prevState) => ({
                ...prevState,
                name: data.name,
                email: data.email,
                city: data.city,
                sex: data.sex,
                about: data.about,
            }))
            dispatch(setInfo({...data}))
        }
    }, [data])


    useEffect(() => {
        if (changeUserData) {
            openNotification(changeUserData.type, changeUserData.message)
            setTimeout(() => {
                navigate("/")
                window.location.reload()
            }, 2000)
        }
    }, [changeUserData])
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
    const enableInputsHandler = ({type}: IEnabledInputs) => {
        setEnabledInputs(prevState => ({
            ...prevState,
            [type]: !prevState[type]
        }));
    };
    const handleSubmit = () => {
        if (id) {
            const newValues: UserInfo = {
                ...changedInputs,
                id,
            };

            const formData = new FormData();
            if (image) {
                formData.append("image", image); // Добавляем изображение в FormData
            }
            for (const key in newValues) {
                formData.append(key, newValues[key]);
            }

            getChangeUser(formData); // Отправляем FormData
        }
    };

    const changeInputsHandler = ({type, value}: IEnabledInputs) => {
        setChangedInputs(prevState => ({
            ...prevState,
            [type]: value
        }));
    };
    return (
        <div className={cls.wrapper}>
            <Context.Provider value={contextValue}>
                {contextHolder}
                <div className={cls.baseInfo}>
                    <span className={cls.avatar}>
                        {image
                            ? <img src={URL.createObjectURL(image)} alt="postImage"/>
                            : imageName ? <img style={{width: "128px", height: "128px"}}
                                               src={`${process.env.REACT_APP_SERVER_URL}/avatars/${imageName}`}
                                               alt="avatar"/>
                                : <Avatar size={128} icon={<UserOutlined/>}/>

                        }
                        <span>
                            {/*@ts-ignore*/}
                            <Input onChange={(e) => {
                                // @ts-ignore
                                if (e.target.files[0] !== null) {
                                    // @ts-ignore
                                    if (e.target.files[0].name.split('.')[e.target.files[0].name.split('.').length - 1] === "png"
                                        // @ts-ignore
                                        || e.target.files[0].name.split('.')[e.target.files[0].name.split('.').length - 1] === "jpg"
                                        // @ts-ignore
                                        || e.target.files[0].name.split('.')[e.target.files[0].name.split('.').length - 1] === "jpeg") {
                                        // @ts-ignore
                                        setImage(e.target.files[0])
                                    } else {
                                        openNotification("error", "Неправильный формат файла")
                                    }
                                }
                            }} className={cls.avatarInput}
                                   type={'file'}/>
                            <EditOutlined className={cls.edit}/>
                        </span>
                    </span>
                    <div className={cls.inputs}>
                        <div>
                            <span className={cls.label}>Никнейм</span>
                            <div className={cls.input}>
                                <Input onChange={(e) => {
                                    changeInputsHandler({type: enabledEnum.name, value: e.currentTarget.value})
                                }
                                } value={changedInputs.name} disabled={!enabledInputs.name}/>
                                <EditOutlined onClick={() => enableInputsHandler({type: enabledEnum.name})}/>
                            </div>
                        </div>
                        <div>
                            <span className={cls.label}>Email</span>
                            <div className={cls.input}>
                                <Input
                                    onChange={(e) => {
                                        changeInputsHandler({type: enabledEnum.email, value: e.currentTarget.value})
                                    }
                                    } value={changedInputs.email}
                                    disabled={!enabledInputs.email}/>
                                <EditOutlined onClick={() => enableInputsHandler({type: enabledEnum.email})}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <span className={cls.label}>Город</span>
                    <div className={cls.input}>
                        <Input
                            onChange={(e) => {
                                changeInputsHandler({type: enabledEnum.city, value: e.currentTarget.value})
                            }
                            } value={changedInputs.city}
                            disabled={!enabledInputs.city}/>
                        <EditOutlined onClick={() => enableInputsHandler({type: enabledEnum.city})}/>
                    </div>
                </div>
                <div>
                    <span className={cls.label}>Пол</span>
                    <div className={cls.input}>
                        <Radio.Group
                            onChange={(e) => {
                                changeInputsHandler({type: enabledEnum.sex, value: e.target.value})
                            }
                            } value={changedInputs.sex}
                        >
                            <Radio value={"male"}>Мужчина</Radio>
                            <Radio value={"female"}>Женщина</Radio>
                        </Radio.Group>
                    </div>
                </div>
                <div>
                    <span className={cls.label}>О себе</span>
                    <div className={cls.input}>
                        <TextArea
                            onChange={(e) => {
                                changeInputsHandler({type: enabledEnum.about, value: e.currentTarget.value})
                            }
                            } value={changedInputs.about}
                            disabled={!enabledInputs.about}/>
                        <EditOutlined onClick={() => enableInputsHandler({type: enabledEnum.about})}/>
                    </div>
                </div>
                <div>
                    <span className={cls.label}>Старый пароль</span>
                    <div className={cls.inputPassword}>
                        <Input.Password
                            onChange={(e) => {
                                changeInputsHandler({type: enabledEnum.password, value: e.currentTarget.value})
                            }
                            } value={changedInputs.password}
                            disabled={!enabledInputs.password}/>
                        <EditOutlined className={cls.passwordEdit}
                                      onClick={() => enableInputsHandler({type: enabledEnum.password})}/>

                    </div>
                </div>
                <div>
                    <span className={cls.label}>Новый пароль</span>
                    <div className={cls.inputPassword}>
                        <Input.Password
                            onChange={(e) => {
                                changeInputsHandler({type: enabledEnum.confirmPassword, value: e.currentTarget.value})
                            }
                            } value={changedInputs.confirmPassword}
                            disabled={!enabledInputs.confirmPassword}/>
                        <EditOutlined className={cls.passwordEdit}
                                      onClick={() => enableInputsHandler({type: enabledEnum.confirmPassword})}/>
                    </div>
                </div>
                <div className={cls.buttons}>
                    <Button onClick={handleSubmit} type={"primary"}>Сохранить</Button>
                    <Button type={"link"}>Отмена</Button>
                </div>
            </Context.Provider>
        </div>
    );
};

export default MainInfo;
