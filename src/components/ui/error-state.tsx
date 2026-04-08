import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Algo deu errado. Tente novamente.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <AlertCircle className="h-12 w-12 text-destructive/50 mx-auto mb-3" />
      <p className="text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
