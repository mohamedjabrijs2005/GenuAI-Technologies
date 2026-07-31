/**
 * AIMockInterview page — placeholder component.
 * Replace with full implementation when ready.
 */
interface Props {
  user: any;
  onBack: () => void;
}

export default function AIMockInterview({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-black text-on-surface">AI Mock Interview</h1>
      <p className="text-on-surface-variant text-lg">This module is coming soon.</p>
      <button
        onClick={onBack}
        className="px-6 py-3 rounded-xl bg-indigo-brand text-white font-bold hover:opacity-90 transition-opacity"
      >
        ← Go Back
      </button>
    </div>
  );
}
