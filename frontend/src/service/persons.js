import axios from 'axios'

const baseUrl = '/api/persons'

const getAllPersons = () => {
    const request = axios.get(baseUrl).then(response => response.data)
    return request
}

const addPerson = (personObject) => {
    const request = axios.post(baseUrl, personObject).then(response => response.data)
    return request
}

const deletePerson = (id) => {   
    const request = axios.delete(`${baseUrl}/${id}`).then(response => response.data)
    return request
}

const updateNumber = (personObject) => {
    const request = axios.put(`${baseUrl}/${personObject.id}`, personObject).then(response => response.data)
    return request
}

export default { getAllPersons, addPerson, deletePerson, updateNumber }