import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Packery from 'packery'

class ProfileVides extends Component {

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
          <div className="grid-item grid-item--height2">
            <img src={require('../Main/images/vide-dev.svg').default} alt=""/>
            <div className="icon">
              <img src={require('../Main/images/profile-vides-active.svg').default} alt=""/>
            </div>
          </div>
          <div className="grid-item grid-item--height2">
            <img src={require('../Main/images/vide-dev.svg').default} alt=""/>
            <div className="icon">
              <img src={require('../Main/images/profile-vides-active.svg').default} alt=""/>
            </div>
          </div>
          <div className="grid-item grid-item--height2">
            <img src={require('../Main/images/vide-dev.svg').default} alt=""/>
            <div className="icon">
              <img src={require('../Main/images/profile-vides-active.svg').default} alt=""/>
            </div>
          </div>
          <div className="grid-item grid-item--height2">
            <img src={require('../Main/images/vide-dev.svg').default} alt=""/>
            <div className="icon">
              <img src={require('../Main/images/profile-vides-active.svg').default} alt=""/>
            </div>
          </div>
          <div className="grid-item grid-item--height2">
            <img src={require('../Main/images/vide-dev.svg').default} alt=""/>
            <div className="icon">
              <img src={require('../Main/images/profile-vides-active.svg').default} alt=""/>
            </div>
          </div>
          <div className="grid-item grid-item--height2">
            <img src={require('../Main/images/vide-dev.svg').default} alt=""/>
            <div className="icon">
              <img src={require('../Main/images/profile-vides-active.svg').default} alt=""/>
            </div>
          </div>
          <div className="grid-item grid-item--height2">
            <img src={require('../Main/images/vide-dev.svg').default} alt=""/>
            <div className="icon">
              <img src={require('../Main/images/profile-vides-active.svg').default} alt=""/>
            </div>
          </div>
          <div className="grid-item grid-item--height2">
            <img src={require('../Main/images/vide-dev.svg').default} alt=""/>
            <div className="icon">
              <img src={require('../Main/images/profile-vides-active.svg').default} alt=""/>
            </div>
          </div>
          <div className="grid-item grid-item--height2">
            <img src={require('../Main/images/vide-dev.svg').default} alt=""/>
            <div className="icon">
              <img src={require('../Main/images/profile-vides-active.svg').default} alt=""/>
            </div>
          </div>
          <div className="grid-item grid-item--height2">
            <img src={require('../Main/images/vide-dev.svg').default} alt=""/>
            <div className="icon">
              <img src={require('../Main/images/profile-vides-active.svg').default} alt=""/>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default ProfileVides;
