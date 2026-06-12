import { AlertCircle } from "lucide-react";

export const ValidationAlert = ({ errors, hasNoAddress, selectedRate, isValid }: any) => {
  if (isValid && selectedRate && !hasNoAddress) return null;

  // A MUDANÇA ESTÁ AQUI: Extraímos apenas as mensagens como strings
  const errorMessages = Object.entries(errors).map(([key, value]: [string, any]) => {
    return value.message || `${key} é inválido`;
  });

  return (
    <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg text-sm text-destructive space-y-2">
      <p className="font-bold flex items-center gap-2">
        <AlertCircle size={16} /> Verifique os dados:
      </p>
      
      <ul className="list-disc list-inside opacity-90 text-xs space-y-1">
        {hasNoAddress && <li>Nenhum endereço cadastrado.</li>}
        {!selectedRate && <li>Selecione uma opção de frete.</li>}
        
        {/* Agora renderizamos uma lista de strings puras */}
        {errorMessages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};