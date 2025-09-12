import axios from "axios";

export const getCurrentUser = async () => {
  try {
    const res = await axios.get("/api/auth/me", { withCredentials: true });
    if (res.data.authenticated) {
      return res.data;
    }
    return null;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
};

// get all posts
export const getAllPosts = async () => {
  try {
    const res = await axios.get("/api/posts");
    console.log("Fetched posts:", res.data);
  } catch (error) {
    console.log("Failed to fetch posts:", error);
  }
};

// get single post
export const getSinglePost = async (id: string) => {
  try {
    const res = await axios.get(`/api/posts/${id}`);
    return res.data;
  } catch (error) {
    console.log("Failed to fetch post:", error);
  }
};

// create a new post
export const createPost = async (post: {
  title: string;
  thumbnail: string;
  content: string;
  categoryIds?: string[];
}) => {
  // const userId = await getCurrentUser();
  const { title, thumbnail, content, categoryIds } = post;

  try {
    const res = await axios.post(
      "/api/posts",
      {
        title,
        thumbnail,
        content,
        categoryIds: categoryIds ?? [],
      },
      { withCredentials: true }
    );
    console.log("Post created:", res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to create post:", error);
  }
};

// get featured posts
export const getFeaturedPosts = async (limit: number = 4) => {
  try {
    const res = await axios.get(`/api/posts?featured=true&limit=${limit}`);
    return res.data?.data ?? [];
  } catch (error) {
    console.log("Failed to fetch featured posts:", error);
    return [];
  }
};
