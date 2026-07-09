import { useState, useEffect, useRef } from 'react'
import HeroSection from '@/components/features/home/HeroSection'
import StatsSection from '@/components/features/home/StatsSection'
import OfferingsBento from '@/components/features/home/OfferingsBento'
import PopularCourses from '@/components/features/home/PopularCourses'
import WhyChooseUs from '@/components/features/home/WhyChooseUs'
import WhyAgenticX from '@/components/features/about/WhyAgenticX'
import SuccessStories from '@/components/features/home/SuccessStories'
import LiveActivities from '@/components/features/home/LiveActivities'
import CollaboratorsSection from '@/components/features/home/CollaboratorsSection'
import CtaSection from '@/components/features/home/CtaSection'
import DemoModal from '@/components/features/home/DemoModal'
import SEO from '@/components/seo/SEO'

export default function Home() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const popularCoursesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!popularCoursesRef.current) return;

      const rect = popularCoursesRef.current.getBoundingClientRect();

      const hasLeftSection = rect.bottom < window.innerHeight * 0.3;

      if (hasLeftSection) {
        const now = Date.now();

        const lastShown = localStorage.getItem('demoModalLastShown');

        // ⏱ 2 minutes cooldown (you can change to 3 min if needed)
        const COOLDOWN = 2 * 60 * 1000;

        if (!lastShown || now - Number(lastShown) > COOLDOWN) {
          setIsDemoModalOpen(true);

          localStorage.setItem('demoModalLastShown', now.toString());
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <SEO 
        title="AgenticX | AI & Data Science Training in Kollam"
        description="AgenticX Knowledge Solutions offers industry-ready AI, Data Science, Full Stack, and Cyber Security courses with placement support in Kollam, Kerala."
        keywords="AI course Kollam, Data analytics Kerala, Python full stack course, Cyber security training"
      />
      <HeroSection onOpenDemo={() => setIsDemoModalOpen(true)} />
      <StatsSection />
      <OfferingsBento />

      <div ref={popularCoursesRef}>
        <PopularCourses />
      </div>

      <WhyChooseUs />
      <WhyAgenticX />
      <SuccessStories />
      <LiveActivities />
      <CollaboratorsSection />
      <CtaSection onOpenDemo={() => setIsDemoModalOpen(true)} />

      
      <DemoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </>
  )
}