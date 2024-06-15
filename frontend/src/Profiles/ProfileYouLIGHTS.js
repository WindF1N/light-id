import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Packery from 'packery'

class ProfileYouLIGHTS extends Component {

  componentDidMount() {
    var elem = document.querySelector('.grid');
    var pckry = new Packery( elem, {
      // options
      itemSelector: '.grid-item',
      gutter: 5
    });
  }

  render() {
    return (
      <>
        <div className="grid">
          <div className="grid-item grid-item--width2">
            <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            <div className="icon">
              <img src={require('../Main/images/profile-youlights-active.svg').default} alt=""/>
            </div>
          </div>
          <div className="grid-item grid-item--height2">
            <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            <div className="icon">
              <img src={require('../Main/images/profile-youlights-active.svg').default} alt=""/>
            </div>
          </div>
          <div className="grid-item grid-item--height2">
            <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            <div className="icon">
              <img src={require('../Main/images/profile-youlights-active.svg').default} alt=""/>
            </div>
          </div>
          <div className="grid-item">
            <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            <div className="icon">
              <img src={require('../Main/images/profile-youlights-active.svg').default} alt=""/>
            </div>
          </div>
          <div className="grid-item grid-item--height2 ">
            <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            <div className="icon">
              <img src={require('../Main/images/profile-youlights-active.svg').default} alt=""/>
            </div>
          </div>
          <div className="grid-item grid-item--width2">
            <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            <div className="icon">
              <img src={require('../Main/images/profile-youlights-active.svg').default} alt=""/>
            </div>
          </div>
          <div className="grid-item">
            <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            <div className="icon">
              <img src={require('../Main/images/profile-youlights-active.svg').default} alt=""/>
            </div>
          </div>
          <div className="grid-item">
            <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            <div className="icon">
              <img src={require('../Main/images/profile-youlights-active.svg').default} alt=""/>
            </div>
          </div>
          <div className="grid-item">
            <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            <div className="icon">
              <img src={require('../Main/images/profile-youlights-active.svg').default} alt=""/>
            </div>
          </div>
          <div className="grid-item">
            <img src={require('../Main/images/youlights-dev.svg').default} alt=""/>
            <div className="icon">
              <img src={require('../Main/images/profile-youlights-active.svg').default} alt=""/>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default ProfileYouLIGHTS;
