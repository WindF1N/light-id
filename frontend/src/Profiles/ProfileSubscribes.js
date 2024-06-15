import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'

import Back from '../Main/Back'

import Service from './../Service'
const service = new Service()

function ProfileSubscribes({access, setAccess, refresh, setRefresh, setRequestUser, requestUser, setRefreshRequired}) {

  const { username } = useParams();
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState([])
  const [nextPage, setNextPage] = useState("/api/profiles/"+ username +"/subscribes?page=1")
  const [firstPage, setFirstPage] = useState("/api/profiles/"+ username +"/subscribes?page=1")
  const [loading, setLoading] = useState(true)
  const [stop, setStop] = useState(false)
  const [sub, setSub] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (access){
      if (!stop){
        if (loading){
          service.getSubscribes(nextPage, {'Authorization': `Bearer ${access}`}).then(function (result) {
            if (result.status === 200){
              setRefreshRequired(false);
              setLoading(false);
              if (result.data.nextlink === firstPage){
                setStop(true);
              }
              setProfiles([...profiles, ...result.data.result]);
              setNextPage(result.data.nextlink);
            }else if (result.status === 401){
              setRefreshRequired(true);
            }
          });
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
          }else if (result.status === 401){
            setRefreshRequired(true);
          }
        })
      }
    }
  }, [access, sub])

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
    <div className="subsHeader">
      <div className="title">
        Подписки
      </div>
      <div className="share">
      </div>
    </div>
      <div className="profiles-list subs">
        {profiles?.map(c =>
          <div className="profile" key={c.username}>
            <Link to={"/"+c.username}>
            <div className="avatar">
              <img src={c.avatar ? c.avatar : "http://backend.idlpro.ru/media/avatars/non/non-avatar.svg"} alt={c.name} />
            </div>
            <div className="info">
              <div className="username">
                {c.username}
              </div>
              <div className="name">
                {c.name}
              </div>
            </div>
            </Link>
            {requestUser ?
              <div className="buttons">
                {requestUser.username !== c.username ?
                  <>
                  {c.is_sub ?
                    <div className="button" onClick={subscribe} data-subs="true" data-username={c.username}>Отписаться</div>
                  :
                    <div className="button" onClick={subscribe} data-subs="false" data-username={c.username}>Подписаться</div>
                  }
                  </>
                : null }
              </div>
            : null}
          </div>
        )}
      </div>
      <Back />
    </>
  );
}
export default ProfileSubscribes;
