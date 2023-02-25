import {useLeafletContext} from "@react-leaflet/core";
import * as L from "leaflet";
import {useEffect} from "react";
import FreeDraw from "leaflet-freedraw/src/FreeDraw";
import MapPaint from "./MapPaint";



const Canvas_hook = () => {

    const context = useLeafletContext()


    useEffect(() => {
        const freeDraw = new FreeDraw()
        const container = context.layerContainer || context.map

        container.addLayer(freeDraw)



        return () => {
            container.removeLayer(freeDraw)

        }

        })
}

export default Canvas_hook