import {createSlice} from "@reduxjs/toolkit";

interface IAuth {
    isLogged: boolean
    token: string | null
    imageName: string
    user: {
        id: string;
        email: string;
        name: string;
        city: string;
        sex: "male" | "female" | undefined;
        about: string;
        isActivated: boolean | undefined
    }
}
const initialState : IAuth = {
    isLogged: false,
    imageName: "",
    token: localStorage.getItem("token"),
    user: {
        id: "",
        email: "",
        name: "",
        city: "",
        sex: undefined,
        about: "",
        isActivated: undefined
    }
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogged: (state, action) => {
            state.imageName = action.payload.imageName
            state.token = action.payload.token
            state.isLogged = action.payload.isLogged;
            state.user.email = action.payload.email;
            state.user.id = action.payload.id;
            state.user.isActivated = action.payload.isActivated
        },
        setInfo: (state, action) => {
            state.user.email = action.payload.email;
            state.user.name = action.payload.name;
            state.user.sex = action.payload.sex;
            state.user.city = action.payload.city;
            state.user.about = action.payload.about;
        }
    }
})

export default authSlice.reducer;
export const {setLogged, setInfo} = authSlice.actions