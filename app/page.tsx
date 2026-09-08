import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import Problem from "@/components/home/Problem";
import Solution from "@/components/home/Solution";
import HowItWorks from "@/components/home/HowItWorks";
import Products from "@/components/home/Products";
import Industries from "@/components/home/Industries";
import SupplyPlanner from "@/components/home/SupplyPlanner";
import FinalCTA from "@/components/home/FinalCTA";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
export default function Home() {
  return (
    <>
      <Navbar />
      <MobileNav />
      <main>
        <Hero />
        <TrustBar />
        <Problem />
        <Solution />
        <HowItWorks />
        <Products />
        <Industries />
        <SupplyPlanner />
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}