import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiUrl = process.env.REACT_APP_API || "http://localhost:3001";

const userApi = createApi({
    reducerPath: "user",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl+"/users",
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
                            username: String(user.username).toLocaleLowerCase(),
                            password: user.password,
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
                            username: String(user.username).toLocaleLowerCase(),
                            password: user.password,
                        },
                        method: "POST"
                    }
                }
            })
        }
    }
});

export const { useCreateUserMutation, useLoginUserMutation } = userApi;
export { userApi };