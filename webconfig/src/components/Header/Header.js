import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Header.css';

class Header extends Component {
  render() {
    return (
        <div className="header">
            <Link to="/" className="header-title"><h1>Grape</h1></Link>

            <div className="header-nav">
                <Link to="/">Home</Link>
            </div>
        </div>
    );
  }
}

export default Header;
