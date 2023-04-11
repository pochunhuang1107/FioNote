import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import { useSendFriendRequestMutation } from "../store";
import { AiOutlineLoading } from 'react-icons/ai';

export default function FriendSearchModal({ onClose, socket }) {
    const [sendFriendRequest, results] = useSendFriendRequestMutation();
    const [placeholder, setPlaceholder] = useState('Enter username or email...');
    const [searchTerm, setSearchTerm] = useState('');
    const { _id, token } = useSelector(state => state.auth);

    useEffect(() => {
        document.body.classList.add('overflow-hidden');
        return () => {
            document.body.classList.remove('overflow-hidden');
        }
    });

    const sendMessage = (selectedId) => {
        socket.emit("send_message", {
            id: selectedId
        });
    };

    const handleClose = () => {
        onClose(false);
    };

    const handleSearchTerm = (event) => {
        const input = event.target.value.trim();
        setSearchTerm(input);
    };

    const handleSubmit = async (event) => {
        if ((event.key === 'Enter' || event.target.name === 'submit') && searchTerm !== '') {
            const response = await sendFriendRequest({ _id, searchTerm, token });
            const data = await response.data;

            if (data) {
                alert(data.data);
                setSearchTerm("");
                setPlaceholder("Enter username or email...");
                sendMessage(data.selectedId);
            } else {
                setSearchTerm("");
                setPlaceholder(response.error.data);
            }
        }
    };

    return ReactDOM.createPortal(
        <div>
            <div
                className="fixed inset-0 bg-gray-600 opacity-60"
                onClick={handleClose}
            />
            <div className="fixed w-80 top-60 left-1/2 transform -translate-x-1/2 mt-14 flex flex-col space-y-3">
                <input
                    className="h-10 text-stone-600 border border-white rounded-lg px-5 w-full select-none"
                    placeholder={placeholder}
                    autoFocus={true}
                    onChange={handleSearchTerm}
                    onFocus={() => setPlaceholder("Enter username or email...")}
                    onKeyDown={handleSubmit}
                    value={searchTerm}
                    disabled={results.isLoading}
                />
                <button className="h-10 flex items-center justify-center rounded-lg select-none text-white bg-sky-500 hover:bg-sky-600" name="submit" onClick={handleSubmit} disabled={results.isLoading}>
                    {results.isLoading ? <AiOutlineLoading className='animate-spin text-2xl' /> : "Add"}
                </button>
            </div>
        </div>,
        document.querySelector(".modal-container")
    );
}
