import { Link, Form } from "@remix-run/react";

export default function Navigation({ user }) {
  return (
    <nav className="bg-white shadow-md border-b-4 border-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-3xl">🤝</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Bayanika
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/dashboard" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/activities" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              Activities
            </Link>
            <Link 
              to="/shop" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              🏪 Shop
            </Link>
            <Link 
              to="/proof-of-work" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              Proof of Work
            </Link>
            <Link 
              to="/leaderboard" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              🏆 Leaderboard
            </Link>
            
            {user.role === "admin" && (
              <>
                <Link 
                  to="/admin/dashboard" 
                  className="text-purple-700 hover:text-purple-900 font-semibold transition-colors"
                >
                  ⚙️ Admin
                </Link>
                <Link 
                  to="/admin/verify-proof" 
                  className="text-orange-700 hover:text-orange-900 font-semibold transition-colors"
                >
                  ✅ Verify
                </Link>
              </>
            )}
            
            <div className="flex items-center space-x-4 border-l border-gray-300 pl-6">
              <span className="text-gray-700">
                Welcome, <span className="font-semibold">{user.firstName}</span>!
              </span>
              <Link 
                to="/profile" 
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              >
                Profile
              </Link>
              <Form method="post" action="/logout">
                <button
                  type="submit"
                  className="text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Logout
                </button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

