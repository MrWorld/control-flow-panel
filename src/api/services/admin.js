import { AxiosInstance } from "../index";

export const adminService = {

    getStations: data => AxiosInstance.get(`/station?page=${data.page + 1}&take=${data.take}${data.search ?`&search=${data.search}` : ''}`),
    getStationDetail: id => AxiosInstance.get(`/station/${id}`),
    updateStation: (id, data) => AxiosInstance.patch(`/station/${id}`, data),
    addStation: data => AxiosInstance.post(`/station`, data),
    deleteStation: id => AxiosInstance.delete(`/station/${id}`),

    getProducts: data => AxiosInstance.get(`/product?page=${data.page + 1}&take=${data.take}${data.search ? `&search=${data.search}` : '' } `),
    getProductDetail: id => AxiosInstance.get(`/product/${id}`),
    updateProduct: (id, data) => AxiosInstance.patch(`/product/${id}`, data),
    addProduct: data => AxiosInstance.post(`/product`, data),
    deleteProduct: id => AxiosInstance.delete(`/product/${id}`),

    getManufactorings: data => AxiosInstance.get(`/manufactoring?page=${data.page + 1}&take=${data.take}${data.search ? `&search=${data.search}` : '' } `),
    getManufactoringDetail: id => AxiosInstance.get(`/manufactoring/${id}`),
    updateManufactoring: (id, data) => AxiosInstance.patch(`/manufactoring/${id}`, data),
    addManufactoring: data => AxiosInstance.post(`/manufactoring`, data),
    deleteManufactoring: id => AxiosInstance.delete(`/manufactoring/${id}`),
    unBindManufactoringMedia: id => AxiosInstance.put(`/manufactoring/unbind-media/${id}`),



    //**** users and admins *****
    getAdminList: data => AxiosInstance.get(`/v1/users?limit=${data.take}&offset=${data.page == 0 ? '0' : +(data.page * data.take)}${data.roleId ? `&roleId=${data.roleId}` : ''}${data.search ? `&search=${data.search}` : ''}${data.sort ? `&sort=${data.sort}` : ''}${data.filter ? `&filter=${data.filter}` : ''}`),
    getAvailableDrivers: data => AxiosInstance.get(`/v1/users/drivers/available?offset=${data.offset}&limit=${data.limit}`),
    getUserDetail: id => AxiosInstance.get(`/v1/users/details/${id}`), //***** get user details should be get admin details and get customer details
    adminInvitation: body => AxiosInstance.post("v1/users/", body),
    getCustomersList: data => AxiosInstance.get(`v1/customers?limit=${data.take}&offset=${data.page == 0 ? '0' : +(data.page * data.take)}${data.roleId ? `&roleId=${data.roleId}` : ''}${data.search ? `&search=${data.search}` : ''}${data.sort ? `&sort=${data.sort}` : ''}${data.filter ? `&filter=${data.filter}` : ''}`),
    getCustomerDetail: id => AxiosInstance.get(`/v1/customers/${id}`),
    updateAdmin: (id, data) => AxiosInstance.put(`/v1/users/${id}`, data),
    updateCustomer: (id, data) => AxiosInstance.put(`/v1/customers/${id}`, data),
    assignDriverToBooking: (body) => AxiosInstance.post(`/v1/users/drivers/assign`, body),
    updateParker: (id, data) => AxiosInstance.put(`/v1/bookings/${id}/updateParker`, data),

    assignBranch: (id,body) => AxiosInstance.put(`/v1/branch/${id}/assign`, body),
    unAssignBranch: (id,body) => AxiosInstance.put(`/v1/branch/${id}/unAssign`, body),

    // reports //
    getHourlyGraph: (body) => AxiosInstance.get(`/v1/dashboard/hourlyGraph`),
    getLandLordsData: (data) => AxiosInstance.post(`/reports/landlord`, data),
    getDriverReport: (payload,data) => AxiosInstance.post(`/reports/drivers?${payload.sort ? `sort=${payload.sort}` : ''}`, data),
    getVoucherReport: (payload,data) => AxiosInstance.post(`/reports/voucher?${payload.sort ? `sort=${payload.sort}` : ''}`, data),
    getServiceReport: (payload,data) => AxiosInstance.post(`/reports/service?${payload.sort ? `sort=${payload.sort}` : ''}`, data),
    getKeyTagReport: (data) => AxiosInstance.post(`/reports/keytags`, data),
    getCheckInCheckOutData: (data) => AxiosInstance.post(`/reports/checkInCheckOut`, data),
    getIncomeReport: (data) => AxiosInstance.post(`/reports/income`, data),
    getHourWiseReport: (data) => AxiosInstance.post(`/reports/hourwise`, data),
    getCloseShiftData: (data) => AxiosInstance.post(`/reports/closeShiftData`, data),
    getIncomeSummaryReport: (data) => AxiosInstance.post(`/reports/incomeSummary`, data),
    submitSendReport: (data) => AxiosInstance.post(`/reports/closeShift`, data),

    // configs
    getBranchConfigs: (id) => AxiosInstance.get(`/v1/configurations/byBranchId/${id}`),
    updateBranchConfig: (data) => AxiosInstance.put(`/v1/configurations`, data),


    //sms
    getSmsTemplates: () => AxiosInstance.get(`/v1/sms/generalTemplates`),
    sendGeneralSms: (data) => AxiosInstance.post(`/v1/sms/sendGeneralSms`, data),
    sendIndiviualSms: (data) => AxiosInstance.post(`/v1/sms/sendIndiviualSms`, data),
    sendCustomSms: (data) => AxiosInstance.post(`/v1/sms/sendCustomSms`, data),
    getSmsProviders: (data) => AxiosInstance.get(`/v1/sms/providers?limit=${data.take}&offset=${data.page ? '0' : +(data.page * data.take)}${data.search ? `&search=${data.search}` : ''}${data.sort ? `&sort=${data.sort}` : ''}`),
    toggleSmsProvider: (id, data) => AxiosInstance.put(`/v1/sms/toggle/${id}`, data),


    // //**** catalog *****
    // getProductList: data => AxiosInstance.post('admin/products/list', fixPageNumber(data)),
    // createProduct: data => AxiosInstance.post("admin/products", data),
    // updateProduct: (id, data) => AxiosInstance.put(`admin/products/${id}`, data),
    // getProductDetails: id => AxiosInstance.get(`admin/products/${id}`),
    // productToggle: (id, data) => AxiosInstance.put(`admin/products/toggle/${id}`, data),
    // getProductStocks: id => AxiosInstance.get(`admin/products/inventory/list/${id}`),
    // initiateProductStocks: (id, data) => AxiosInstance.post(`admin/products/inventory/until/${id}`, data),

    getCarManufacturers: data => AxiosInstance.get(`/v1/cars-manufacturer?limit=${data.take}&offset=${data.page ? '0' : +(data.page * data.take)}${data.search ? `&search=${data.search}` : ''}${data.sort ? `&sort=${data.sort}` : ''}`),
    addCarManufacturer: data => AxiosInstance.post('/v1/cars-manufacturer', data),
    updateCarManufacturer: (id, data) => AxiosInstance.put(`/v1/cars-manufacturer/${id}`, data),
    toggleCarManufacturer: (id, data) => AxiosInstance.put(`/v1/cars-manufacturer/toggle/${id}`, data),
    deleteCarManufacturer: (id) => AxiosInstance.delete(`/v1/cars-manufacturer/${id}`),


    getRoleGroupList: (data) => AxiosInstance.get(`v1/roles?offset=${data.offset}&limit=${data.limit}${data.search ? `&search=${data.search}` : ''}${data.sort ? `&sort=${data.sort}` : ''}`),
    addRoleGroup: data => AxiosInstance.post('/v1/roles', data),
    getRoleGroupDetails: data => AxiosInstance.get(`/v1/roles/${data}`),
    updateRoleGroup: (id, data) => AxiosInstance.put(`/v1/roles/${id}`, data),
    toggleRoleGroup: (id, data) => AxiosInstance.put(`/v1/roles/toggle/${id}`, data),
    deleteRoleGroup: (id) => AxiosInstance.delete(`/v1/roles/${id}`),

    getParkingLocations: (data) => AxiosInstance.get(`v1/branch?offset=${data.offset}&limit=${data.limit}${data.search ? `&search=${data.search}` : ''}${data.sort ? `&sort=${data.sort}` : ''}`),
    getParkingLocation: (data) => AxiosInstance.get(`v1/branch/${data}`),
    addParkingLocations: data => AxiosInstance.post('/v1/branch', data),
    updateParkingLocations: (id, data) => AxiosInstance.put(`/v1/branch/${id}`, data),
    toggleParkingLocations: (id, data) => AxiosInstance.put(`/v1/branch/toggle/${id}`, data),
    ParkingLocationRemoveEntrance: (id) => AxiosInstance.delete(`/v1/branch/entrance/${id}`),
    deleteParkingLocation: (id) => AxiosInstance.delete(`/v1/branch/${id}`),
    deleteParkingEntrance: (id) => AxiosInstance.delete(`/v1/branch/entrance/${id}`),


    getCompanies: (data) => AxiosInstance.get(`v1/companies?offset=${data.offset}&limit=${data.limit}${data.search ? `&search=${data.search}` : ''}${data.sort ? `&sort=${data.sort}` : ''}`),
    getCompany: (data) => AxiosInstance.get(`v1/companies/${data}`),
    addCompany: data => AxiosInstance.post('/v1/companies', data),
    updateCompany: (id, data) => AxiosInstance.put(`/v1/companies/${id}`, data),
    toggleCompany: (id, data) => AxiosInstance.put(`/v1/companies/toggle/${id}`, data),
    deleteCompany: (id) => AxiosInstance.delete(`/v1/companies/${id}`),

    getServices: (data) => AxiosInstance.get(`v1/services?offset=${data.offset}&limit=${data.limit}${data.search ? `&search=${data.search}` : ''}${data.sort ? `&sort=${data.sort}` : ''}`),
    getService: (data) => AxiosInstance.get(`v1/services/${data}`),
    addService: data => AxiosInstance.post('/v1/services', data),
    updateService: (id, data) => AxiosInstance.put(`/v1/services/${id}`, data),
    toggleService: (id, data) => AxiosInstance.put(`/v1/services/toggle/${id}`, data),
    deleteService: (id) => AxiosInstance.delete(`/v1/services/${id}`),
    serviceBook: (data) => AxiosInstance.post(`/v1/services/book`, data),

    getBookings: (data) => AxiosInstance.get(`v1/bookings?offset=${data.offset}&limit=${data.limit}${data.search ? `&search=${data.search}` : ''}${data.sort ? `&sort=${data.sort}` : ''}${data.filter ? `&filter=${data.filter}` : ''}${data.admin ? `&admin=${data.admin}` : ''}`),
    getServiceBookings: (id, data) => AxiosInstance.get(`v1/services/${id}/bookings?offset=${data.offset}&limit=${data.limit}${data.search ? `&search=${data.search}` : ''}${data.sort ? `&sort=${data.sort}` : ''}`),
    getBookingDetails: (data) => AxiosInstance.get(`v1/bookings/${data}`),
    addBooking: data => AxiosInstance.post('/v1/bookings', data),
    updateBooking: (id, data) => AxiosInstance.put(`/v1/bookings/${id}`, data),
    getCustomerTypes: () => AxiosInstance.get('/v1/customers/customerTypes'),
    updateBookingVehicle: (data) => AxiosInstance.post('/v1/booking-cars/attach', data),
    setPrePaid: (data) => AxiosInstance.put('/v1/bookings/prePaid', data),
    setPaymentMethod: (data) => AxiosInstance.put('/v1/bookings/setPaymentMethod', data),
    updatePaymentMethod: (data) => AxiosInstance.put('/v1/bookings/updatePaymentMethod', data),
    updateBookingLocation: (data) => AxiosInstance.put(`/v1/booking-location`, data),
    checkout: (id, data) => AxiosInstance.put(`/v1/bookings/${id}/checkout`, data),
    getClientSideInvoice: (hash) => AxiosInstance.get(`/v1/invoices/${hash}`),
    requestCar: (hash) => AxiosInstance.get(`/v1/invoices/request_car/${hash}`),
    searchBookings: (search) => AxiosInstance.get(`/v1/bookings/search/${search}`),
    getControlPanelStatistics: () => AxiosInstance.get(`/v1/bookings/controlPanelData`),
    carIsReady: (id, data) => AxiosInstance.put(`/v1/bookings/${id}/carIsReady`, data),
    resendTicket: (id) => AxiosInstance.post(`/v1/bookings/${id}/resendSms`),


    getParkingBlock: (data) => AxiosInstance.get(`v1/parkings-block?offset=${data.offset}&limit=${data.limit}${data.search ? `&search=${data.search}` : ''}${data.sort ? `&sort=${data.sort}` : ''}`),
    addParkingBlock: data => AxiosInstance.post('/v1/parkings-block', data),
    updateParkingBlock: (id, data) => AxiosInstance.put(`/v1/parkings-block/${id}`, data),
    toggleParkingBlock: (id, data) => AxiosInstance.put(`/v1/parkings-block/toggle/${id}`, data),
    deleteParkingBlock: (id) => AxiosInstance.delete(`/v1/parkings-block/${id}`),


    getSubscriptions: (data) => AxiosInstance.get(`/v1/subscriptions?offset=${data.offset}&limit=${data.limit}${data.search ? `&search=${data.search}` : ''}${data.sort ? `&sort=${data.sort}` : ''}`),
    getSubscription: (id) => AxiosInstance.get(`/v1/subscriptions/${id}`),
    addSubscriptions: data => AxiosInstance.post('/v1/subscriptions', data),
    updateSubscriptions: (id, data) => AxiosInstance.put(`/v1/subscriptions/${id}`, data),
    toggleSubscriptions: (id, data) => AxiosInstance.put(`/v1/subscriptions/toggle/${id}`, data),

    getAdvertisements: (data) => AxiosInstance.get(`/v1/advertisements?offset=${data.offset}&limit=${data.limit}${data.search ? `&search=${data.search}` : ''}${data.sort ? `&sort=${data.sort}` : ''}`),
    getAdvertisement: (id) => AxiosInstance.get(`/v1/advertisements/${id}`),
    addAdvertisements: data => AxiosInstance.post('/v1/advertisements', data),
    updateAdvertisements: (id, data) => AxiosInstance.put(`/v1/advertisements/${id}`, data),
    toggleAdvertisements: (id, data) => AxiosInstance.put(`/v1/advertisements/toggle/${id}`, data),
    deleteAdvertisements: (id) => AxiosInstance.delete(`/v1/advertisements/${id}`),

    getPaymentMethods: (data) => AxiosInstance.get(`/v1/paymentmethods?offset=${data.offset}&limit=${data.limit}${data.search ? `&search=${data.search}` : ''}`),
    // addPeymentMethods: data => AxiosInstance.post('/v1/paymentmethods', data),
    // updatePeymentMethods: (id, data) => AxiosInstance.put(`/v1/paymentmethods/${id}`, data),
    // togglePeymentMethods: (id, data) => AxiosInstance.put(`/v1/paymentmethods/toggle/${id}`, data),

    getKeyTags: (data) => AxiosInstance.get(`v1/keytags?offset=${data.offset}&limit=${data.limit}${data.search ? `&search=${data.search}` : ''}${data.sort ? `&sort=${data.sort}` : ''}`),
    getAvailableKeyTags: (data) => AxiosInstance.get(`v1/keytags/available?offset=${data.offset}&limit=${data.limit}${data.search ? `&search=${data.search}` : ''}`),
    getActiveKeyTags: (data) => AxiosInstance.get(`v1/keytags/booked?offset=${data.offset}&limit=${data.limit}${data.search ? `&search=${data.search}` : ''}${data.sort ? `&sort=${data.sort}` : ''}${data.filter ? `&filter=${data.filter}` : ''}`),
    getKeyTag: (id) => AxiosInstance.get(`v1/keytags/${id}`),
    addKeyTag: data => AxiosInstance.post('/v1/keytags', data),
    updateKeyTag: (id, data) => AxiosInstance.put(`/v1/keytags/${id}`, data),
    toggleKeyTag: (id, data) => AxiosInstance.put(`/v1/keytags/toggle/${id}`, data),
    deleteKeyTag: (id) => AxiosInstance.delete(`/v1/keytags/${id}`),


    getCarModel: data => AxiosInstance.get(`/v1/cars-model?limit=${data.take}&offset=${data.page ? '0' : +(data.page * data.take)}${data.search ? `&search=${data.search}` : ''}${data.sort ? `&sort=${data.sort}` : ''}${data.filter ? `&filter=${data.filter}` : ''}`),
    addCarModel: data => AxiosInstance.post('/v1/cars-model', data),
    updateCarModel: (id, data) => AxiosInstance.put(`/v1/cars-model/${id}`, data),
    toggleCarModel: (id, data) => AxiosInstance.put(`/v1/cars-model/toggle/${id}`, data),
    deleteCarModel: (id) => AxiosInstance.delete(`/v1/cars-model/${id}`),


    getFloors: data => AxiosInstance.get(`/v1/parkings-floor?limit=${data.take}&offset=${data.page ? '0' : +(data.page * data.take)}${data.search ? `&search=${data.search}` : ''}${data.sort ? `&sort=${data.sort}` : ''}`),
    addFloors: data => AxiosInstance.post('/v1/parkings-floor', data),
    updateFloors: (id, data) => AxiosInstance.put(`/v1/parkings-floor/${id}`, data),
    togglefloor: (id, data) => AxiosInstance.put(`/v1/parkings-floor/toggle/${id}`, data),
    deleteFloor: (id) => AxiosInstance.delete(`/v1/parkings-floor/${id}`),

    getOrganizations: data => AxiosInstance.get(`/v1/organizations?limit=${data.take}&offset=${data.page ? '0' : +(data.page * data.take)}${data.search ? `&search=${data.search}` : ''}${data.sort ? `&sort=${data.sort}` : ''}`),
    addOrganizations: data => AxiosInstance.post('/v1/organizations', data),
    updateOrganizations: (id, data) => AxiosInstance.put(`/v1/organizations/${id}`, data),
    toggleOrganizations: (id, data) => AxiosInstance.put(`/v1/organizations/toggle/${id}`, data),
    deleteOrganizations: (id) => AxiosInstance.delete(`/v1/organizations/${id}`),


    toggleCatalogType: (id, data) => AxiosInstance.put(`admin/types/toggle/${id}`, data),
    getCatalogCategoriesList: data => AxiosInstance.post('admin/categories/list', fixPageNumber(data)),
    addCatalogCategories: data => AxiosInstance.post('admin/categories', data),
    updateCatalogCategories: (id, data) => AxiosInstance.put(`admin/categories/${id}`, data),
    toggleCatalogCategories: (id, data) => AxiosInstance.put(`admin/categories/toggle/${id}`, data),

    //**** store front *****
    addBanner: data => AxiosInstance.post('admin/banners', data),
    updateBanner: (id, data) => AxiosInstance.put(`admin/banners/${id}`, data),
    getBannersList: data => AxiosInstance.post('admin/banners/list', fixPageNumber(data)),
    getSlidersList: data => AxiosInstance.post('admin/sliders/list', fixPageNumber(data)),
    addSlider: data => AxiosInstance.post('admin/sliders', data),
    updateSlider: (id, data) => AxiosInstance.put(`admin/sliders/${id}`, data),
    addCollection: data => AxiosInstance.post('admin/collections', data),
    updateCollection: (id, data) => AxiosInstance.put(`admin/collections/${id}`, data),
    getCollectionList: data => AxiosInstance.post('admin/collections/list', fixPageNumber(data)),
    getCollectionDetails: id => AxiosInstance.get(`admin/collections/${id}`),
    addAppHome: data => AxiosInstance.post('admin/homepage', data),
    updateAppHome: (id, data) => AxiosInstance.put(`admin/homepage/${id}`, data),
    getAppHomeList: data => AxiosInstance.post('admin/homepage/list', fixPageNumber(data)),
    makeAppHomeAsDefault: (id) => AxiosInstance.put(`admin/homepage/set-default/${id}`),
    getAppHomeDetails: (id) => AxiosInstance.get(`admin/homepage/${id}`),

    //**** logistics *****
    getVendorList: data => AxiosInstance.post("admin/vendors/list", fixPageNumber(data)),
    getVendorDetails: id => AxiosInstance.get(`admin/vendors/${id}`),
    createVendor: data => AxiosInstance.post("admin/vendors", data),
    updateVendor: (id, data) => AxiosInstance.put(`admin/vendors/${id}`, data),
    getVendorTiming: id => AxiosInstance.get(`admin/vendors/timing/${id}`),
    changeVendorTiming: (id, data) => AxiosInstance.put(`admin/vendors/timing/${id}`, data),
    getVendorAreas: id => AxiosInstance.get(`admin/vendors/areas/${id}`),
    updateAreaAvailability: (id, data) => AxiosInstance.put(`admin/vendors/areas/${id}`, data),
    addNewVendorArea: (id, data) => AxiosInstance.post(`admin/vendors/areas/${id}`, data),
    toggleVendorStatus: (id, data) => AxiosInstance.put(`admin/vendors/toggle/${id}`, data),
    getParcels: id => AxiosInstance.get(`admin/orders/parcel/list/${id}`),
    updateParcelStatus: (id, data) => AxiosInstance.put(`admin/orders/parcel/status/${id}`, data),
    getParcelDetails: id => AxiosInstance.get(`admin/orders/parcel/detail/${id}`),
    // getMyVendorDetails: () => AxiosInstance.get(`admin/vendors/my-vendor`), **** get my shop details should be implemented

    //**** orders *****
    getOrdersList: (vendorId, data) => AxiosInstance.post(`admin/orders/list/${vendorId}`, fixPageNumber(data)),
    getOrderDetails: id => AxiosInstance.get(`admin/orders/${id}`),
    orderUpdateStatus: (id, data) => AxiosInstance.put(`admin/orders/status/${id}`, data),
    updateOrderDetailAddress: (id, data) => AxiosInstance.post(`admin/addresses/phone-order/${id}`, data),
    //**** coupon *****
    getRandomCode: () => AxiosInstance.get(`admin/coupon/misc/random-code`),
    createCoupon: (data) => AxiosInstance.post("admin/coupon", data),
    getCouponList: (data) => AxiosInstance.post(`admin/coupon/list`, fixPageNumber(data)),
    removeCoupon: (id) => AxiosInstance.put(`admin/coupon/revoke/${id}`),
    //**** Static pages *****
    editStaticPage: (id, data) => AxiosInstance.put(`admin/misc/static/${id}`, data),
    getStaticPage: (type, language) => AxiosInstance.get(`misc/static/${type}/${language}`),
    getStaticPages: () => AxiosInstance.get(`admin/misc/static`),

    //**** Notification *****
    deleteOrderNotification: id => AxiosInstance.delete(`admin/misc/notification/${id}`),
    getMyNotifications: () => AxiosInstance.get("admin/misc/my-notifications"),
    readNotification: id => AxiosInstance.put(`admin/misc/notification/read/${id}`),

    //**** general *****
    getAllAreas: () => AxiosInstance.get(`admin/areas/`),
    getPermission: () => AxiosInstance.get("admin/misc/role-perms"),
    togglePermission: (id, data) => AxiosInstance.put(`admin/misc/toggle-perm/${id}`, data),
    // getCurrencyExchange: () => AxiosInstance.get("admin/misc/currency-exchange"),
    getReports: () => AxiosInstance.get("/v1/dashboard"),
    getAreas: (data) => AxiosInstance.post(`areas/list`, data),
    //**** settings *****
    getSettings: () => AxiosInstance.get("admin/misc/settings"),
    updateSetting: (id, data) => AxiosInstance.put(`admin/misc/settings/${id}`, data),
    //**** settings *****
    getAddressConfig: () => AxiosInstance.get("addresses/config"),

    // feedback
    getFeedbacks: data => AxiosInstance.get(`/v1/feedback?limit=${data.take}&offset=${data.page ? '0' : +(data.page * data.take)}${data.search ? `&search=${data.search}` : ''}${data.sort ? `&sort=${data.sort}` : ''}`),
    sendFeedback: (hash, data) => AxiosInstance.post(`/v1/feedback/${hash}`, data),
    getFeedback: (id, data) => AxiosInstance.get(`/v1/feedback/${id}`),
}

const fixPageNumber = data => {
    //***** Pagination component in material UI start from page 0, our backend start from 1, 
    // For dealing with API call and handle pagination functions I did this manipulation *****
    let manipulatedPage = (data.page + 1)
    data['page'] = manipulatedPage

    return data
}
