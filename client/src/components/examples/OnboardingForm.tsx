import OnboardingForm from '../OnboardingForm'

export default function OnboardingFormExample() {
  return <OnboardingForm onComplete={(data) => console.log('Onboarding complete:', data)} />
}
