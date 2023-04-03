import React from 'react'
import ItemList from '../../components/ItemList';
import Logout from '../../components/Logout';
import { useSelector } from 'react-redux';

export default function HomePage() {
    const { firstName } = useSelector(state => state.auth);

    let date = new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    return (
        <div className="flex flex-col pb-10 min-h-screen h-max items-center bg-gradient-to-r from-orange-400 to-pink-400">
            <div className="mt-20">
                <h1 className="text-6xl text-stone-700 font-semibold">FioNote</h1>
                <h1 className="text-2xl text-stone-600 font-semibold text-center">{firstName}</h1>
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
