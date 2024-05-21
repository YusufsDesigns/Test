import Hero from "@/components/home/Hero";
import SectionFive from "@/components/home/SectionFive";
import SectionFour from "@/components/home/SectionFour";
import SectionSeven from "@/components/home/SectionSeven";
import SectionSix from "@/components/home/SectionSix";
import SectionThree from "@/components/home/SectionThree";
import SectionTwo from "@/components/home/SectionTwo";
import Footer from "@/components/shared/Footer";

export default function Home() {
  return (
    <main className="f">
      <Hero />
      <SectionTwo />
      <SectionThree />
      <SectionFour />
      <hr className="hidden md:block" />
      <SectionFive />
      <SectionSix />
      <SectionSeven />
      <Footer />
    </main>
  );
}
