import React, {useEffect, useMemo, useState} from 'react';
import cls from "./Book.module.scss"
import {useNavigate, useParams} from "react-router-dom";
import {useGetBookQuery, useLazyReadBookQuery} from "../../store/services/bookApi";
import {LoadingOutlined} from "@ant-design/icons";
import {Button, notification, Spin} from "antd";
import {Typography} from "antd";
import TextArea from "antd/es/input/TextArea";
import {useGetCommentsQuery, useGetNewCommentMutation} from "../../store/services/commentApi";
import {useAppDispatch, useAppSelector} from "../../store";
import CommentItem from "../../components/CommentItem/CommentItem";
const Context = React.createContext({name: 'Default'});
const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;
const {Title, Text} = Typography
const Book = () => {
    const [comment, setComment] = useState("")
    const params = useParams()
    const navigate = useNavigate()
    const {data} = useGetBookQuery(params.id)
    const [getNewComment, {data: commentData, error}] = useGetNewCommentMutation()
    const {data: allCommentsData, refetch: refetchComments} = useGetCommentsQuery({appointment: "book", id: params.id})
    const userId = useAppSelector(state => state.auth.user.id)
    const [api, contextHolder] = notification.useNotification();
    const contextValue = useMemo(() => ({name: 'Ant Design'}), []);


    useEffect(() => {
        if (commentData) {
            // Вызываем функцию для обновления данных комментариев
            refetchComments();
        }
    }, [commentData, refetchComments, params.id]);


    useEffect(() => {
        if (error) {
            openNotification("error", "Ошибка при отправке")
        }
        if (commentData) {
            openNotification("success", "Комментарий отправлен")
        }
    }, [commentData, error])
    const handleComment = () => {
        if (comment) {
            const newComment = {
                comment,
                userId,
                bookId: params.id
            }
            getNewComment(newComment)
        }
    }
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

    if (data) {
        const reversedComments = allCommentsData ? [...allCommentsData].reverse() : [];
        return (
            <div className={cls.wrapper}>
                <Context.Provider value={contextValue}>
                    {contextHolder}
                    <div className={cls.bookInfo}>
                        <div className={cls.image}>
                            <img src={`${process.env.REACT_APP_SERVER_URL}/images/${data.imageName}`} alt=""/>
                        </div>
                        <div className={cls.info}>
                            <Title className={cls.title} level={2}>{data.name}</Title>
                            <Text className={cls.text}>Описание:</Text>
                            <Text>{data.description}</Text>
                            <Text className={cls.author}>Автор:</Text>
                            <Text>{data.author}</Text>
                            <Button onClick={() => {
                                navigate(`/book/${params.id}/read`)
                            }} type={"primary"}>Читать</Button>
                        </div>
                    </div>
                    <div className={cls.commentWrapper}>
                        <Title level={3}>Оставить отзыв</Title>
                        <TextArea value={comment} onChange={(e) => setComment(e.target.value)} rows={5}/>
                        <Button onClick={handleComment} size={"large"} type={"primary"}>Отправить</Button>
                        <ul className={cls.commentList}>
                            {reversedComments && reversedComments.map((item: any) => (
                                <CommentItem appointment={"book"} key={item._id} {...item}></CommentItem>
                            ))}
                        </ul>
                    </div>
                </Context.Provider>
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

export default Book;