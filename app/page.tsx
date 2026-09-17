import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import Problem from "@/components/home/Problem";
import Solution from "@/components/home/Solution";
import HowItWorks from "@/components/home/HowItWorks";
import Products from "@/components/home/Products";
import Industries from "@/components/home/Industries";
import FinalCTA from "@/components/home/FinalCTA";

export default function Home() {
  return (
      
      <main>
        <Hero />
        <TrustBar />
        <Problem />
        <Solution />
        <HowItWorks />
        <Products />
        <Industries />
        <FinalCTA />
      </main>
  );
}