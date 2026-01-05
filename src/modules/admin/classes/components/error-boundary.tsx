import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ClassErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-destructive">
                  Error en el formulario de clases
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ha ocurrido un error inesperado al cargar el formulario de clases. 
              Esto puede deberse a un problema temporal con la carga de datos.
            </p>
            
            {this.state.error && (
              <details className="text-xs text-muted-foreground bg-muted p-3 rounded">
                <summary className="cursor-pointer font-medium mb-2">
                  Detalles del error
                </summary>
                <pre className="whitespace-pre-wrap">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            
            <div className="flex gap-3">
              <Button 
                onClick={this.handleReset}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reintentar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Recargar página
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ClassErrorBoundary;
