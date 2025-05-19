import DummyContent from "@/components/dummy-content";
import { GlobeDemo } from "@/components/globe-demo";
import { NavbarDemo } from "@/components/navbar";
import Link from "next/link";

// this page will be generic for all the user
export default function Home() {
  return (
    <>
      <NavbarDemo />

      <div className="flex flex-col lg:flex-row w-full">
        {/* Left column - Content */}
        <div className="w-full lg:w-1/2 px-4 lg:px-20 pt-40">
          <div className="flex flex-col gap-6 pt-8 pb-16">
            <h1 className="text-4xl font-bold">Welcome to My Platform</h1>
            <p className="text-neutral-400">
              Discover our innovative solutions and services
              designed to help you succeed in the digital world.
            </p>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                Get Started
              </button>
              <button className="px-4 py-2 border border-neutral-300 rounded-md">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Right column - Globe - ADJUSTED POSITIONING */}
        <div className="w-full lg:w-1/2 h-[400px] lg:h-[90vh] -mt-20 lg:-mt-32 bg-background">
          <GlobeDemo />
        </div>
      </div>

      <DummyContent />
    </>
  );
}
