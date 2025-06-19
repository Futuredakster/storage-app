"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
const Page = () => {

   const router = useRouter(); // Initialize useRouter

  const handleLoginClick = () => {
    router.push('/sign-in'); // Redirect to the login page
  };

  const handleSignUpClick = () => {
    router.push('/sign-up'); // Redirect to the signup page
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-bue font-poppins">
       <img
        src="/public/assets/icons/logo-full-brand.svg"
        alt="Company Logo"
        className="absolute top-4 left-4 h-10 w-auto z-20 md:top-8 md:left-8 md:h-12" // Smaller on mobile, then larger on medium screens and up
      />
      {/* Content wrapper, keeping the max-w-screen-xl */}
      <div className="relative flex flex-col lg:flex-row items-center justify-center p-8 md:p-12 w-full h-full max-w-screen-xl mx-auto">

        {/* Left section for text and buttons - now wider for bigger words */}
        {/* CHANGED: Text column width back to lg:w-1/4 (25%) */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left z-10 lg:w-1/4 p-4 lg:pr-8"> {/* Changed to lg:w-1/4, adjusted pr to pr-8 */}
          {/* Main heading - now significantly bigger */}
          {/* CHANGED: Increased font sizes here */}
          <h1 className="text-5xl md:text-6xl font-bold text-dark-100 mb-6 leading-tight"> {/* Increased from 4xl/5xl to 5xl/6xl */}
           Your Files, Revolutionized
          </h1>

          {/* Sub-text - now bigger */}
          {/* CHANGED: Increased font size and removed max-w-md to allow text to fill more width */}
          <p className="text-xl text-light-100 mb-8"> {/* Increased from text-lg to text-xl, removed max-w-md */}
            Our platform redefines how you handle your files,
            offering powerful tools to manage, convert, downlaod and share everything from images and videos to documents.
            And with an integrated AI assistant by your side, you'll navigate your digital world with unprecedented ease.
          </p>

          {/* Buttons section - adjusted size for better appearance */}
          {/* CHANGED: Adjusted button padding and font size for better appearance */}
          <div className="flex flex-col space-y-4 w-full max-w-xs">
            <button className="bg-brand-DEFAULT text-white font-semibold py-3 px-6 rounded-full shadow-md bg-brand-100 transition-colors duration-300 text-base"
               onClick={handleLoginClick}>
               {/* Adjusted py/px, added text-base */}
              Sign In
            </button>
            <button className="border-2 border-brand-DEFAULT text-brand-DEFAULT font-semibold py-3 px-6 rounded-full bg-brand-100 text-white transition-colors duration-300 text-base"
            onClick={handleSignUpClick}>
              Sign Up
            </button>
          </div>
        </div>

        {/* Right section for the cloud image - adjusted to lg:w-3/4 to maintain total width */}
        {/* CHANGED: Image column width back to lg:w-3/4 (75%) to accommodate wider text column */}
        <div className="relative mt-8 lg:mt-0 lg:w-3/4 flex justify-center items-center"> {/* Changed to lg:w-3/4 */}
          <img
            src="/public/assets/images/Cloud.png"
            alt="Cloud storage with files"
            className="w-full h-auto max-w-lg lg:w-full lg:max-w-none lg:transform-none transform -translate-x-12"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
