import AsyncStorage from '@react-native-community/async-storage';
import { LoginData } from '../types/interface';

let baseUrl = 'https://aws-wallet.cfsemoney.com';

export const BASE_URL = baseUrl;

export const getLoginData = async () => {
    const loginDataString = await AsyncStorage.getItem('loginData')
    if (!loginDataString) {
        return {} as LoginData
    }
    return JSON.parse(loginDataString) as LoginData
}
