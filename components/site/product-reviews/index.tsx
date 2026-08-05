"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Edit2, Star, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import type { Database } from "@/types/database";

import { deleteReview, upsertReview } from "./actions/upsert-review";

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

  // Estado para controlar a abertura do modal de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  // Atualiza estados quando a avaliação inicial carregar ou mudar
  React.useEffect(() => {
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment);
    } else {
      setRating(0);
      setComment("");
    }
  }, [userReview]);

  const handleSubmit = async () => {
    if (!user) return;
    if (rating === 0 || !comment.trim()) {
      toast.error("Preencha a nota e o comentário");
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
      toast.success(
        userReview
          ? "Avaliação atualizada com sucesso!"
          : "Avaliação publicada com sucesso!",
      );
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar avaliação");
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
      setIsDeleteModalOpen(false);
      router.refresh();
      toast.success("Avaliação removida com sucesso.");
    } catch (error: any) {
      toast.error(error.message || "Erro ao excluir avaliação");
    } finally {
      setLoading(false);
    }
  };

  const avg = initialReviews.length
    ? initialReviews.reduce((a, r) => a + r.rating, 0) / initialReviews.length
    : 0;

  return (
    <div className="space-y-6 pt-4 border-t">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Avaliações dos Clientes</h2>
        {initialReviews.length > 0 && (
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-bold text-sm">{avg.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">
              ({initialReviews.length}{" "}
              {initialReviews.length === 1 ? "avaliação" : "avaliações"})
            </span>
          </div>
        )}
      </div>

      {/* Bloco de Avaliação do Usuário Logado */}
      {user && (
        <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
          {userReview && !isEditing ? (
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-muted-foreground">
                  Sua avaliação publicada:
                </p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`h-4 w-4 ${n <= userReview.rating ? "fill-primary text-primary" : "text-muted"}`}
                    />
                  ))}
                </div>
                <p className="text-sm mt-2 text-foreground/90 whitespace-pre-line">
                  {userReview.comment}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  title="Editar"
                >
                  <Edit2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDeleteModalOpen(true)}
                  title="Excluir"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  {userReview ? "Editar sua avaliação" : "Deixe sua avaliação"}
                </label>
                <div className="flex items-center gap-1 pt-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                      aria-label={`Avaliar com ${n} estrelas`}
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${n <= (hoverRating || rating) ? "fill-primary text-primary" : "text-muted fill-transparent"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="O que você achou do produto? Compartilhe sua experiência..."
                className="min-h-[100px] rounded-xl resize-none"
              />

              <div className="flex gap-2 justify-end">
                {userReview && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setRating(userReview.rating);
                      setComment(userReview.comment);
                    }}
                    className="rounded-xl"
                  >
                    <X className="h-4 w-4 mr-2" /> Cancelar
                  </Button>
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={loading || rating === 0}
                  className="rounded-xl font-semibold px-5"
                >
                  {loading
                    ? "Salvando..."
                    : userReview
                      ? "Salvar Alterações"
                      : "Publicar Avaliação"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lista de Outras Avaliações */}
      <div className="space-y-3">
        {initialReviews.filter((r) => r.user_id !== user?.id).length === 0 &&
          !userReview && (
            <p className="text-sm text-muted-foreground text-center py-6 bg-muted/20 rounded-xl border border-dashed">
              Este produto ainda não possui avaliações. Seja o primeiro a
              avaliar!
            </p>
          )}

        {initialReviews
          .filter((r) => r.user_id !== user?.id)
          .map((r) => (
            <div
              key={r.id}
              className="rounded-xl border p-4 bg-card shadow-sm space-y-2"
            >
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`h-3.5 w-3.5 ${n <= r.rating ? "fill-primary text-primary" : "text-muted"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-foreground/90 whitespace-pre-line">
                {r.comment}
              </p>
            </div>
          ))}
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO DA AVALIAÇÃO */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader className="space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-xl font-bold">
              Excluir sua avaliação?
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-muted-foreground">
              Tem certeza de que deseja remover sua avaliação deste produto?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2 sm:justify-center pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="flex-1 rounded-xl font-semibold"
              disabled={loading}
              onClick={handleDelete}
            >
              {loading ? "Excluindo..." : "Sim, excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
