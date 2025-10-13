import { headers } from "next/headers";
import ManagePostsClient from "@/components/post/ManagePostsClient";

export default async function ManagePostsPage({
  searchParams,
}: {
  searchParams?: { page?: string; limit?: string };
}) {
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") || hdrs.get("host");
  const protocol =
    hdrs.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "production" ? "https" : "http");
  const cookie = hdrs.get("cookie");

  const page = Math.max(parseInt(searchParams?.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(searchParams?.limit || "12", 10), 1), 50);

  const url = new URL(`${protocol}://${host}/api/posts/mine`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      ...(cookie && { cookie }),
    },
  });

  if (res.status === 401) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">Please sign in to manage your posts.</div>
    );
  }
  if (!res.ok) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">Failed to load your posts.</div>
    );
  }

  const { data, pagination } = await res.json();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-1">Manage Posts</h1>
          <p className="text-sm text-neutral-600">
            {pagination.total} {pagination.total === 1 ? "post" : "posts"} · Page {pagination.page} of {pagination.totalPages}
          </p>
        </div>
        <a
          href="/post/create-post"
          className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2.5 rounded-lg font-medium transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </a>
      </div>

      {/* Posts List */}
      <ManagePostsClient initialData={data} />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6 border-t border-neutral-200">
          <a
            href={`/manage-posts?page=${Math.max(1, pagination.page - 1)}&limit=${limit}`}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg border transition-all duration-200 ${
              pagination.page <= 1
                ? "pointer-events-none opacity-40 bg-neutral-50 text-neutral-400 border-neutral-200"
                : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400"
            }`}
            aria-disabled={pagination.page <= 1}
          >
            ← Previous
          </a>
          <span className="text-sm font-medium text-neutral-600 px-4">
            {pagination.page} / {pagination.totalPages}
          </span>
          <a
            href={`/manage-posts?page=${Math.min(pagination.totalPages, pagination.page + 1)}&limit=${limit}`}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg border transition-all duration-200 ${
              pagination.page >= pagination.totalPages
                ? "pointer-events-none opacity-40 bg-neutral-50 text-neutral-400 border-neutral-200"
                : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400"
            }`}
            aria-disabled={pagination.page >= pagination.totalPages}
          >
            Next →
          </a>
        </div>
      )}
    </div>
  );
}
