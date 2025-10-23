import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";

/**
 * Home page - Landing page for unauthenticated users,
 * redirects to dashboard for authenticated users
 */
export default function Home() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user && !loading) {
      setLocation("/dashboard");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#8A1538] to-[#6B0F2B]">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8A1538] via-[#6B0F2B] to-[#4A0820]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {APP_LOGO && (
            <img src={APP_LOGO} alt="Logo" className="w-10 h-10 rounded" />
          )}
          <h1 className="text-2xl font-bold text-white">{APP_TITLE}</h1>
        </div>
        <Button
          onClick={() => (window.location.href = getLoginUrl())}
          className="bg-[#C9A646] text-[#8A1538] hover:bg-[#B8952F]"
        >
          Sign In
        </Button>
      </nav>

      {/* Hero Section */}
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Content */}
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              المعلّم الذكي
              <br />
              <span className="text-[#C9A646]">Smart Teacher</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
              Professional lesson planning and educational content creation
              platform aligned with Qatar Ministry of Education standards
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 my-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Structured Lesson Plans
              </h3>
              <p className="text-gray-300">
                Create Qatar-MoE aligned lesson plans with AI assistance
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-4xl mb-4">❓</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Question Bank
              </h3>
              <p className="text-gray-300">
                Build comprehensive assessments with multiple item types
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Interactive Games
              </h3>
              <p className="text-gray-300">
                Design engaging learning games with SCORM export
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Analytics
              </h3>
              <p className="text-gray-300">
                Track content creation and usage metrics
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              size="lg"
              className="bg-[#C9A646] text-[#8A1538] hover:bg-[#B8952F] text-lg px-8"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 text-lg px-8"
            >
              Learn More
            </Button>
          </div>

          {/* Footer */}
          <div className="pt-12 border-t border-white/20 text-gray-300 text-sm">
            <p>
              Empowering educators with AI-driven tools for Qatar education
            </p>
            <p className="mt-2">
              © 2025 Smart Teacher. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

