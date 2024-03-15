import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const bookApi = createApi({
    reducerPath: 'bookApi',
    baseQuery: fetchBaseQuery(
        {
            baseUrl: 'http://localhost:4000/book',
            credentials: "include"
        }),
    endpoints: (builder) => ({
        getNewBook: builder.mutation({
            query: (data) => ({
                url: "new",
                method: "POST",
                body: data
            }),
        }),
        getBook: builder.query({
            query: (id) => ({
                url: id
            })
        }),
        getAllBooks: builder.query({
            query: () => ({
                url: "/all"
            })
        }),
        readBook: builder.query({
            query: (id) => ({
                url: `${id}/read`,
                responseHandler: (response: { text: () => any }) => response.text()
            })
        })

    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useGetNewBookMutation, useLazyReadBookQuery, useGetAllBooksQuery, useGetBookQuery} = bookApi