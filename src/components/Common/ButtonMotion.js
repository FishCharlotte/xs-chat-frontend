import './ButtonMotion.css'


const ButtonMotion = ({ width = 100, height = 50, marginX = [4, 4], paddingX=[2, 2], paddingY=[1, 1], onClick, text }) => {
    return (
        <div
            className={`btn border-border border-[3px]`}
            style={{
                width: `${Number(width)}px`,
                height: `${Number(height)}px`,
                marginLeft: `${marginX[0]}px`,
                marginRight: `${marginX[1]}px`,
                paddingTop: `${paddingY[0]}px`,
                paddingBottom: `${paddingY[1]}px`,
                paddingLeft: `${paddingX[0]}px`,
                paddingRight: `${paddingX[1]}px`,
            }}
        >
            <button // className='w-full h-full'
                    style={{
                        width: '100%',  // Fill the full div
                        height: '100%'  // Fill the full div
                    }}
                    onClick={onClick}
            >
                {text}
            </button>
        </div>
    )
}

export default ButtonMotion;