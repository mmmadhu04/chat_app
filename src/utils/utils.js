const users = []

const addUser = ({id, username, room}) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room) {
        return {
            error: 'Please enter username and room id !'
        }
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if(existingUser) {
        return {
            error: 'Username already in use !'
        }
    }

    const user = {id, username, room}
    users.push(user)
    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    // const index = users.findIndex((user) => user.id === id)

    // if(index !== -1) {
    //     return users[index]
    // }

    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

// addUser({
//     id: 1,
//     username: 'A',
//     room: '1'
// })

// addUser({
//     id: 2,
//     username: 'B',
//     room: '1'
// })

// addUser({
//     id: 3,
//     username: 'A',
//     room: '2'
// })

// console.log(users)
// const userDet = getUser(0)
// console.log(userDet)
// const remUser = removeUser(1)
// console.log(remUser)
// console.log(users)