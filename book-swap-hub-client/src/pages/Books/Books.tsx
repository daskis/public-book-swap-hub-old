import React from 'react';
import cls from "./Books.module.scss"
import BookItem, {IBookItem} from "../../components/BookItem/BookItem";
import {useGetAllBooksQuery} from "../../store/services/bookApi";
const Books = () => {
    const {data} = useGetAllBooksQuery("")
    return (
        <div className={cls.wrapper}>
            <ul className={cls.list}>
                {data &&
                data.map((item : IBookItem) => (
                    <BookItem key={item._id} {...item}/>
                ))}
            </ul>
        </div>
    );
};

export default Books;