import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'
import Packery from 'packery'

function Posts({posts, search, loading}) {

  useEffect(() => {
    if (posts.length > 0) {
      var elem = document.querySelector('.grid');
      var pckry = new Packery( elem, {
        // options
        itemSelector: '.grid-item',
        gutter: 5
      });
    }
  })

  return (
    <>
      {posts.length > 0 ?
        <div className="grid">
          {posts?.map(c =>
            <>
            {c.items[0] ?
              <Link to={"/"+c.user.username+"/posts#post"+c.id} key={c.id}>
              <div className="grid-item" key={c.id}>
                <img src={c.items[0].file} alt=""/>
                {c.items.length > 1 ?
                  <div className="icon">
                    <img src={require('../Main/images/profile-albums-active.svg').default} alt=""/>
                  </div>
                : null}
              </div>
              </Link>
            : null}
            </>
          )}
        </div>
      : <div className="empty">{loading ? `Загрузка...` : `По запросу "${search}" ничего не найдено`}</div>}
    </>
  );
}
export default Posts;
