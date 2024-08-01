"use client";
import Header2 from "./Header2";

const HeroSection = () => {
  return (
    <div className="relative w-full h-screen bg-[url('/hero-section/main-bg.jpg')] bg-cover bg-center">
      <Header2 />
      <div className="flex items-center justify-start h-full pl-10">
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">Your Title Here</h1>
          <p className="text-lg">
            Your description goes here. Add some engaging content!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
