import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center text-white">
      <span className="font-mono text-sm text-ocean-300">404</span>
      <h1 className="mt-4 font-display text-4xl font-medium sm:text-5xl">
        This line doesn&apos;t connect to anything.
      </h1>
      <p className="mt-4 max-w-md text-slate-400">
        The page you&apos;re looking for may have moved. Head back to the homepage to keep exploring.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/">Back to Home</Link>
      </Button>
    </section>
  );
}
