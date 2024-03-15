import {createSlice} from "@reduxjs/toolkit";
import book from "../../pages/Book/Book";


const initialState = {
    fontSize: 14,
    color: "#000",
    backgroundColor: "#fff",
    lineHeight: 16
}

const bookSettingsSlice = createSlice({
    name: "bookSettings",
    initialState,
    reducers: {
        setNewSettings: (state, action) => {
            state.backgroundColor = action.payload.backgroundColor
            state.fontSize = action.payload.fontSize
            state.lineHeight = action.payload.lineHeight
            state.color = action.payload.color
        }
    }
})

export const {setNewSettings} = bookSettingsSlice.actions
export default bookSettingsSlice.reducer