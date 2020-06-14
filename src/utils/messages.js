const genMsg = (username, msg) => {
    return {
        username,
        msg,
        createdAt: new Date().getTime()
    }
}

const genLocMsg = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    genMsg,
    genLocMsg
}