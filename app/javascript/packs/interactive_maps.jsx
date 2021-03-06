import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

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
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&libraries=places&callback=initMap`;
  script.async = true;
  document.body.appendChild(script);
  return googlePromise
}


function App(){
  var googlePromise = getGoogleMapsApi();
  return (
    <div>
      <AppWithGoogle googlePromise={googlePromise}/>
    </div>
  )
}

function AppWithGoogle(props){
  const mapRef = useRef();

  var queryMapPromise = new Promise( (resolve) => {
    var map;
    props.googlePromise.then((google) => {
      map = new google.maps.Map(mapRef.current, {
        center: {lat:37.7, lng:-122.4},
        zoom: 10
      });
  
      resolve(map);
    })
  })


  return (
    <div>
      <div ref={mapRef} style={{width: 600, height: 400}}></div>
      <br />
      <QueryMaps mapsPromise={props.googlePromise} queryMapPromise={queryMapPromise} lat={37.7} lng={-122.4}/>
      <br />
      <br />
      <br />
      <StationTiles mapsPromise={props.googlePromise}/>
    </div>
    
  )
}



function QueryMaps(props){
  // Create request after confirmation.
  const [searchString, setSearchString] = useState("");
  const [myLocation, setMyLocation] = useState({lat: props.lat, lng: props.lng});
  const [station, setStation] = useState();
  
  var bounds;


  useEffect( ()=>{
    // Update my location after user dragging the map
    props.queryMapPromise.then( (map)=>{

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log(pos);
          if (pos.lat.toFixed(1) != myLocation.lat.toFixed(1) || pos.lng.toFixed(1) != myLocation.lng.toFixed(1)){
            setMyLocation(pos);
          }
        }, () => {
        });
      } else {
      }

      map.addListener('dragend', () => {
        let newCenter = map.getCenter();
        if (newCenter) {
          let newLat = newCenter.lat();
          let newLng = newCenter.lng();
          if (newLat.toFixed(1) != myLocation.lat.toFixed(1) || newLng.toFixed(1) != myLocation.lng.toFixed(1)){
            setMyLocation({lat: newLat, lng: newLng});
          }
        }
      })

    });
  }, [])

  
  // When a station is selected on map, send place id to server
  // Also launch extension.
  

  useEffect( ()=>{
    props.queryMapPromise.then((map) => {
      props.mapsPromise.then((google) => {
        bounds = new google.maps.LatLngBounds();

        let request = {
          location: myLocation,
          rankBy: google.maps.places.RankBy.DISTANCE,
          keyword: searchString,
          type: "gas_station"
          };
        
          let service = new google.maps.places.PlacesService(map);
          service.nearbySearch(request, (results, status) => {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              results.forEach(place => {
                let marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map: map,
                    title: place.name
                });
                google.maps.event.addListener(marker, 'click', () => {
                  setStation(place);
                })
                bounds.extend(place.geometry.location);
              });
              map.fitBounds(bounds);
              }
          });

      })
    })
  }, [searchString, myLocation])

  return(
    <div>
      <QueryComponent currentQuery={searchString} updateQuery={setSearchString}/>
      <br />
      <NewStationForm place={station}/>
    </div>
  )
}


function QueryComponent(props){
  // Use search nearby and geolocation to find nearby gas stations
  const [searchString, setSearchString] = useState(props.currentQuery);

  const handleSearchStringChange = (e) => {
    setSearchString(e.target.value);
  }

  const handleNewSearch = (e) => {
    // Use Google search nearby api to find nearby gas station
    props.updateQuery(searchString)
  }

  return(
    <div>
      <input type="text" value={searchString} onChange={handleSearchStringChange}></input>
      <input type="submit" className="btn" value="Search" onClick={handleNewSearch}></input>
    </div>
  )
}

function fetchStationBatch(){
  return new Promise((resolve)=>{
    $.ajax({
      type: "GET", 
      url: "/fetch_stations",
      success: (response)=> {     
        resolve(response);
      },
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
      },
    });
  })
}

function sendToExtension(message){
  return new Promise((resolve)=>{
    const extensionId = "mbdpjbcmfccpbdmpaohnecngkbmjmbei";
    const extensionLink = "https://chrome.google.com/webstore/detail/paperpetrol/" + extensionId;
    chrome.runtime.sendMessage(extensionId, message, (response) => {
        if (!chrome || !(chrome.runtime) || chrome.runtime.lastError){
          window.open(extensionLink, '_blank');
        } else {
          resolve(response);
        }  
      });
  })
}

function updateGasPrice(dataArray){
  for (const data of dataArray){
    $.ajax({
      type: "POST", 
      url: "/add_record",
      data: {station: data},
      success: (response)=> {console.log(response)},
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
      },
    })
  } 
}

function createStationRequest(place_id, nickname){
  return new Promise((resolve)=>{
    let newRquestData = {
      request: {
        place_id: place_id,
        duration: 15,
        nickname: nickname
      }
    }
    $.ajax({
      type: "POST", 
      url: "/requests",
      data: newRquestData,
      success: (response)=> {resolve(response)},
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
      },
    })
  })
}



function NewStationForm(props){
  var place = props.place || {name: "", vicinity: ""};
  const [nickname, setNickname] = useState("Nickname for my gas station");
  
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  }

  const handleCreateRequest = (e) => {
    let place_id = place.place_id;
    if (place_id) {
      let fetchStationPromise = fetchStationBatch();
      fetchStationPromise.then((stations)=>{
        stations.push({place_id: place_id, link: null});
        let extensionResponse = sendToExtension(stations);
        extensionResponse.then((extensionResponse)=>{
          console.log(extensionResponse)
          if (extensionResponse.length > 0){
            let createRequestPromise = createStationRequest(place_id, nickname);
            createRequestPromise.then(()=>{
              updateGasPrice(extensionResponse);
            })
          } else {
            console.log("failed fetch necessary data")
          }
        })
      });
    } else {
      console.log("no place id selected")
    }

    
  }

  return(
    <div>
      {place.name}
      {place.vicinity}
      <input type="text" value={nickname} onChange={handleNicknameChange}></input>
      The extension must be installed to create a request. You will be redirected to the extension page if it cannot be detected.
      <input type="submit" className="btn" value="Create" onClick={handleCreateRequest}></input>
    </div>
  )
}

function StationTiles(props){
  // Ajax call to server?
  // Get all place_id through requests and display
  const [trackingStations, setTrackingStations] = useState({});

  useEffect( ()=>{
    $.ajax({
      type: "GET", 
      url: "/requests",
      success: (response)=> {
        setTrackingStations(response);        
      },
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
      },
    })
  
  }, [])


  return(
    <div>
      {Object.entries(trackingStations).map(([nickname, place_id]) =>
          <StationMaps key={place_id}
          mapsPromise = {props.mapsPromise}
          nickname = {nickname}
          placeId = {place_id}/>
        )
      }
    </div>
  )
}

function geocodePlaceId(geocoder, map, placeId, nickname) {
  geocoder.geocode({'placeId': placeId}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        map.setZoom(11);
        map.setCenter(results[0].geometry.location);
        new google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
          title: nickname
        });
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
  let map;
  const showMap = (e) => {
    props.mapsPromise.then((google) => {
      if (!map){
        var geocoder = new google.maps.Geocoder;
        map = new google.maps.Map(mapRef.current, {
          disableDefaultUI: true,
          center: {lat: 0, lng: 0},
          zoom: 5,
        });
        geocodePlaceId(geocoder, map, props.placeId, props.nickname);
      }
    })
  }

  const toggleGraph = (e)=>{
    // let mapContainer = $(e.target).find(".map-tiles-container")[0];
    // let graphBox = $(".paper", mapContainer);
    let mapContainer = e.currentTarget;
    let graphBox = $(mapContainer).find(".paper");
    console.log(mapContainer)
    console.log(graphBox)
    console.log($(mapContainer).find(".map-node"))
    if (graphBox && !graphBox.textContent) {
      const data = {station: {place_id: props.placeId}};
      console.log(data)
      $.ajax({
        type: "GET", 
        url: "/stations",
        data: data,
        success: (response)=> {
          console.log(response);
          graphBox.text(JSON.stringify(response));
          console.log($(".map-node", mapContainer))
          $(".map-node", mapContainer).toggle();
        },
        beforeSend: (xhr) => {
          xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
        },
      });
    }
  }

  
  return (
    <div onClick={toggleGraph}>
      <div  className="map-tiles-container">
        Hover over your mouse to see registered gas station; click to see recorded data.
        <div className="paper map-node" ></div>
        <div className="map-node" ref={mapRef} style={{width: 600, height: 400}} onMouseEnter={showMap} >{props.nickname}</div>
      </div>
    </div>
  )
}

  
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.getElementById('root'),
  )
})
