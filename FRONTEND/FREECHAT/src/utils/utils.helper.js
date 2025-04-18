import axios from "axios";
import CryptoJS from 'crypto-js';
const encrypt = (text, key = import.meta.env.VITE_SALT_FOR_CIPHER)=>CryptoJS.AES.encrypt(text,key).toString();
const decrypt = ( cipherText, key = import.meta.env.VITE_SALT_FOR_CIPHER)=>CryptoJS.AES.decrypt(cipherText,key).toString(CryptoJS.enc.Utf8);

export const makeApiRequest = async ({
    method,
    urlPath,
    body,
    encryptedKeys,
    convertToFormData,
    token,
    dispatchTypeOnRes
  }) => {
    let config = {};
    const baseApiUrl = "http://localhost:8888/";
  
    config.method = method;
    config.url = `${baseApiUrl}${urlPath}`;
  
    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }
  
    if (convertToFormData && body) {
      config.headers = { ...config.headers, "Content-Type": "multipart/form-data" };
  
      Object.entries(body).forEach(([key, value]) => {
        if (typeof value === "string") {
          if (encryptedKeys && encryptedKeys.includes(key)) {
            body[key] = encrypt(value);
          }
        } else if (!(value instanceof Blob)) {
          body[key] = JSON.stringify(value);
        }
      });
    } else if (encryptedKeys && body) {
      encryptedKeys.forEach((key) => {
        if (typeof body[key] === "string") {
          body[key] = encrypt(body[key]);
        }
      });
    }
  
    if (method === "get") {
      config.params = body;
    } else {
      config.data = body;
    }
  
    let data, error;
  
    try {
      data = await axios(config);
      console.log({ data });
    } catch (err) {
      console.log({ err });
      error = err;
    }
  
    return { error, data };
  };
 export const useLocalStorage = (navigate)=>
  {
    try
    {
      const localStorageData = localStorage.getItem("user");
      if (!localStorageData) {
        navigate("/login");
      }
      const user_id = `${decrypt(localStorageData)}`;
      return user_id;
    }
    catch (error) {
      console.log(error);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }
  export const setLocalStorage = (user_id) => 
    {
      const encryptedUserId = encrypt(user_id);
      localStorage.setItem("user", encryptedUserId);
      return encryptedUserId;
    }