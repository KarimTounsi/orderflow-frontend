import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-auto">
      <div className="container mx-auto max-w-6xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-white/10 flex items-center justify-center">
            <Zap className="h-3 w-3 text-white/50" />
          </div>
          <span className="font-medium text-white/50">OrderFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Spring Boot 4</span>
          <span className="text-white/10">·</span>
          <span>Apache Kafka</span>
          <span className="text-white/10">·</span>
          <span>Next.js 16</span>
          <span className="text-white/10">·</span>
          <span>Vercel</span>
        </div>
      </div>
    </footer>
  );
}
