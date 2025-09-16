import axios from "axios";

interface signUpData {
  username: string;
  email: string;
  password: string;
}
interface signInData {
  email: string;
  password: string;
}
export const signUpApi = async ({ username, email, password }: signUpData) => {
  try {
    const response = await axios.post(
      "api/auth/signup",
      {
        username,
        email,
        password,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Signup failed:", error.response?.data || error.message);
    throw error;
  }
};

export const loginApi = async ({email,password}:signInData) => {
      try {
        const res = await axios.post(
          "api/auth/signin",
          {
            emailOrUsername: email,
            password: password,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        return res.data;
      } catch (error:any) {
        console.error("Signup failed:", error.response?.data || error.message);
        throw error;
      }
}

export const signOutApi = async () =>{
  try {
    const res = await axios.post("api/auth/logout", {}, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return res.data;
  } catch (error:any) {
    console.error("Logout failed:", error.response?.data || error.message);
    throw error;
  }
}
