// components/post/BookmarkButton.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { FaBookmark } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa";
import { postBookmarks } from "@/services/bookmarkService";

type Props = {
  postId: string;
  initialBookmarked?: boolean;
  variant?: 'absolute' | 'inline'; // Add variant prop for different positioning
};

export default function BookmarkButton({ postId, initialBookmarked, variant = 'absolute' }: Props) {
  const [bookmarked, setBookmarked] = useState(Boolean(initialBookmarked));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const showMessage = (text: string) => {
    setMessage(text);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMessage(null), 1800);
  };

  const toggleBookmark = async () => {
    if (loading) return;
    // Optimistic update
    const nextState = !bookmarked;
    setBookmarked(nextState);
    setLoading(true);
    try {
      const res = await postBookmarks(postId);
      if (res && typeof res.bookmarked === "boolean") {
        // In case server disagrees, sync with server
        setBookmarked(res.bookmarked);
        showMessage(res.bookmarked ? "Added to bookmarks" : "Removed from bookmarks");
      } else {
        // If no explicit result, keep optimistic state
        showMessage(nextState ? "Added to bookmarks" : "Removed from bookmarks");
      }
    } catch (error) {
      // Revert optimistic update on failure
      setBookmarked(!nextState);
      console.error("Failed to toggle bookmark", error);
      showMessage("Failed to update bookmark");
    } finally {
      setLoading(false);
    }
  };

  const baseClasses = "inline-flex items-center justify-center rounded-md p-2 bg-white/80 hover:bg-white shadow-sm ring-1 ring-black/5 transition disabled:opacity-60";
  const positionClasses = variant === 'absolute'
    ? "absolute top-2 right-2 flex flex-col items-end gap-2"
    : "relative";

  return (
    <div className={positionClasses}>
      <button
        onClick={toggleBookmark}
        disabled={loading}
        aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
        className={baseClasses}
      >
        {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
      </button>
      {message && (
        <div
          role="status"
          aria-live="polite"
          className="text-xs px-2 py-1 rounded bg-black/80 text-white shadow"
        >
          {message}
        </div>
      )}
    </div>
  );
}
