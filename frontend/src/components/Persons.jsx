const Persons = ({persons, deletePersonHandler}) => {
    return (
        <div>
            <ul>
                {persons.map(person =>
                    <div key={person.name}>
                        <li >{person.name} {person.number}</li>
                        <button onClick={() => deletePersonHandler(person.id)}>Delete</button>
                    </div>       
                )}
            </ul>
        </div>
    )
}

export default Persons