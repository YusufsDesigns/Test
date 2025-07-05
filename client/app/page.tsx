// Importing React components for various sections of the home page
import Hero from "../components/home/Hero";
import ReadyMadeWears from "../components/home/ReadyMadeWears";
import HandMadeShoes from "../components/home/HandMadeShoes";
import Accessories from "../components/home/Accessories";
import Testimonials from "@/components/home/Testimonials";

// Home component that defines the structure of the home page
export default function Home() {
  return (
    <main>
      <Hero />
      <ReadyMadeWears />
      <hr />
      <HandMadeShoes />
      <hr />
      <Accessories />
      <Testimonials />
    </main>
  );
}
