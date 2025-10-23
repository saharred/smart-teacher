import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";

export default function Dashboard() {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const { data: summary, isLoading } = trpc.analytics.getSummary.useQuery();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      label: t("dashboard.lessons"),
      value: summary?.lessonsCount || 0,
      icon: "📝",
      color: "from-blue-500 to-blue-600",
      href: "/lessons",
    },
    {
      label: t("dashboard.questions"),
      value: summary?.questionsCount || 0,
      icon: "❓",
      color: "from-green-500 to-green-600",
      href: "/questions",
    },
    {
      label: t("dashboard.assessments"),
      value: summary?.assessmentsCount || 0,
      icon: "✅",
      color: "from-purple-500 to-purple-600",
      href: "/assessments",
    },
    {
      label: t("dashboard.games"),
      value: summary?.gamesCount || 0,
      icon: "🎮",
      color: "from-orange-500 to-orange-600",
      href: "/games",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("dashboard.welcome")}, {user?.name || "User"}!
            </h1>
            <p className="text-gray-600 mt-2">{t("app.subtitle")}</p>
          </div>
          <Link href="/lessons/create">
            <a>
              <Button className="bg-[#8A1538] hover:bg-[#6B0F2B]">
                {t("button.create")} {t("nav.lessons")}
              </Button>
            </a>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link key={stat.href} href={stat.href}>
              <a>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div className="text-4xl">{stat.icon}</div>
                  </div>
                </Card>
              </a>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-br from-[#8A1538] to-[#6B0F2B] text-white">
            <h3 className="text-xl font-bold mb-4">{t("nav.lessons")}</h3>
            <p className="text-gray-200 mb-4">
              Create structured lesson plans aligned with Qatar MoE standards
            </p>
            <Link href="/lessons">
              <a>
                <Button variant="secondary" className="w-full">
                  {t("button.create")}
                </Button>
              </a>
            </Link>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#C9A646] to-[#A67F3A] text-white">
            <h3 className="text-xl font-bold mb-4">{t("nav.questions")}</h3>
            <p className="text-gray-200 mb-4">
              Build comprehensive question banks with multiple item types
            </p>
            <Link href="/questions">
              <a>
                <Button variant="secondary" className="w-full">
                  {t("button.create")}
                </Button>
              </a>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">{t("nav.analytics")}</h3>
          <p className="text-gray-600">
            Track your content creation and usage analytics
          </p>
          <Link href="/analytics">
            <a>
              <Button variant="outline" className="mt-4">
                View Analytics
              </Button>
            </a>
          </Link>
        </Card>
      </div>
    </DashboardLayout>
  );
}

