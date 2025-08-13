'use client';

const plans = [
  { name: 'Free', price: '$0', features: ['5 problems/day', 'Basic K-12'], key: 'FREE' },
  { name: 'Basic', price: '$8/mo', features: ['Unlimited problems', 'Full AI tutor'], key: 'BASIC' },
  { name: 'Premium', price: '$15/mo', features: ['K-12 + University', 'Socratic mode', 'Videos'], key: 'PREMIUM' },
  { name: 'Family', price: '$25/mo', features: ['All features', 'Up to 6 accounts'], key: 'FAMILY' },
];

export default function SubscriptionPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Subscription</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {plans.map(p => (
          <div key={p.key} className="rounded border bg-white p-4">
            <div className="text-lg font-semibold">{p.name}</div>
            <div className="text-primary-600">{p.price}</div>
            <ul className="mt-2 text-sm list-disc pl-4">
              {p.features.map(f => <li key={f}>{f}</li>)}
            </ul>
            <button className="mt-3 w-full rounded bg-primary-500 py-2 text-white">Select</button>
          </div>
        ))}
      </div>
    </div>
  );
}