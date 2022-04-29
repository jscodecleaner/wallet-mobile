export enum SignupFlow {
    ACCOUNT_TYPE = 'accountType',
    INDIVIDUAL_ACCOUNT = 'individualAccount',
    CORPORATE_ACCOUNT = 'corporateAccount',
}

export enum ApiEndpoint {
    SIGNUP = 'signup',
    LOGIN = 'login',
    LOGOUT = 'logout',
    REFRESH_TOKEN = 'auth-refresh',
    FORGET_PASSWORD = 'forgot-password',
    FORGET_USERNAME = 'forgot-username',
    RESET_PASSWORD = 'reset-password',
    CONFIRM_FORGET_PASSWORD = 'confirm-forgot-password',
    REGISTER_COMPANY = 'register-company',
    CORPORATE_STAFF_REGISTRATION = 'register-corporate-staff',
    PM_SPM_STAFF_REGISTRATION = 'register-pm-spm-staff',
    COUNTRY_LIST = 'get-country-list',
    GET_PARAMETER = 'get-parameter',
    SET_PARAMETER = 'set-parameter',
    CREATE_PERMISSION = 'create-permission',
    UPDATE_PERMISSION = 'edit-permission',
    DELETE_PERMISSION = 'delete-permission',
    FETCH_PERMISSION = 'fetch-permission',
    COMPANY_PARENT_LIST = 'company-parent-full-relation',
    GET_USER_PROFILE = 'get-user-profile',
    UPDATE_USER_PROFILE = 'update-user-profile',
    GET_CUSTOMER_FILE_PRE_SIGNED_URL = 'get-customer-file-pre-signed-url',
    GET_STAFF_FILE_PRE_SIGNED_URL = 'get-staff-file-pre-signed-url',
    CREATE_DOCUMENT_TYPE_VALIDITY = 'create-document-type-validity',
    FETCH_DOCUMENT_TYPE_VALIDITY = 'fetch-document-type-validity',
    DELETE_DOCUMENT_TYPE_VALIDITY = 'delete-document-type-validity',
    INSERT_KYC_DOCUMENT_STATUS = 'insert-kyc-document-status',
    FETCH_USER_PERMISSIONS = 'fetch-user-permission',
    SET_USER_PERMISSIONS = 'set-user-permission',
    GET_ACCEPTABLE_KYC_DOCUMENT_BY_USER = 'get-acceptable-kyc-document-by-user',
    KYC_DOCS_STATISTICS = 'get-kyc-docs-needed-uploaded-by-user',
    GET_OBJECT_SIGNED_URL = 'get-object-signed-url',
    CHANGE_PASSWORD = 'change-password',
    KYC_ACCEPT = 'kyc-accept',
    KYC_REJECT = 'kyc-reject',
    GET_KYC_APPROVAL_PENDING_DOCUMENT = 'get-kyc-approval-pending-document',
    GET_COMPANY_FILE_PRE_SIGNED_URL = 'get-company-file-pre-signed-url',
    CREATE_PROVIDER = 'create-provider',
    INSERT_KYB_DOCUMENT_STATUS = 'insert-kyb-document-status',
    GET_USER_ATTRIBUTE = 'get-user-attributes',
    CREATE_ACCOUNT = 'create-account',
    GET_USER_PROFILES_BY_ENTITY = 'get-user-profiles-by-entity',
    GET_PROVIDER_DETAILS = 'get-provider-details',
    GET_All_USER_PROFILE_DETAILS = 'get-all-profiles-by-username',
    UPDATE_USER_BAND_TYPE = 'update-user-band-type',
    GET_KYB_APPROVAL_PENDING_DOCUMENT = 'get-kyb-approval-pending-document',
    GET_DOCUMENT_APPROVAL_RULES = 'get-document-approval-rules',
    GET_USER_PROFILE_SCREEN_2 = 'get-user-profiles-screen-2',
    KYB_ACCEPT = 'kyb-accept',
    KYB_REJECT = 'kyb-reject',
    GET_KYB_DOCS_UPLOADED_SO_FAR = 'get-kyb-docs-uploaded-so-far',
    GET_ALL_ENTITY_DETAILS = 'get-all-entity-details',
    UPDATE_ENTITY_DETAILS = 'update-company-detail',
    GET_PENDING_ACCOUNTS = 'get-pending-accounts',
    GET_BANK_CODE_TYPE = 'get-bank-code-type',
    UPDATE_ACCOUNT_BY_STAFF = 'update-account-by-staff',
    ACCOUNT_ACCEPT = 'account_accept',
    ACCOUNT_REJECT = 'account_reject',
    GET_ONBOARDING_KYB_STATUS_LIST = 'get-entity-onboarding-kyb-status',
    UPDATE_ONBOARDING_STATUS = 'update-entity-onboarding-status',
    UPDATE_KYB_STATUS = 'update-entity-kyb-status',
    BANK_ACCOUNT_ACCEPT = 'bank-account-accept',
    BANK_ACCOUNT_REJECT = 'bank-account-reject',
    GET_ACCOUNT_APPROVAL_PENDING_DOCUMENT = 'get-account-approval-pending-document',
    GET_ACCOUNT_USERNAME_TYPE_BY_ENTITY_ID = 'get-account-username-type-by-entity-id',
    GET_ACCOUNT_NAME_TYPE_CURRENCY_FROM_ACCOUNTS = 'get-account-name-type-currency-from-accounts',
    GET_ACCOUNT_ID_FROM_ACCOUNT_GROUPS = 'get-account-id-from-account-groups',
    INSERT_STAFF_GROUP4ACCT_ACCESS = 'insert-staff-groups4acct-access',
    INSERT_ACCOUNT_GROUPS = 'insert-account-groups',
    GET_STAFF_GROUP4ACCT_ACCESS = 'get-staff_groups4acct_access',
    GET_ACCOUNT_GROUP_LISTING = 'get-account-group-listing',
    INVALIDATE_CLOUDFRONT = 'invalidate-all-cloudfront-distributions',
    GET_ENTITY_DETAIL_COMPARISON = 'get-entity-details-old-and-new',
    INSERT_STAFF_GROUP4ACCT_ACCOUNT_GROUPS = 'insert-staff-group4acct-account-groups',
    GET_TRANSACTION_FEE = 'get-transaction-fee',
    GET_PROVIDER_RELATED_TRANSACTION_DETAILS = 'get-provider-related-transaction-details',
    GET_ALL_ACCOUNTS_INFO = 'get-all-accounts-info',
    CHANGE_EMAIL = 'update-user-email-address',
    UPDATE_USER_ATTRIBUTE = 'update-user-attribute',
    GET_BALANCES_BYACCT_BYCURRENCY = 'get-balances-byacct-bycurrency',
    CONFIRM_CHANGE_EMAIL = 'confirm-update-user-email-address',
    GET_CUSTOMER_KYC_DETAILS = 'get-customer-kyc-details-view',
    DELETE_STAFF_USER_GROUP = 'delete-staff-user-group',
    DELETE_A_USER_IN_STAFF_USER_GROUP = 'delete-a-user-in-staff-user-group',
    DELETE_ACCOUNT_GROUP = 'delete-account-group',
    DELETE_ACCOUNT_LIST = 'delete-account-list',
    GET_ACCTGROUP_STAFFGROUP_NAME = 'get-acctgroup-staffgroup-name',
    GET_RECENT_TRANSACTION_BY_IBAN = 'get-recent-transactions-by-iban',
    GET_RECENT_TEN_TRANSACTION = 'get-recent-ten-transactions',
    DELETE_FROM_ACCOUNT_STAFF_USER_BY_SG4ACCT_ACCESS_GROUP_NAME = 'delete-from-account-staff-user-by-sg4acct-access-group-name',
    CREATE_TRANSACTION_TO_SELF = 'create-transaction-to-self',
    GET_TRANSACTIONS_FOR_APPROVAL = 'get-transactions-for-approval',
    TRANSACTION_APPROVE = 'transaction-approve',
    TRANSACTION_REJECT = 'transaction-reject',
    BULK_TRANSACTION_APPROVE = 'bulk-transaction-approve',
    BULK_TRANSACTION_REJECT = 'bulk-transaction-reject',
    CREATE_TRANSACTION_TO_ANOTHER_CLIENT = 'create-transaction-to-another-client',
    CREATE_TRANSACTION_TO_UK_DOMESTIC = 'create-transaction-in-uk',
    GET_ENTITY_LEVEL_NOTIFICATIONS = 'get-entity-level-notifications',
    GET_FEE_ACCOUNT_LIST = 'get-fee-account-list',
    GET_STATEMENT_FROMDATE_TODATE = 'get-statement-fromdate-todate',
    GET_ENTITY_DETAILS = 'get-entity-details',
    USER_TRANSACTIONS = 'get-user-transactions-by-entityId',
    PROCESSED_TRANSACTIONS = 'get-processed-transactions-by-entityId',
    GET_PROCESSED_TRANSACTIONS_FROM_DATE_TO_DATE_BY_ENTITYID='get-processed-transactions-from-date-to-date-by-entityId',
    GET_USER_TRANSACTIONS_FROM_DATE_TO_DATE_BY_ENTITYID='get-user-transactions-from-date-to-date-by-entityId',
    KYB_APPROVAL_EMAIL = 'kyb-approval-email',
    GET_ACCOUNT_LIST = 'get-balances-byacct-bycurrency-by-username',
    MULTI_CURRENCY_TRANSFER = 'create-mccy-transaction',
    GET_STATEMENT_FOOTER = 'get-statement-footer',
    GET_USER_TRANSACTIONS = 'get-user-transactions-wallet-user',
    GENERATE_MFA_KEY = 'generate-mfa-secret-key',
    VERIFY_MFA_DEVICE = 'verify-mfa-device',
    VERIFY_MFA_OTP = 'verify-mfa-otp',
    ACCOUNT_LIST_FOR_CORPORATE_ENTITY = 'get-balances-byacct-bycurrency-bycorporate',
    GET_PRICELIST = 'get-pricelist',
    ADD_PRICELIST = 'add-pricelist',
    REMOVE_PRICELIST = 'remove-pricelist',
    ADD_TNX_FEE_PRICELIST = 'add-txn-fee-pricelist',
    GET_TNX_FEE_PRICELIST = 'get-txn-fee-pricelist',
    REMOVE_TNX_FEE_PRICELIST = 'remove-txn-fee-pricelist',
    ENTITY_APPROVAL_EMAIL = 'entity-onboarding-complete-email',
    REQUEST_MORE_KYB = 'ask-more-kyb-documents',
    ONBOARDING_INCOMPLETE = 'onboarding-incomplete',
    GET_TNX_FEE_PRICELIST_NAMES = 'get-txn-fee-pricelist-names',
    EURO_TRANSACTION = 'create-eur-transaction'
}

export enum CorporateSignupFlow {
    USER_DETAILS = 'userDetails',
    ENTITY_INFO = 'entityInfo',
    ADDRESS = 'address',
    SMTP_INFO = 'smtpInfo',
    ADDITIONAL_INFO = 'additionalInfo',
}

export enum StatusCode {
    OKAY = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_ERROR = 500,
}

export enum UserState {
    KYC_UPLOAD_PENDING = 'kyc-upload-pending',
    KYC_APPROVAL_PENDING = 'kyc-approval-pending',
    KYC_APPROVAL_COMPLETE = 'kyc-approval-complete',
    ONBOARDING_INCOMPLETE = 'incomplete',
    ONBOARDING_COMPLETE = 'complete',
    ONBOARDING_APPROVED = 'approved',
    KYB_UPLOAD_PENDING = 'kyb-upload-pending',
    KYB_APPROVAL_PENDING = 'kyb-approval-pending',
    KYB_APPROVAL_COMPLETE = 'kyb-approval-complete',
    BANK_ACCOUNT_REQUESTED = 'bank-account-requested',
}

export enum CurrencySynbol {
    USD = '$',
    GBP = '£',
    EUR = '£',
    RUP = '₹',
}
