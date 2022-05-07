import { useEffect, useState } from 'react'
import { socket } from './Socket'
import '../../styles/Chat.css'

function Chat() {

  const [currentMessage, setCurrentMessage] = useState('')
  const [target, setTarget] = useState('')
  const [messageList, setMessageList] = useState([])

  const sendMessage = () => {
    if (currentMessage !== '') {
      const messageData = {
        target: target,
        author: socket.id,
        message: currentMessage,
      }
      socket.emit('send_pm', messageData)
      setMessageList((list) => [...list, messageData])
      setCurrentMessage('')
    }
  }

  useEffect(() => {
    socket.emit('request_target')
  }, [])

  useEffect(() => {
    socket.on('receive_pm', (data) => {
      setTarget(data.author)
      setMessageList((list) => [...list, data])
    })
    socket.on('receive_target', (data) => {
      //console.log('target received:',data)
      setTarget(data)
    })
    return () => {
      socket.off('receive_pm')
      socket.off('receive_target')
    }
  })

  return (
    <div className='chat'>
      <div className="chat-header"><p>Chat</p></div>
      <div className="chat-body">
        {messageList.map((messageContent) => {
          return (
            <div className='message' id={socket.id === messageContent.author ? 'you' : 'other'}>
              <div>
                <div className='message-content'>
                  <p>{messageContent.message}</p>
                </div>
                <div className='message-meta'>
                  <p>{messageContent.author}</p>
                </div>
              </div>
            </div>)
        })}
      </div>
      <div className="chat-footer">
        <input
          type='text'
          value={currentMessage}
          placeholder='hey...'
          onChange={(event) => {
            setCurrentMessage(event.target.value)
          }}
          onKeyPress={(event) => { event.key === 'Enter' && sendMessage() }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>)
}

export default Chat
