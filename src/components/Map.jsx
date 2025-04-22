import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const TrailsMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-106.3468, 56.1304],
      zoom: 4,
    });

    mapRef.current = map;

    map.on("load", async () => {
      const res = await fetch("/data/trails.json");
      const geojson = await res.json();

      map.addSource("trails", {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: "trails-layer",
        type: "line",
        source: "trails",
        layout: {},
        paint: {
          "line-color": "#e63946",
          "line-width": 3,
        },
      });
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainerRef} className="h-[80vh] w-auto" />;
};

export default TrailsMap;
