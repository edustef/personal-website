import { Suspense } from "react";
import type { Metadata } from "next";
import { AllPosts } from "@/components/Posts";
import { LanguageId } from "@/lib/i18n";

type Props = {
  params: Promise<{ locale: LanguageId }>;
};

export const metadata: Metadata = {
  title: "Blog",
  description: "Read my latest blog posts and articles",
};

export default async function BlogPage(props: Props) {
  const params = await props.params;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-5xl font-bold md:text-6xl lg:text-7xl">
              <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-xl text-gray-600">
              Thoughts, insights, and tutorials
            </p>
          </div>

          <Suspense
            fallback={
              <div className="text-center text-gray-500">Loading posts...</div>
            }
          >
            <AllPosts locale={params.locale} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
