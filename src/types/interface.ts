export interface LoginData {
    access_token: string
    refresh_token: string
    is_first_login: boolean
    is_mfa_active: boolean
    session_key: string
    id_token: string
    expires_in: number
    expiry_time: number
    login_time: number
    date: string
    email: string
    username: string
    phone_number: string
    user_id: number
    owner_company: number
    programme_manager: number
    subprogramme_manager: number
    corporate: number
    entity_id: number
    default_profile: string
    current_profile: string
    permissions: string[]
    user_state: string
    user_status: string
    user_upcoming_status: string
    msgAlreadyShown: boolean
    kybStatus: string
    onboardingStatus: string
    entity_name: string
}

export interface CurrencyInterface {
    currencyName: string
    fundsAvailable: number
    reservedBalance: number
    accountBalance: number
}

export interface AccountDataInterface {
    accountName: string
    accountId: string
    accountHolderName: string
    iBan: string
    currencyData: CurrencyInterface
    accountNumber: number
    accountType: string
    paymentMethod: string
    sortCode: number
    feeDepositeAccountId: number
    feeDepositOwnerName?: string
    feeDepositAccountIBan: string
    pAndTType: string
    providerName: string
}