

import React, { Component, ErrorInfo, ReactNode } from "react";
import GlassCard from './GlassCard';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-13rem)] text-center p-4">
            <GlassCard className="max-w-xl w-full">
                <div className="flex flex-col items-center justify-center">
                    <svg className="w-20 h-20 text-status-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h1 className="text-3xl text-red-300 font-bold mt-6">An Unexpected Error Occurred</h1>
                    <p className="text-gray-300 mt-4 max-w-md">
                        We're sorry, but something went wrong. Our team has been notified.
                        Please refresh the page to try again.
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="btn-primary mt-8"
                    >
                      Refresh Page
                    </button>
                </div>
            </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;