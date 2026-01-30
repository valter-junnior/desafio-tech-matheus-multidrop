import { Component, type ErrorInfo, type ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Em produção, enviar para serviço de logging (Sentry, etc)
    if (import.meta.env.DEV) {
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Oops! Algo deu errado</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-4">
                Ocorreu um erro inesperado. Por favor, tente novamente.
              </p>
              {import.meta.env.DEV && this.state.error && (
                <pre className="text-xs bg-red-50 p-2 rounded mb-4 overflow-auto">
                  {this.state.error.message}
                </pre>
              )}
              <Button onClick={this.handleReset} variant="outline">
                Voltar para início
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
