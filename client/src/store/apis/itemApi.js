import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

//Dev only
// const pause = (duration) => {
//     return new Promise((resolve) => {
//         setTimeout(resolve, duration);
//     });
// }

const apiUrl = process.env.REACT_APP_API || "http://localhost:3001";

const itemApi = createApi({
    reducerPath: "item",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl+"/items",
        fetchFn: async (...args) => {
            // Remove for production
            // await pause(1000);
            return fetch(...args);
        }
    }),
    endpoints(builder) {
        return {
            fetchItems: builder.query({
                providesTags: ['Items', 'AcceptTask'],
                query: ({ _id, date, token }) => {
                    return {
                        url: `/${_id}/${date}`,
                        headers: { Authorization: `Bearer ${token}` },
                        method: "GET"
                    }
                }
            }),
            createItem: builder.mutation({
                invalidatesTags: ['Items'],
                query: ({ _id, inputItem, token, date }) => {
                    return {
                        url: '/create',
                        headers: { Authorization: `Bearer ${token}` },
                        body: {
                            userId: _id,
                            description: inputItem,
                            dateCreated: date,
                        },
                        method: "POST"
                    }
                }
            }),
            completeItem: builder.mutation({
                invalidatesTags: ['Items'],
                query: ({ id, token, date }) => {
                    return {
                        url: '/modify',
                        headers: { Authorization: `Bearer ${token}` },
                        body: {
                            _id: id,
                            date: date,
                        },
                        method: "PATCH"
                    }
                }
            }),
            removeItem: builder.mutation({
                invalidatesTags: ['Items'],
                query: ({ id, token }) => {
                    return {
                        url: '/remove',
                        headers: { Authorization: `Bearer ${token}` },
                        body: {
                            _id: id
                        },
                        method: "DELETE"
                    }
                }
            }),
            sendTask: builder.mutation({
                query: ({ requester, recipient, description, dateCreated, token }) => {
                    return {
                        url: '/request/send',
                        headers: { Authorization: `Bearer ${token}` },
                        body: {
                            requester, recipient, description, dateCreated
                        },
                        method: "POST"
                    }
                }
            }),
            fetchTask: builder.query({
                providesTags: ['Tasks'],
                query: ({ _id, token }) => {
                    return {
                        url: `/request/fetch/${_id}`,
                        headers: { Authorization: `Bearer ${token}` },
                        method: "GET",
                    }
                }
            }),
            modifyReadTask: builder.mutation({
                invalidatesTags: ['Tasks'],
                query: ({ _id, token }) => {
                    return {
                        url: '/request/read',
                        headers: { Authorization: `Bearer ${token}` },
                        body: {
                            _id
                        },
                        method: "PATCH"
                    }
                }
            }),
            acceptTask: builder.mutation({
                invalidatesTags: ['Tasks', 'AcceptTask'],
                query: ({ id, token }) => {
                    return {
                        url: '/request/accept',
                        headers: { Authorization: `Bearer ${token}` },
                        body: {
                            _id: id
                        },
                        method: "PATCH"
                    }
                }
            }),
            deleteTask: builder.mutation({
                invalidatesTags: ['Tasks'],
                query: ({ id, token }) => {
                    return {
                        url: '/request/delete',
                        headers: { Authorization: `Bearer ${token}` },
                        body: {
                            _id: id
                        },
                        method: "DELETE"
                    }
                }
            }),
        }
    }
});

export const { useFetchItemsQuery, 
            useCreateItemMutation, 
            useCompleteItemMutation, 
            useRemoveItemMutation,
            useAcceptTaskMutation,
            useDeleteTaskMutation,
            useFetchTaskQuery,
            useSendTaskMutation,
            useModifyReadTaskMutation,
        } = itemApi;
export { itemApi };