import React from 'react';
import {connect} from 'react-redux'

import WeatherForm from './../weather-form';
import WeatherToday from './../weather-today';
import WeatherForecast from './../weather-forecast';
import {weatherFetchRequest} from '../../actions/weather-actions.js';
import * as util from './../../lib/util.js';

class LandingContainer extends React.Component {
  constructor(props){
    super(props);
  }

  handleSearch = city => {
    return this.props.weatherFetch(city)
      .catch(err => console.log(err));
  };


  render() {
    let {weather} = this.props;
    let cloud1 = require('../../assets/cloud1.png');
    let cloud2 = require('../../assets/cloud2.png');
    let cloud1Style = {
      background: `url(${cloud1}) no-repeat`,
    }; 
    let cloud2Style = {
      background: `url(${cloud2}) no-repeat`,
    };
    return (
      <main>
        <div className='cloud1' style={cloud1Style}></div>
        <div className='cloud2' style={cloud2Style}></div>
        <div className='weatherContainer'>
          <div className='topSection'>
            <WeatherForm onComplete={this.handleSearch}/>
            {util.renderIf(this.props.weather.length > 0,
              <div className='weatherTodayWrapper'>
                <WeatherToday weather={weather[0]}/>
              </div>
            )}
          </div>
          {util.renderIf(this.props.weather.length > 0,
            <div className='bottomSection'>
              <WeatherForecast weather={weather}/>
            </div>
          )}
        </div>
      </main>
    );
  }
}

let mapStateToProps = state => ({ weather: state.weather });

let mapDispatchToProps = dispatch => {
  return {
    weatherFetch: city => dispatch(weatherFetchRequest(city)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);