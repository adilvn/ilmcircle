import React from 'react'

const InputField = (props) => {
    return (
        <>
            <input
                className={props.className}
                placeholder={props.placeholder}
                // required
                onInput={props?.onInput}
                type={props?.type}
                disabled={!props?.PerminentDisablled ? props?.isOpenEditing == undefined ? false : !props.isOpenEditing : true}
                onChange={props?.onChange}
                onBlur={props?.onBlur}
                name={props?.name}
                value={props?.value}
                min={props?.min}
                max={props?.max} />
        </>
    )
}

export default InputField
