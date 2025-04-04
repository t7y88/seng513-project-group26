import React, { useState, useEffect } from "react";

export default function PageSizeWidget() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Update the window size when the window is resized
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fixed bottom-2 right-2 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg shadow-lg">
      {`Width: ${windowSize.width}px, Height: ${windowSize.height}px`}
    </div>
  );
}