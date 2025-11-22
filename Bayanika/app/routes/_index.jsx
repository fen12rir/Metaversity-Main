import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <nav className="bg-white/80 backdrop-blur-md shadow-md border-b-4 border-indigo-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🤝</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Bayanika
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Turn <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Bayanihan</span> into<br />
            Real Proof of Work
          </h1>
          <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gamify community volunteer work across barangays, schools, and guilds. 
            Earn verifiable on-chain credentials for your contributions.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-200"
            >
              🚀 Start Your Journey
            </Link>
            <Link
              to="/activities"
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg border-2 border-indigo-600 hover:bg-indigo-50 shadow-xl transition-all duration-200"
            >
              📋 View Activities
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Activities</h3>
            <p className="text-gray-600">
              Participate in community events, volunteer work, and social initiatives. Make a real impact in your barangay.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Earn Points</h3>
            <p className="text-gray-600">
              Complete tasks and submit proof of work to earn Bayanihan Points. Redeem them for real rewards in our shop.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Compete & Win</h3>
            <p className="text-gray-600">
              Climb the leaderboard and showcase your community contributions. Get recognized for your Bayanihan spirit!
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-3xl p-12 shadow-2xl mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h4 className="font-bold text-lg mb-2">Sign Up</h4>
              <p className="text-gray-600 text-sm">Create your free account and join the community</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h4 className="font-bold text-lg mb-2">Join Activities</h4>
              <p className="text-gray-600 text-sm">Browse and join community activities that interest you</p>
            </div>

            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pink-600">3</span>
              </div>
              <h4 className="font-bold text-lg mb-2">Submit Proof</h4>
              <p className="text-gray-600 text-sm">Complete tasks and submit proof of your work</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h4 className="font-bold text-lg mb-2">Get Rewarded</h4>
              <p className="text-gray-600 text-sm">Earn points and redeem them for real rewards</p>
            </div>
          </div>
        </div>

        {/* Problem & Solution */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 shadow-xl">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">The Problem</h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="text-2xl mr-3">❌</span>
                <span>Meaningful acts of Bayanihan stay unseen outside immediate circles</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">❌</span>
                <span>No verifiable way to show community work for internships or leadership roles</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">❌</span>
                <span>Volunteers lack recognition and tangible rewards for their efforts</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 shadow-xl">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Solution</h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <span className="text-2xl mr-3">✅</span>
                <span>On-chain proof of work verified on Base blockchain</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">✅</span>
                <span>Verifiable credentials you can showcase anywhere</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">✅</span>
                <span>Real rewards and recognition through gamification</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Filipinos turning their community work into verifiable proof of impact.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-200"
          >
            Get Started for Free →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl">🤝</span>
            <span className="text-2xl font-bold">Bayanika</span>
          </div>
          <p className="text-gray-400 mb-4">
            Gamifying Bayanihan into Real Proof of Work
          </p>
          <p className="text-gray-500 text-sm">
            Built with ❤️ for Filipino communities • Powered by Base & Remix
          </p>
        </div>
      </footer>
    </div>
  );
}
