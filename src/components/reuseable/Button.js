import React from 'react'

const Button = (props) => {
  return (
    <>
      <button style={props.style} type={props?.type}
        onClick={props.onClick} className={`${props.className}`}
        disabled={props.disabled}
      >{props.icon} {props.data} </button>
    </>
  )
}

export default Button

