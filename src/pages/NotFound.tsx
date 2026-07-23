import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <main className="message-page">
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link to="/">Return to employee data</Link>
    </main>
  );
}
