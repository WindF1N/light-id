import React, { Component } from 'react';
import LazyLoad from "react-lazyload";
// import { Link } from 'react-router-dom'

class YouLIGHT extends Component {
  render() {
    return (
      <>
        <div className="title">
          <div className="icon">
            <img src={require('./images/YouLIGHT.svg').default} alt="" />
          </div>
          <div className="text">
            Видео
          </div>
        </div>
        <div className="youlights">
          <div className="video">
            <LazyLoad once className="poster">
              <img src={require('./images/youlights-dev.svg').default} alt="" />
            </LazyLoad>
            <div className="inf">
              <LazyLoad once className="avatar">
                <img src="http://backend.idlpro.ru/media/avatars/non/non-avatar.svg" alt="" />
              </LazyLoad>
              <div className="information">
                <div className="top">
                  YouLIGHT - ЗАМЕНА YouTube ;)
                </div>
                <div className="bottom">
                  <span>LIGHTid</span>
                  <span>0 просмотров</span>
                </div>
              </div>
            </div>
          </div>
          <div className="video">
            <LazyLoad once className="poster">
              <img src={require('./images/youlights-dev.svg').default} alt="" />
            </LazyLoad>
            <div className="inf">
              <LazyLoad once className="avatar">
                <img src="http://backend.idlpro.ru/media/avatars/non/non-avatar.svg" alt="" />
              </LazyLoad>
              <div className="information">
                <div className="top">
                  YouLIGHT - ЗАМЕНА YouTube ;)
                </div>
                <div className="bottom">
                  <span>LIGHTid</span>
                  <span>0 просмотров</span>
                </div>
              </div>
            </div>
          </div>
          <div className="video">
            <LazyLoad once className="poster">
              <img src={require('./images/youlights-dev.svg').default} alt="" />
            </LazyLoad>
            <div className="inf">
              <LazyLoad once className="avatar">
                <img src="http://backend.idlpro.ru/media/avatars/non/non-avatar.svg" alt="" />
              </LazyLoad>
              <div className="information">
                <div className="top">
                  YouLIGHT - ЗАМЕНА YouTube ;)
                </div>
                <div className="bottom">
                  <span>LIGHTid</span>
                  <span>0 просмотров</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default YouLIGHT;
