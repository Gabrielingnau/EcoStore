"use client";

import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Star, Trash2, Edit2, X } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import type { Database } from "@/types/database";
import { upsertReview, deleteReview } from "./actions/upsert-review";
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

  // Encontra a avaliação do usuário logado
  const userReview = initialReviews.find((r) => r.user_id === user?.id);

  const [isEditing, setIsEditing] = React.useState(false);
  const [rating, setRating] = React.useState(userReview?.rating || 0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [comment, setComment] = React.useState(userReview?.comment || "");
  const [loading, setLoading] = React.useState(false);

  // Atualiza estados quando a avaliação inicial carregar
  React.useEffect(() => {
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment);
    }
  }, [userReview]);

  const handleSubmit = async () => {
    if (!user) return;
    if (rating === 0 || !comment.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);
      await upsertReview({
        product_id: productId,
        user_id: user.id,
        rating,
        comment: comment.trim(),
      });
      
      setIsEditing(false);
      router.refresh();
      toast.success(userReview ? "Avaliação atualizada" : "Avaliação publicada");
    } catch (error) {
      toast.error("Erro ao salvar avaliação");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userReview) return;
    try {
      setLoading(true);
      await deleteReview(userReview.id, productId);
      setRating(0);
      setComment("");
      setIsEditing(false);
      router.refresh();
      toast.success("Avaliação removida");
    } catch (error) {
      toast.error("Erro ao excluir");
    } finally {
      setLoading(false);
    }
  };

  const avg = initialReviews.length
    ? initialReviews.reduce((a, r) => a + r.rating, 0) / initialReviews.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Avaliações</h2>
        {initialReviews.length > 0 && (
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-primary text-primary" />
            <span className="font-bold">{avg.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({initialReviews.length})</span>
          </div>
        )}
      </div>

      {user && (
        <div className="rounded-lg border bg-card p-5 space-y-4 shadow-sm">
          {userReview && !isEditing ? (
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold mb-1">Sua avaliação:</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={`h-4 w-4 ${n <= userReview.rating ? "fill-primary text-primary" : "text-muted"}`} />
                  ))}
                </div>
                <p className="text-sm mt-2 text-muted-foreground">{userReview.comment}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}><Edit2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)} onMouseEnter={() => setHoverRating(n)} onMouseLeave={() => setHoverRating(0)}>
                    <Star className={`h-6 w-6 transition-colors ${n <= (hoverRating || rating) ? "fill-primary text-primary" : "text-muted fill-transparent"}`} />
                  </button>
                ))}
              </div>
              <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Compartilhe sua experiência..." className="min-h-[100px]" />
              <div className="flex gap-2">
                <Button onClick={handleSubmit} disabled={loading || rating === 0}>{loading ? "Salvando..." : "Publicar"}</Button>
                {userReview && <Button variant="outline" onClick={() => setIsEditing(false)}><X className="h-4 w-4 mr-2" /> Cancelar</Button>}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        {initialReviews.filter(r => r.user_id !== user?.id).map((r) => (
          <div key={r.id} className="rounded-lg border p-4 bg-card">
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className={`h-4 w-4 ${n <= r.rating ? "fill-primary text-primary" : "text-muted"}`} />
              ))}
            </div>
            <p className="text-sm">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}