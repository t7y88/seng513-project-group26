import React, { useEffect, useRef, useState } from 'react';
import { getHikeByHikeId } from '../../firebase/services/hikeService';
import BookmarkButton from './Bookmark';
import PlusButton from './AddHike';
import mapboxgl from 'mapbox-gl';
import { useAuth } from '../../contexts/authContext';
import { useUserData } from '../../contexts/userDataContext/useUserData';
import { useParams } from 'react-router-dom';
import HikeCompletionModal from './HikeCompletionModal';
import RatingWidget from './RatingWidget';
import HikeStatusField from './HikeStatusField';

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
  const isAdmin = userData?.admin === true;

  const [hikeData, setHikeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
  
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

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
    }
  }, [hikeId]);

  useEffect(() => {
    if (!hikeData || !mapContainerRef.current) return;
    
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
          if (Array.isArray(coord) && coord.length === 2) {
            bounds.extend([coord[0], coord[1]]);
          }
        });
        map.fitBounds(bounds, { padding: 40 });
      }

      const firstFeature = filteredFeatures[0];
      if (firstFeature && firstFeature.geometry.type === 'Point') {
        const coordinates = firstFeature.geometry.coordinates;
        if (Array.isArray(coordinates) && coordinates.length === 2) {
          const [longitude, latitude] = coordinates;

          new mapboxgl.Marker({ color: 'green' })
            .setLngLat([longitude, latitude])
            .addTo(map);
        }
      }
    });

    return () => map?.remove();
  }, [hikeData]);

  const handlePlusButtonClick = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  if (loading) return <div className="text-center p-8">Loading hike information...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!hikeData) return <div className="text-center p-8">No hike found</div>;

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto px-4">
      {/* Main row */}
      <div className="flex flex-row w-full justify-center gap-2 md:flex-nowrap flex-wrap max-md:truncate">
        {/* Container 1: Title and Map */}
        <div className="md:w-2/3 w-full flex flex-col">
        <div className='flex justify-between items-center w-full'>
          {/* Title on the left */}
          <h1 className="text-2xl italic pb-0.5">
            {hikeData.title},
            <span className="text-lg font-normal"> {hikeData.location}</span>
          </h1>
          
          {/* Buttons on the right */}
          {currentUser && (
            <div className="flex md:hidden space-x-2">
              <BookmarkButton 
                hikeId={hikeData.hikeId} 
                userId={currentUser.uid}
                username={userData?.username}
              />
              <PlusButton onClick={handlePlusButtonClick} />
            </div>
          )}
        </div>
          <div
            ref={mapContainerRef}
            className="w-full flex-grow h-[500px] rounded-lg shadow-md border border-gray-300"
          />
        </div>
  
        {/* Container 2: Bookmark, Image, Details */}
        <div className="md:w-2/5 w-full flex flex-col">
        {currentUser && (
            <div className="hidden md:flex justify-end">
              <BookmarkButton 
                hikeId={hikeData.hikeId} 
                userId={currentUser.uid}
                username={userData?.username}
              />
              <PlusButton onClick={handlePlusButtonClick} />
            </div>
          )}
          <img
            src={hikeData.image}
            alt={hikeData.title}
            className="w-full h-128 object-cover rounded-lg shadow-md"
          />
          {/* Details container*/}
          <div className="rounded-lg p-3 max-md:mt-2 mt-2 flex-grow bg-gray-300 text-black">
              <div className="flex md:flex-row flex-col justify-between">
                {/* Left side: details */}
                <div className="md:w-1/2">
                  <div className="text-lg">
                    <span className="font-bold">Distance:</span> {hikeData.distance} {hikeData.distanceUnit}
                  </div>
                  <div className="text-lg">
                    <span className="font-bold">Elevation:</span> {hikeData.elevation} {hikeData.elevationUnit}
                  </div>
                  <div className="text-lg">
                    <span className="font-bold">Estimated Time: ~</span>{formatTimeToHours(hikeData.timeEstimateMinutes)}
                  </div>
                  <div>
                    <span className="font-bold">Difficulty: </span>{hikeData.difficulty}
                  </div>
                </div>
                
                {/* Right side: ratings */}
                <div className="md:w-1/2 flex flex-col">
                  {/* Rating field */}
                  <div className="flex md:justify-end items-center">
                    <span className="text-lg font-bold pr-2">Rating: </span>
                    <RatingWidget hikeId={hikeData.hikeId} />
                  </div>
                  
                  {/* Status field - positioned under rating */}
                  <div className="flex md:justify-end items-center mt-2">
                    <HikeStatusField 
                      hikeId={hikeData.hikeId} 
                      initialStatus={hikeData.status || 'Open'} 
                      isAdmin={isAdmin} 
                    />
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
  
      {/* About section - */}
      <div className="flex flex-col w-full mt-2 bg-gray-300 p-2 rounded-lg shadow-md">
        <h1 className="text-2xl italic mr-4">About:</h1>
        <div className="text-lg">{hikeData.description}</div>

      </div>

      {/* Modal for Hike Completion */}
      {isModalOpen && (
        <HikeCompletionModal 
          hikeId={hikeData.hikeId} 
          userId={currentUser?.uid} 
          username={userData?.username}
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default HikeInfo;
