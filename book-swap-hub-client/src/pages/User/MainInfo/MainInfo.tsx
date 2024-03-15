import React, {useEffect} from 'react';
import cls from './MainInfo.module.scss';
import {Avatar, Button, Input, notification, Radio, Spin} from 'antd';
import {EditOutlined, LoadingOutlined, UserOutlined} from '@ant-design/icons';
import {useAppDispatch, useAppSelector} from "../../../store";
import {
    useLazyGetAnotherUserInfoQuery
} from "../../../store/services/authApi";
import {Typography} from "antd";
import {useNavigate, useParams} from "react-router-dom";

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;

const {Title, Text} = Typography;
const MainInfo = () => {
    const userId = useParams().id;
    const stateUserId = useAppSelector(state => state.auth.user.id)
    const navigate = useNavigate()
    const [getAnotherUser, {data}] = useLazyGetAnotherUserInfoQuery();

    useEffect(() => {
        if (userId) {
            getAnotherUser({id: userId});
        }
    }, [userId]);


    if (data) {
        return (
            <div className={cls.wrapper}>
                <div className={cls.baseInfo}>
                    {data.imageName ? <img style={{width: "128px", height: "128px"}} src={`${process.env.REACT_APP_SERVER_URL}/avatars/${data.imageName}`} alt="avatar"/>
                        : <Avatar size={128} icon={<UserOutlined/>}/>
                    }
                    <div className={cls.mainInfo}>
                        <p>Никнейм: <Text>{data.name}</Text></p>
                        <p>Email: <Text>{data.email}</Text></p>
                    </div>
                </div>
                <div className={cls.anotherInfo}>
                    <p>Город: <Text>{data.city ? data.city : "Не указан"}</Text></p>
                    <p>Пол: <Text>{data.sex === "male" ? "Мужской" : "Женский"}</Text></p>
                    <p>О себе: <Text>{data.about ? data.about : "Не указано"}</Text></p>
                </div>
            </div>
        );
    } else {
        return (
            <div className={cls.loading}>
                <Spin indicator={antIcon}/>
            </div>
        )
    }

};

export default MainInfo;
