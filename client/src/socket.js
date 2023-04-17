import { io } from 'socket.io-client';

const url = process.env.REACT_APP_API || "http://localhost:3001";
export const socket = io(url);