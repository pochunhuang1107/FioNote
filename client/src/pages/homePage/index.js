import React from 'react'
import ItemList from '../../components/ItemList';
import Logout from '../../components/Logout';
import Notification from '../../components/Notification';
import FriendSearch from '../../components/FriendSearch';
import SendTask from '../../components/SendTask';
import { useDispatch, useSelector } from 'react-redux';
import { setSelected } from '../../store/slices/friendsSlice';

export default function HomePage() {
    const { firstName } = useSelector(state => state.auth);
    const name = String(firstName.charAt(0)).toUpperCase() + String(firstName.slice(1,));
    const dispatch = useDispatch();

    let date = new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    const handleClick = () => {
        dispatch(
            setSelected({
                selectedId: null,
                selectedName: null,
            })
        );
    }

    return (
        <div className="flex flex-col pb-10 min-h-screen h-max items-center bg-gradient-to-r from-orange-400 to-pink-400">
            <div className="mt-20 max-w-2xl w-full">
                <h1 className="text-6xl text-stone-700 font-semibold text-center">FioNote</h1>
                <div className='grid grid-cols-3'>
                    <div></div>
                    <div className='cursor-pointer' onClick={handleClick}>
                        <h1 className="text-2xl text-stone-600 font-semibold text-center">{name}</h1>
                    </div>
                    <div className='flex justify-end items-center'>
                        <SendTask />
                        <FriendSearch />
                        <Notification />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center max-w-2xl w-full h-full mx-10 mb-10 mt-3 bg-slate-800 bg-opacity-20 py-10 rounded-lg">
                <h2 className="text-4xl text-white font-light">{date}</h2>
                <div className="my-8 w-full h-full">
                    <ItemList />
                </div>
            </div>
            <Logout />
        </div>
    )
}
