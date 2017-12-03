import { Widget } from "./prest/jsonml/jsonml-widget";
import { JsonMLs } from "./prest/jsonml/jsonml";

import { swInit, showNotification } from "./sw-lib";

// declare const L: any;
import * as L from "leaflet";


class MapWidget extends Widget {

    private _map: L.Map;
    private _imagePath: string = "/lib/leaflet/images/";

    constructor() {
        super("MapWidget");
    }

    onMount() {
        setTimeout(() => this._render(this.refs["map"]), 0);
    }

    render(): JsonMLs {
        return [
            ["div~map", {
                _skip: !!this._map,
                // style: "width: 100%; height: 100vw" }
                style: "width: 100%; height: 100%" }
            ]
        ];
    }

    private _render(element: HTMLElement): void {
        if (this._imagePath) {
            L.Icon.Default.imagePath = this._imagePath;
        }

        const map = L.map(element).fitWorld();
        this._map = map;

        L.tileLayer(
            "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
            {
                maxZoom: 18,
                attribution:
                    `Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ` +
                    `<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ` +
                    `Imagery © <a href="http://mapbox.com">Mapbox</a>`,
                id: "mapbox.streets"
            }
        ).addTo(map);

        map.on("locationfound", this.onLocationFound);
        map.on("locationerror", this.onLocationError);

        map.locate({ setView: true, maxZoom: 16 });
    }

    private onLocationFound = (e: L.LocationEvent) => {
        const radius = e.accuracy / 2;
        L.marker(e.latlng)
            .addTo(this._map)
            .bindPopup("<strong>Me</strong>, radius " + radius + "m")
            .openPopup();
        L.circle(e.latlng, radius).addTo(this._map);
    }

    private onLocationError = (e: L.ErrorEvent) => {
        alert(e.message);
    }

}


swInit();

const app = new MapWidget();
app.mount();


setTimeout(() => {
    showNotification("Notif title", {
        body: "Notif body",
        icon: "assets/icons/ic-face.png",
        tag: "notif-tag"
        // vibrate: [200, 100, 200, 100, 200, 100, 200],
        // data: {
        //     dateOfArrival: Date.now(),
        //     primaryKey: 1
        // },
        // actions: [
        //     {action: "explore", title: "Explore this new world",
        //         icon: "images/checkmark.png"},
        //     {action: "close", title: "Close notification",
        //         icon: "images/xmark.png"},
        // ]
    });
}, 3000);

(self as any).app = app;

(self as any).VERSION = "@VERSION@";
