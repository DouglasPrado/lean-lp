import { Navbar } from "@/components/sections/navbar"
import { Hero } from "@/components/sections/hero"
import { SocialProof } from "@/components/sections/social-proof"
import { Benefits } from "@/components/sections/benefits"
import { HowItWorks } from "@/components/sections/how-it-works"
import { UseCases } from "@/components/sections/use-cases"
import { Features } from "@/components/sections/features"
import { DemoCta } from "@/components/sections/demo-cta"
import { Faq } from "@/components/sections/faq"
import { FinalCta } from "@/components/sections/final-cta"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Benefits />
        <HowItWorks />
        <UseCases />
        <Features />
        <DemoCta />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
