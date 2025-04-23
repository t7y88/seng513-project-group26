import { getFriendsCompletedHikesWithDetails } from "../../firebase/";
import { useAuth } from "../../contexts/authContext";
import { useState, useEffect, useCallback, useRef } from "react";
import LogCard from "./LogCard";

function FriendsActivity() {
  const { currentUser } = useAuth();
  const [friendsHikes, setFriendsHikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const loaderRef = useRef(null);
  
  const loadInitialHikes = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Loading initial hikes for user:", currentUser.uid);
      const result = await getFriendsCompletedHikesWithDetails(currentUser.uid);
      setFriendsHikes(result.hikeData);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Error loading hikes:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);
  
  const loadMoreHikes = useCallback(async () => {
    if (!hasMore || loading || !lastDoc) return;
    
    setLoading(true);
    try {
      const result = await getFriendsCompletedHikesWithDetails(
        currentUser.uid,
        10, // batch size
        lastDoc
      );
      
      setFriendsHikes(prevHikes => [...prevHikes, ...result.hikeData]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Error loading more hikes:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, hasMore, loading, lastDoc]);
  
  // Setup Intersection Observer for infinite scroll
  useEffect(() => {
    // Disconnect previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreHikes();
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the target is visible
    );
    
    // Observe the loader element if it exists
    if (loaderRef.current) {
      observerRef.current.observe(loaderRef.current);
    }
    
    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMoreHikes]);
  
  useEffect(() => {
    if (currentUser) {
      loadInitialHikes();
    }
  }, [currentUser, loadInitialHikes]);
  
  return (
    <div className="w-full h-full">
      <h1 className="px-8 max-sm:px-2 text-2xl font-stretch-ultra-expanded text-left">Friends Hikes</h1>
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-2 justify-items-center max-sm:grid-cols-1 max-sm:gap-2">
        {friendsHikes.map(item => (
          <div key={item.completion.id} className="mb-4">
            <LogCard 
              {...item} 
              hikeId={item.completion?.hikeId} 
            />
          </div>
        ))}
        
        {/* This invisible element serves as our observer target */}
        <div 
          ref={loaderRef} 
          className="h-10 w-full flex items-center justify-center"
        >
          {loading && hasMore && <p>Loading more hikes...</p>}
        </div>
      </div>
    </div>
  );
}

export default FriendsActivity;