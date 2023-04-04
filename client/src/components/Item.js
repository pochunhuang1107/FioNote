import React from 'react'
import { FiDelete } from 'react-icons/fi';
import { MdCheckBoxOutlineBlank, MdOutlineCheckBox } from "react-icons/md";
import { AiOutlineLoading } from 'react-icons/ai';
import classNames from 'classnames';
import { useCompleteItemMutation, useRemoveItemMutation } from '../store/apis/itemApi';

export default function Item({ description, isCompleted, dateCreated, date, id, token }) {
    const today = new Date(date).getTime();
    const createdDate = new Date(dateCreated).getTime();

    const completionStatusClasses = classNames("text-xl ml-2 text-start",
        today === createdDate ? 'text-stone-800' : 'text-red-700',
        isCompleted && 'line-through',
    );
    const checkBoxStatus = (isCompleted ? <MdOutlineCheckBox className='text-xl cursor-pointer' /> : <MdCheckBoxOutlineBlank className='text-xl cursor-pointer' />);

    const [completeItem] = useCompleteItemMutation();
    const [removeItem, results] = useRemoveItemMutation();

    const handleComplete = () => {
        completeItem({ id, token, date });
    }

    const handleRemove = () => {
        removeItem({ id, token })
    }

    return (
        <div className='flex flex-row justify-between items-center'>
            <div className='flex flex-row items-center'>
                <div onClick={handleComplete}>{checkBoxStatus}</div>
                <p className={completionStatusClasses}>{description}</p>
            </div>
            <div className='min-w-14'>
                {results.isLoading ?
                    <AiOutlineLoading className='animate-spin' /> :
                    <FiDelete className='text-xl cursor-pointer' onClick={handleRemove} />
                }
            </div>
        </div>
    )
}
