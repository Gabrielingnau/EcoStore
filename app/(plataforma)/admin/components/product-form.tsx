"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { X, Check, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { 
  productFormSchema, 
  step1Schema, 
  step2Schema, 
  step3Schema, 
  step4Schema, 
  step5Schema, 
  type FormDataState, 
  type ProductRow 
} from "../types/admin-types";
import { useAdminProduct } from "../hooks/use-admin-product";

// Sub-etapas
import { StepBasicInfo } from "./steps/step-basic-info";
import { StepVariants } from "./steps/step-variants";
import { StepSizesSku } from "./steps/step-sizes-sku";
import { StepDescriptionLogistics } from "./steps/step-description-logistics";
import { StepPricingWarranty } from "./steps/step-pricing-warranty";

interface ProductFormProps {
  product: ProductRow | null;
  onClose: () => void;
  onSaved: () => void;
}

const STEPS = [
  { id: 1, label: "Informações básicas" },
  { id: 2, label: "Cores e fotos" },
  { id: 3, label: "Tamanhos e SKU" },
  { id: 4, label: "Descrição e logística" },
  { id: 5, label: "Preço e garantia" },
];

export function ProductForm(props: ProductFormProps) {
  const { onClose, product, onSaved } = props;
  const [currentStep, setCurrentStep] = useState(1);

  const { initialValues, saving, isEdit, handleSaveSubmit } = useAdminProduct(product, onSaved);

  const methods = useForm<FormDataState>({
    resolver: yupResolver(productFormSchema) as any,
    defaultValues: initialValues,
    values: initialValues,
    mode: "onSubmit",
  });

  const { handleSubmit, trigger } = methods;

  // Validação modularizada por etapa utilizando os schemas individuais do Yup
  const handleNext = async () => {
    let isValid = true;
    let currentSchema;

    if (currentStep === 1) currentSchema = step1Schema;
    else if (currentStep === 2) currentSchema = step2Schema;
    else if (currentStep === 3) currentSchema = step3Schema;
    else if (currentStep === 4) currentSchema = step4Schema;
    else if (currentStep === 5) currentSchema = step5Schema;

    if (currentSchema) {
      try {
        const formData = methods.getValues();
        await currentSchema.validate(formData, { abortEarly: false });
        isValid = true;
        methods.clearErrors();
      } catch (err: any) {
        isValid = false;
        if (err.inner) {
          err.inner.forEach((error: any) => {
            if (error.path) {
              methods.setError(error.path, {
                type: "manual",
                message: error.message,
              });
            }
          });
        }
      }
    }

    // --- LOGS DE DIAGNÓSTICO ---
    console.group(`🔍 Validação da Etapa ${currentStep}`);
    console.log("O formulário passou na validação da etapa?", isValid);
    console.log("Erros atuais capturados pelo Yup/RHF:", methods.formState.errors);
    console.groupEnd();
    // ---------------------------

    if (isValid && currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = (data: FormDataState) => {
    handleSaveSubmit(data);
  };

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-lg animate-fade-in w-full mx-auto">
      <CardHeader className="border-b border-border/50 pb-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-xl font-bold text-foreground">
            {isEdit ? "Editar produto" : "Novo produto"}
          </CardTitle>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 transition-colors"
            disabled={saving}
          >
            <X className="h-4 w-4" /> cancelar
          </button>
        </div>

        {/* Stepper Header Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isPassed = currentStep > step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={async () => {
                  if (step.id < currentStep) {
                    setCurrentStep(step.id);
                  } else if (step.id > currentStep) {
                    const isValid = await trigger();
                    if (isValid) setCurrentStep(step.id);
                  }
                }}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 border",
                  isActive && "bg-primary text-primary-foreground border-primary shadow-sm",
                  isPassed && "bg-secondary/80 text-foreground border-border/80",
                  !isActive && !isPassed && "bg-muted/40 text-muted-foreground border-border/40 hover:bg-muted"
                )}
              >
                {isPassed ? <Check className="h-3.5 w-3.5 text-primary" /> : <span>{step.id}.</span>}
                {step.label}
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <FormProvider {...methods}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {currentStep === 1 && <StepBasicInfo />}
            {currentStep === 2 && <StepVariants />}
            {currentStep === 3 && <StepSizesSku />}
            {currentStep === 4 && <StepDescriptionLogistics />}
            {currentStep === 5 && <StepPricingWarranty />}

            {/* Rodapé com Botões de Navegação */}
            <div className="flex items-center justify-between pt-6 border-t border-border/50">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  className="rounded-xl h-11 px-5 gap-2 border-border"
                >
                  <ChevronLeft className="h-4 w-4" /> Voltar
                </Button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Etapa {currentStep} de 5</span>
                {currentStep < 5 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="rounded-xl h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 shadow-sm"
                  >
                    Continuar <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={saving}
                    onClick={handleSubmit(onSubmit)}
                    className="rounded-xl h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm"
                  >
                    {saving ? "Salvando..." : "Salvar alterações"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}