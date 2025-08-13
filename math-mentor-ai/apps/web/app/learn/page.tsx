'use client';
import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function LearnPage() {
  const [difficulty, setDifficulty] = useState<string>('');
  const { data } = useSWR(`/api/lessons${difficulty ? `?difficulty=${difficulty}` : ''}`, fetcher);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Learn</h2>
      <div className="flex gap-2 items-center">
        <label>Difficulty:</label>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="rounded border px-3 py-2">
          <option value="">All</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
          <option value="UNIVERSITY">University</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(data || []).map((t: any) => (
          <div key={t.id} className="rounded border bg-white p-4">
            <div className="font-semibold">{t.title}</div>
            <div className="text-sm text-slate-500">Grades {t.gradeMin}-{t.gradeMax} • {t.difficulty}</div>
            <p className="mt-2 text-sm">{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}