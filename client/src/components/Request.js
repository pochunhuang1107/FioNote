import classNames from 'classnames';
import { socket } from '../socket';

export default function Request({ subject, isRead, id, requesterId, token, acceptRequest, deleteRequest, acceptResults, deleteResults, from }) {
    const itemClasses = classNames("flex justify-between items-center text-sm select-none px-4 py-2 text-gray-800 hover:bg-gray-100",
        isRead ? "" : "font-semibold bg-sky-100"
    )
    const buttonClasses = classNames("w-16 p-1 rounded-md");
    const greenButtonClasses = classNames(buttonClasses, "bg-sky-500 hover:bg-sky-600 text-white");
    const redButtonClasses = classNames(buttonClasses, "bg-gray-200 hover:bg-gray-300 text-gray-600");

    const sendMessage = () => {
        socket.emit("send_message", {
            id: requesterId
        });
    };

    const handleAccept = async () => {
        await acceptRequest({ id, requesterId, token });
        sendMessage();
    }

    const handleDelete = async () => {
        await deleteRequest({ id, requesterId, token });
        sendMessage();
    }

    return (
        <div className={itemClasses}>
            {subject}{from ? <div className='text-gray-400'> from {from}</div> : ""}
            {acceptRequest && deleteRequest &&
                <div className='flex items-center text-xs space-x-1'>
                    <button className={greenButtonClasses} onClick={handleAccept} disabled={acceptResults.isLoading || deleteResults.isLoading}>
                        Confirm
                    </button>
                    <button className={redButtonClasses} onClick={handleDelete} disabled={acceptResults.isLoading || deleteResults.isLoading}>
                        Delete
                    </button>
                </div>
            }
        </div>
    )
}
