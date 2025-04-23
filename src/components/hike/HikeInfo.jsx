import React, { useEffect, useRef, useState } from 'react';
import { getHikeByHikeId } from '../../firebase/services/hikeService';
import BookmarkButton from './Bookmark';
import PlusButton from './AddHike';
import mapboxgl from 'mapbox-gl';
import { useAuth } from '../../contexts/authContext';
import { useUserData } from '../../contexts/userDataContext/useUserData';
import { useParams } from 'react-router-dom';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const formatTimeToHours = (timeInMinutes) => {
  if (!timeInMinutes) return '';
  
  // Convert to number if it's a string
  const minutes = Number(timeInMinutes);
  
  if (isNaN(minutes)) return timeInMinutes; // Return original if not a valid number
  
  // Convert minutes to hours with half-hour precision
  const hours = minutes / 60;
  const roundedHours = Math.round(hours * 2) / 2; // Round to nearest 0.5
  
  // Format the output
  if (roundedHours === 1) return '1 hr';
  if (roundedHours % 1 === 0) return `${roundedHours} hrs`;
  
  // For half hours, format as "X.5 hrs"
  const wholeHours = Math.floor(roundedHours);
  return wholeHours === 0 ? '0.5 hrs' : `${wholeHours}.5 hrs`;
};

// Ensure mapbox-gl CSS is imported
import 'mapbox-gl/dist/mapbox-gl.css';
import { FaClock } from 'react-icons/fa';

const HikeInfo = () => {
  const { hikeId } = useParams();
  const { currentUser } = useAuth();
  const { userData } = useUserData();

  const [hikeData, setHikeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  // Fetch hike data
  useEffect(() => {
    const fetchHikeData = async () => {
      try {
        setLoading(true);
        const hike = await getHikeByHikeId(hikeId);
        if (hike) {
          setHikeData(hike);
        } else {
          setError('Hike not found');
        }
      } catch (err) {
        console.error('Error loading hike:', err);
        setError('Failed to load hike details');
      } finally {
        setLoading(false);
      }
    };

    if (hikeId) {
      fetchHikeData();
      console.log('Hike ID:', hikeId);
    }
  }, [hikeId]);


  useEffect(() => {
    if (!hikeData || !mapContainerRef.current) return;
    
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-106.3468, 56.1304],
      zoom: 6,
      transformRequest: (url, resourceType) => {
        // Disable y-flip for images to prevent warning
        if (resourceType === 'Image' && !url.includes('mapbox.com')) {
          return {
            url,
            credentials: 'same-origin',
            headers: {
              'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
            }
          };
        }
      }
    });
  
    mapRef.current = map;

    map.on("load", async () => {
      const res = await fetch("/data/trails.json");
      const geojson = await res.json();

      // Trail name might be under 'Label_e_5k_less' or 'Name_Official_e'
      const filteredFeatures = geojson.features.filter((feature) => {
        return (
          feature.properties["Name_Official_e"]?.toLowerCase() ===
            hikeData.title.toLowerCase() ||
          feature.properties["Label_e_5k_less"]?.toLowerCase() ===
            hikeData.title.toLowerCase()
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

    return () => map?.remove();
  }, [hikeData]);

  if (loading) return <div className="text-center p-8">Loading hike information...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!hikeData) return <div className="text-center p-8">No hike found</div>;

  return (
    <div className='justify-center flex flex-row'>
      <div className="flex flex-col justify-center">


        <div className="flex justify-center w-6xl bg-amber-300 h-4/5">
          {/* ========================== Tile and Map container =================*/}
          <div className="w-2/3 flex flex-col h-full bg-green-400 p-2">
            <h1 className="text-2xl italic pb-0.5 text-nowrap">
              {hikeData.title},
              <span className="text-lg font-normal "> {hikeData.location}</span>
            </h1>
            <div
              ref={mapContainerRef}
              className="w-full h-full rounded-lg shadow-md border border-gray-300 flex-grow"
            />
          </div>

          {/*================= Bookmark, Log hike, Image, and ratings/info =======*/}
          <div className="w-1/2 flex flex-col h-full p-2">
            {currentUser && (
              <div className="flex justify-end ">
                <BookmarkButton 
                  hikeId={hikeData.hikeId} 
                  userId={currentUser.uid}
                  username={userData?.username}
                />
                <PlusButton onClick={() => { console.log('Adding hike to completed'); }} />
              </div>
            )}

            <img
              src={hikeData.image}
              alt={hikeData.title}
              className="w-full h-1/2 object-cover rounded-lg shadow-md border border-gray-300"
            />
            <div className="rounded-lg p-4 mt-4 flex-grow bg-blue-500">
              <div className="text-lg text-gray-700 mb-2">
                <span className="font-bold">Distance:</span> {hikeData.distance} {hikeData.distanceUnit}
              </div>
              <div className="text-lg text-gray-700 mb-2">
                <span className="font-bold">Elevation:</span> {hikeData.elevation} {hikeData.elevationUnit}
              </div>
              <div className="text-lg text-gray-700 mb-2">
                <div className='inline-flex'> <FaClock className="mr-1" />{formatTimeToHours(hikeData.timeEstimateMinutes)}</div>
                
                <div>{hikeData.difficulty}</div>
                <span>{hikeData.distance} {hikeData.distanceUnit}</span>
                <span>Elev. {hikeData.elevation} {hikeData.elevationUnit}</span>
              </div>
          </div>


        </div>
            {/* Display difficulty, distance, elevation */}
            <div className="flex justify-center mb-6">

            </div>
        </div>
        <div className='flex px-2 text-align-left w-full bg-red-600'> 
          <h1 className="text-3xl md:text-4xl italic mb-4 pr-10 pt-5">
            About:
          </h1>
          <span className="text-lg text-gray-700 mb-2">
            {hikeData.description}
          </span>
        </div>
      </div>
  </div>
  );
};

export default HikeInfo;
