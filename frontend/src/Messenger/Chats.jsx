import { React, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Back from '../Main/Back'

import Service from './../Service'
const service = new Service()


function Chats({access, setAccess, refresh, setRefresh, setRequestUser, requestUser, setRefreshRequired}) {

  const navigate = useNavigate();

  const dateNow = new Date();
  const timeString = (dateNow.getDate()<10?'0'+dateNow.getDate():dateNow.getDate())+'.'+(dateNow.getMonth()+1<10?'0'+(dateNow.getMonth()+1):dateNow.getMonth()+1)+'.'+dateNow.getFullYear();

  const [chats, setChats] = useState([])

  const [loading, setLoading] = useState(true)
  const [stop, setStop] = useState(false)
  const [updating, setUpdating] = useState(false)

  const [nextPage, setNextPage] = useState("/api/lobbies/?page=1")
  const [firstPage, setFirstPage] = useState("/api/lobbies/?page=1")

  const [wait, setWait] = useState(2000)
  const [countEmpty, setCountEmpty] = useState(0)

  useEffect(() => {
    if (access){
      if (!stop){
        if (loading) {
          service.getChats(nextPage, {'Authorization': `Bearer ${access}`}).then(function(result){
            if (result.status === 200){
              setRefreshRequired(false);
              setLoading(false);
              if (result.data.nextlink === firstPage){
                setStop(true)
              }
              setChats([...chats, ...result.data.result]);
              setNextPage(result.data.nextlink);
            }else if (result.status === 401){
              setRefreshRequired(true);
            }
          })
        }
      }
    }
  }, [access, stop, loading])

  useEffect(() => {
    if (access){
      if (updating) {
        service.getChats(firstPage, {'Authorization': `Bearer ${access}`}).then(function(result){
          if (result.status === 200){
            setRefreshRequired(false);
            setUpdating(false);
            let new_chats = [...result.data.result, ...chats.slice(1)].reduce((acc, chat) => {
              if (acc.map[chat.id])
                return acc;

              acc.map[chat.id] = true;
              acc.chats.push(chat);
              return acc;
            }, {
              map: {},
              chats: []
            }).chats;
            setChats(new_chats);
          }else if (result.status === 401){
            setRefreshRequired(true);
          }
        })
      }
    }
  }, [access, updating, chats])

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
  }, [stop])

  const scrollHandler = (e) => {
    if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100){
      if (!stop){
        setLoading(true);
      }
    }
  }

  return (
    requestUser ?
      <>
      <div className="messenger">
        <div className="messengerHeader">
          <div className="title">
            Мессенджер
          </div>
          <div className="new">
            <img src={require('../Main/images/create-chat.svg').default} alt="" />
          </div>
        </div>
        <div className="MainSearch">
          <form>
            <img src={require('../Main/images/search-input.svg').default} />
            <input type="text" name="search" placeholder="Поиск"/>
          </form>
        </div>
        <div className="chats">
          {chats?.map(chat =>
            chat.last_message.start === false ?
              <Link to={"/messenger/inbox/"+chat.id} key={chat.id}>
              <div className="chat">
                <div className="avatar">
                {chat.memberone.username !== requestUser?.username ?
                  <img src={chat.memberone.avatar ? chat.memberone.avatar : "http://backend.idlpro.ru/media/avatars/non/non-avatar.svg"} alt={chat.memberone.name} />
                : <img src={chat.membertwo.avatar ? chat.membertwo.avatar : "http://backend.idlpro.ru/media/avatars/non/non-avatar.svg"} alt={chat.membertwo.name} />}
                </div>
                <div className="middle">
                  <div className="chatName">
                    {chat.memberone.username !== requestUser?.username ?
                      chat.memberone.name ? chat.memberone.name : chat.memberone.username
                    : chat.membertwo.name ? chat.membertwo.name : chat.membertwo.username}
                  </div>
                  {chat.last_message ?
                      <div className="lastMessage">
                        <div className="text">
                          {chat.last_message.sender.username === requestUser?.username ? "Вы: " : null}
                          {chat.last_message.text}
                        </div>
                      </div>
                  : null}
                </div>
                <div className="counts">
                  <div className="date">
                  {chat.last_message.date.split(' ')[0] === timeString ? chat.last_message.date.split(' ')[1]
                  : chat.last_message.date.split(' ')[0].split('.')[2] === timeString.split('.')[2] ?
                        chat.last_message.date.split(' ')[0].split('.')[0] + '.' + chat.last_message.date.split(' ')[0].split('.')[1] : chat.last_message.date.split(' ')[0]
                  }</div>
                  {chat.count_unread > 0 ?
                  <div className="countMessages">{chat.count_unread}</div>
                  : null}
                </div>
              </div>
              </Link>
            : null
          )}
        </div>
      </div>
      <Back/>
      </>
    : null
  )
}

export default Chats
