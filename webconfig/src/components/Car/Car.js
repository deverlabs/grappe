import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as carReducer from '../../reducers/carReducer';

import './Car.css';

class Car extends Component {
    constructor(props) {
        super(props);

        this.state = props.car;
    }

    rentCar = () => {
        this.props.carReducer.rentCar(this.state.plate);
        this.setState({...this.props.car, inUse: true});
    }

    returnCar = () => {
        this.props.carReducer.returnCar(this.state.plate);
        this.setState({...this.props.car, inUse: false});
    }

    deleteCar = () => {
        this.props.carReducer.deleteCar(this.state.plate);
    }

    render() {
        return (
            <div className={"carCard " + (this.state.inUse ? "carCard-not-available" : "carCard-available")}>
                <p className="carCard-title">{this.state.brand} {this.state.model}</p>
                <img alt={"image for " + this.state.model} className="imageCar" src={this.state.img}/>

                <p className="carCard-details">
                    <b>Catégorie :</b> {this.state.category}<br />
                    <b>Plaque :</b> {this.state.plate}
                </p>

                <p className="carCard-action">
                    {!this.state.inUse && <button onClick={this.rentCar}>Louer</button>}
                    {this.state.inUse && <button onClick={this.returnCar}>Rendre</button>}
                    {this.props.allowDelete && <button onClick={this.deleteCar}>Supprimer</button>}
                </p>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        carReducer: bindActionCreators(carReducer, dispatch)
    }
}

export default connect(null, mapDispatchToProps)(Car);
