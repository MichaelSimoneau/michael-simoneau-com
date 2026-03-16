import React, { Component, ErrorInfo, ReactNode, useEffect } from 'react';
import { useRouteError } from 'react-router-dom';
import { InteractiveButton } from '../ui/buttons/InteractiveButton';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("GlobalErrorBoundary caught an error:", error, errorInfo);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("app:error", {
          detail: {
            message: `${error.name}: ${error.message}`,
          },
        }),
      );
    }

    // Auto-reload for chunk load errors
    if (error.message.includes('Failed to fetch dynamically imported module')) {
      // Check if we already reloaded to prevent infinite loop
      if (!sessionStorage.getItem('retry-chunk-load')) {
        sessionStorage.setItem('retry-chunk-load', 'true');
        window.location.reload();
      }
    }
  }

  handleReload = () => {
    sessionStorage.removeItem('retry-chunk-load');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
          <div className="max-w-md w-full bg-gray-900/80 p-8 rounded-xl border border-gray-800 shadow-2xl backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-cyan-400 mb-4">System Anomaly Detected</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Our quantum-resistant protocols encountered an unexpected fluctuation. 
              The system has been paused to preserve integrity.
            </p>
            {this.state.error && (
               <div className="bg-black/50 p-4 rounded-lg mb-8 text-left overflow-auto max-h-40 border border-gray-800">
                 <p className="text-red-400 font-mono text-xs">{this.state.error.toString()}</p>
               </div>
            )}
            <InteractiveButton 
              text="REINITIALIZE INTERFACE" 
              onClick={this.handleReload}
              className="mx-auto"
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper for usage with React Router's errorElement
export const GlobalErrorElement = () => {
  const error = useRouteError() as unknown as Error;
  useEffect(() => {
    if (typeof window === "undefined" || !error) {
      return;
    }
    window.dispatchEvent(
      new CustomEvent("app:error", {
        detail: { message: `${error.name || "RouteError"}: ${error.message || String(error)}` },
      }),
    );
  }, [error]);
  
  // Reuse logic or simple display if not using the class boundary directly
  // For the router, we can just return the UI directly since the router catches the error
  
  // Check for chunk error here as well just in case
  if (error?.message?.includes('Failed to fetch dynamically imported module')) {
     if (!sessionStorage.getItem('retry-chunk-load')) {
        sessionStorage.setItem('retry-chunk-load', 'true');
        window.location.reload();
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Reloading...</div>;
      }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
          <div className="max-w-md w-full bg-gray-900/80 p-8 rounded-xl border border-gray-800 shadow-2xl backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-cyan-400 mb-4">System Anomaly Detected</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Our quantum-resistant protocols encountered an unexpected fluctuation. 
              The system has been paused to preserve integrity.
            </p>
            {error && (
               <div className="bg-black/50 p-4 rounded-lg mb-8 text-left overflow-auto max-h-40 border border-gray-800">
                 <p className="text-red-400 font-mono text-xs">{error.toString() || error.message}</p>
               </div>
            )}
            <InteractiveButton 
              text="REINITIALIZE INTERFACE" 
              onClick={() => {
                  sessionStorage.removeItem('retry-chunk-load');
                  window.location.reload();
              }}
              className="mx-auto"
            />
          </div>
        </div>
  );
};

export default GlobalErrorBoundary;

