import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

function TestButton(){
  const mydata = {
    // "as":"Dsa"
    thing: {
     placeId: "qew",
     field2: 123,
     gogogo: {
       a:"sad",
       e3: 22
     }
    }}

  const handleSubmit = () => {
    $.ajax({
      type: "POST", 
      // contentType: "application/json; charset=utf-8",
      url: "/requests",
      data: mydata,
      success: (response)=> {console.log(response)},
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
      },
    })
  }

  // const handleSubmit = () => {
  //     $.ajax({
  //       type: "GET", 
  //       url: "/requests",
  //       data: mydata,
  //       success: (response)=> {console.log(response)},
  //       beforeSend: (xhr) => {
  //         xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
  //       },
  //     })
  //   }

  return (
    <input type="submit" className="btn" value="TEST!!!!" onClick={handleSubmit}></input>
  )
}

function getGoogleMapsApi(){
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

function App(){
  // const [googlePromise, setGooglePromise] = useState(getGoogleMapsApi());
  var googlePromise = getGoogleMapsApi();

  return (
    <div>
      <TestButton />
      <QueryMaps mapsPromise={googlePromise} lat={-34} lng={150}/>
      <StationTiles mapsPromise={googlePromise}/>
    </div>
    
  )
}

function QueryMaps(props){
  const [searchString, setSearchString] = useState("Type your next query");
  const [myLocation, setMyLocation] = useState({
    lat: props.lat, 
    lng: props.lng
  })
  const mapRef = useRef();
  var map;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      setMyLocation(pos);
    });
  }

  useEffect( () => {
    props.mapsPromise.then((google) => {
      if (!map){
        map = new google.maps.Map(mapRef.current, {
          center: {lat: myLocation.lat, lng: myLocation.lng},
          zoom: 8
        });
      } else {
        map.setCenter(myLocation);
      }
    })
  }, [searchString, myLocation])


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

function StationTiles(props){
  // Ajax call to server?
  var stationResponses = ["ChIJd8BlQ2BZwokRAFUEcm_qrcA", "ChIJXUppRReuEmsRKy0s_W-x8Bc"];
  return(
    <div>
      {stationResponses.map((stationResponse) =>
        <StationMaps key={stationResponse}
        mapsPromise = {props.mapsPromise}
        placeId = {stationResponse}/>
      )}
    </div>
  )
}

function geocodePlaceId(geocoder, map, placeId) {
  geocoder.geocode({'placeId': placeId}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        map.setZoom(11);
        map.setCenter(results[0].geometry.location);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}

function StationMaps(props){
  const mapRef = useRef();

  props.mapsPromise.then((google) => {
    var geocoder = new google.maps.Geocoder;
    var map = new google.maps.Map(mapRef.current, {
      disableDefaultUI: true,
      center: {lat: 0, lng: 0},
      zoom: 8
    });
    geocodePlaceId(geocoder, map, props.placeId)
  })
  return (
    <div>
        <div ref={mapRef} style={{width: 400, height: 300}}></div>
    </div>
  )
}

  
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.getElementById('root'),
  )
})