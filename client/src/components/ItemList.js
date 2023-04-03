// import Item from './Item'
import { useFetchItemsQuery, useCreateItemMutation } from '../store/apis/itemApi';
import { useSelector } from 'react-redux';
import Item from './Item';
import Skeleton from './Skeleton';
import classNames from 'classnames';
import { useState } from 'react';

export default function ItemList() {
    const inputClasses = classNames("h-10 border border-white rounded-l-lg rounded-r-none px-5 w-56 focus:w-4/6 duration-500 text-center focus:outline-0 focus:outline-none");
    const buttonClasses = classNames("h-10 border-2 border-white rounded-r-lg px-5 text-stone-800 text-white hover:bg-gray-400 active:bg-gray-500");
    const { _id, token } = useSelector(state => state.auth);
    const date = new Date().toISOString().split('T')[0];
    const [inputItem, setInputItem] = useState('');
    const [placeholder, setPlaceholder] = useState('Task for today...');

    const { data, isLoading, error } = useFetchItemsQuery({ _id, date, token });
    const [createItem, results] = useCreateItemMutation();

    let content;
    if (isLoading) {
        content = <Skeleton className="h-8 w-full" times={3} />;
    } else if (error) {
        content = "error loading content";
    } else {
        content = (data.map(item => {
            return <Item key={item._id} description={item.description} isCompleted={item.isCompleted} id={item._id} token={token} />
        }));
    }

    const handleKeyDown = (event) => {
        const keyEvent = event.key;
        if (keyEvent === 'Enter') {
            if (inputItem.length < 1 || inputItem.trim().length < 1) {
                setInputItem('');
                setPlaceholder("Input must not be empty");
                return;
            }
            createItem({ _id, inputItem, token });
            setInputItem('');
            setPlaceholder("Task for today...");
        }
    }

    const handleButtonClick = () => {
        if (inputItem.length < 1 || inputItem.trim().length < 1) {
            setPlaceholder("Input must not be empty");
            return;
        }
        createItem({ _id, inputItem, token });
        setInputItem('');
        setPlaceholder("Task for today...");
    }

    const onInputChange = (e) => {
        setInputItem(e.target.value);
        setPlaceholder("Task for today...");
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="inline-flex w-full justify-center">
                <input type="text" className={inputClasses} placeholder={placeholder} onKeyDown={handleKeyDown} value={inputItem} onChange={onInputChange} disabled={results.isLoading} />
                <button className={buttonClasses} onClick={handleButtonClick}>Add</button>
            </div>
            <div className="space-y-3 mt-5 w-full px-10">
                {content}
            </div>
        </div>
    )
}
