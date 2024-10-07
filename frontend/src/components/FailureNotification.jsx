const FailureNotification = ({ message }) => {        
    if (message === 0) {
        return null
    }
    return (
        <div className="failure">
            {message}
        </div>
    )
}

export default FailureNotification