import { useState } from 'react';
import { IoMdSearch } from 'react-icons/io';
import FriendSearchModal from './FriendSearchModal';

export default function FriendSearch() {
    const [showed, setShowed] = useState(false);

    const handleSearchClick = () => {
        setShowed(!showed);
    }

    return (
        <div className='w-7 text-2xl text-stone-700 flex items-center justify-center hover:text-stone-800'>
            <IoMdSearch className='cursor-pointer' onClick={handleSearchClick} />
            {showed && <FriendSearchModal onClose={handleSearchClick} />}
        </div>
    )
}