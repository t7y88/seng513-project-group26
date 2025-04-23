import React, { useEffect, useState } from "react";

/**
 * LabelList Component
 *
 * Loads `trails.json` from the public folder and displays all
 * values found in the "Label_e_5k_less" field.
 *
 * Assumes the file is served at: `/data/trails.json`
 */
export default function LabelList() {
  const [labels, setLabels] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const res = await fetch("/data/trails.json");
        const geojson = await res.json();

        const labelList = geojson.features
          .map((feature) => feature.properties?.Label_e_5k_less)
          .filter((label) => !!label); // Remove null or undefined

        setLabels(labelList);
      } catch (err) {
        console.error("Failed to load labels:", err);
        setError("Error loading labels");
      }
    };

    fetchLabels();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Label_e_5k_less Values</h2>
      <ul className="list-disc list-inside space-y-1 text-sm">
        {labels.map((label, index) => (
          <li key={index}>{label}</li>
        ))}
      </ul>
    </div>
  );
}
