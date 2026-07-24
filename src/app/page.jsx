import HeroSlider from '@/components/HeroSlider';
import TopRatedDoctors from '@/components/TopRatedDoctors';
import HowItWorks from '@/components/HowItWorks';
import MedicalSpecialties from '@/components/MedicalSpecialties';

export const metadata = {
  title: 'DocAppoint - Home | Book Top Doctors Online',
  description: 'Browse available specialist doctors, check ratings, and book instant appointment consultations.',
};

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* 1. Hero Banner Section with Swiper/Slider */}
      <HeroSlider />

      {/* 2. Top Rated Doctors Section (3 high-rated doctors dynamically) */}
      <TopRatedDoctors />

      {/* 3. Additional Section A: How It Works */}
      <HowItWorks />

      {/* 4. Additional Section B: Medical Specialties */}
      <MedicalSpecialties />
    </div>
  );
}
