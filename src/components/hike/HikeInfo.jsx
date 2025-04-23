import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useParams } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';

import { getHikeByHikeId } from '../../firebase/services/hikeService';
import { useAuth } from '../../contexts/authContext';
import { useUserData } from '../../contexts/userDataContext/useUserData';;
import HikeCompletionModal from './HikeCompletionModal';
import RatingWidget from './RatingWidget';
import BookmarkButton from './Bookmark';
import PlusButton from './AddHike';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const formatTimeToHours = (timeInMinutes) => {
  if (!timeInMinutes) return '';
  const minutes = Number(timeInMinutes);
  if (isNaN(minutes)) return timeInMinutes;

  const hours = minutes / 60;
  const roundedHours = Math.round(hours * 2) / 2;

  if (roundedHours === 1) return '1 hr';
  if (roundedHours % 1 === 0) return `${roundedHours} hrs`;
  const wholeHours = Math.floor(roundedHours);
  return wholeHours === 0 ? '0.5 hrs' : `${wholeHours}.5 hrs`;
};

const HikeInfo = () => {
  const { hikeId } = useParams();
  const { currentUser } = useAuth();
  const { userData } = useUserData();

  const [hikeData, setHikeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchHikeData = async () => {
      try {
        setLoading(true);
        const hike = await getHikeByHikeId(hikeId);
        console.log('Fetched hike:', hike);
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

    if (hikeId) fetchHikeData();
  }, [hikeId]);

  useEffect(() => {
    if (!hikeData || !mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [-106.3468, 56.1304],
      zoom: 6,
    });

    mapRef.current = map;

    map.on('load', async () => {
      const res = await fetch('/data/trails.json');
      const geojson = await res.json();

      const filteredFeatures = geojson.features.filter((feature) => {
        return (
          feature.properties['Name_Official_e']?.toLowerCase() ===
            hikeData.title.toLowerCase() ||
          feature.properties['Label_e_5k_less']?.toLowerCase() ===
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
        id: 'trails-layer',
        type: 'line',
        source: 'trails',
        layout: {},
        paint: {
          'line-color': '#e63946',
          'line-width': 3,
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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <div className="text-center p-8">Loading hike information...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!hikeData) return <div className="text-center p-8">No hike found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">{hikeData.title}</h1>
        <BookmarkButton
          hikeId={hikeId}
          userId={currentUser?.uid}
          username={userData?.username}
        />
      </div>

      <div className="aspect-video rounded-2xl overflow-hidden shadow-md" ref={mapContainerRef} />

      <div className="space-y-4">
        <p className="text-gray-600 text-lg">{hikeData.description}</p>
        
        {/* Displaying Difficulty, Elevation Gain, and Estimated Time */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span><strong>Difficulty:</strong> {hikeData.difficulty}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span><strong>Elevation Gain:</strong> {hikeData.elevation} {hikeData.elevationUnit}</span>
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
              <PlusButton onClick={() => { console.log('Adding hike to completed'); }} />
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
                <div className="md:w-1/2 flex md:justify-end items-center md:items-start md:mt-0">
                  <span className="text-lg font-bold pr-2">Rating:  </span><RatingWidget hikeId={hikeData.hikeId} />
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

      {isModalOpen && (
        <HikeCompletionModal
          hikeId={hikeId}
          userId={currentUser?.uid}
          username={userData?.username}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default HikeInfo;
