import { MainSection } from "./Sections/MainSection/MainSection";
import { LatestSection } from "./Sections/LatestSection/LatestSection";
// import { RankingSection } from "./Sections/RankingSection/RankingSection";
import { TutorialSection } from "./Sections/TutorialSection/TutorialSection";
import { PartnerSection } from "./Sections/PartnerSection/PartnerSection";

const LandingPage = () => {
  return (
    <>
      <MainSection />
      <LatestSection />
      {/* <RankingSection /> */}
      <TutorialSection />
      <PartnerSection />
    </>
  );
};

export default LandingPage;
