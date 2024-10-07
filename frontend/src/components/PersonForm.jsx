const PersonForm = ({onFormSubmit, onNameChange, onNumberChange, currentName, currentNumber}) => {
    return (
        <div>
            <form onSubmit={onFormSubmit}>
            <div>
            name: <input value={currentName} onChange={onNameChange}/>
            number: <input value={currentNumber} onChange={onNumberChange}/>
            </div>
            <div>
            <button type='submit'>Add</button>
            </div>
        </form>
        </div>
    )
}

export default PersonForm