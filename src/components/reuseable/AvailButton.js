import React from 'react'

const AvailButton = (props) => {
    return (
        <div>
            <button  key={props.key} type={props?.type} style={props.style} onClick={props.onClick} className={`${props.class}`}> {props.icon} <small>{props.data} </small><span>{props.date}</span> </button>
        </div>
    )
}

export default AvailButton