'use client';
import { useState } from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

export default function PracticePage() {
  const [problem, setProblem] = useState('Solve x + 2 = 5');
  const [mode, setMode] = useState<'standard' | 'socratic'>('standard');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function solve(input?: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/ai/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (window.localStorage.getItem('token') || '') },
        body: JSON.stringify({ problem: input ?? problem, mode }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Practice</h2>
      <div className="flex gap-2">
        <input value={problem} onChange={e => setProblem(e.target.value)} className="flex-1 rounded border px-3 py-2" placeholder="Enter a math problem" />
        <select value={mode} onChange={e => setMode(e.target.value as any)} className="rounded border px-3 py-2">
          <option value="standard">Standard</option>
          <option value="socratic">Socratic</option>
        </select>
        <button onClick={() => solve()} disabled={loading} className="rounded bg-primary-500 px-4 py-2 text-white">{loading ? 'Solving...' : 'Solve'}</button>
      </div>

      {result && (
        <div className="rounded border bg-white p-4 space-y-3">
          <div>
            <h3 className="font-semibold">Steps</h3>
            <div className="space-y-2">
              {(result.steps || []).map((s: string, idx: number) => (
                <BlockMath key={idx}>{s}</BlockMath>
              ))}
            </div>
          </div>
          {result.diagram && (
            <div>
              <h3 className="font-semibold">Diagram</h3>
              <pre className="bg-slate-100 p-2 rounded overflow-x-auto text-xs">{result.diagram}</pre>
            </div>
          )}
          {result.similar_problem && (
            <div className="pt-2">
              <button className="text-primary-600 underline" onClick={() => solve(result.similar_problem)}>Try similar problem</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}