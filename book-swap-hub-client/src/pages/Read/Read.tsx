import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import parse from "html-react-parser"
import "./Read.scss"
import {useLazyReadBookQuery} from "../../store/services/bookApi";
import {Button, ColorPicker, Drawer, InputNumber} from "antd";
import {ControlOutlined, SettingFilled, SettingOutlined} from "@ant-design/icons";
import {Typography} from "antd";
import {useAppDispatch, useAppSelector} from "../../store";
import {setNewSettings} from "../../store/features/bookSettingsSlice";
import {Color} from "antd/es/color-picker";
import {useGetChangePreventsMutation, useGetMeQuery} from "../../store/services/authApi";

const {Text, Title} = Typography


enum SettingsEnum {
    FONTSIZE = "fontSize",
    COLOR = "color",
    BACKGROUNDCOLOR = "backgroundColor",
    LINEHEIGHT = "lineHeight"
}

const Read = () => {
    const params = useParams()
    const [parsedContent, setParsedContent] = useState<any>()
    const {data, isLoading} = useGetMeQuery(null)
    const [readBook, readBookData] = useLazyReadBookQuery()
    const [changePrevents, {data: dataPrevents}] = useGetChangePreventsMutation()
    const dispatch = useAppDispatch()
    const settings = useAppSelector(state => state.bookSettings)
    useEffect(() => {
        readBook(params.id)
    }, [])
    useEffect(() => {
        if (readBookData.data) {
            setParsedContent(parse(readBookData.data))
        }
    }, [readBookData])

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };



    useEffect(() => {
        if (data) {
            dispatch(setNewSettings({...data.prevents}))
        }
    }, [data])
    const handleChangeSettings = (value: string | number | null | Color, type: SettingsEnum) => {
        if (value) {
            switch (type) {
                case SettingsEnum.BACKGROUNDCOLOR:
                    dispatch(setNewSettings({...settings, backgroundColor: value}))
                    break;
                case SettingsEnum.COLOR:
                    dispatch(setNewSettings({...settings, color: value}))
                    break;
                case SettingsEnum.FONTSIZE:
                    dispatch(setNewSettings({...settings, fontSize: value}))
                    break;
                case SettingsEnum.LINEHEIGHT:
                    dispatch(setNewSettings({...settings, backgroundColor: value}))
                    break;
            }
        }
    }

    const setNewPrevents = () => {
        changePrevents(settings)
        console.log(settings)
    }
    return (
        <div className="wrapper"
             style={{
                 backgroundColor: settings.backgroundColor,
                 color: settings.color,
                 fontSize: settings.fontSize,
                 lineHeight: settings.lineHeight
             }}>
            <SettingOutlined className="icon" onClick={showDrawer}/>
            {parsedContent}
            <Drawer bodyStyle={{display: "flex", flexDirection: "column", gap: 20}} title="Basic Drawer" placement="right" onClose={onClose} open={open}>
                <ul className="drawerList">
                    <li>
                        <Text>Размер шрифта</Text>
                        <InputNumber
                            onChange={(value) => handleChangeSettings(value, SettingsEnum.FONTSIZE)}
                            defaultValue={settings.fontSize}/>
                    </li>
                    <li>
                        <Text>Межстрочный интервал</Text>
                        <InputNumber
                            onChange={(value) => handleChangeSettings(value, SettingsEnum.LINEHEIGHT)}
                            defaultValue={settings.lineHeight}/>
                    </li>
                    <li>
                        <Text>Цвет текста</Text>
                        <ColorPicker
                            onChangeComplete={(value) => {
                                handleChangeSettings(value.toHexString(), SettingsEnum.COLOR)
                            }}
                            defaultValue={settings.color}/>
                    </li>
                    <li>
                        <Text>Цвет заднего фона</Text>
                        <ColorPicker
                            onChangeComplete={(value) => {
                                handleChangeSettings(value.toHexString(), SettingsEnum.BACKGROUNDCOLOR)
                            }}
                            defaultValue={settings.backgroundColor}/>
                    </li>
                </ul>
                <Button onClick={setNewPrevents} type={"primary"}>Сохранить</Button>
            </Drawer>
        </div>
    );
};

export default Read;