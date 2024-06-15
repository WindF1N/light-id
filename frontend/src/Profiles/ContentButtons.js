import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'

function ContentButtons() {

  const { username } = useParams()
  const [display, setDisplay] = useState(null)

  useEffect(() => {
    setDisplay(window.location.pathname.split('/')[2]);
  })

  return (
    <>
      <div className="buttons-content">
        <Link to={"/"+username}>
          <div className="button">
            {!display ?
              <img src={require('../Main/images/profile-grid-active.svg').default} alt=""/>
              :
              <img src={require('../Main/images/profile-grid.svg').default} alt=""/>
            }
          </div>
        </Link>
        <Link to={"/"+username+"/vides"}>
          <div className="button">
          {display === 'vides' ?
            <img src={require('../Main/images/profile-vides-active.svg').default} alt=""/>
            :
            <img src={require('../Main/images/profile-vides.svg').default} alt=""/>
          }
          </div>
        </Link>
        <Link to={"/"+username+"/youlights"}>
          <div className="button">
          {display === 'youlights' ?
            <img src={require('../Main/images/profile-youlights-active.svg').default} alt=""/>
            :
            <img src={require('../Main/images/profile-youlights.svg').default} alt=""/>
          }
          </div>
        </Link>
        <Link to={"/"+username+"/albums"}>
          <div className="button">
            {display === 'albums' ?
              <img src={require('../Main/images/profile-albums-active.svg').default} alt=""/>
              :
              <img src={require('../Main/images/profile-albums.svg').default} alt=""/>
            }
          </div>
        </Link>
      </div>
    </>
  );
}
export default ContentButtons;
