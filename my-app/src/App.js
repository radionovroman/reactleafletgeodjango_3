import React, {useState, useRef, useEffect} from "react";
import logo from './logo.svg';
import './App.css';
import { MapContainer, TileLayer, SVGOverlay,Polygon,Polyline, LayerGroup,LayersControl, useMap, Marker, Popup } from 'react-leaflet' ;
import axios from "axios";
import { GeoJSON } from 'react-leaflet';
import * as L from "leaflet";
import Map_paint from "./DrawingArea";
import Canvas_2 from "./copmponents/MapPaint";
import {useHistory} from "react-router-dom";
import Cookies from 'js-cookie';
import  {points} from "./DrawingArea";




const MyData = (props, event) => {
  // create state variable to hold data when it is fetched





  let [data, setData] = useState();

    // useEffect to fetch data on mount

    useEffect(() => {
      // async function!

      let getData = async () => {
        // 'await' the data
        let response = await axios.get(props.name);
        // save data to state
        setData(response.data);
        console.log(JSON.stringify(response.data));
      };
      getData();




    }, [props.name]);










  // render react-leaflet GeoJSON when the data is ready
  if (data) {
    //return <input type={"text"} value={name} onChange={updateName}/>;

   return <GeoJSON data={data} />


  } else {
    //return <input type={"text"} value={name} onChange={updateName}/>;
    return null;


  }

};








const bounds = [
  [51.49, -10],
  [1, 50],
]

const polygon = [
  [51.515, -0.09],
  [51.52, -0.1],
  [51.52, -0.12],
]


const purpleOptions = { color: 'purple' }






const csrfToken = Cookies.get('csrftoken');

function App(event) {



  const mapRef = useRef(null);
  const [painting, setPainting] = useState(false);
  const [path, setPath] = useState([[0, 0]]);





  let [post, setPost] = useState("");

  const handleSubmit = (e, props) => {
		e.preventDefault();

      axios.post("http://127.0.0.1:8000/api/world/create", {
          "name": post,
          "area": 1,
          "pop2005": 1,
          "fips": "1",
          "iso2": "1",
          "iso3": "1",
          "un": 1,
          "region": 2,
          "subregion": 2,
          "lon": 2,
          "lat": 2,
          "mpoly": {
  "type": "MultiPolygon",
  "coordinates": points
}


        }, {
    headers: {
        'X-CSRFToken': csrfToken
    }}
)
      .then((response) => {
console.log(response);
console.log("New country's coordinates are:",points)
}, (error) => {
console.log(error);
})};





  let [components, setComponents] = useState([])




  let [name, setName] = useState("http://127.0.0.1:8000/api/world/");







  let updateName = (event) => {

    if (event.key === 'Enter' && event.target.value.slice(-4) != "1914" && event.target.value != "German Empire") {
      event.preventDefault();
      setName("http://127.0.0.1:8000/api/world/" + event.target.value)
    }
    ;

    if (event.key === 'Enter' && event.target.value === "German Empire") {
      event.preventDefault();
      setName("http://127.0.0.1:8000/api/german_empire")
    }
    ;

    if (event.key === 'Enter' && event.target.value.slice(-4) === "1914") {
      event.preventDefault();
      setName("http://127.0.0.1:8000/api/world1914/" + event.target.value.slice(0, -4))
    }

    //else {setName("")}
    //return <MyData name={name + "/"}/>
  };

  let updatePost = (event) => {
    if (event.key === 'Enter'){
      event.preventDefault();
      setPost( event.target.value)
    }
  };






  useEffect(() => {
    console.log("value of 'name' changed to", name.slice(0, 42));
    console.log(components)
    console.log("Value of post is:", post)
    console.log("Points:", points)

    });





  let NewData = (event) => {

    if (event.key === "Enter" && event.target.value.slice(-4) != "1914" && event.target.value != "German Empire") {

    }

    return <MyData name={name + "/" + "?format=json"}/>
  }

  if (event.key === "Enter" && event.target.value === "German Empire") {



  return <MyData name={name}/>
}

  if (event.key === "Enter" && event.target.value.slice(-4) === "1914") {
    return <MyData name={name.slice(0, 42) + "/"}/>
  };


  const center = [51.505, -0.09];



  const addComponent = event => { if(components.length === 0) {
    setComponents(components.concat(<Map_paint />));


  }
    else

    {setComponents([]);

    }


  };

  return (

  <div style={{"display" : "grid"}}>
  <button onClick={addComponent}
  >

  Activate Lasers
  </button>

  <div style={{"display": "flex", "flex-direction":"row"}}>
  <form>
  <link rel="stylesheet" href="style.css"/>
    <label  htmlFor="country">Country:</label>
  <input  id="country" type={"text"} placeholder={"type a country here"} onKeyDown={updateName}/>
  </form>
    <button onClick={handleSubmit}>
      {"Submit"}
    </button>
  <form>
  <link rel="stylesheet" href="style.css"/>
    <label  htmlFor="country">Country to post:</label>
  <input  id="country_post" type={"text"} placeholder={"type a country here"} onKeyDown={updatePost}/>
  </form>
  </div>



    <MapContainer ref={mapRef}  center={[51.505, -0.09]} zoom={2} scrollWheelZoom={true} onKeyDown={updateName} onKeyDown={updatePost}>


  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />



      {painting ? (
          <Polyline positions={path} />
        ) : (
          <Polyline positions={[]} />
        )}
      

      {components}








       <NewData/>





      <Polygon pathOptions={purpleOptions} positions={polygon} />






  </MapContainer>


</div>

  );


}

export default App;

