import apiClient from "./apiClient";

export const getFirebaseToken = async (uuid: string) => {
  const response = await apiClient.get(`/auth/gen-token?uuid=${uuid}`);
  return response.data;
};

export const registerMerchant = async (email: string, authToken: string) => {
  const response = await apiClient.post(
    "/auth/merchant",
    { email },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return response.data;
};

export const updateMerchant = async (
  firstName: string,
  lastName: string,
  phoneCountryCode: string,
  phoneNumber: string,
  authToken: string
) => {
  const response = await apiClient.put(
    "/auth/merchant",
    {
      firstName,
      lastName,
      phoneCountryCode,
      phoneNumber,
    },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return response.data;
};

export const getUser = async (authToken: string) => {
  const response = await apiClient.get(`/auth/user`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return response.data;
};
