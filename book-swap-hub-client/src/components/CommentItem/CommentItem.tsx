import React from 'react';
import {UserOutlined} from "@ant-design/icons";
import {Avatar} from "antd";
import cls from "./CommentItem.module.scss"
import {Typography} from "antd";
import {Link} from "react-router-dom";
import {useAppSelector} from "../../store";

const {Title, Text} = Typography
interface ICommentItem {
    appointment?: "book" | "user",
    book: string,
    comment: string,
    user: {
        name: string,
        email: string,
        _id: string
        imageName: string
    },
    _id: string
}
const CommentItem = ({book, comment, user, _id, appointment} : ICommentItem) => {
    const userId = useAppSelector(state => state.auth.user.id)
    if (user._id === userId) {
        return (
            <li className={cls.wrapper}>
                {user.imageName ? <img style={{width: 32, height: 32}} src={`${process.env.REACT_APP_SERVER_URL}/avatars/${user.imageName}`} alt=""/> : <Avatar icon={<UserOutlined/>}/>}
                <div className={cls.info}>
                    <Title level={3}>{user.name ? user.name : user.email}</Title>
                    <Text>{comment}</Text>
                </div>
                {appointment === "book" ? <Link to={`/profile/main`}>Источник</Link> : <Link to={`/book/${book}`}>Источник</Link>}
            </li>
        );
    } else {
        return (
            <li className={cls.wrapper}>
                {user.imageName ? <img style={{width: 32, height: 32}} src={`${process.env.REACT_APP_SERVER_URL}/avatars/${user.imageName}`} alt=""/> : <Avatar icon={<UserOutlined/>}/>}
                <div className={cls.info}>
                    <Title level={3}>{user.name ? user.name : user.email}</Title>
                    <Text>{comment}</Text>
                </div>
                {appointment === "book" ? <Link to={`/user/${user._id}/main`}>Источник</Link> : <Link to={`/book/${book}`}>Источник</Link>}
            </li>
        );
    }

};

export default CommentItem;