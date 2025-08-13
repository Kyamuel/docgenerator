'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProgressPage() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/progress/summary`)
      .then(r => r.json())
      .then(setSummary)
      .catch(console.error);
  }, []);

  const data = (summary?.recent || []).map((a: any, i: number) => ({ idx: summary.recent.length - i, score: a.score || 0 }));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Progress</h2>
      <div className="rounded border bg-white p-4">
        <div className="text-sm text-slate-600">Accuracy: {summary?.accuracy ?? 0}% • Attempts: {summary?.totalAttempts ?? 0}</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="idx" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}