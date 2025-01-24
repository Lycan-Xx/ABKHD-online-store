import React from 'react';
import { motion } from 'framer-motion';

const UploadProgress = ({ progress }) => {
  return (
    <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className="absolute h-full bg-yellow-400"
      />
      <div className="absolute inset-0 flex items-center justify-center text-xs text-white">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export default UploadProgress;