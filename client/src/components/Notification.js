import { useEffect, useRef, useState } from 'react';
import { IoMdNotificationsOutline, IoMdNotifications } from 'react-icons/io';
import { useSelector } from 'react-redux';
import {
    useFetchFriendRequestQuery,
    useFetchTaskQuery,
    useModifyReadMutation,
    useModifyReadTaskMutation,
    useAcceptFriendRequestMutation,
    useDeleteFriendRequestMutation,
    useAcceptTaskMutation,
    useDeleteTaskMutation,
} from '../store';
import Request from './Request';

export default function Notification({ socket }) {
    const bellRef = useRef();
    const requestRef = useRef();
    const [expanded, setExpanded] = useState(false);
    const [update, setUpdate] = useState(0);
    const { _id, token } = useSelector(state => state.auth);
    const { friends } = useSelector(state => state.friends);
    let friendsDict;
    if (friends) {
        friendsDict = friends.reduce((acc, { _id, firstName, lastName }) => {
            acc[_id] = `${firstName} ${lastName}`;
            return acc;
        }, {});
    }

    const { data: tasks, isLoading: taskIsLoading, error: taskError } = useFetchTaskQuery({ _id, token, update });
    const { data, isLoading, error } = useFetchFriendRequestQuery({ _id, token, update });
    const [modifyRead] = useModifyReadMutation();
    const [modifyReadTask] = useModifyReadTaskMutation();
    const [acceptFriendRequest, acceptFriendResults] = useAcceptFriendRequestMutation();
    const [deleteFriendRequest, deleteFriendResults] = useDeleteFriendRequestMutation();
    const [acceptTask, acceptTaskResults] = useAcceptTaskMutation();
    const [deleteTask, deleteTaskResults] = useDeleteTaskMutation();
    
    useEffect(() => {
        socket.on("receive_message", () => {
            setUpdate(update+1);
        });
    }, [socket, update]);

    let friendRequests, count = 0;
    let taskRequests, taskCount = 0;

    if (!isLoading && data && !taskIsLoading && tasks) {
        const dataArray = Object.entries(data).map(([key, value]) => ({ key, ...value }));
        dataArray.sort((b, a) => new Date(a.createdAt) - new Date(b.createdAt));
        friendRequests = dataArray.map(friendRequest => {
            return <Request
                key={friendRequest._id}
                subject={`${friendRequest.user.firstName} ${friendRequest.user.lastName}`}
                isRead={friendRequest.read}
                id={_id}
                requesterId={friendRequest.user._id}
                token={token}
                acceptRequest={acceptFriendRequest}
                deleteRequest={deleteFriendRequest}
                acceptResults={acceptFriendResults}
                deleteResults={deleteFriendResults}
            />
        });
        count = data.filter(friendRequest => !friendRequest.read).length;
    } else if (error) {
        friendRequests = error;
    }


    if (!taskIsLoading && tasks && !isLoading && data) {
        const dataArray = Object.entries(tasks).map(([key, value]) => ({ key, ...value }));
        dataArray.sort((b, a) => new Date(a.createdAt) - new Date(b.createdAt));
        taskRequests = dataArray.map(taskRequest => {
            return <Request
                key={taskRequest._id}
                subject={taskRequest.description}
                isRead={taskRequest.read}
                id={taskRequest._id}
                requesterId={taskRequest.createdBy}
                token={token}
                acceptRequest={acceptTask}
                deleteRequest={deleteTask}
                acceptResults={acceptTaskResults}
                deleteResults={deleteTaskResults}
                from={friendsDict[taskRequest.createdBy]}
            />
        });
        taskCount = tasks.filter(taskRequest => !taskRequest.read).length;
    } else if (taskError) {
        taskRequests = taskError;
    }

    useEffect(() => {
        if (!expanded) {
            return;
        }
        const handler = (event) => {
            if (!bellRef.current || !document.contains(bellRef.current)) {
                return;
            }
            if (!bellRef.current.contains(event.target)) {
                if (count) {
                    modifyRead({ _id, token });
                }
                if (taskCount) {
                    modifyReadTask({ _id, token });
                }
                setExpanded(false);
            };
        };

        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, [expanded, _id, token, count, taskCount, modifyRead, modifyReadTask]);

    const handleNotificationClicked = (event) => {
        if (!isLoading && !taskIsLoading) {
            if (requestRef.current) {
                if (requestRef.current.contains(event.target)) {
                    return;
                }
            }
            setExpanded(!expanded);
            if (expanded) {
                if (count) {
                    modifyRead({ _id, token });
                }
                if (taskCount) {
                    modifyReadTask({ _id, token });
                }
            }
        }
    }

    return (
        <div className='w-7 flex items-center justify-center mr-5' ref={bellRef} onClick={handleNotificationClicked} >
            <div className='text-2xl text-stone-700 absolute cursor-pointer hover:text-stone-800'>
                {!isLoading && !taskIsLoading && count === 0 && taskCount === 0 && <IoMdNotificationsOutline />}
                {!isLoading && !taskIsLoading && (count !== 0 || taskCount !== 0) &&
                    <div>
                        <IoMdNotifications />
                        <span className="absolute flex h-3 w-3 top-0 right-0">
                            <span className="rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    </div>
                }
            </div>
            {expanded && (<div ref={requestRef} className='absolute w-80 top-40 mr-80 py-2 bg-white rounded-l-lg rounded-br-lg shadow-lg border'>
                <div className='text-xs text-gray-500 select-none text-center'>Friend Request</div>
                <hr />
                {data?.length ? friendRequests : <div className='px-4 py-2 text-sm text-gray-600'>Nothing to show...</div>}
                <div className='text-xs text-gray-500 select-none text-center'>Task Request</div>
                <hr />
                {tasks?.length ? taskRequests : <div className='px-4 py-2 text-sm text-gray-600'>Nothing to show...</div>}
            </div>)}
        </div>
    )
}
