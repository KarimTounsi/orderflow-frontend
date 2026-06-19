"use client";


import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { searchApi } from "@/lib/api/search";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2 } from "lucide-react";

export function AiAssistant() {
  const [question, setQuestion] = useState("");

  const ask = useMutation({
    mutationFn: (q: string) => searchApi.ask(q),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = question.trim();
    if (q.length > 0 && !ask.isPending) {
      ask.mutate(q);
    }
  };

  const isDisabled =
    ask.isError && isAxiosError(ask.error) && ask.error.response?.status === 503;

  return (
    <div className="rounded-xl border bg-card p-4 flex flex-col gap-3">
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Ask AI... e.g. what should I get for a home gym?"
            className="pl-9"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={ask.isPending}
          />
        </div>
        <Button type="submit" disabled={ask.isPending || question.trim().length === 0}>
          {ask.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking...
            </>
          ) : (
            "Ask AI"
          )}
        </Button>
      </form>

      {isDisabled && (
        <p className="text-sm text-muted-foreground">
          AI assistant is not enabled on the backend (RAG feature flag is off).
        </p>
      )}

      {ask.isError && !isDisabled && (
        <p className="text-sm text-destructive">
          Something went wrong while asking the assistant. Please try again.
        </p>
      )}

      {ask.data && (
        <div className="flex flex-col gap-3">
          <p className="text-sm leading-relaxed">{ask.data.answer}</p>

          {ask.data.sources.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Based on:</span>
              {ask.data.sources.map((source) => (
                <Link key={source.productId} href={`/products/${source.productId}`}>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                  >
                    {source.name}
                    <span className="ml-1 text-muted-foreground">
                      {Math.round(source.score * 100)}%
                    </span>
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
