export default function Home() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h1 className="text-3xl font-bold text-primary-600">Welcome to MathMentor AI</h1>
      <p className="max-w-lg">Personalized, age-aware tutoring from elementary to university. Guided solutions, interactive practice, and parental oversight.</p>
      <div className="flex gap-3">
        <a href="/practice" className="rounded bg-primary-500 px-4 py-2 text-white">Try Practice</a>
        <a href="/subscription" className="rounded border border-primary-500 px-4 py-2 text-primary-600">See Plans</a>
      </div>
    </div>
  );
}