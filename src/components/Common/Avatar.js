
const Avatar = (props) => {
    const src = props.src ? props.src : '/avatar/default_avatar.jpg';
    return (
        <img src={src}
             alt={props.alt || ''}
             title={props.title || ''}
             className={props.className || ''} />
    )
}

export default Avatar;