import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

//Dev only
// const pause = (duration) => {
//     return new Promise((resolve) => {
//         setTimeout(resolve, duration);
//     });
// }

const itemApi = createApi({
    reducerPath: "item",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3001/items",
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
                query: ({ _id, inputItem, token }) => {
                    return {
                        url: '/create',
                        headers: { Authorization: `Bearer ${token}` },
                        body: {
                            userId: _id,
                            description: inputItem
                        },
                        method: "POST"
                    }
                }
            }),
            completeItem: builder.mutation({
                invalidatesTags: ['Items'],
                query: ({ id, token }) => {
                    return {
                        url: '/modify',
                        headers: { Authorization: `Bearer ${token}` },
                        body: {
                            _id: id
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