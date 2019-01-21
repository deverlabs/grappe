import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../components/Header'
import '../styles/App.css'

class HomeScreen extends Component {
  render() {
    return (
        <div className="App-body">
          <Header/>
          <div style={{'width': '60vw'}}>
            Welcome
          </div>
        </div>
    )
  }
}

export default HomeScreen
