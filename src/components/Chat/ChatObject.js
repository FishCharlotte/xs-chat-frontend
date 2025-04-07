import { useSelector } from "react-redux";
import { selectInfo } from "store/reducers/dialogSlice";

const ChatObject = () => {
    const dialog = useSelector(selectInfo);

    return (
        <div className='h-[50px] bg-[#C1B9AC]'>
            <p className='leading-[50px] text-center text-xl truncate px-[30px]'>
                { dialog.name }
            </p>
        </div>
    )
}

export default ChatObject;