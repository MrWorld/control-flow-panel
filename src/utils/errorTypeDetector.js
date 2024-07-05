// export enum ErrorResponseMessageType {
//     VALIDATION = 4,
//     ERROR = 2,
//     WARMING = 3,
//     SUCCESS = 1,
//   }

export const errorMessage = error => {
    const errorMessageType = error?.response?.data?.meta?.messageType
    
    switch (errorMessageType) {
        case 1:
            return 'Success'
        case 2:
            return error?.response?.data?.meta?.message || 'Error happened in updating password'
        case 3:
            return 'Warning'
        case 4:
            return error?.response?.data?.meta?.validationErrors[0]['msg'] || 'Validation error happened in updating password'
        default:
            break;
    }
}