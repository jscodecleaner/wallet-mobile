import AsyncStorage from '@react-native-community/async-storage';
import { PROXY_URL } from '@env';
import { LoginData } from '../types/interface';

let baseUrl = 'https://aws-wallet.cfsemoney.com';

export const BASE_URL = baseUrl;

export const getProxyUrl = () => PROXY_URL;

export const getLoginData = async () => {
    const loginDataString = await AsyncStorage.getItem('loginData')
    if (!loginDataString) {
        return {} as LoginData
    }
    return JSON.parse(loginDataString) as LoginData
}
