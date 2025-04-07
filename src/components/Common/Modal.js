import { useRef } from "react";

import { useClickOutside } from "hooks/clickOutside";
import ButtonMotion from "components/Common/ButtonMotion";


const Modal = ({children, onConfirm, onCancel}) => {
    const modalRef = useRef();

    useClickOutside(modalRef, () => {
        console.log('click outside');
        onCancel();
    });

    return (
        <div>
            <div
                className="absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-60 opacity-100 transform translate-z-0 w-full h-full cancel-modal">
            </div>
            <div
                className="absolute top-0 right-0 left-0 bottom-0 flex justify-center items-center cancel-modal">

                <div ref={modalRef} className="bg-white rounded-lg w-[300px] h-[150px] flex flex-col">
                    <div className='flex flex-1 px-4 py-4 justify-center items-center'>

                        { children }

                    </div>
                    <footer className='w-full flex justify-end items-end pb-2 px-2'>
                        <ButtonMotion text='Yes' onClick={onConfirm} width={70} height={40} marginX={[0, 6]}/>
                        <ButtonMotion text='No' onClick={onCancel} width={70} height={40}/>
                    </footer>
                </div>
            </div>
        </div>
    )
}

export default Modal;