"use client";

import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";
import type { Database } from "@/types/database";

import { createReview } from "./actions/create-review";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export type Review = Database["public"]["Tables"]["reviews"]["Row"];

type Props = {
  productId: string;
  initialReviews: Review[];
};

export function ProductReviews({ productId, initialReviews }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  const [reviews, setReviews] = React.useState<Review[]>(initialReviews);
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [comment, setComment] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const submit = async () => {
    if (!user) {
      toast.error("Faça login para avaliar");
      return;
    }

    if (rating === 0) {
      toast.error("Selecione uma nota");
      return;
    }

    if (!comment.trim()) {
      toast.error("Escreva um comentário");
      return;
    }

    try {
      setLoading(true);

      await createReview({
        product_id: productId,
        user_id: user.id,
        rating,
        comment: comment.trim(),
      });

      const optimisticReview: Review = {
        id: crypto.randomUUID(),
        product_id: productId,
        user_id: user.id,
        rating,
        comment: comment.trim(),
        created_at: new Date().toISOString(),
      };

      setReviews((prev) => [optimisticReview, ...prev]);
      
      setComment("");
      setRating(0);
      router.refresh(); 

      toast.success("Avaliação publicada");
    } catch (error) {
      toast.error("Erro ao publicar avaliação");
    } finally {
      setLoading(false);
    }
  };

  const avg = reviews.length
    ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Avaliações</h2>

        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-primary text-primary" />
            <span className="font-bold">{avg.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({reviews.length})</span>
          </div>
        )}
      </div>

      {user && (
        <div className="rounded-lg border bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => {
              const isFilled = n <= (hoverRating || rating);
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`${n} estrelas`}
                  className="transition-transform active:scale-95 duration-150"
                >
                  <Star
                    className={`h-6 w-6 transition-all duration-150 ${
                      isFilled
                        ? "fill-primary text-primary"
                        : "text-muted fill-transparent hover:text-muted-foreground"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Compartilhe sua experiência..."
            className="min-h-[100px]"
          />

          <Button
            onClick={submit}
            disabled={loading || rating === 0}
            className="font-semibold"
          >
            {loading ? "Enviando..." : "Publicar avaliação"}
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-sm pl-1">Seja o primeiro a avaliar</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="rounded-lg border p-4 bg-card">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`h-4 w-4 ${
                      n <= r.rating
                        ? "fill-primary text-primary"
                        : "text-muted fill-transparent"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed">{r.comment}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(r.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}