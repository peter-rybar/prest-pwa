// https://codelabs.developers.google.com/codelabs/workbox-lab/

declare const importScripts: (script: string) => void;
declare const WorkboxSW: any;

importScripts("lib/workbox-sw.js");
// importScripts("./node_modules/workbox-sw/build/importScripts/workbox-sw.prod.v2.1.1.js");

const workboxSW = new WorkboxSW();
workboxSW.precache([]); // workbox will generate lrecache list!
