import React, { useEffect, useState, useRef as useReference } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import DeleteProfileButton from "../profile/DeleteProfileButton"; // Adjust path as needed


/**
 * UserCard Component
 *
 * Props:
 * - regUser: UserProfile object for the user to display
 *
 * This component is self-contained:
 * - Handles navigation to the user's profile directly
 * - Handles user deletion directly via Firestore
 */
function UserCard({ regUser }) {
    const navigate = useNavigate();
    const scrollReference = useReference(null);
    const [mergedHikes, setMergedHikes] = useState([]);
    const [confirmingDelete, setConfirmingDelete] = useState(false);


    // Scroll the hike preview list left/right
    const scroll = (direction) => {
        const container = scrollReference.current;
        const scrollAmount = 100;
        if (container) {
            container.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    // Navigate to the user's profile
    const goToProfile = () => {
        navigate(`/profile/${regUser.id}`);
    };

    return (
        <div className="w-full bg-gray-160 p-4 rounded shadow-md flex flex-col gap-4 border border-gray-200">
            {/* Switch to Flex-Col below 768px*/}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">

                {/* Left: Profile image and basic info */}
                <div className="flex flex-col items-center gap-2 flex-[1_1_15%] w-full sm:w-xs md:w-1/4 lg:w-1/3 min-w-[6ch] sm:min-w-[9ch] md:min-w-[12ch] self-center">
                    <div className="w-full max-w-[6rem] aspect-square rounded-full overflow-hidden">
                        {regUser.profileImage ? (
                            <img
                                src={regUser.profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <FaUserCircle className="w-full h-full object-cover" />
                        )}
                    </div>
                    <div className="text-center w-full">
                        <p className="text-base sm:text-lg font-bold truncate">@{regUser.username}</p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{regUser.location}</p>
                    </div>
                </div>

                {/* Middle: Detailed profile info */}
                <div className="flex flex-col md:flex-row self-center text-sm sm:text-base gap-x-4 sm:gap-x-8 md:gap-x-14 flex-[3_1_60%] min-w-0">
                    <div>
                        <div><span className="font-semibold">Name:</span> {regUser.name || "—"}</div>
                        <div><span className="font-semibold">Email:</span> {regUser.email || "—"}</div>
                        <div><span className="font-semibold">Age:</span> {regUser.age ?? "—"}</div>
                    </div>
                    <div><div><span className="font-semibold">User docId:</span> {regUser.id || "—"}</div>
                        <div><span className="font-semibold">Member Since:</span> {regUser.memberSince || "—"}</div>
                        <div><span className="font-semibold">Admin:</span> {regUser.admin ? "Yes" : "No"}</div>
                    </div>
                </div>

                {/* Right: Delete and View Profile buttons */}
                <div className="flex flex-col gap-2 items-center justify-end flex-[1_1_10%] min-w-[6rem] self-center">
                    {/* Delete with confirm/cancel */}
                    <DeleteProfileButton targetUser={regUser} />

                    {/* Navigate to profile */}
                    <button
                        className="generic-button-active text-xs sm:text-sm md:text-base w-full max-w-[5rem]"
                        onClick={goToProfile}
                    >
                        View Profile
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserCard;
