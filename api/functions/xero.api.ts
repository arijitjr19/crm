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

  export const callbackApi = async ({
    code,
    state
  }: {
    code: string;
    state: string;
  }) => {
    const res = await axiosInstance.get(
      endpoints.xero.callbacl_api(code,state)
    );
  
    return res.data;
  };