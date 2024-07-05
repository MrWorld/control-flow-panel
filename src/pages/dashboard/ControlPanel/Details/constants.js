
export const attributeValueTypes = ['BOOLEAN', 'STRING', 'NUMBER']
export const BookingStatuses = {
    0: 'NOT_BOOKED',
    1: 'CHECKED_IN',
    2: 'READY',
    3: 'ASSIGNED',
    4: 'REQUESTED',
    5: 'RE_PARKED',
    6: 'SERVICE_REQUESTED',
    7: 'SERVICE_DONE',
    8: 'DELIVERED',
}

export const BookingStatusesReverse = {
    'NOT_BOOKED': 0,
    'CHECKED_IN': 1,
    'READY': 2,
    'ASSIGNED': 3,
    'REQUESTED': 4,
    'RE_PARKED': 5,
    'SERVICE_REQUESTED': 6,
    'SERVICE_DONE': 7,
    'DELIVERED': 8,
}

export const BookStatusColors = {
    "Ready" : {color: '#00e340', key: 'READY'},
    "Assigned" : {color: '#d8df00', key: 'ASSIGNED'},
    "Requested" : {color: '#fb3e18', key: 'REQUESTED' },
    "Re Parked" : {color: '#fb9718', key: 'RE_PARKED'},
    "Service Request" : {color: '#00ffff', key: 'SERVICE_REQUESTED'},
    "Service Done" : {color: '#88d8c0', key: 'SERVICE_DONE'},
    "Parked" : {color: '#b2babb', key: 'PARKED'},
  }
  