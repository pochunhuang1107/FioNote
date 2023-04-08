import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

//Dev only
// const pause = (duration) => {
//     return new Promise((resolve) => {
//         setTimeout(resolve, duration);
//     });
// }

const apiUrl = process.env.REACT_APP_API || "http://localhost:3001";

const userApi = createApi({
    reducerPath: "user",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl + "/users",
        fetchFn: async (...args) => {
            // Remove for production
            // await pause(1000);
            return fetch(...args);
        }
    }),
    endpoints(builder) {
        return {
            createUser: builder.mutation({
                query: (user) => {
                    return {
                        url: "/register",
                        body: {
                            lastName: user.lastName,
                            firstName: user.firstName,
                            username: user.username,
                            password: user.password,
                            email: user.email,
                        },
                        method: "POST"
                    }
                }
            }),
            loginUser: builder.mutation({
                query: (user) => {
                    return {
                        url: "/login",
                        body: {
                            username: user.username,
                            password: user.password,
                        },
                        method: "POST"
                    }
                }
            }),
            sendFriendRequest: builder.mutation({
                query: ({ _id, searchTerm, token }) => {
                    return {
                        url: "/friends/request",
                        headers: { Authorization: `Bearer ${token}` },
                        body: {
                            requesterId: _id,
                            recipientEmail: searchTerm,
                            recipientUsername: searchTerm,
                        },
                        method: "POST",
                    }
                }
            }),
            fetchFriendRequest: builder.query({
                providesTags: ['FriendRequest'],
                query: ({ _id, token }) => {
                    return {
                        url: `/friends/fetch/${_id}`,
                        headers: { Authorization: `Bearer ${token}` },
                        method: "GET",
                    }
                }
            }),
            modifyRead: builder.mutation({
                invalidatesTags: ['FriendRequest'],
                query: ({ _id, token }) => {
                    return {
                        url: '/friends/read',
                        headers: { Authorization: `Bearer ${token}` },
                        body: {
                            _id: _id
                        },
                        method: "POST",
                    }
                }
            }),
            acceptFriendRequest: builder.mutation({
                invalidatesTags: ['FriendRequest', 'Accept'],
                query: ({ id, requesterId, token }) => {
                    return {
                        url: '/friends/accept',
                        headers: { Authorization: `Bearer ${token}` },
                        body: {
                            recipientId: id,
                            requesterId: requesterId,
                        },
                        method: "POST",
                    }
                }
            }),
            deleteFriendRequest: builder.mutation({
                invalidatesTags: ['FriendRequest'],
                query: ({ id, requesterId, token }) => {
                    return {
                        url: '/friends/decline',
                        headers: { Authorization: `Bearer ${token}` },
                        body: {
                            recipientId: id,
                            requesterId: requesterId,
                        },
                        method: "POST",
                    }
                }
            }),
            fetchFriendsList: builder.query({
                providesTags: ['Accept'],
                query: ({ _id, token }) => {
                    return {
                        url: `/friends/list/${_id}`,
                        headers: { Authorization: `Bearer ${token}` },
                        method: "GET",
                    }
                }
            })
        }
    }
});

export const { useCreateUserMutation,
    useLoginUserMutation,
    useSendFriendRequestMutation,
    useFetchFriendRequestQuery,
    useModifyReadMutation,
    useAcceptFriendRequestMutation,
    useDeleteFriendRequestMutation,
    useFetchFriendsListQuery,
} = userApi;
export { userApi };