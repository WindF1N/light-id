import { React, useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { InView } from 'react-intersection-observer'

import Service from './../Service'
const service = new Service()

function Chat({access, setAccess, refresh, setRefresh, setRequestUser, requestUser, setRefreshRequired}) {

  const navigate = useNavigate();

  const { id } = useParams();

  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [stop, setStop] = useState(false)

  const [user, setUser] = useState()
  const [messages, setMessages] = useState([])

  const [nextPage, setNextPage] = useState("/api/lobbies/"+ id +"?page=1")
  const [firstPage, setFirstPage] = useState("/api/lobbies/"+ id +"?page=1")

  const [message, setMessage] = useState(null)
  const [readMessageId, setReadMessageId] = useState(null)

  const [wait, setWait] = useState(2000)
  const [countEmpty, setCountEmpty] = useState(0)

  useEffect(() => {
    if (access){
      if (!stop){
        if (loading) {
          service.getMessages(nextPage, {'Authorization': `Bearer ${access}`}).then(function(result){
            if (result.status === 200){
              var scroll = document.body.scrollHeight;
              var top = document.documentElement.scrollTop;
              setRefreshRequired(false);
              setLoading(false);
              if (result.data.nextlink === firstPage){
                setStop(true)
              }
              setMessages([ ...result.data.result.reverse(), ...messages]);
              setNextPage(result.data.nextlink);
              setUser(result.data.user)

              if (firstPage === nextPage){
                window.scrollTo(0, document.body.scrollHeight);
              }else{
                window.scrollTo(0, document.body.scrollHeight - scroll + top);
              }
            }else if (result.status === 401){
              setRefreshRequired(true);
            }
          })
        }
      }
    }
  }, [access, stop, loading])

  useEffect(() => {
    if (access) {
      if (message) {
        if (!updating){
          service.addMessage(id, message, {'Authorization': `Bearer ${access}`}).then(function(result){
            if (result.status === 200){
              setMessages([...messages, result.data.result]);
              setMessage(null);
              setRefreshRequired(false);
              setCountEmpty(0);
              setWait(2000);
              window.scrollTo(0, document.body.scrollHeight);
            }else if (result.status === 401){
              setRefreshRequired(true);
            }
          })
        }
      }
    }
  }, [access, message])

  useEffect(() => {
    if (access){
      if (readMessageId){
        service.readMessage(readMessageId, {'Authorization': `Bearer ${access}`}).then(function(result){
          if (result.status === 200){
            document.querySelector('.message[data-id="'+ readMessageId +'"]').dataset.checked = "true";
            setRefreshRequired(false);
          }else if (result.status === 401){
            setRefreshRequired(true);
          }
        })
      }
    }
  }, [access, readMessageId])

  useEffect(() => {
    if (access){
      if (updating){
        if (messages.length > 0){
          service.updateMessages(id, {'Authorization': `Bearer ${access}`}).then(function(result){
            if (result.status === 200){
              setUpdating(false)

              let new_messages = [...messages, ...result.data.result.reverse()].reduce((acc, msg) => {
                if (acc.map[msg.id])
                  return acc;

                acc.map[msg.id] = true;
                acc.msgs.push(msg);
                return acc;
              }, {
                map: {},
                msgs: []
              }).msgs;

              setMessages(new_messages);

              if (result.data.result.length > 0){
                setCountEmpty(0);
                setWait(2000);
                if (document.documentElement.scrollHeight - (document.documentElement.scrollTop + window.innerHeight) < 100){
                  window.scrollTo(0, document.body.scrollHeight);
                }
              }else{
                if (countEmpty < 20){
                  setCountEmpty(countEmpty + 1);
                  setWait(wait + 1000)
                }else{
                  setWait(20000);
                }
              }
              setRefreshRequired(false);
            }else if (result.status === 401){
              setRefreshRequired(true);
            }
          })
        }
      }
    }
  }, [access, updating, messages])

  useEffect(() => {
    if (!updating){
      setTimeout(function(){
        setUpdating(true)
      }, wait)
    }
  }, [updating])

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler);
    return function () {
      document.removeEventListener('scroll', scrollHandler);
    }
  }, [stop, loading, messages])

  const scrollHandler = (e) => {
    if (e.target.documentElement.scrollTop < 100){
      if (!stop){
        if (!loading){
          setLoading(true);
        }
      }
    }
  }

  const changeText = (e) => {
    var textarea = e.target;
    textarea.addEventListener('keyup', function(){
      if(this.scrollTop > 0){
        this.style.height = this.scrollHeight + "px";
      };
      if(!this.value) {
        this.style.height = "20px";
        document.querySelector('#send').classList.remove('active_send');
      }else{
        document.querySelector('#send').classList.add('active_send');
      }
    });
  }

  const addMessage = (e) => {
    setMessage(document.querySelector('textarea[name="add-message"]').value);
    document.querySelector('textarea[name="add-message"]').value = null;
  }

  const readMessage = (entry, inView) => {
    if (inView === true){
      if (entry.target.lastChild.dataset.checked === "false"){
        if (requestUser.username !== entry.target.lastChild.dataset.username){
          setReadMessageId(entry.target.lastChild.dataset.id)
        }
      }
    }
  }

  return (
    requestUser ?
    <div className="messenger">
      <div className="messengerHeader chat">
        <div className="back" onClick={() => navigate(-1)}>
          <img src={require('../Main/images/back.svg').default} alt="" />
        </div>
        {user ?
          <Link to={"/"+user.username}>
          <div className="user">
            <div className="avatar">
              <img src={user.avatar ? user.avatar : "http://backend.idlpro.ru/media/avatars/non/non-avatar.svg"} alt={user.name} />
            </div>
            <div className="userInfo">
              <div className="username">
                { user.username }
              </div>
              <div className="name">
                { user.name }
              </div>
            </div>
          </div>
          </Link>
        : null}
        <div className="actions">
          <img src={require('../Main/images/phone.svg').default} alt="" />
          <img src={require('../Main/images/videocall.svg').default} alt="" />
        </div>
      </div>
      <div className="messages">
        {messages?.map((message, idx) =>
          message.start ? null :
            message.sender.username !== requestUser.username ?
              <>
                {message.date_messages ?
                  <div className="date_messages"><span>{message.date_messages}</span></div>
                : null}
                <InView onChange={(inView, entry) => readMessage(entry, inView)} key={idx}>
                  <div className="message l" data-id={message.id} data-checked={message.read ? "true" : "false"} data-username={message.sender.username}>
                    <span>{message.text}</span>
                    <div className="date">
                      {message.date.split(' ')[1]}
                    </div>
                  </div>
                </InView>
              </>
            :
              <>
                {message.date_messages ?
                  <div className="date_messages"><span>{message.date_messages}</span></div>
                : null}
                <InView onChange={(inView, entry) => readMessage(entry, inView)} key={idx}>
                  <div className="message r" data-id={message.id} data-checked={message.read ? "true" : "false"} data-username={message.sender.username}>
                    <span>{message.text}</span>
                    <div className="date">
                      {message.date.split(' ')[1]}
                    </div>
                  </div>
                </InView>
              </>
        )}
      </div>
      <div className="add-message">
        <div className="attach">
          <img src={require('../Main/images/attach.svg').default} alt="" />
        </div>
        <div className="input">
          <textarea name="add-message" placeholder="Сообщение..." onChange={changeText}></textarea>
        </div>
        <div className="send" id="send" onClick={addMessage}>
          <img src={require('../Main/images/send.svg').default} alt="" />
        </div>
      </div>
    </div>
    : null
  )
}

export default Chat
