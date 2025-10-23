import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  ar: {
    "app.title": "المعلّم الذكي",
    "app.subtitle": "منصة قطر للتعليم",
    "nav.dashboard": "لوحة التحكم",
    "nav.lessons": "خطط الدروس",
    "nav.questions": "بنك الأسئلة",
    "nav.assessments": "التقييمات",
    "nav.games": "الألعاب التعليمية",
    "nav.analytics": "التحليلات",
    "nav.admin": "الإدارة",
    "nav.settings": "الإعدادات",
    "nav.logout": "تسجيل الخروج",
    "dashboard.welcome": "مرحباً بك",
    "dashboard.lessons": "خطط الدروس",
    "dashboard.questions": "الأسئلة",
    "dashboard.assessments": "التقييمات",
    "dashboard.games": "الألعاب",
    "button.create": "إنشاء جديد",
    "button.edit": "تعديل",
    "button.delete": "حذف",
    "button.save": "حفظ",
    "button.cancel": "إلغاء",
    "button.submit": "إرسال",
    "lesson.title": "عنوان الدرس",
    "lesson.subject": "المادة",
    "lesson.grade": "الصف",
    "lesson.unit": "الوحدة",
    "lesson.topic": "الموضوع",
    "lesson.objectives": "الأهداف التعليمية",
    "lesson.duration": "المدة الزمنية",
    "lesson.materials": "المواد والموارد",
    "lesson.vocabulary": "المفردات",
    "lesson.assessment": "التقييم",
    "lesson.differentiation": "التمايز",
    "lesson.homework": "الواجب المنزلي",
    "lesson.reflection": "الانعكاس",
    "lesson.status": "الحالة",
    "lesson.draft": "مسودة",
    "lesson.published": "منشور",
    "lesson.archived": "مؤرشف",
    "form.required": "مطلوب",
    "form.optional": "اختياري",
    "error.unauthorized": "غير مصرح لك بالوصول",
    "error.notfound": "لم يتم العثور على الموارد",
    "success.created": "تم الإنشاء بنجاح",
    "success.updated": "تم التحديث بنجاح",
    "success.deleted": "تم الحذف بنجاح",
  },
  en: {
    "app.title": "Smart Teacher",
    "app.subtitle": "Qatar Education Platform",
    "nav.dashboard": "Dashboard",
    "nav.lessons": "Lesson Plans",
    "nav.questions": "Question Bank",
    "nav.assessments": "Assessments",
    "nav.games": "Learning Games",
    "nav.analytics": "Analytics",
    "nav.admin": "Administration",
    "nav.settings": "Settings",
    "nav.logout": "Logout",
    "dashboard.welcome": "Welcome",
    "dashboard.lessons": "Lesson Plans",
    "dashboard.questions": "Questions",
    "dashboard.assessments": "Assessments",
    "dashboard.games": "Games",
    "button.create": "Create New",
    "button.edit": "Edit",
    "button.delete": "Delete",
    "button.save": "Save",
    "button.cancel": "Cancel",
    "button.submit": "Submit",
    "lesson.title": "Lesson Title",
    "lesson.subject": "Subject",
    "lesson.grade": "Grade",
    "lesson.unit": "Unit",
    "lesson.topic": "Topic",
    "lesson.objectives": "Learning Objectives",
    "lesson.duration": "Duration",
    "lesson.materials": "Materials & Resources",
    "lesson.vocabulary": "Vocabulary",
    "lesson.assessment": "Assessment",
    "lesson.differentiation": "Differentiation",
    "lesson.homework": "Homework",
    "lesson.reflection": "Reflection",
    "lesson.status": "Status",
    "lesson.draft": "Draft",
    "lesson.published": "Published",
    "lesson.archived": "Archived",
    "form.required": "Required",
    "form.optional": "Optional",
    "error.unauthorized": "You are not authorized to access this resource",
    "error.notfound": "Resource not found",
    "success.created": "Created successfully",
    "success.updated": "Updated successfully",
    "success.deleted": "Deleted successfully",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar");

  // Set HTML lang and dir attributes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    isRTL: language === "ar",
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

