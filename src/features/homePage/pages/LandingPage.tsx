import React, { useState } from 'react';
import '../styles/index.css'
import {
  HeroSection,
  AboutSection,
  InfiniteCarouselSection,
  BenefitsSection,
  // VideoSection,
  ShowcaseSection,
  MobileCampusSection,
  TeamSection,
  PricingSection,
  CTASection,
  FAQSection,
  Footer,
  Header,
  WhatsAppButton,
  IllustrationsSection
} from '../components';
import { ChatBot } from '../../../shared/components';


export const LandingPage: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <Header />
      <main className="pt-16">
        <HeroSection />
        <BenefitsSection />
        {/* <VideoSection /> */}
        <AboutSection />
        <IllustrationsSection/>
        <InfiniteCarouselSection />
        <MobileCampusSection />
        <ShowcaseSection />
        <TeamSection />
        <PricingSection />
        <CTASection />
        <FAQSection />
        <Footer />
      </main>

      {/* ChatBot Asistente Virtual */}
      <ChatBot onOpenChange={setIsChatOpen} />

      {/* WhatsApp Button */}
      <WhatsAppButton isDisabled={isChatOpen} />
    </>
  );
};
