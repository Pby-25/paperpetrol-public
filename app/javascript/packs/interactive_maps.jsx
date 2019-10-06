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
  // const [googlePromise, setGooglePromise] = useState(getGoogleMapsApi());
  const [newPlace, setNewPlace] = useState();
  
  console.log("apping")

  return (
    <div>
      <TestButton />
      <QueryMaps mapsPromise={props.googlePromise} setNewPlace={setNewPlace} lat={37.7} lng={-122.4}/>
      <NewStationForm place={newPlace}/>
      <StationTiles mapsPromise={props.googlePromise}/>
    </div>
    
  )
}




function QueryMaps(props){
  // Create request after confirmation.
  console.log("running")
  const [searchString, setSearchString] = useState("");
  const [myLocation, setMyLocation] = useState({lat: props.lat, lng: props.lng});
  
  const mapRef = useRef();
  var map;
  var bounds;

  props.mapsPromise.then((google) => {
    // console.log(queryMap)
    bounds = new google.maps.LatLngBounds();
    map = new google.maps.Map(mapRef.current, {
      center: myLocation,
      zoom: 10
    });

    // Update my location after user dragging the map
    map.addListener('dragend', () => {
      let newCenter = map.getCenter();
      if (newCenter) {
        let newLat = newCenter.lat();
        let newLng = newCenter.lng();
        if (newLat.toFixed(1) != myLocation.lat.toFixed(1) || newLng.toFixed(1) != myLocation.lng.toFixed(1)){
          console.log("re-render-1")
          setMyLocation({lat: newLat, lng: newLng});
        }
      }

    })

  })


  if (navigator.geolocation) {
    console.log("geolocating")
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log(pos);
      if (pos.lat.toFixed(1) != myLocation.lat.toFixed(1) || pos.lng.toFixed(1) != myLocation.lng.toFixed(1)){
        console.log("re-render-2")
        setMyLocation(pos);
      }
    }, () => {
      console.log("geolocation denied")
    });
  } else {
    console.log("fail to geolocate")
  }



  // When a station is selected on map, send place id to server
  // Also launch extension.
  

  useEffect( () => {
    props.mapsPromise.then((google) => {

      let request = {
        location: myLocation,
        rankBy: google.maps.places.RankBy.DISTANCE,
        keyword: searchString,
        type: "gas_station"
        };
      
        let service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, (results, status) => {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log(results)
            results.forEach(place => {
              let marker = new google.maps.Marker({
                  position: place.geometry.location,
                  map: map,
                  title: place.name
              });
              google.maps.event.addListener(marker, 'click', () => {
                props.setNewPlace(place);
              })
              bounds.extend(place.geometry.location);
            });
            map.fitBounds(bounds);
            }
        });

    })
  }, [searchString, myLocation])

  // add event listener to onidle 
  // useEffect( () => {
  //   console.log("mounting")
  //   mapRef.current.addEventListener("idle", () => {
  //     console.log("yah");
  //   })

  //   return () => {
  //     console.log("unmounting");
  //     mapRef.current.removeEventListener("idle");
  //   }
  // }, [] )

  return(
    <div>
      {searchString}
      <QueryComponent currentQuery={searchString} updateQuery={setSearchString}/>
      <div ref={mapRef} style={{width: 500, height: 400}}></div>
    </div>
  )
}


function QueryComponent(props){
  console.log("redenering QueryComponent")
  // Use search nearby and geolocation to find nearby gas stations
  const [searchString, setSearchString] = useState(props.currentQuery);

  const handleSearchStringChange = (e) => {
    setSearchString(e.target.value);
  }

  const handleNewSearch = (e) => {
    // Use Google search nearby api to find nearby gas station
    console.log("re-render-3")
    props.updateQuery(searchString)
  }

  return(
    <div>
      <input type="text" value={searchString} onChange={handleSearchStringChange}></input>
      <input type="submit" className="btn" value="Search" onClick={handleNewSearch}></input>
    </div>
  )
}

function NewStationForm(props){
  console.log(props.place);
  var place = props.place || {name: "", vicinity: ""};
  const [nickname, setNickname] = useState("ThatGasStation");

  
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  }

  const handleCreateRequest = (e) => {
    // submit request for new request lol!
    if (place.place_id) {
      console.log("creating request")
      console.log(place)
      let newRquestData = {
        request: {
          place_id: place.place_id,
          duration: 15,
          nickname: nickname
        }
      }
      $.ajax({
        type: "POST", 
        url: "/requests",
        data: newRquestData,
        success: (response)=> {console.log(response)},
        beforeSend: (xhr) => {
          xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
        },
      })
    }

    
  }

  return(
    <div>
      {place.name}
      {place.vicinity}
      <input type="text" value={nickname} onChange={handleNicknameChange}></input>
      <input type="submit" className="btn" value="Create" onClick={handleCreateRequest}></input>
    </div>
  )
}

function StationTiles(props){
  // Ajax call to server?
  // Get all place_id through requests and display
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
  let map;
  const showMap = (e) => {
    props.mapsPromise.then((google) => {
      if (!map){
        console.log("requesting");
        var geocoder = new google.maps.Geocoder;
        map = new google.maps.Map(mapRef.current, {
          disableDefaultUI: true,
          center: {lat: 0, lng: 0},
          zoom: 8,
        });
        geocodePlaceId(geocoder, map, props.placeId);
      }
    })
  }

  
  return (
    <div>

        <div ref={mapRef} style={{width: 400, height: 300}} onMouseEnter={showMap} ></div>
    </div>
  )
}

  
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.getElementById('root'),
  )
})