import { AxiosInstance, RawAxiosInstance } from "../index";

export const authService = {
    login(username, password) {
        return AxiosInstance.post("/auth/local/login", {
            username,
            password
        })
    },
    logout() {
        return AxiosInstance.get("/auth/logout")
    },
    getProfile: () =>  AxiosInstance.get("/auth/me")
};