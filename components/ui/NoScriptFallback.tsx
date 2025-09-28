import Link from "next/link";

export default function NoScriptFallback() {
  return (
    <>
      <noscript>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              JavaScript Required
            </h1>

            <p className="text-gray-600 mb-6">
              Address Me requires JavaScript to provide the interactive assessment experience. 
              Please enable JavaScript in your browser to continue with the personalized Policy Address summary.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-3">How to enable JavaScript:</h3>
              <ul className="text-sm text-gray-600 text-left space-y-2">
                <li>• <strong>Chrome/Edge:</strong> Settings → Privacy and security → Site settings → JavaScript</li>
                <li>• <strong>Firefox:</strong> about:config → javascript.enabled → true</li>
                <li>• <strong>Safari:</strong> Preferences → Security → Enable JavaScript</li>
                <li>• <strong>Mobile browsers:</strong> Usually enabled by default</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">What you're missing without JavaScript:</h3>
              <ul className="text-sm text-gray-600 text-left space-y-1">
                <li>• Interactive multi-step assessment form</li>
                <li>• Real-time form validation and progress tracking</li>
                <li>• Smooth animations and transitions</li>
                <li>• AI-powered personalized summary generation</li>
                <li>• PDF download functionality</li>
                <li>• Mobile-optimized responsive experience</li>
              </ul>
            </div>

            <div className="space-y-4">
              <a
                href="/"
                className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                onClick="window.location.reload()"
              >
                Refresh Page
              </a>

              <Link
                href="/"
                className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Go Home
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                For the best experience, we recommend using a modern browser with JavaScript enabled.
                Address Me is designed as a progressive web application that requires JavaScript for core functionality.
              </p>
            </div>

            <div className="mt-4 p-4 bg-orange-50 rounded-lg">
              <p className="text-xs text-orange-700">
                <strong>Alternative:</strong> If you cannot enable JavaScript, please contact our support team 
                for assistance with accessing Hong Kong Policy Address information through alternative means.
              </p>
            </div>
          </div>
        </div>
      </noscript>
    </>
  );
}