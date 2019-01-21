import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Header.css';

class Header extends Component {
  render() {
    return (
        <div className="header">
            <Link to="/" className="header-title"><h1>RentCar</h1></Link>

            <div className="header-nav">
                <Link to="/">Home</Link>
                <Link to="/rent">Rent a car</Link>
                <Link to="/return">Return a car</Link>
                <Link to="/manage">Manage cars</Link>
            </div>
        </div>
    );
  }
}

export default Header;
