import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Application error:", error, errorInfo);
  }
  render() {
    return this.state.hasError ? (
      <main className="message-page">
        <h1>Something went wrong</h1>
        <p>Please refresh the page and try again.</p>
        <button onClick={() => this.setState({ hasError: false })}>
          Try again
        </button>
      </main>
    ) : (
      this.props.children
    );
  }
}
