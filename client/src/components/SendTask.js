import { useEffect, useState } from 'react';
import { RiTaskLine } from 'react-icons/ri';
import SendTaskModal from './SendTaskModal';
import { useFetchFriendsListQuery } from '../store';
import { setFriends } from '../store/slices/friendsSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function SendTask() {
    const dispatch = useDispatch();
    const [showed, setShowed] = useState(false);
    const { _id, token } = useSelector(state => state.auth);

    const { data, isLoading, error } = useFetchFriendsListQuery({ _id, token });

    useEffect(() => {
        if (!isLoading && data) {
            const users = data.map(user => user.user);
            dispatch(setFriends({
                friends: users
            }));
        }
    }, [data, isLoading, dispatch])

    const handleSearchClick = () => {
        setShowed(!showed);
    }

    return (
        <div className='w-7 text-2xl text-stone-700 flex items-center justify-center hover:text-stone-800'>
            {!isLoading && !error && <RiTaskLine className='cursor-pointer' onClick={handleSearchClick} />}
            {showed && !isLoading && <SendTaskModal onClose={handleSearchClick} />}
        </div>
    )
}