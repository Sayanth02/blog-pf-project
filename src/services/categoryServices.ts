import axios from "axios"

export const createCategory = async (category: {name: String, description: String, slug: String}) => {
    try {
        const res = await axios.post('/api/categories',category, { withCredentials: true });
        console.log("Category created:", res.data);
        return res.data;
    } catch (error) {
        console.log("Failed to create category:", error);
    }
}

export const getAllCategories = async () => {
    try {
        const res = await axios.get('/api/categories', { withCredentials: true });
        return res.data;
    } catch (error) {
        console.log("Failed to fetch categories:", error);
    }
}

export const getCategoryById = async (id: string) => {
    try {
        const res = await axios.get(`/api/categories/${id}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.log("Failed to fetch category:", error);
    }
}


export const updatedCategory = async (categoryId:string, category:object) =>{
    try {
        const res  = await axios.put('/api/categories', {...category, _id: categoryId}, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.log("Failed to update category:", error);
        
    }
}

export const deleteCategory = async (_id:string) =>{ 
    try {
        const res = await axios.delete("/api/categories", {
          data: { _id },
        });
    } catch (error) {
         console.error("Delete failed:", error);
         throw error;
    }
}