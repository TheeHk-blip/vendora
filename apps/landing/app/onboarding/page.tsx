import { Metadata } from "next";
import Onboarding from "./components/onboarding";

export const metadata: Metadata = ({
  title: "Onboarding | Vendora",
  description: "Smooth and user friendly onboarding"
})

export default function OnboardingPage() {
  return <Onboarding />
}
