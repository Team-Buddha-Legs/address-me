export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
        <div className="max-w-2xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
