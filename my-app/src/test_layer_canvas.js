import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import CanvasLayer from "react-leaflet-canvas-layer";
import "leaflet/dist/leaflet.css";


function layer() {
  const drawMethod = (info) => {
    const ctx = info.canvas.getContext("2d");
    ctx.clearRect(0, 0, info.canvas.width, info.canvas.height);
    ctx.fillStyle = "rgba(255,116,0, 0.2)";
    var point = info.map.latLngToContainerPoint([-37, 175]);
    ctx.beginPath();
    ctx.arc(point.x, point.y, 200, 0, Math.PI * 2.0, true, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  return (
    <div className="App">
      <MapContainer center={[-37, 175]} zoom={13} style={{"border-style" : "dotted", "width" : "300px", "height" : "300px"}}>
        <CanvasLayer drawMethod={this.drawMethod} />
        <TileLayer url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png" />

      </MapContainer>
    </div>
  );
}
