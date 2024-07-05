export const orderStatusDictionary = {
    PENDING_PAYMENT: 'Pending',
    FAIL_PAYMENT: 'Failed',
    PAYED: 'Payed',
    REJECT: 'Reject',
    COMPLETED: 'Compelete',
    EXPIRED: 'Expired',
    SYSTEM_CANCELED: 'Canceled',
}

export const paymentStatusDictionary = { // @TODO - use it whenever we have payment status 
    PENDING: 'Pending',
    FAILED: 'Failed',
    SUCCESS: 'Success',
    EXPIRED: 'Expired',
    PENDING_REFUND: 'Pending Refund',
    REFUNDED: 'Refunded',
}

export const orderStatusOptions = [
    'PAYED',
    'COMPLETED',
    'REJECT',
]

export const orderSelectorColors = {
    PENDING_PAYMENT: '#82cdff',
    FAIL_PAYMENT: '#aeaeae',
    PAYED: '#329ace',
    REJECT: '#da0d0c',
    COMPLETED: '#36d932',
    EXPIRED: '#aeaeae',
    SYSTEM_CANCELED: '#aeaeae'
}

export const paymentStatusColor = {
    PENDING: '#82cdff',
    FAILED: '#da0d0c',
    SUCCESS: '#36d932',
    EXPIRED: '#aeaeae',
    PENDING_REFUND: '#82cdff',
    REFUNDED: '#36d932',
}

export const dayTypeColor = {
    WEEKEND: '#df8040',
    HOLIDAY: '#7f0302',
    REGULAR: '#329ace'
}