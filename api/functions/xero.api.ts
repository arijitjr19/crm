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

  // To get Xero Status
  export const XeroStatus = async ({
    companyName,
  }: {
    companyName: string;
  }) => {
    const res = await axiosInstance.get(
      endpoints.xero.xero_status(companyName)
    );
  
    return res.data;
  };

    // To disconnect from Xero
    export const XeroDisconnect = async ({
      companyName,
    }: {
      companyName: string;
    }) => {
      const res = await axiosInstance.post(
        endpoints.xero.xero_disconnect(companyName)
      );
    
      return res.data;
    };