import React, { useEffect, useState } from 'react';
import { Avatar, Menu, MenuProps } from 'antd';
import cls from './User.module.scss';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { getItem } from '../../utils';
import { useGetUserMutation } from '../../store/services/authApi';
import { useAppDispatch, useAppSelector } from '../../store';
import { setInfo } from '../../store/features/authSlice';
import MainInfo from './MainInfo/MainInfo';
import BookMarks from './BookMarks/BookMarks';
import Comments from './Comments/Comments';

const User = () => {
    const params = useParams();
    const [selectedKey, setSelectedKey] = useState(params['*']); // Изначально выбран 'main'
    const navigate = useNavigate();
    const userId = params.id;
    const stateUserId = useAppSelector((state) => state.auth.user.id);

    useEffect(() => {
        if (selectedKey) {
            navigate(`/user/${userId}/${selectedKey}`);
        }
    }, [selectedKey]);

    const items: MenuProps['items'] = [
        getItem('Основная информация', 'main', null),
        getItem('Закладки', 'bookmarks', null),
        getItem('Комментарии', 'comments', null),
    ];

    // Проверяем условие и выполняем перенаправление, если оно истинное


    return (
        <div className={cls.wrapper}>
            <div className={cls.menu}>
                <Menu
                    onClick={({ key }) => setSelectedKey(key)} // Обновляем выбранный ключ
                    items={items}
                    /*@ts-ignore*/
                    selectedKeys={[selectedKey]}
                    mode="inline"
                />
            </div>
            <div className={cls.info}>
                <Routes>
                    <Route path="main" element={<MainInfo />} />
                    <Route path="bookmarks" element={<BookMarks />} />
                    <Route path="comments" element={<Comments />} />
                </Routes>
            </div>
        </div>
    );
};

export default User;
