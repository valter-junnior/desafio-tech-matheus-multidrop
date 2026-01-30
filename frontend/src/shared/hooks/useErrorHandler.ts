import { useCallback } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface ErrorResponse {
  message?: string;
  error?: string;
}

export function useErrorHandler() {
  const handleError = useCallback((error: unknown, defaultMessage?: string) => {
    let errorMessage = defaultMessage || "Ocorreu um erro inesperado";

    if (error instanceof AxiosError) {
      const data = error.response?.data as ErrorResponse;
      errorMessage = data?.message || data?.error || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Apenas em desenvolvimento
    if (import.meta.env.DEV) {
      console.error("Error:", error);
    }

    toast.error(errorMessage);
    return errorMessage;
  }, []);

  const handleSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  return { handleError, handleSuccess };
}
