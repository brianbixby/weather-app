import React from 'react';
import {connect} from 'react-redux'

import WeatherForm from './../weather-form';
import WeatherToday from './../weather-today';
import WeatherForecast from './../weather-forecast';
import {weatherFetchRequest, weatherFetch} from '../../actions/weather-actions.js';
import * as util from './../../lib/util.js';

class LandingContainer extends React.Component {
  constructor(props){
    super(props);
  }

  componentWillMount() {
    console.log('If you have any questions about my code please email me @BrianBixby0@gmail.com and visit www.BuiltByBixby.com to see my latest projects.');
    if (localStorage.timestamp && localStorage.timestamp > new Date().getTime()) {
      this.props.weatherFetchRequest(JSON.parse(localStorage.weatherAppToken));
    }
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.getAddress(position.coords.latitude, position.coords.longitude);
        },
        err => {
          this.ipLookUp();
        }
      );
    } else {
      this.ipLookUp();
    }
  }

  ipLookUp = () => {
    fetch('http://ip-api.com/json')
      .then(res => res.json())
      .then(
        (result) => {
            let searchString = `${result.city}, ${result.region}, ${result.country}`;
            if (!localStorage.timestamp || localStorage.timestamp > new Date().getTime() || searchString.indexOf(localStorage.weatherAppCity) < 0)
              this.handleSearch(searchString);
          },
          (error) => {
              console.log('Request failed.  Returned status of', error);
          }
      );
  };

  getAddress = (lat, lon) => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.GOOGLE_MAP_KEY}`)
      .then(res => res.json())
      .then(
        (result) => {
          let searchString = result.plus_code.compound_code.substr(result.plus_code.compound_code.indexOf(" ") + 1);
          if (!localStorage.timestamp || localStorage.timestamp > new Date().getTime() || searchString.indexOf(localStorage.weatherAppCity) < 0)
            this.handleSearch(searchString);
        },
        (error) => {
          console.log('Request failed.  Returned status of', error);
        }
      );
  };
  
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
    weatherFetchRequest: data => dispatch(weatherFetch(data)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);