import React, { useEffect, useRef, useState } from 'react';
import { getHikeByHikeId } from '../../firebase/services/hikeService';
import BookmarkButton from './Bookmark';
import PlusButton from './AddHike';
import mapboxgl from 'mapbox-gl';
import { useAuth } from '../../contexts/authContext';
import { useUserData } from '../../contexts/userDataContext/useUserData';
import { useParams } from 'react-router-dom';
import HikeCompletionModal from './HikeCompletionModal'; // Import the modal

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
import 'mapbox-gl/dist/mapbox-gl.css';

const HikeInfo = () => {
  const { hikeId } = useParams();
  const { currentUser } = useAuth();
  const { userData } = useUserData();

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
    <>
      <div className="flex justify-center">
        <h1 className="text-3xl md:text-4xl italic mb-4 pr-10 pt-5">
          {hikeData.title}
        </h1>
        <BookmarkButton 
          hikeId={hikeData.hikeId} 
          userId={currentUser?.uid}
          username={userData?.username}
        />
        <PlusButton onClick={handlePlusButtonClick} />
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="text-lg text-gray-700 flex gap-4">
          <span>{hikeData.difficulty}</span>
          <span>{hikeData.distance} {hikeData.distanceUnit}</span>
          <span>Elev. {hikeData.elevation} {hikeData.elevationUnit}</span>
        </div>
      </div>

      <div className="flex justify-center items-center py-4">
        <div
          ref={mapContainerRef}
          className="w-full max-w-4xl h-[500px] rounded-lg shadow-md border border-gray-300"
        />
      </div>

      {/* Modal for Hike Completion */}
      {isModalOpen && (
        <HikeCompletionModal 
          hikeId={hikeData.hikeId} 
          userId={currentUser?.uid} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
};

export default HikeInfo;
