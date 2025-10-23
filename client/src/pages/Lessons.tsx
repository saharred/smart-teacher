import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Trash2, Edit, Eye } from "lucide-react";

export default function Lessons() {
  const { t, isRTL } = useLanguage();
  const { data: lessons, isLoading, refetch } = trpc.lessons.list.useQuery();
  const deleteMutation = trpc.lessons.delete.useMutation({
    onSuccess: () => refetch(),
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("nav.lessons")}
            </h1>
            <p className="text-gray-600 mt-1">
              Create and manage your lesson plans
            </p>
          </div>
          <Link href="/lessons/create">
            <a>
              <Button className="bg-[#8A1538] hover:bg-[#6B0F2B]">
                {t("button.create")}
              </Button>
            </a>
          </Link>
        </div>

        {/* Lessons List */}
        {lessons && lessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((lesson) => (
              <Card
                key={lesson.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`flex items-start justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {isRTL ? lesson.titleAr : lesson.titleEn}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {isRTL ? lesson.topicAr : lesson.topicEn}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      lesson.status === "published"
                        ? "bg-green-100 text-green-800"
                        : lesson.status === "draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {lesson.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <p>Grade: {lesson.gradeId}</p>
                  <p>Subject: {lesson.subjectId}</p>
                  <p>Duration: {lesson.totalDuration} minutes</p>
                </div>

                <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Link href={`/lessons/${lesson.id}`}>
                    <a>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye size={16} className={isRTL ? "ml-2" : "mr-2"} />
                        {t("button.edit")}
                      </Button>
                    </a>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete this lesson?"
                        )
                      ) {
                        deleteMutation.mutate({ id: lesson.id });
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              No lesson plans yet. Create your first one!
            </p>
            <Link href="/lessons/create">
              <a>
                <Button className="bg-[#8A1538] hover:bg-[#6B0F2B]">
                  {t("button.create")} {t("nav.lessons")}
                </Button>
              </a>
            </Link>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

