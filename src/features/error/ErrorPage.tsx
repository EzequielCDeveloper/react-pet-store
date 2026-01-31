import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export const ErrorPage = () => {
  const error = useRouteError();
  
  let errorMessage: string;
  let errorTitle = "Oops! Something went wrong";
  let errorCode = "Error";

  if (isRouteErrorResponse(error)) {
    // 404, 401, 503, etc.
    errorCode = error.status.toString();
    errorTitle = error.statusText;
    errorMessage = error.data?.message || "Sorry, an unexpected error has occurred.";
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Unknown error';
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{errorCode}</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{errorTitle}</h2>
        
        <div className="bg-gray-50 p-4 rounded-md mb-8 text-left overflow-auto max-h-40">
          <code className="text-sm text-red-600 font-mono break-words">
            {errorMessage}
          </code>
        </div>

        <Link 
          to="/"
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors w-full"
        >
          <Home className="w-5 h-5" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};
