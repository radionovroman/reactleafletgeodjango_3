import React, { Component } from "react";
import { Canvas } from "leaflet/dist/leaflet-src.esm";


const bounds = [
  [51.49, -10],
  [1, 50],
]

class MyMap extends Component {
    state = {};
    render() {
        return(
           <div>
               <Canvas style={{left: 100, top: 150  }}></Canvas>
           </div>
        );
    }


}

export default MyMap;