export const ROUTE_CONSTANTS = {
    ROOT: {
        RELATIVE: "/",
        ABSOLUTE: "/",
    },
    ROOT_STAR: {
        RELATIVE: "/*",
        ABSOLUTE: "/*",
    },
    PUBLIC_ROUTES: {
        NOT_PERMITTED: {
            RELATIVE: "not-permitted",
            ABSOLUTE: "/not-permitted",
        },
        STATIC_PAGES: {
            ROOT: {
                RELATIVE: ":name/:language",
                ABSOLUTE: "/:name/:language",
            },
            GET_BY_DATA: (name, language) => {
                return {
                    RELATIVE: `/${name}/${language}`,
                    ABSOLUTE: `/${name}/${language}`,
                }
            }
        },
        CLIENT_PAGE: {
            ROOT: {
                RELATIVE: ":token",
                ABSOLUTE: "client/:token",
            },
            GET_BY_DATA: (token) => {
                return {
                    RELATIVE: `/${token}}`,
                    ABSOLUTE: `client/${token}}`,
                }
            }
        },
    },
    AUTH: {
        ROOT: {
            RELATIVE: "auth",
            ABSOLUTE: "/auth",
        },
        LOGIN: {
            RELATIVE: "login",
            ABSOLUTE: "/auth/login",
        },
        RESET_PASSWORD: {
            RELATIVE: "reset-password",
            ABSOLUTE: "/auth/reset-password",
        },
        FORGOT_PASSWORD: {
            RELATIVE: "forgot-password",
            ABSOLUTE: "/auth/forgot-password",
        },
    },
    DASHBOARD: {
        ROOT: {
            RELATIVE: "dashboard",
            ABSOLUTE: "/dashboard",
        },
        ANALYTICS: {
            RELATIVE: "analytics",
            ABSOLUTE: "/dashboard/analytics",
        },
        CUSTOM_DASHBOARD: {
            RELATIVE: "custom_dashboard",
            ABSOLUTE: "/dashboard/custom_dashboard",
        },
        SMS: {
            RELATIVE: "sms",
            ABSOLUTE: "/dashboard/sms",
        },
        STATIONS: {
            ROOT: {
                RELATIVE: "stations",
                ABSOLUTE: "/dashboard/stations",
            },
            ADD_NEW: {
                RELATIVE: "stations/new",
                ABSOLUTE: "/dashboard/stations/new",
            },
            DETAILS: {
                RELATIVE: "stations/:id",
                ABSOLUTE: "/dashboard/stations/:id",
            },
            GET_BY_DATA: (id) => {
                return {
                    RELATIVE: `stations/${id}`,
                    ABSOLUTE: `/dashboard/stations/${id}`,
                }
            }
        },
        PRODUCTS: {
            ROOT: {
                RELATIVE: "products",
                ABSOLUTE: "/dashboard/products",
            },
            ADD_NEW: {
                RELATIVE: "products/new",
                ABSOLUTE: "/dashboard/products/new",
            },
            DETAILS: {
                RELATIVE: "products/:id",
                ABSOLUTE: "/dashboard/products/:id",
            },
            GET_BY_DATA: (id) => {
                return {
                    RELATIVE: `products/${id}`,
                    ABSOLUTE: `/dashboard/products/${id}`,
                }
            }
        },

        MANUFACTORING: {
            ROOT: {
                RELATIVE: "manufactoring",
                ABSOLUTE: "/dashboard/manufactoring",
            },
            ADD_NEW: {
                RELATIVE: "manufactoring/new",
                ABSOLUTE: "/dashboard/manufactoring/new",
            },
            DETAILS: {
                RELATIVE: "manufactoring/:id",
                ABSOLUTE: "/dashboard/manufactoring/:id",
            },
            GET_BY_DATA: (id) => {
                return {
                    RELATIVE: `manufactoring/${id}`,
                    ABSOLUTE: `/dashboard/manufactoring/${id}`,
                }
            }
        },
        USERS: {
            ROOT: {
                RELATIVE: "users",
                ABSOLUTE: "/dashboard/users",
            },
            PROFILE: {
                ROOT: {
                    RELATIVE: "me",
                    ABSOLUTE: "/dashboard/me/",
                },
            },
        },
        CONTROL_PANEL: {
            ROOT: {
                RELATIVE: "control-panel",
                ABSOLUTE: "/dashboard/control-panel"
            }
        },
        REPORTS: {
            ROOT: {
                RELATIVE: "reports",
                ABSOLUTE: "/dashboard/reports"
            },
            LANDLORDS: {
                ROOT: {
                    RELATIVE: "landlords",
                    ABSOLUTE: "/dashboard/reports/landlords"
                }
            },
            CHECKINOUTREPORT: {
                ROOT: {
                    RELATIVE: "checkinout",
                    ABSOLUTE: "/dashboard/reports/checkinout"
                }
            },
            INCOMEREPORT: {
                ROOT: {
                    RELATIVE: "income",
                    ABSOLUTE: "/dashboard/reports/income"
                }
            },
            CLOSESHIFTREPORT: {
                ROOT: {
                    RELATIVE: "closeshift",
                    ABSOLUTE: "/dashboard/reports/closeshift"
                }
            },
            DRIVER_REPORTS: {
                ROOT: {
                    RELATIVE: "driver-reports",
                    ABSOLUTE: "/dashboard/reports/driver-reports"
                }
            },
            KEYTAG_REPORTS: {
                ROOT: {
                    RELATIVE: "keytag-reports",
                    ABSOLUTE: "/dashboard/reports/keytag-reports"
                }
            },
            HOURWISE_REPORTS: {
                ROOT: {
                    RELATIVE: "hourwise-reports",
                    ABSOLUTE: "/dashboard/reports/hourwise-reports"
                }
            },
            INCOMESUMMARY_REPORTS: {
                ROOT: {
                    RELATIVE: "incomesummary-reports",
                    ABSOLUTE: "/dashboard/reports/incomesummary-reports"
                }
            },
            VOUCHER_REPORTS: {
                ROOT: {
                    RELATIVE: "voucher-reports",
                    ABSOLUTE: "/dashboard/reports/voucher-reports"
                }
            },
            SERVICE_REPORTS: {
                ROOT: {
                    RELATIVE: "service-reports",
                    ABSOLUTE: "/dashboard/reports/service-reports"
                }
            },
            FEEDBACKS: {
                ROOT: {
                    RELATIVE: "feedbacks",
                    ABSOLUTE: "/dashboard/reports/feedbacks"
                },
                DETAILS: {
                    RELATIVE: ":id",
                    ABSOLUTE: "/dashboard/reports/feedbacks/:id",
                },
                GET_BY_DATA: (id) => {
                    return {
                        RELATIVE: `/${id}`,
                        ABSOLUTE: `/dashboard/reports/feedbacks/${id}`,
                    }
                }
            },
        },
        MASTERS: {
            ROOT: {
                RELATIVE: "masters",
                ABSOLUTE: "/dashboard/masters",
            },
            USERS: {
                CUSTOMERS: {
                    ROOT: {
                        RELATIVE: "customers",
                        ABSOLUTE: "/dashboard/masters/users/customers",
                    },
                },
                ADMINS: {
                    ROOT: {
                        RELATIVE: "admins",
                        ABSOLUTE: "/dashboard/masters/users/admins",
                    },
                },
                DETAILS: {
                    RELATIVE: ":id",
                    ABSOLUTE: "/dashboard/masters/users/:id",
                },
                GET_BY_DATA: (id) => {
                    return {
                        RELATIVE: `/${id}`,
                        ABSOLUTE: `/dashboard/masters/users/${id}`,
                    }
                }
            },
            
            CUSTOMERS: {
                ROOT: {
                    RELATIVE: "customers",
                    ABSOLUTE: "/dashboard/masters/customers",
                },
                DETAILS: {
                    RELATIVE: ":id",
                    ABSOLUTE: "/dashboard/masters/customers/:id",
                },
                GET_BY_DATA: (id) => {
                    return {
                        RELATIVE: `/${id}`,
                        ABSOLUTE: `/dashboard/masters/customers/${id}`,
                    }
                }
            },
            CAR_MANUFACTURER: {
                ROOT: {
                    RELATIVE: "car_manufactorer",
                    ABSOLUTE: "/dashboard/masters/car_manufactorer",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "car_manufactorer/add-new",
                        ABSOLUTE: "/dashboard/masters/car_manufactorer/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "car_manufactorer/update",
                        ABSOLUTE: "/dashboard/masters/car_manufactorer/update",
                    },
                },
            },
            CAR_MODEL: {
                ROOT: {
                    RELATIVE: "car_model",
                    ABSOLUTE: "/dashboard/masters/car_model",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "car_model/add-new",
                        ABSOLUTE: "/dashboard/masters/car_model/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "car_model/update",
                        ABSOLUTE: "/dashboard/masters/car_model/update",
                    },
                },
            },
            PARKING_LOCATION: {
                ROOT: {
                    RELATIVE: "parking_location",
                    ABSOLUTE: "/dashboard/masters/parking_location",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "parking_location/add-new",
                        ABSOLUTE: "/dashboard/masters/parking_location/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "parking_location/:id",
                        ABSOLUTE: "/dashboard/masters/parking_location/:id",
                    },
                },
                GET_BY_DATA: (id) => {
                    return {
                        RELATIVE: `parking_location/${id}`,
                        ABSOLUTE: `/dashboard/masters/parking_location/${id}`,
                    }
                }
            },
            COMPANY: {
                ROOT: {
                    RELATIVE: "company",
                    ABSOLUTE: "/dashboard/masters/company",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "company/add-new",
                        ABSOLUTE: "/dashboard/masters/company/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "company/:id",
                        ABSOLUTE: "/dashboard/masters/company/:id",
                    },
                },
                GET_BY_DATA: (id) => {
                    return {
                        RELATIVE: `company/${id}`,
                        ABSOLUTE: `/dashboard/masters/company/${id}`,
                    }
                }
            },
            SERVICE: {
                ROOT: {
                    RELATIVE: "service",
                    ABSOLUTE: "/dashboard/masters/service",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "service/add-new",
                        ABSOLUTE: "/dashboard/masters/service/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "service/:id",
                        ABSOLUTE: "/dashboard/masters/service/:id",
                    },
                },
                GET_BY_DATA: (id) => {
                    return {
                        RELATIVE: `service/${id}`,
                        ABSOLUTE: `/dashboard/masters/service/${id}`,
                    }
                }
            },
            PARKING_FLOOR: {
                ROOT: {
                    RELATIVE: "parking_floor",
                    ABSOLUTE: "/dashboard/masters/parking_floor",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "parking_floor/add-new",
                        ABSOLUTE: "/dashboard/masters/parking_floor/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "parking_floor/update",
                        ABSOLUTE: "/dashboard/masters/parking_floor/update",
                    },
                },
            },
            PARKING_BLOCK: {
                ROOT: {
                    RELATIVE: "parking_block",
                    ABSOLUTE: "/dashboard/masters/parking_block",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "parking_block/add-new",
                        ABSOLUTE: "/dashboard/masters/parking_block/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "parking_block/update",
                        ABSOLUTE: "/dashboard/masters/parking_block/update",
                    },
                },
            },
            KEY_TAG: {
                ROOT: {
                    RELATIVE: "key_tag",
                    ABSOLUTE: "/dashboard/masters/key_tag",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "key_tag/add-new",
                        ABSOLUTE: "/dashboard/masters/key_tag/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "key_tag/:id",
                        ABSOLUTE: "/dashboard/masters/key_tag/:id",
                    },
                },
                GET_BY_DATA: (id) => {
                    return {
                        RELATIVE: `key_tag/${id}`,
                        ABSOLUTE: `/dashboard/masters/key_tag/${id}`,
                    }
                }
            },
            BOOKING: {
                ROOT: {
                    RELATIVE: "bookings",
                    ABSOLUTE: "/dashboard/masters/bookings",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "bookings/add-new",
                        ABSOLUTE: "/dashboard/masters/bookings/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "bookings/update",
                        ABSOLUTE: "/dashboard/masters/bookings/update",
                    },
                },
                UPDATE_VEHICLE: {
                    ROOT: {
                        RELATIVE: "bookings/update-vehicle",
                        ABSOLUTE: "/dashboard/masters/bookings/update-vehicle",
                    },
                },
                UPDATE_LOCATION: {
                    ROOT: {
                        RELATIVE: "bookings/update-location",
                        ABSOLUTE: "/dashboard/masters/bookings/update-location",
                    },
                },
                DETAILS: {
                    ROOT: {
                        RELATIVE: "bookings/:id",
                        ABSOLUTE: "/dashboard/masters/bookings/:id",
                    },
                },
                PRINT: {
                    ROOT: {
                        RELATIVE: "bookings/print/:id",
                        ABSOLUTE: "/dashboard/masters/bookings/print/:id",
                    },
                },
                GET_BY_DATA: (id) => {
                    return {
                        RELATIVE: `bookings/${id}`,
                        ABSOLUTE: `/dashboard/masters/bookings/${id}`,
                    }
                },
                PRINT_BY_DATA: (id) => {
                    return {
                        RELATIVE: `bookings/print/${id}`,
                        ABSOLUTE: `/dashboard/masters/bookings/print/${id}`,
                    }
                }
            },
            SUBSCRIPTION: {
                ROOT: {
                    RELATIVE: "subscriptions",
                    ABSOLUTE: "/dashboard/masters/subscriptions",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "subscriptions/add-new",
                        ABSOLUTE: "/dashboard/masters/subscriptions/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "subscriptions/:id",
                        ABSOLUTE: "/dashboard/masters/subscriptions/:id",
                    },
                },
                GET_BY_DATA: (id) => {
                    return {
                        RELATIVE: `subscriptions/${id}`,
                        ABSOLUTE: `/dashboard/masters/subscriptions/${id}`,
                    }
                }
            },
            ADVERTISEMENT: {
                ROOT: {
                    RELATIVE: "advertisements",
                    ABSOLUTE: "/dashboard/masters/advertisements",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "advertisements/add-new",
                        ABSOLUTE: "/dashboard/masters/advertisements/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "advertisements/:id",
                        ABSOLUTE: "/dashboard/masters/advertisements/:id",
                    },
                },
                GET_BY_DATA: (id) => {
                    return {
                        RELATIVE: `advertisements/${id}`,
                        ABSOLUTE: `/dashboard/masters/advertisements/${id}`,
                    }
                },
            },
        },
        CATALOG: {
            ROOT: {
                RELATIVE: "catalog",
                ABSOLUTE: "/dashboard/catalog",
            },
            PRODUCT: {
                ROOT: {
                    RELATIVE: "product",
                    ABSOLUTE: "/dashboard/catalog/product",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "product/add-new",
                        ABSOLUTE: "/dashboard/catalog/product/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "product/update",
                        ABSOLUTE: "/dashboard/catalog/product/update",
                    },
                },
                DETAILS: {
                    ROOT: {
                        RELATIVE: "product/:id",
                        ABSOLUTE: "/dashboard/catalog/product/:id",
                    },
                },
                GET_BY_DATA: (id) => {
                    return {
                        RELATIVE: `product/${id}`,
                        ABSOLUTE: `/dashboard/catalog/product/${id}`,
                    }
                }
            },
            CATEGORY: {
                ROOT: {
                    RELATIVE: "category",
                    ABSOLUTE: "/dashboard/catalog/category",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "category/add-new",
                        ABSOLUTE: "/dashboard/catalog/category/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "category/update",
                        ABSOLUTE: "/dashboard/catalog/category/update",
                    },
                },
            },

        },
        LOGISTICS: {
            ROOT: {
                RELATIVE: "logistics",
                ABSOLUTE: "/dashboard/logistics",
            },
            SHOP: {
                ROOT: {
                    RELATIVE: "shop",
                    ABSOLUTE: "/dashboard/logistics/shop",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "shop/add-new",
                        ABSOLUTE: "/dashboard/logistics/shop/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "shop/update",
                        ABSOLUTE: "/dashboard/logistics/shop/update",
                    },
                },
                DETAILS: {
                    ROOT: {
                        RELATIVE: "shop/:id",
                        ABSOLUTE: "/dashboard/logistics/shop/:id",
                    },
                },
                GET_BY_DATA: (id) => {
                    return {
                        RELATIVE: `shop/${id}`,
                        ABSOLUTE: `/dashboard/logistics/shop/${id}`,
                    }
                }
            },
            ORDERS: {
                ROOT: {
                    RELATIVE: "orders",
                    ABSOLUTE: "/dashboard/logistics/orders",
                },
                DETAILS: {
                    ROOT: {
                        RELATIVE: "orders/:id",
                        ABSOLUTE: "/dashboard/logistics/orders/:id",
                    },
                },
                GET_BY_DATA: (id) => {
                    return {
                        RELATIVE: `orders/${id}`,
                        ABSOLUTE: `/dashboard/logistics/orders/${id}`,
                    }
                }
            },
            PARCELS: {
                ROOT: {
                    RELATIVE: "parcels",
                    ABSOLUTE: "/dashboard/logistics/parcels",
                },
                DETAILS: {
                    ROOT: {
                        RELATIVE: "parcels/:id",
                        ABSOLUTE: "/dashboard/logistics/parcels/:id",
                    },
                },
                GET_BY_DATA: (id) => {
                    return {
                        RELATIVE: `parcels/${id}`,
                        ABSOLUTE: `/dashboard/logistics/parcels/${id}`,
                    }
                }
            },
            COUPON: {
                ROOT: {
                    RELATIVE: "coupon",
                    ABSOLUTE: "/dashboard/logistics/coupon",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "coupon/add-new",
                        ABSOLUTE: "/dashboard/logistics/coupon/add-new",
                    },
                },
            },
        },
        STORE_FRONT: {
            ROOT: {
                RELATIVE: "store-front",
                ABSOLUTE: "/dashboard/store-front",
            },
            COLLECTION: {
                ROOT: {
                    RELATIVE: "collection",
                    ABSOLUTE: "/dashboard/store-front/collection",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "collection/add-new",
                        ABSOLUTE: "/dashboard/store-front/collection/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "collection/update",
                        ABSOLUTE: "/dashboard/store-front/collection/update",
                    },
                },
                DETAILS: {
                    ROOT: {
                        RELATIVE: "collection/:id",
                        ABSOLUTE: "/dashboard/store-front/collection/:id",
                    },
                },
                GET_BY_DATA: (id) => {
                    return {
                        RELATIVE: `collection/${id}`,
                        ABSOLUTE: `/dashboard/store-front/collection/${id}`,
                    }
                }
            },
            SLIDE: {
                ROOT: {
                    RELATIVE: "slide",
                    ABSOLUTE: "/dashboard/store-front/slide",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "slide/add-new",
                        ABSOLUTE: "/dashboard/store-front/slide/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "slide/update",
                        ABSOLUTE: "/dashboard/store-front/slide/update",
                    },
                },
            },
            BANNER: {
                ROOT: {
                    RELATIVE: "banner",
                    ABSOLUTE: "/dashboard/store-front/banner",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "banner/add-new",
                        ABSOLUTE: "/dashboard/store-front/banner/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "banner/update",
                        ABSOLUTE: "/dashboard/store-front/banner/update",
                    },
                },
            },
            APP_HOME: {
                ROOT: {
                    RELATIVE: "app-home",
                    ABSOLUTE: "/dashboard/store-front/app-home",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "app-home/add-new",
                        ABSOLUTE: "/dashboard/store-front/app-home/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "app-home/update",
                        ABSOLUTE: "/dashboard/store-front/app-home/update",
                    },
                },
            },
        },
        SYSTEM: {

            ROOT: {
                RELATIVE: "system",
                ABSOLUTE: "/dashboard/system",
            },
            SETTING: {
                ROOT: {
                    RELATIVE: "setting",
                    ABSOLUTE: "/dashboard/system/setting",
                },
            },
            STATIC_PAGES: {
                ROOT: {
                    RELATIVE: "static-pages",
                    ABSOLUTE: "/dashboard/system/static-pages",
                },
            },
        },
        ADDRESS_SETTING: {
            ROOT: {
                RELATIVE: "address-setting",
                ABSOLUTE: "/dashboard/address-setting",
            },
            FIELD: {
                ROOT: {
                    RELATIVE: "field",
                    ABSOLUTE: "/dashboard/address-setting/field",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "field/add-new",
                        ABSOLUTE: "/dashboard/address-setting/field/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "field/update",
                        ABSOLUTE: "/dashboard/address-setting/field/update",
                    },
                },
            },
            TYPE: {
                ROOT: {
                    RELATIVE: "type",
                    ABSOLUTE: "/dashboard/address-setting/type",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "type/add-new",
                        ABSOLUTE: "/dashboard/address-setting/type/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "type/update",
                        ABSOLUTE: "/dashboard/address-setting/type/update",
                    },
                },
            },
            AREA: {
                ROOT: {
                    RELATIVE: "area",
                    ABSOLUTE: "/dashboard/address-setting/area",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "area/add-new",
                        ABSOLUTE: "/dashboard/address-setting/area/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "area/update",
                        ABSOLUTE: "/dashboard/address-setting/area/update",
                    },
                },
                DETAILS: {
                    ROOT: {
                        RELATIVE: "area/:id",
                        ABSOLUTE: "/dashboard/address-setting/area/:id",
                    },
                },
                GET_BY_DATA: (id) => {
                    return {
                        RELATIVE: `area/${id}`,
                        ABSOLUTE: `/dashboard/address-setting/area/${id}`,
                    }
                }
            },
        },
        VEHICLES: {
            ROOT: {
                RELATIVE: "vehicle",
                ABSOLUTE: "/dashboard/vehicle",
            },
            CARS: {
                ROOT: {
                    RELATIVE: "cars",
                    ABSOLUTE: "/dashboard/vehicle/cars",
                },
                ADD_NEW_CAR: {
                    ROOT: {
                        RELATIVE: "cars/add-new",
                        ABSOLUTE: "/dashboard/vehicle/cars/add-new",
                    },
                },
                UPDATE_CAR: {
                    ROOT: {
                        RELATIVE: "cars/update",
                        ABSOLUTE: "/dashboard/vehicle/cars/update",
                    },
                },
                DETAILS: {
                    RELATIVE: "cars/:id",
                    ABSOLUTE: "/dashboard/vehicle/cars/:id",
                },
                GET_BY_DATA: (id) => {
                    return {
                        RELATIVE: `cars/${id}`,
                        ABSOLUTE: `/dashboard/vehicle/cars/${id}`,
                    }
                }
            },
            BRANDS: {
                ROOT: {
                    RELATIVE: "brands",
                    ABSOLUTE: "/dashboard/vehicle/brands",
                },
                ADD_NEW_BRAND: {
                    ROOT: {
                        RELATIVE: "brands/add-new",
                        ABSOLUTE: "/dashboard/vehicle/brands/add-new",
                    },
                },
                UPDATE_BRAND: {
                    ROOT: {
                        RELATIVE: "brands/update",
                        ABSOLUTE: "/dashboard/vehicle/brands/update",
                    },
                },
            },
            CAR_CLASSES: {
                ROOT: {
                    RELATIVE: "class",
                    ABSOLUTE: "/dashboard/vehicle/class",
                },
                ADD_NEW_CLASS: {
                    ROOT: {
                        RELATIVE: "class/add-new",
                        ABSOLUTE: "/dashboard/vehicle/class/add-new",
                    },
                },
                UPDATE_CLASS: {
                    ROOT: {
                        RELATIVE: "class/update",
                        ABSOLUTE: "/dashboard/vehicle/class/update",
                    },
                },
            },
        },
        ADMINISTRATION: {
            ROOT: {
                RELATIVE: "administration",
                ABSOLUTE: "/dashboard/administration",

            },
            ROLE_GROUP: {
                ROOT: {
                    RELATIVE: "role-group",
                    ABSOLUTE: "/dashboard/administration/role-group",
                },
                ADD_NEW: {
                    ROOT: {
                        RELATIVE: "role-group/add-new",
                        ABSOLUTE: "/dashboard/administration/role-group/add-new",
                    },
                },
                UPDATE: {
                    ROOT: {
                        RELATIVE: "role-group/update",
                        ABSOLUTE: "/dashboard/administration/role-group/update",
                    },
                },
            },
            SMS_PROVIDERS: {
                ROOT: {
                    RELATIVE: "sms-providers",
                    ABSOLUTE: "/dashboard/administration/sms-providers",
                },
            },
            CONFIGURATION: {
                ROOT: {
                    RELATIVE: "configuration",
                    ABSOLUTE: "/dashboard/administration/configuration",
                },
            },
        },
        
        EDIT_STATIC_PAGES: {
            ROOT: {
                RELATIVE: "edit-static-pages",
                ABSOLUTE: "/dashboard/edit-static-pages",
            }
        },
    }
};
