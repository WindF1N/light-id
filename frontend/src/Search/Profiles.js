import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'
import Packery from 'packery'

import Service from './../Service'
const service = new Service()

function Profiles({profiles, search, loading, requestUser}) {

  const [access, setAccess] = useState(localStorage.getItem('accessToken'))
  const [refresh, setRefresh] = useState(localStorage.getItem('refreshToken'))
  const [refreshRequired, setRefreshRequired] = useState(false)
  const [sub, setSub] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (refreshRequired) {
      service.refreshTokens(refresh).then(function(result){
        if (result.status === 200){
          setAccess(result.data.access);
          localStorage.setItem('accessToken', result.data.access);
        }else if (result.status === 401 | result.status === 400){
          localStorage.removeItem('accessToken');
          setAccess(null);
          localStorage.removeItem('refreshToken');
          setRefresh(null);
        }
      });
    }
  }, [refreshRequired])

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
      {profiles.length > 0 ?
        <div className="profiles-list">
          {profiles?.map(c =>
            <div className="profile">
              <Link to={"/"+c.username} key={c.username}>
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
                <div className="name">
                  {c.subscribers_count} подписчиков
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
      : <div className="empty">{loading ? `Загрузка...` : `По запросу "${search}" пользователей не найдено`}</div>}
    </>
  );
}
export default Profiles;
