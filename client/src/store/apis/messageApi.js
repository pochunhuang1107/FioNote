import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiUrl = process.env.REACT_APP_API || "http://localhost:3001";

const messageApi = createApi({
    reducerPath: "message",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl+"/messages",
    }),
    endpoints(builder) {
        return {
            fetchMessages: builder.query({
                providesTags: ['Messages'],
                query: ({ _id, token }) => {
                    return {
                        url: `/fetch/${_id}`,
                        headers: { Authorization: `Bearer ${token}` },
                        method: "GET"
                    }
                }
            }),
            modifyReadMessages: builder.mutation({
                invalidatesTags: ['Messages'],
                query: ({ _id, token }) => {
                    return {
                        url: '/read',
                        headers: { Authorization: `Bearer ${token}` },
                        body: {
                            _id
                        },
                        method: "PATCH"
                    }
                }
            }),
        }
    }
});

export const { useFetchMessagesQuery, useModifyReadMessagesMutation } = messageApi;
export { messageApi };