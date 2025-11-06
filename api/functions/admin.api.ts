import axiosInstance from "../axiosInstance"
import { endpoints } from "../endpoints";

export const getAdminDashboard = async(date: string) => {
    const res = await axiosInstance.get(endpoints.admin.admin_dashboard(date)); 
    return res.data;
}