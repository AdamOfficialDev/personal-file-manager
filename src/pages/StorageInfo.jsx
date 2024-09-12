import React, { useEffect, useState } from "react";
import { ref, listAll, getMetadata } from "firebase/storage";
import { storage } from "../firebaseConfig";
import { BsFillCloudFill, BsFillCloudCheckFill } from "react-icons/bs";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FiRefreshCw } from "react-icons/fi";

const StorageInfoPage = () => {
  const [usedSpace, setUsedSpace] = useState(0); // in bytes
  const [loading, setLoading] = useState(true);

  const totalStorage = 5 * 1024 * 1024 * 1024; // 5GB in bytes

  useEffect(() => {
    const calculateStorageUsage = async () => {
      try {
        setLoading(true);
        let totalBytes = 0;

        // Recursive function to calculate the size of all files in the storage
        const calculateSize = async (ref) => {
          const result = await listAll(ref);

          for (const item of result.items) {
            const metadata = await getMetadata(item); // Fetch metadata to get file size
            totalBytes += metadata.size; // Add file size to total bytes
          }

          // If there are any subfolders, calculate their size recursively
          for (const folderRef of result.prefixes) {
            await calculateSize(folderRef);
          }
        };

        const rootRef = ref(storage, "uploads/"); // Define root storage reference
        await calculateSize(rootRef); // Calculate the storage usage starting from root

        setUsedSpace(totalBytes); // Update the state with the total storage used
        setLoading(false);
      } catch (error) {
        console.error("Error calculating storage usage:", error);
        setLoading(false);
      }
    };

    calculateStorageUsage();
  }, []);

  const usedPercentage = ((usedSpace / totalStorage) * 100).toFixed(2);
  const remainingSpace = totalStorage - usedSpace;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Cloud Storage Information
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="flex gap-2">
            <FiRefreshCw className="animate-spin text-3xl" />
            <span className="text-lg">Calculating storage usage...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Used Storage Section */}
          <div className="card bg-base-100 shadow-md p-6 flex items-center gap-4">
            <BsFillCloudCheckFill className="text-blue-500 text-6xl" />
            <div>
              <h2 className="text-lg font-semibold">Used Storage</h2>
              <p className="text-sm text-gray-500">
                {usedSpace
                  ? `${(usedSpace / (1024 * 1024)).toFixed(2)} MB`
                  : "0 MB"}{" "}
                of 5 GB
              </p>
              <progress
                className="progress progress-info w-full"
                value={usedPercentage}
                max="100"
              ></progress>
              <p className="text-sm text-gray-600 mt-1">
                {usedPercentage}% Used
              </p>
            </div>
          </div>

          {/* Remaining Storage Section */}
          <div className="card bg-base-100 shadow-md p-6 flex items-center gap-4">
            <BsFillCloudFill className="text-green-500 text-6xl" />
            <div>
              <h2 className="text-lg font-semibold">Remaining Storage</h2>
              <p className="text-sm text-gray-500">
                {(remainingSpace / (1024 * 1024)).toFixed(2)} MB Available
              </p>
              <progress
                className="progress progress-success w-full"
                value={100 - usedPercentage}
                max="100"
              ></progress>
              <p className="text-sm text-gray-600 mt-1">
                {100 - usedPercentage}% Remaining
              </p>
            </div>
          </div>

          {/* Total Storage Section */}
          <div className="card bg-base-100 shadow-md p-6 flex items-center gap-4">
            <AiOutlineExclamationCircle className="text-yellow-500 text-6xl" />
            <div>
              <h2 className="text-lg font-semibold">Total Storage</h2>
              <p className="text-sm text-gray-500">5 GB Total Storage</p>
              <progress
                className="progress progress-warning w-full"
                value="100"
                max="100"
              ></progress>
              <p className="text-sm text-gray-600 mt-1">100% Total Capacity</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageInfoPage;
