import React from 'react'

const Toast = ({message}) => {
    const {data,color} = message
    console.log(color)
  return (
    <div>
        <div className="toast toast-top toast-center">
          <div className={`alert bg-${color}-700`}>
            <span>{data}</span>
          </div>
        </div>
    </div>
  )
}

export default Toast