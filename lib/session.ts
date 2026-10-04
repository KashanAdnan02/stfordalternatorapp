import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "token";

export const getToken = () =>
  Platform.OS === "web"
    ? AsyncStorage.getItem(TOKEN_KEY)
    : SecureStore.getItemAsync(TOKEN_KEY);
export const saveToken = (token: string) =>
  Platform.OS === "web"
    ? AsyncStorage.setItem(TOKEN_KEY, token)
    : SecureStore.setItemAsync(TOKEN_KEY, token);
export const clearToken = () =>
  Platform.OS === "web"
    ? AsyncStorage.removeItem(TOKEN_KEY)
    : SecureStore.deleteItemAsync(TOKEN_KEY);
