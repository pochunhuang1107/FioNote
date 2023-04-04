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
                providesTags: ['Items'],
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
            })
        }
    }
});

export const { useFetchItemsQuery, useCreateItemMutation, useCompleteItemMutation, useRemoveItemMutation } = itemApi;
export { itemApi };