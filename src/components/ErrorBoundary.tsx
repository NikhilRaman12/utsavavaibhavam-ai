import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Enterprise Production Error Boundary
 * Catches unhandled runtime exceptions in the React tree, renders
 * a graceful recovery UI, and prevents application crashes.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[UtsavaVaibhavam AI ErrorBoundary caught an exception]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-6"
        >
          <div className="max-w-md w-full bg-stone-900 border border-amber-800/40 rounded-2xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-amber-950/60 border border-amber-600/40 rounded-2xl flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-8 h-8" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-serif text-amber-200">
                Resilience Engine Active
              </h2>
              <p className="text-sm text-stone-400">
                An unexpected component rendering state was intercepted. Your event planning data remains preserved in session state.
              </p>
            </div>
            {this.state.error && (
              <pre className="text-xs text-left bg-stone-950 p-3 rounded-lg border border-stone-800 text-stone-400 overflow-x-auto">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm transition-all shadow-lg hover:shadow-amber-600/25 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Reload Workspace
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

