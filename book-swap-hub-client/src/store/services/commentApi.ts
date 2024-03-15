import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const commentApi = createApi({
    reducerPath: 'commentApi',
    baseQuery: fetchBaseQuery(
        {
            baseUrl: 'http://localhost:4000/comment',
        }),
    endpoints: (builder) => ({
        getNewComment: builder.mutation({
            query: (data) => ({
                url: "new",
                method: "POST",
                body: data
            }),
        }),
        getComments: builder.query({
            query: (data)  =>({
                url: `all?appointment=${data.appointment}&id=${data.id}`
            })
        })


    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useGetNewCommentMutation, useLazyGetCommentsQuery, useGetCommentsQuery} = commentApi