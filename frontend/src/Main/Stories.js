import React, { Component } from 'react';
import LazyLoad from "react-lazyload";
// import { Link } from 'react-router-dom'

class Stories extends Component {
  render() {
    return (
      <div className="stories">
        <div className="storie">
          <LazyLoad once className="avatar new">
            <img src="http://backend.idlpro.ru/media/avatars/non/non-avatar.svg" alt="dog" />
          </LazyLoad>
          <div className="username">
            в разработке
          </div>
        </div>
        <div className="storie">
          <LazyLoad once className="avatar">
            <img src="http://backend.idlpro.ru/media/avatars/non/non-avatar.svg" alt="dog" />
          </LazyLoad>
          <div className="username">
            в разработке
          </div>
        </div>
        <div className="storie">
          <LazyLoad once className="avatar">
            <img src="http://backend.idlpro.ru/media/avatars/non/non-avatar.svg" alt="dog" />
          </LazyLoad>
          <div className="username">
            в разработке
          </div>
        </div>
        <div className="storie">
          <LazyLoad once className="avatar">
            <img src="http://backend.idlpro.ru/media/avatars/non/non-avatar.svg" alt="dog" />
          </LazyLoad>
          <div className="username">
            в разработке
          </div>
        </div>
        <div className="storie">
          <LazyLoad once className="avatar">
            <img src="http://backend.idlpro.ru/media/avatars/non/non-avatar.svg" alt="dog" />
          </LazyLoad>
          <div className="username">
            в разработке
          </div>
        </div>
        <div className="storie">
          <LazyLoad once className="avatar">
            <img src="http://backend.idlpro.ru/media/avatars/non/non-avatar.svg" alt="dog" />
          </LazyLoad>
          <div className="username">
            в разработке
          </div>
        </div>
        <div className="storie">
          <LazyLoad once className="avatar">
            <img src="http://backend.idlpro.ru/media/avatars/non/non-avatar.svg" alt="dog" />
          </LazyLoad>
          <div className="username">
            в разработке
          </div>
        </div>
      </div>
    );
  }
}
export default Stories;
