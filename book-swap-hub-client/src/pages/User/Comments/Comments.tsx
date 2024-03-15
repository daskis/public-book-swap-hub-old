import React, {useEffect} from 'react';
import {useAppSelector} from "../../../store";
import {useLazyGetCommentsQuery} from "../../../store/services/commentApi";
import cls from "./Comments.module.scss"
import CommentItem from "../../../components/CommentItem/CommentItem";
import {useParams} from "react-router-dom";
const Comments = () => {
    const userId = useParams().id
    const [getComments, { data: allCommentsData }] = useLazyGetCommentsQuery();
    useEffect(() => {
        // Вызываем getComments только если userId существует
        if (userId) {
            getComments({ appointment: 'user', id: userId }); // Вызываем запрос с параметрами
        }
    }, [userId, getComments]);

    return (
        <div className={cls.wrapper}>
            <ul className={cls.commentList}>
                {allCommentsData && allCommentsData.map((item:any) => (
                    <CommentItem key={item._id} {...item}></CommentItem>
                ))}
            </ul>
        </div>
    );
};

export default Comments;