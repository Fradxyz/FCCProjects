import './Profile.sass';
import React from 'react';
import $ from 'jquery';

class Profile extends React.Component {
  componentDidMount() {
    $('a.nav-link.active').removeClass('active');
  }
  render() {
    return (
      <div className="Profile">
        <div className="user-container">
          <div className="user-avatar-container">
            <img src="https://avatars.githubusercontent.com/u/83095832?v=4" alt="user-avatar" id="userAvatar" />
          </div>
          <div className="user-info-container">
            <div className="info-main-container">
              <h4 id="userName">Ry2uko</h4>
              <p id="userDescription">Just a dev for fun.</p>
            </div>
            <div className="location-container">
              <span className="location-icon"><i className="fa-solid fa-location-dot"></i></span>
              <span id="userLocation">Philippines</span>
            </div>
            <button type="button" id="userBooksBtn"><i className="fa-solid fa-book"></i>Ry2uko's Books</button>
          </div>
        </div>
        <div className="recent-trade-container">

        </div>
      </div>
    );
  }
}

export default function WithRouter(props) {
  return (
    <Profile type={props.type} />
  );
}
