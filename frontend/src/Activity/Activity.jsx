import { React, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { InView } from 'react-intersection-observer'

import Buttons from '../Main/Buttons'

import Service from './../Service'
const service = new Service()

function Activity({access, setAccess, refresh, setRefresh, setRequestUser, requestUser, setRefreshRequired}) {

  const [loading, setLoading] = useState(true)
  const [stop, setStop] = useState(false)

  const [nextPage, setNextPage] = useState("/api/activity/?page=1")
  const [firstPage, setFirstPage] = useState("/api/activity/?page=1")

  const [activity, setActivity] = useState([])
  const [sub, setSub] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (access){
      if (!stop){
        if (loading) {
          service.getActivity(nextPage, {'Authorization': `Bearer ${access}`}).then(function(result){
            if (result.status === 200){
              setRefreshRequired(false);
              setLoading(false);
              if (result.data.nextlink === firstPage){
                setStop(true)
              }
              setActivity([ ...result.data.result, ...activity]);
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
      if (sub){
        service.subscribe(user, {'Authorization': `Bearer ${access}`}).then(function(result){
          if (result.status === 200){
            setSub(false);
            setRefreshRequired(false);
            document.querySelector('#subs_count').innerHTML = result.data.count;
          }else if (result.status === 401){
            setRefreshRequired(true);
          }
        })
      }
    }
  }, [access, sub])

  const subscribe = (e) => {
    if (!sub){
      if (e.target.dataset.subs === "false"){
        e.target.innerHTML = 'Отписаться';
        e.target.dataset.subs = "true";
      }else if (e.target.dataset.subs === "true"){
        e.target.innerHTML = 'Подписаться';
        e.target.dataset.subs = "false";
      };
      setSub(true);
      setUser(e.target.dataset.username);
    }
  }


  return (
    <>
      <div className="activity">
        <div className="activityHeader">
          Активность
        </div>
        <div className="section">
          <div className="activityList">
            {activity?.map((item, idx) =>
              item.from_user.username !== requestUser.username ?
                <div className="item" key={idx}>
                  <Link to={"/"+item.from_user.username}>
                    <div className="avatar">
                      <img src={item.from_user.avatar ? item.from_user.avatar : "http://backend.idlpro.ru/media/avatars/non/non-avatar.svg"} alt={item.from_user.name} />
                    </div>
                  </Link>
                  <div className="middle">
                    <Link to={"/"+item.from_user.username}>
                    <div className="username">
                      {item.from_user.username}
                    </div>
                    </Link>
                    <div className="text">
                      {item.text} <span>{item.date}</span>
                    </div>
                  </div>
                  {item.type === 'sub' ?
                    <div className="button" onClick={subscribe} data-subs={item.from_user.is_sub ? "true" : "false"} data-username={item.from_user.username}>
                      {item.from_user.is_sub ? "Отписаться" : "Подписаться"}
                    </div>
                  :
                    item.post?.items.length > 0 ?
                      <Link to={"/"+item.to_user.username+'/posts#post'+item.post.id} className="image">
                        <img src={item.post.items[0].file} alt="" />
                      </Link>
                    : null
                  }
                </div>
              : null
            )}
          </div>
        </div>
      </div>
      <Buttons access={access} setAccess={setAccess} refresh={refresh} setRefresh={setRefresh} requestUser={requestUser} setRequestUser={setRequestUser} setRefreshRequired={setRefreshRequired}/>
    </>
  )
}

export default Activity
