import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import Packery from 'packery'


function ProfileGrid({posts}) {

  useEffect(() => {
    var elem = document.querySelector('.grid');
    var pckry = new Packery( elem, {
      // options
      itemSelector: '.grid-item',
      gutter: 5
    });
  })

  return (
    <>
      <div className="grid">
        {posts?.map(c =>
          <>
          {c.items[0] ?
            <Link to={"posts#post"+c.id}>
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
    </>
  );
}
export default ProfileGrid;
