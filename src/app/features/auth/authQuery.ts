import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Ipermisson } from "interfaces";

// URL الأساسي الذي يتم توجيه الطلبات إليه
const BASE_URL = '/api'; // مهم جدًا لأنه هو ما يتم عمل proxy عليه

// واجهة الاستجابة المتوقعة من الخادم
interface Ires {
  code: number;
  data: {
    permissions: Ipermisson[];
    email: string;
    id: number;
    name: string;
  };
  status: boolean;
  token: string;
}

// دالة `baseQuery` المعدلة مع إضافة سجل للخطأ للتحقق من الاستجابة
const baseQueryWithLogging = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
  const result = await fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set('Content-Type', 'application/json');

      return headers;
    },
  })(args, api, extraOptions);

  // طباعة الاستجابة الخام للتحقق من النوع
  console.log("Raw Response:", result);
  
  // إذا كانت الاستجابة HTML بدلاً من JSON، نطبع رسالة تنبيهية
  if (result.error && result.error.status === 200 && typeof result.error.data === 'string' && result.error.data.includes("<html")) {
    console.error("تم تلقي استجابة HTML بدلاً من JSON. ربما صفحة خطأ.");
  }

  return result;
};

// إعدادات API مع التعامل مع الأخطاء
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithLogging, // استخدام `baseQueryWithLogging` المعدل
  endpoints: (builder) => ({
    // نقطة النهاية لتسجيل الدخول
    login: builder.mutation<Ires, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: "/admin/login",
        method: "POST",
        body: { email, password },
      }),
      transformResponse: (response: unknown): Ires => {
        // إذا كانت الاستجابة على شكل HTML، نرمي خطأ
        if (typeof response === "string" && response.includes("<html")) {
          throw new Error("تم تلقي استجابة HTML بدلاً من JSON.");
        }
        // تحويل الاستجابة إلى النوع الصحيح
        return response as Ires; // نُحوّل الاستجابة إلى النوع Ires
      },
    }),
  }),
});

// تصدير `useLoginMutation` لاستخدامها في المكونات
export const { useLoginMutation } = authApi;
