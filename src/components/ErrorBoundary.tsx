"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 p-8 font-mono text-red-900">
          <h1 className="text-2xl font-bold mb-4">Error en el Panel de Admin</h1>
          <p className="mb-2 font-semibold">{this.state.error?.message}</p>
          <pre className="bg-white p-4 rounded border border-red-200 overflow-auto text-sm whitespace-pre-wrap">
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-red-600 text-white rounded"
          >
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
