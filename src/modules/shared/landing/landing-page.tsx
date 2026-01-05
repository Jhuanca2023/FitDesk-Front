import { HeroSection } from "@/modules/shared/landing/components/hero-section"
import { StatsSection } from "@/modules/shared/landing/components/stats-section";
import { PriceSection } from "./components/price-section";
import ClaseSection from "./components/clase-section";

const LandingPage = () => {
    return (
        <div>
            <HeroSection />
            <StatsSection />
            <PriceSection />
            <ClaseSection />
        </div>
    )
}
export default LandingPage;
