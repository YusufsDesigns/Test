import Hero from "@/components/home/Hero";
import SectionFive from "@/components/home/SectionFive";
import SectionFour from "@/components/home/SectionFour";
import SectionThree from "@/components/home/SectionThree";
import SectionTwo from "@/components/home/SectionTwo";
import Image from "next/image";

export default function Home() {
  return (
    <main className="f">
      <Hero />
      <SectionTwo />
      <SectionThree />
      <SectionFour />
      <hr />
      <SectionFive />
    </main>
  );
}
