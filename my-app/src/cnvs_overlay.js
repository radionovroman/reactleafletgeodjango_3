import {useLeafletContext} from "@react-leaflet/core";
import * as L from "leaflet";
import {useEffect} from "react";
import FreeDraw from "leaflet-freedraw/src/FreeDraw";

import CanvasOverlay from 'react-leaflet-canvas-overlay';



const Cnvs_overlay = () => {

    const context = useLeafletContext()


    useEffect(() => {
        const cnvs_ovr = new CanvasOverlay
        const container = context.layerContainer || context.map

        container.addLayer(cnvs_ovr)



        return () => {
            container.removeLayer(cnvs_ovr)

        }

        })
}

export default Cnvs_overlay