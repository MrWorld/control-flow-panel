export const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
export const validYears = [1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]
export const validGearbox = ['AUTOMATIC', 'MANUAL']
export const adminRolesOptions = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Shop Admin', value: 'VENDORADMIN' }
]
export const adminRoles = {
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
    SUPER_ADMIN: 'SUPERADMIN',
    VENDOR_ADMIN: 'VENDORADMIN',
    NIZEK_ADMIN: 'NIZEKADMIN'
}
export const actionTypesDisctionary = {
    CATEGORY: 'CATEGORY',
    ALL_CATEGORIES: 'ALL_CATEGORIES',
    COLLECTION: 'COLLECTION',
    ALL_COLLECTIONS: 'ALL_COLLECTIONS',
    PRODUCT: 'PRODUCT',
    SHOP: 'SHOP',
    ALL_SHOPS: 'ALL_SHOPS',
    URL: 'URL',
}

export const actionType = [
    'CATEGORY',
    'ALL_CATEGORIES',
    'COLLECTION',
    'ALL_COLLECTIONS',
    'PRODUCT',
    'SHOP',
    'ALL_SHOPS',
    'URL',
]