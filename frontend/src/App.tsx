import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import JourneySection from "./components/JourneySection";
import RhythmSlider from "./components/RhythmSlider";
import AppSection from "./components/AppSection";
import SimulatorsSection from "./components/SimulatorsSection";
import SocialFeed from "./components/SocialFeed";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import PageSkeleton from "./components/PageSkeleton";
import CardDetailPage from "./components/CardDetailPage";
import EasyPayPage from "./components/EasyPayPage";

function Home() {
  return (
    <>
      <Hero />
      <JourneySection />
      <RhythmSlider />
      <SimulatorsSection />
      <AppSection />
      <SocialFeed />
      <Footer />
      <PageSkeleton />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cartao/:slug" element={<CardDetailPage />} />
        <Route path="/servicos/easypay" element={<EasyPayPage />} />
      </Routes>
      <AuthModal />
    </BrowserRouter>
  );
}
