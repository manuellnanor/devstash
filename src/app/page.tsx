import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">DevStash</h1>
        <p className="text-muted-foreground mb-8">
          One fast, searchable, AI-enhanced hub for all your dev knowledge & resources.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
