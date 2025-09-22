import axios from "axios";

export const postBookmarks = async (postId: string) => {
  try {
    const res = await axios.post(
      "/api/bookmarks",
      { postId },
      { withCredentials: true }
    );
    return res.data as { bookmarked: boolean };
  } catch (error) {
    console.error("Failed to toggle bookmark:", error);
    throw error;
  }
};

export const getBookmarkedPosts = async () => {
  try {
    const res = await axios.get("/api/bookmarks", { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch bookmarked posts:", error);
    throw error;
  }
};