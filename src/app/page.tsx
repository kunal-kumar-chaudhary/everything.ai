import DummyContent from "@/components/dummy-content";
import Hero from "@/components/Hero";
import { NavbarDemo } from "@/components/navbar";

// this page will be generic for all the user
export default function Home() {
  return (
    <>
      <NavbarDemo />
      <Hero/>
      <DummyContent />
    </>
  );
}
