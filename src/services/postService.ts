import axios from "axios";

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export const getMyPosts = async (params?: { page?: number; limit?: number }) => {
  const { page = 1, limit = 12 } = params || {};
  const res = await axios.get("/api/posts/mine", {
    params: { page, limit },
    withCredentials: true,
  });
  return res.data as { data: any[]; pagination: Pagination };
};
