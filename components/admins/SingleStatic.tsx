import React from 'react';

const SingleStatic = ({ title, data, imageSrc }:any) => {
  return (
    <div className="relative p-4 bg-white shadow-lg rounded-lg border border-gray-200">
      {/* Title */}
      <h1 className="text-xl font-semibold mb-4">{title}</h1>

      {/* Data */}
      <div className="flex items-center justify-center h-32">
        <p className="text-lg">{data}</p>
      </div>

      {/* Image */}
      <img
        src={imageSrc}
        alt="Decorative"
        className="absolute bottom-4 right-4 w-16 h-16 rounded-full border border-gray-300 object-cover"
      />
    </div>
  );
};

export default SingleStatic;
