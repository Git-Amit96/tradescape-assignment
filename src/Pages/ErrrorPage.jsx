import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-8xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-400 mb-6">
          Oops! We can’t find the page you’re looking for.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-white text-black font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-all"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;