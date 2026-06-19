
import { productClient } from "./client";
import type { RagAnswer, SemanticSearchResult } from "@/types";

export const searchApi = {
  // Pelny RAG: pytanie w jezyku naturalnym -> odpowiedz LLM + produkty-zrodla
  ask: (question: string) =>
    productClient
      .get<RagAnswer>("/api/v1/search/ask", { params: { question } })
      .then((r) => r.data),

  // Samo "R" z RAG: lista najpodobniejszych produktow bez generacji LLM
  semantic: (query: string, topK = 4, maxPrice?: number) =>
    productClient
      .get<SemanticSearchResult[]>("/api/v1/search/semantic", {
        params: { query, topK, maxPrice },
      })
      .then((r) => r.data),
};
