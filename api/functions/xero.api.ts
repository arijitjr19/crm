import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";

export const connectToXero = async ({
    companyName,
  }: {
    companyName: string;
  }) => {
    const res = await axiosInstance.get(
      endpoints.xero.connect_to_xero(companyName)
    );
  
    return res.data;
  };