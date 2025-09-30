export default function Button(props){
    return(
        <>
        <button className={props.style}  onClick={props.onClickFunction}>
            {props.title}
        </button>
        </>
    )
}