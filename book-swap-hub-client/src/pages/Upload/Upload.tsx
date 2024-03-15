import React, {FormEvent, useEffect, useMemo, useRef, useState} from 'react';
import {Button, Form, Input, message, notification, Typography, Upload, UploadFile, UploadProps} from 'antd';
import ImgCrop from 'antd-img-crop';
import {CloseOutlined, UploadOutlined} from '@ant-design/icons';
import cls from './Upload.module.scss';
import TextArea from "antd/es/input/TextArea";
import {useGetNewBookMutation} from "../../store/services/bookApi";
import {useNavigate} from "react-router-dom";

enum ImageEnum {
    PNG = "png",
    JPG = "jpg",
    JPEG = "jpeg",
}

enum fileEnum {
    FB2 = "fb2",
    EPUB = "epub"
}

type fileType = ImageEnum | fileEnum
const Context = React.createContext({name: 'Default'});

const UploadForm = () => {
    const [image, setImage] = useState(null)
    const [book, setBook] = useState(null)
    const [getNewBook, {data, isLoading, isError}] = useGetNewBookMutation()
    const navigate = useNavigate()
    const [api, contextHolder] = notification.useNotification();
    const contextValue = useMemo(() => ({name: 'Ant Design'}), []);
    const formRef = useRef<HTMLFormElement | null>(null);
    const [name, setName] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
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
    const uploadFile = (e: any, type: string) => {
        if (e.target) {
            const fileType: fileType = e.target.files[0].name.split(".")[e.target.files[0].name.split(".").length - 1]
            switch (type) {
                case "image":
                    if (fileType === ImageEnum.PNG
                        ||
                        fileType === ImageEnum.JPG
                        ||
                        fileType === ImageEnum.JPEG
                    ) {
                        let image = e.target.files[0];
                        setImage(image)
                        break
                    } else {
                        openNotification("error", "Неправильный формат изображения")
                        break;
                    }
                case "file":
                    if (fileType === fileEnum.FB2 || fileType === fileEnum.EPUB) {
                        let book = e.target.files[0];
                        setBook(book)
                        break
                    } else {
                        openNotification("error", "Неправильный формат файла");
                        break;
                    }

            }
        }
    }


    const clearForm = () => {
        if (formRef.current) {
            formRef.current.reset(); // Используйте метод reset для очистки формы
            setImage(null); // Также сбрасываем выбранное изображение
            setBook(null); // И сбрасываем выбранный файл
            setName("");
            setAuthor("");
            setDescription("")
        }
    }
    const handleSubmit = (e: any) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        if (image) {
            formData.append("image", image)
        }
        if (formData.get('name') && formData.get('author') && formData.get('description') && formData.get('file') && formData.get('image')) {
            getNewBook(formData)
        } else {
            openNotification("error", "Заполните все поля")
        }
    }
    useEffect(() => {
        if (data) {
            openNotification("success", data.message)
            setTimeout(() => {
                navigate("/")
            }, 2000)
        }
    }, [data])


    return (
        <div className={cls.wrapper}>
            <Context.Provider value={contextValue}>
                {contextHolder}
                <Typography.Title level={2}>Загрузка книги</Typography.Title>
                <form ref={formRef} className={cls.form} onSubmit={handleSubmit}>
                    <div className={cls.formItem}>
                        <Typography.Text>
                            Обложка
                        </Typography.Text>
                        <div className={cls.img}>
                            {image ?
                                <>
                                    <img src={URL.createObjectURL(image)} alt="postImage"/>
                                    <CloseOutlined className={cls.close} onClick={() => setImage(null)}/>
                                </>
                                :
                                <>
                                    <input type="file"
                                           name="image"
                                           onChange={(e) => uploadFile(e, "image")}
                                           id="image"
                                           className={cls.imagefile}/>
                                    <label htmlFor="image">
                                        <UploadOutlined style={{fontSize: 40}}/>
                                    </label>
                                </>
                            }

                        </div>
                    </div>
                    <div className={cls.inputs}>
                        <div className={cls.formItem}>
                            <Typography.Text>
                                Название
                            </Typography.Text>
                            <Input name="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className={cls.formItem}>
                            <Typography.Text>
                                Автор
                            </Typography.Text>
                            <Input name="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                        </div>
                        <div className={cls.formItem}>
                            <Typography.Text>
                                Описание
                            </Typography.Text>
                            <TextArea rows={4} name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className={cls.formItem}>
                            <Typography.Text>
                                Название
                            </Typography.Text>
                            <input type="file"
                                   name="file"
                                   onChange={(e) => uploadFile(e, "file")}
                                   id="file"
                                   className={cls.inputfile}/>
                            <label htmlFor="file">
                                {/*@ts-ignore*/}
                                {book ? book.name : "Выберите файл"}
                            </label>
                        </div>
                        <div className={cls.buttons}>
                            <Button size={"large"} htmlType={"submit"} type={"primary"}>Отправить</Button>
                        </div>
                    </div>

                </form>
            </Context.Provider>
        </div>
    );
};

export default UploadForm;
