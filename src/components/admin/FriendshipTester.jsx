import React, { useState } from "react";
import {
  getFriendship,
  requestFriendship,
  getAllPendingFriendship,
  removeFriendship,
  addFriendship,
  getFriends,
  getUserFromFirestore
} from "../../firebase";

export default function FriendshipTester() {
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const [friendshipId, setFriendshipId] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const executeFunction = async (funcName, func, ...args) => {
    setLoading(true);
    setError(null);
    try {
      // Trim whitespace from any string arguments
      const trimmedArgs = args.map(arg => 
        typeof arg === 'string' ? arg.trim() : arg
      );
      
      // Log the original and trimmed values for debugging
      if (trimmedArgs.some((arg, i) => typeof arg === 'string' && arg !== args[i])) {
        console.log('Trimmed input values:', {
          original: args.filter(arg => typeof arg === 'string'),
          trimmed: trimmedArgs.filter(arg => typeof arg === 'string')
        });
      }
      
      const result = await func(...trimmedArgs);
      setResults({
        function: funcName,
        arguments: trimmedArgs, // Show trimmed arguments in results
        data: result
      });
      console.log(`${funcName} result:`, result);
    } catch (err) {
      setError(`${funcName} error: ${err.message}`);
      console.error(`${funcName} error:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Friendship Functions Tester</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">User 1 ID</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={user1}
            onChange={(e) => setUser1(e.target.value)}
            placeholder="User 1 ID"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">User 2 ID</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={user2}
            onChange={(e) => setUser2(e.target.value)}
            placeholder="User 2 ID"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Friendship ID</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          value={friendshipId}
          onChange={(e) => setFriendshipId(e.target.value)}
          placeholder="For removeFriendship"
        />
      </div>
      
      {/* Add User Information Section */}
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">User Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => executeFunction("getUserInfo", getUserFromFirestore, user1)}
            className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            disabled={!user1 || loading}
          >
            Get User 1 Info
          </button>
          
          <button
            onClick={() => executeFunction("getUserInfo", getUserFromFirestore, user2)}
            className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            disabled={!user2 || loading}
          >
            Get User 2 Info
          </button>
        </div>
      </div>
      
      <h2 className="text-xl font-medium mb-2">Friendship Operations</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => executeFunction("getFriendship", getFriendship, user1, user2)}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={!user1 || !user2 || loading}
        >
          Get Friendship
        </button>
        
        <button
          onClick={() => executeFunction("requestFriendship", requestFriendship, user1, user2)}
          className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          disabled={!user1 || !user2 || loading}
        >
          Request Friendship
        </button>
        
        <button
          onClick={() => executeFunction("getAllPendingFriendship", getAllPendingFriendship, user1)}
          className="p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
          disabled={!user1 || loading}
        >
          Get Pending Friendships
        </button>
        
        <button
          onClick={() => executeFunction("removeFriendship", removeFriendship, friendshipId)}
          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          disabled={!friendshipId || loading}
        >
          Remove Friendship
        </button>
        
        <button
          onClick={() => executeFunction("addFriendship", addFriendship, user1, user2)}
          className="p-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
          disabled={!user1 || !user2 || loading}
        >
          Add Friendship
        </button>
        
        <button
          onClick={() => executeFunction("getFriends", getFriends, user1)}
          className="p-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
          disabled={!user1 || loading}
        >
          Get Friends
        </button>
      </div>
      
      {loading && <div className="text-center my-4">Loading...</div>}
      
      {error && (
        <div className="my-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      {results && (
        <div className="mt-6">
          <h2 className="text-xl font-medium mb-2">Results - {results.function}</h2>
          <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-80">
            <pre>{JSON.stringify(results.data, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}