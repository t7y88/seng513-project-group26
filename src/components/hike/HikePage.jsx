import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getHikeByHikeId } from '../../firebase/services/hikeService';
import BookmarkButton from './Bookmark';
import PlusButton from './AddHike';
import HikeInfo from './HikeInfo';

const HikePage = () => {
  const { hikeId } = useParams();
  const [hikeData, setHikeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHikeData = async () => {
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

    loadHikeData();
  }, [hikeId]);

  if (loading) return <div className="flex justify-center p-8">Loading hike information...</div>;
  if (error) return <div className="flex justify-center p-8 text-red-500">{error}</div>;
  if (!hikeData) return <div className="flex justify-center p-8">Hike not found</div>;

  return <HikeInfo trailName={hikeData.title} hikeData={hikeData} />;
};

export default HikePage;