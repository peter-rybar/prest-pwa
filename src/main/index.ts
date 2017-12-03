import { Widget } from "./prest/jsonml/jsonml-widget";
import { JsonMLs } from "./prest/jsonml/jsonml";

import { swInit, showNotification } from "./sw-lib";

// declare const L: any;
import * as L from "leaflet";
import * as store from "store";


class MapWidget extends Widget {

    private _map: L.Map;
    private _imagePath: string = "lib/leaflet/images/";

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

        const map = L.map(element, {
            minZoom: 4,
            // maxZoom: 18,
            // zoomControl: false,
            scrollWheelZoom: true
        });
        this._map = map;

        map.on("load", this._onLoad);

        map.fitWorld();

        // new L.Control.Zoom({ position: "topright" }).addTo(map);

        const urlTemplate = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
        const layer: L.TileLayer = L.tileLayer(urlTemplate, {
            maxZoom: 18,
            attribution: `<a href="http://osm.org/copyright">OpenStreetMap</a>`,
            id: "prest-pwa.map"
        });
        map.addLayer(layer);

        map.on("moveend", this._onMoveEnd);

        map.on("locationfound", this._onLocationFound);
        map.on("locationerror", this._onLocationError);

        map.locate({ setView: !store.get("located"), maxZoom: 16 });

        const ctrl = (L.Control as any);
        ctrl.geocoder(
            {
                collapsed: true,
                position: "topright",
                placeholder: "Search",
                errorMessage: "No results",
                geocoder: new ctrl.Geocoder.Nominatim(),
                showResultIcons: false,
                defaultMarkGeocode: false,
            })
            .on("markgeocode", function (e: any) {
                // const center = e.geocode.center;
                const bbox = e.geocode.bbox;
                map.fitBounds(bbox);
                // const poly = L.polygon([
                //     bbox.getSouthEast(),
                //     bbox.getNorthEast(),
                //     bbox.getNorthWest(),
                //     bbox.getSouthWest()
                // ]).addTo(map);
                // map.fitBounds(poly.getBounds());
            })
            .addTo(map);
    }

    private _onLoad = () => {
        this._boundsLoad();
    }

    private _onMoveEnd = (e: any) => {
        this._boundsSave();
    }

    private _boundsSave(): void {
        const bounds = this._map.getBounds();
        store.set("bounds", bounds.toBBoxString());
    }

    private _boundsLoad(): void {
        const bounds = store.get("bounds");
        if (bounds) {
            const b = this._fromBBoxString(bounds);
            this._map.fitBounds(b);
        } else {
            this._map.fitWorld();
        }
    }

    private _fromBBoxString = (bbox: string): L.LatLngBounds => {
        const [west, south, east, north] = bbox.split(",").map(parseFloat);
        return new L.LatLngBounds(new L.LatLng(south, west), new L.LatLng(north, east));
    }

    private _onLocationFound = (e: L.LocationEvent) => {
        const radius = e.accuracy / 2;
        L.marker(e.latlng)
            .addTo(this._map)
            .bindPopup("<strong>Me</strong>, radius " + radius.toFixed(0) + "&thinsp;m")
            .openPopup();
        L.circle(e.latlng, radius).addTo(this._map);
        store.set("located", true);
    }

    private _onLocationError = (e: L.ErrorEvent) => {
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
