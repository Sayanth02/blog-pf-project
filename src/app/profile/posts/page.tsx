import { headers } from "next/headers";
import Link from "next/link";
import PostCard from "@/components/post/PostCard";

export default async function MyPostsPage({
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
      <div className="max-w-5xl mx-auto px-4 py-10">Please sign in to view your posts.</div>
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
        <h1 className="text-xl font-semibold">My Posts</h1>
        <span className="text-sm text-neutral-600">
          Page {pagination.page} of {pagination.totalPages} · {pagination.total} total
        </span>
      </div>

      {data?.length === 0 ? (
        <div className="text-neutral-600">You haven't written any posts yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((post: any) => (
            <Link key={post._id} href={`/post/${post._id}`} className="block">
              <PostCard post={post} showBookmarkButton={false} />
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4">
        <a
          href={`/profile/posts?page=${Math.max(1, pagination.page - 1)}&limit=${limit}`}
          className={`px-3 py-2 text-sm rounded border ${pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}`}
          aria-disabled={pagination.page <= 1}
        >
          Previous
        </a>
        <a
          href={`/profile/posts?page=${Math.min(pagination.totalPages, pagination.page + 1)}&limit=${limit}`}
          className={`px-3 py-2 text-sm rounded border ${pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}`}
          aria-disabled={pagination.page >= pagination.totalPages}
        >
          Next
        </a>
      </div>
    </div>
  );
}
