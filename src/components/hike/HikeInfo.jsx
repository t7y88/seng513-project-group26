import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getHikeByHikeId } from '../../firebase/services/hikeService';
import BookmarkButton from './Bookmark';
import PlusButton from './AddHike';
import mapboxgl from 'mapbox-gl';


const HikeInfo = ({ trailName, hikeData ={} }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-106.3468, 56.1304],
      zoom: 6,
    });

    mapRef.current = map;

    map.on("load", async () => {
      const res = await fetch("/data/trails.json");
      const geojson = await res.json();

      // Trail name might be under 'Label_e_5k_less' or 'Name_Official_e'
      const filteredFeatures = geojson.features.filter((feature) => {
        return (
          feature.properties["Name_Official_e"]?.toLowerCase() ===
            trailName.toLowerCase() ||
          feature.properties["Label_e_5k_less"]?.toLowerCase() ===
            trailName.toLowerCase()
        );
      });

      /** @type {GeoJSON.FeatureCollection} */
      const filteredGeoJSON = {
        type: "FeatureCollection",
        features: filteredFeatures,
      };

      map.addSource("trails", {
        type: "geojson",
        data: filteredGeoJSON,
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

      if (filteredFeatures.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        filteredFeatures[0].geometry.coordinates.forEach((coord) => {
          bounds.extend(coord);
        });
        map.fitBounds(bounds, { padding: 40 });
      }
    });

    return () => map.remove();
  }, [trailName]);

  return (
    <>
      <div className="flex justify-center">
        <h1 className="text-3xl md:text-4xl italic mb-4 pr-10 pt-5">
          {trailName}
        </h1>
        {hikeData && (
          <>
            <BookmarkButton hikeId={hikeData.id} />
            <PlusButton onClick={() => /* handle adding hike to completed */ } />
          </>
        )}
      </div>
      
      {/* Display difficulty, distance, elevation */}
      {hikeData && (
        <div className="flex justify-center mb-6">
          <div className="text-lg text-gray-700 flex gap-4">
            <span>{hikeData.difficulty}</span>
            <span>{hikeData.distance} {hikeData.distanceUnit}</span>
            <span>Elev. {hikeData.elevation} {hikeData.elevationUnit}</span>
          </div>
        </div>
      )}

      {/* Map container */}
      <div className="flex justify-center items-center py-4">
        <div
          ref={mapContainerRef}
          className="w-full max-w-4xl h-[500px] rounded-lg shadow-md border border-gray-300"
        />
      </div>
    </>
  );
};

export default HikeInfo;
