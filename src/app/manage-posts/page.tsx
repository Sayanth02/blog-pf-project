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
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Manage Posts</h1>
        <span className="text-sm text-neutral-600">
          Page {pagination.page} of {pagination.totalPages} · {pagination.total} total
        </span>
      </div>

      <ManagePostsClient initialData={data} />

      <div className="flex items-center justify-between pt-4">
        <a
          href={`/manage-posts?page=${Math.max(1, pagination.page - 1)}&limit=${limit}`}
          className={`px-3 py-2 text-sm rounded border ${pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}`}
          aria-disabled={pagination.page <= 1}
        >
          Previous
        </a>
        <a
          href={`/manage-posts?page=${Math.min(pagination.totalPages, pagination.page + 1)}&limit=${limit}`}
          className={`px-3 py-2 text-sm rounded border ${pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}`}
          aria-disabled={pagination.page >= pagination.totalPages}
        >
          Next
        </a>
      </div>
    </div>
  );
}
