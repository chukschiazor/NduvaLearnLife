import CertificatePreview from '../CertificatePreview'

export default function CertificatePreviewExample() {
  return (
    <div className="max-w-2xl">
      <CertificatePreview
        courseName="Smart Budgeting Basics"
        studentName="John Smith"
        completionDate="January 15, 2025"
      />
    </div>
  )
}
