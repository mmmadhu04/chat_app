const socket = io()

const msgForm = document.querySelector('#message-form')
const btnSendLoc = document.querySelector('#send-location')
const msgFormInput = msgForm.querySelector('input')
const msgFormBtn = msgForm.querySelector('button')
const msgs = document.querySelector('#messages')

const msgTemplate = document.querySelector('#message-template').innerHTML
const locMsgTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
    const newMsg = msgs.lastElementChild
    const newMsgStyle = getComputedStyle(newMsg)
    const newMsgMargin = parseInt(newMsgStyle.marginBottom)
    const newMsgHt = newMsg.offsetHeight + newMsgMargin

    const visibleHeight = msgs.offsetHeight

    const contentHeight = msgs.scrollHeight

    const scrollOffset = msgs.scrollTop + visibleHeight

    if(contentHeight - newMsgHt <= scrollOffset) {
        msgs.scrollTop = msgs.scrollHeight
    }

}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(msgTemplate, {
        username: message.username,
        message: message.msg,
        createdAt: moment(message.createdAt).format('h:mm A')
    })
    msgs.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (url) => {
    console.log(url)
    const html = Mustache.render(locMsgTemplate, {
        username: url.username,
        url: url.url,
        createdAt: moment(url.createdAt).format('h:mm A')
    })
    msgs.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

msgForm.addEventListener('submit', (e) => {
    e.preventDefault()

    msgFormBtn.setAttribute('disabled', 'disabled')

    const msg = e.target.elements.message.value

    socket.emit('sendMessage', msg, () => {
        msgFormBtn.removeAttribute('disabled')
        msgFormInput.value = ''
        msgFormInput.focus()
        console.log("Message was delivered !")
    })
})

btnSendLoc.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported !')
    }
    btnSendLoc.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            btnSendLoc.removeAttribute('disabled')
            console.log("Location shared !")
        })
    })
})

socket.emit('join', {username, room}, (e) => {
    if(e) {
        alert(e)
        location.href = '/'
    }
})