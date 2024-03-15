import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {RootState} from "../index";

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery(
        {
            baseUrl: 'http://localhost:4000/auth',
            prepareHeaders: (headers, {getState}) => {
                const token = (getState() as RootState).auth.token
                if (token) {
                    headers.set('authorization', `Bearer ${token}`)
                }
                return headers
            },
            credentials: "include"
        }),
    endpoints: (builder) => ({
        getRegistration: builder.mutation({
            query: (data) => ({
                url: "registration",
                method: "POST",
                body: data
            }),
        }),
        getLogin: builder.mutation({
            query: (data) => ({
                url: "login",
                method: "POST",
                body: data
            }),
        }),
        getMe: builder.query({
            query: () => ({
                url: "me"
            })
        }),
        getLogout: builder.mutation({
            query: () => ({
                url: "logout",
                method: "POST"
            }),
        }),
        getUser: builder.mutation({
            query: (email) => ({
                url: "user",
                method: "POST",
                body: email
            }),
        }),
        getChangeUserInfo: builder.mutation({
            query: (info) => ({
                url: "change",
                method: "PATCH",
                body: info
            }),
        }),
        getAnotherUserInfo: builder.query({
            query: (data) => ({
                url: `/user/${data.id}`
            })
        }),
        getChangePrevents: builder.mutation({
            query: (data) => ({
                url: "/me/prevents",
                method: "PATCH",
                body: data
            })
        })
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetRegistrationMutation,
    useGetChangeUserInfoMutation,
    useGetUserMutation,
    useGetLogoutMutation,
    useGetMeQuery,
    useGetLoginMutation,
    useLazyGetAnotherUserInfoQuery,
    useGetChangePreventsMutation
} = authApi