import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoChevronDown } from 'react-icons/go';
import { setSelected } from "../store/slices/friendsSlice";

export default function SendTaskModal({ onClose }) {
    const [isOpen, setIsOpen] = useState(false);
    const { friends } = useSelector(state => state.friends);
    const dispatch = useDispatch();

    useEffect(() => {
        document.body.classList.add('overflow-hidden');
        return () => {
            document.body.classList.remove('overflow-hidden');
        }
    });

    const handleClose = () => {
        onClose(false);
    };

    const handleDropdown = () => {
        setIsOpen(!isOpen);
    }

    const handleOptionClicked = ({id, name}) => {
        onClose(false);
        dispatch(setSelected({
            user: id,
            firstName: name,
        }));
    }

    const renderedOptions = friends.map(friend => {
        return <div key={friend._id} className="hover:bg-sky-100 rounded cursor-pointer p-3" onClick={() => handleOptionClicked({id: friend._id, name: friend.firstName})}>
            {friend.firstName} {friend.lastName}
        </div>
    })

    return ReactDOM.createPortal(
        <div>
            <div
                className="fixed inset-0 bg-gray-600 opacity-20"
                onClick={handleClose}
            />
            <div className="fixed w-64 top-20 left-1/2 transform -translate-x-1/2 mt-14 flex flex-col" onClick={handleDropdown}>
                <div className="border rounded p-3 shadow bg-white w-full flex justify-between items-center select-none cursor-pointer">
                    Select...
                    <GoChevronDown className="text-lg" />
                </div>
                {isOpen && <div className="absolute top-full border rounded shadow bg-white w-full pb-1">
                    {renderedOptions.length === 0 ? 
                        <div className="hover:bg-sky-100 rounded cursor-pointer p-3" onClick={()=>onClose(true)}>No friends</div>
                        :renderedOptions
                    }
                </div>}
            </div>
        </div>,
        document.querySelector(".modal-container")
    );
}
