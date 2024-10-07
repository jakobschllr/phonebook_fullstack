const SuccessNotification = ({ message }) => {        
    if (message === 0) {
        return null
    }
    return (
        <div className="success">
            {message}
        </div>
    )
}

export default SuccessNotification