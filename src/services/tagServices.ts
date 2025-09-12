// create tag

import axios from "axios";

export const createTag = async (tagData: { name: string; slug?: string }) => {
    try {
         const res = await axios.post('/api/tags', tagData, { withCredentials: true });
         return res.data
    } catch (error) {
        console.log("Failed to create tag:", error);
    }
}