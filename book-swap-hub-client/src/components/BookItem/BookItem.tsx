import React from 'react';
import cls from "./BookItem.module.scss"
import {Button, Typography} from "antd";
import {Link} from "react-router-dom";
export interface IBookItem {
    _id: string
    name: string,
    author: string,
    description: string,
    imageName: string,
    fileName: string,
    user: string
}
const {Title, Text} = Typography
const BookItem = ({_id, fileName, name, imageName, user, author, description}: IBookItem) => {
    return (
        <li className={cls.item}>
            <img src={`${process.env.REACT_APP_SERVER_URL}/images/${imageName}`} alt=""/>
            <div className={cls.info}>
                <Title level={2}>{name}</Title>
                <Text>{description}</Text>
            </div>
            <div className={cls.moreInfo}>
                <Text>{author}</Text>
                <Button size={"large"} type={"primary"}>
                    <Link to={`/book/${_id}`}>Подробнее</Link>
                </Button>
            </div>
        </li>
    );
};

export default BookItem;