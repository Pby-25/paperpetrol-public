import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { resolveObject } from 'url';


function initMap() {
  
  var map = new window.google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
}

function getGooleMapsApi(){
  // Load the Google Maps API
  var googlePromise = new Promise((resolve) => {
    window.initMap = () => {
      resolve(google);
      delete window.initMap;
    }
  })

  const script = document.createElement("script");
  const API = 'AIzaSyBrKFxU3QaKNXCwPx9hQ-xWSUMj_4pzfZE';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=initMap`;
  script.async = true;
  document.body.appendChild(script);
  
  return googlePromise
}

function GoogleMaps(){
  // const [googlePromise, setGooglePromise] = useState(getGooleMapsApi());
  var googlePromise = getGooleMapsApi();


  return (
    <div>
      <QueryMaps apiPromise={googlePromise} lat={-34} lng={150}/>
      <StationMaps apiPromise={googlePromise} lat={-34} lng={150}/>
      <StationMaps apiPromise={googlePromise} lat={-34} lng={150}/>
    </div>
    
  )
}

function QueryMaps(props){
  const [searchString, setSearchString] = useState("Type your next query");
  const mapRef = useRef();

  useEffect( () => {
    props.apiPromise.then((google) => {
      new google.maps.Map(mapRef.current, {
        center: {lat: props.lat, lng: props.lng},
        zoom: 8
      });
    })
  }, [searchString])



  return(
    <div>
      {searchString}
      <QueryComponent currentQuery={searchString} updateQuery={setSearchString}/>
      <div ref={mapRef} style={{width: 400, height: 300}}></div>
    </div>
  )
}

function QueryComponent(props){
  const [searchString, setSearchString] = useState(props.currentQuery);

  const handleChange = (e) => {
    setSearchString(e.target.value);
  }

  const handleSubmit = (e) => {
    props.updateQuery(searchString)
  }

  return(
    <div>
      <input type="text" value={searchString} onChange={handleChange}></input>
      <input type="submit" className="btn" value="Search" onClick={handleSubmit}></input>
    </div>
  )
}

function StationMaps(props){
  const mapRef = useRef();

  props.apiPromise.then((google) => {
    new google.maps.Map(mapRef.current, {
      center: {lat: props.lat, lng: props.lng},
      zoom: 8
    });
  })
  return (
    <div>
        <div ref={mapRef} style={{width: 400, height: 300}}></div>
    </div>
  )
}

  
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <GoogleMaps />,
    document.getElementById('root'),
  )
})