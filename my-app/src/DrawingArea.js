import {useLeafletContext} from "@react-leaflet/core";
import * as L from "leaflet";
import {useState, useEffect} from "react";
import { createStore } from 'redux';










const initialState = {
  points: [],
  points_2: [],
};

function pointsReducer(state = initialState, action) {
  switch (action.type) {
    case "UPDATE_POINTS":
      return { ...state, points: action.payload };

  case "UPDATE_POINTS_2":
  return { ...state, points_2: action.payload };

   case 'CONCAT_POINTS_2':
      const updatedPoints_2 = [...action.payload];
      updatedPoints_2.push(updatedPoints_2[0]); // add the first element to the end
      return { ...state, points_2: updatedPoints_2 };

      case 'CLEAR_POINTS':
      return {
        ...state,
        points: []
      };


    default:
      return state;
  }
}

export const store = createStore(pointsReducer);



L.CustomLayer = L.Layer.extend({



    // -- initialized is called on prototype
    initialize: function (options) {
        this._map = null;
        this._canvas = null;
        this._frame = null;
        this._delegate = null;
        this._geojson = null; // add a _geojson property
        L.setOptions(this, options);
    },

    delegate: function (del) {
        this._delegate = del;
        return this;
    },

    needRedraw: function () {
        if (!this._frame) {
            this._frame = L.Util.requestAnimFrame(this.drawLayer, this);
        }
        return this;
    },

    //-------------------------------------------------------------
    _onLayerDidResize: function (resizeEvent) {
        this._canvas.width = resizeEvent.newSize.x;
        this._canvas.height = resizeEvent.newSize.y;
    },

    //-------------------------------------------------------------
    _onLayerDidMove: function () {
    if (!this._canvasAdded) {
        return;
    }

    var topLeft = this._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this._canvas, topLeft);
    this.drawLayer();
},

    //-------------------------------------------------------------
    getEvents: function () {
        var events = {
            resize: this._onLayerDidResize,
            moveend: this._onLayerDidMove,
            move: this._onLayerDidMove
        };
        if (this._map.options.zoomAnimation && L.Browser.any3d) {
            events.zoomanim = this._animateZoom;
        }

        return events;
    },
    //-------------------------------------------------------------
    onAdd: function (map) {


        this._map = map;
        this._canvas = L.DomUtil.create('canvas', 'leaflet-layer');
        this.tiles = {};

        var size = this._map.getSize();
        this._canvas.width = size.x;
        this._canvas.height = size.y;

        var animated = this._map.options.zoomAnimation && L.Browser.any3d;
        L.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));

        let pane = this.options.pane ? map.getPanes()[this.options.pane] : map._panes.overlayPane;
        pane.appendChild(this._canvas);

        map.on(this.getEvents(), this);

        this._canvasAdded = true;

        var del = this._delegate || this;
        del.onLayerDidMount && del.onLayerDidMount(); // -- callback



        const ctx = this._canvas.getContext("2d");
        const rect = this._canvas.getBoundingClientRect()







        let painting = false;

        function startPosition() {
            painting = true


        };

        function finishedPosition () {
            painting = false;
            ctx.beginPath();

        };


        function draw (e) {
            if(!painting) return;
            ctx.lineWidth = 1;
            ctx.lineCap = "round";
            const latlng = map.layerPointToLatLng([e.clientX - rect.left, e.clientY - rect.top]);
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
            map.scrollWheelZoom.disable()
            map.dragging.disable()
            map.touchZoom.disable()
            map.doubleClickZoom.disable()
            map.boxZoom.disable()
            map.keyboard.disable()
            // Dispatch the action to update the points array
  store.dispatch({
    type: "UPDATE_POINTS",
    payload: [...store.getState().points, [latlng.lng, latlng.lat]],
  });

  store.dispatch({
  type: "UPDATE_POINTS_2",
  payload: [...store.getState().points_2, [latlng.lng, latlng.lat]],
});
        };








        this._canvas.addEventListener('mousedown', startPosition);
        this._canvas.addEventListener('mouseup', finishedPosition);
        this._canvas.addEventListener('mousemove', draw);
        this._canvas.style.position = "absolute";
        this._canvas.style.cursor = "crosshair"
        this._canvas.addEventListener('mouseup', function(e) {
            const latlng = map.layerPointToLatLng([e.clientX - rect.left, e.clientY - rect.top]);

    store.dispatch({
  type: "CONCAT_POINTS_2",
  payload: [...store.getState().points_2, [latlng.lng, latlng.lat]],
});


            // Create a GeoJSON layer and add it to the map
    const geojson = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": store.getState().points,

            }
        }]
    };


    L.geoJSON(geojson).addTo(map);

    // Set the _geojson property of the layer to the GeoJSON object
  this._geojson = geojson;


    // Clear the points array
    //points = [];
            // Dispatch an action to clear the points array
  store.dispatch({
    type: 'CLEAR_POINTS'
  });
});
        this.needRedraw();
    },

    getGeojson: function() {
        return this._geojson;
    },


    //-------------------------------------------------------------
    onRemove: function (map) {
        var del = this._delegate || this;
        del.onLayerWillUnmount && del.onLayerWillUnmount(); // -- callback



        let pane = this.options.pane ? map.getPanes()[this.options.pane] : map._panes.overlayPane;
        pane.removeChild(this._canvas);

        map.off(this.getEvents(), this);

        this._canvas = null;


        // Clear the points array
        //points = [];

        map.scrollWheelZoom.enable();
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();



    },

    //------------------------------------------------------------
    addTo: function (map) {
        map.addLayer(this);
        return this;
    },

    // --------------------------------------------------------------------------------
    LatLonToMercator: function (latlon) {
        return {
            x: latlon.lng * 6378137 * Math.PI / 180,
            y: Math.log(Math.tan((90 + latlon.lat) * Math.PI / 360)) * 6378137
        };
    },

    //------------------------------------------------------------------------------
    drawLayer: function () {
        // -- todo make the viewInfo properties  flat objects.
        var size = this._map.getSize();
        var bounds = this._map.getBounds();
        var zoom = this._map.getZoom();

        var center = this.LatLonToMercator(this._map.getCenter());
        var corner = this.LatLonToMercator(this._map.containerPointToLatLng(this._map.getSize()));

        var del = this._delegate || this;
        del.onDrawLayer && del.onDrawLayer({
            layer: this,
            canvas: this._canvas,
            bounds: bounds,
            size: size,
            zoom: zoom,
            center: center,
            corner: corner
        });
        this._frame = null;
    },



    //x------------------------------------------------------------------------------
    _animateZoom: function (e) {
        var scale = this._map.getZoomScale(e.zoom);
        var offset = this._map._latLngToNewLayerPoint(this._map.getBounds().getNorthWest(), e.zoom, e.center);

        L.DomUtil.setTransform(this._canvas, offset, scale);
    },





});








const Map_paint = () => {
    const ctx = useLeafletContext()

    useEffect(() => {

    const canvas_container = ctx.overlayContainer || ctx.map
    const new_grid_layer = new L.CustomLayer






        canvas_container.addLayer(new_grid_layer)


        console.log("test points:", store.getState().points_2)
        console.log(new_grid_layer._canvas.ctx)



        return () => {
            canvas_container.removeLayer(new_grid_layer)



        }


        })






}


export default Map_paint