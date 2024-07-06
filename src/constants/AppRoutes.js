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
        // RESET_PASSWORD: {
        //     RELATIVE: "reset-password",
        //     ABSOLUTE: "/auth/reset-password",
        // },
        // FORGOT_PASSWORD: {
        //     RELATIVE: "forgot-password",
        //     ABSOLUTE: "/auth/forgot-password",
        // },
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
        OPERATION: {
            RELATIVE: "operation",
            ABSOLUTE: "/dashboard/operation",
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
        TASK: {
            ROOT: {
                RELATIVE: "task",
                ABSOLUTE: "/dashboard/task",
            },
            ADD_NEW: {
                RELATIVE: "task/new",
                ABSOLUTE: "/dashboard/task/new",
            },
            DETAILS: {
                RELATIVE: "task/:id",
                ABSOLUTE: "/dashboard/task/:id",
            },
            GET_BY_DATA: (id) => {
                return {
                    RELATIVE: `task/${id}`,
                    ABSOLUTE: `/dashboard/task/${id}`,
                }
            }
        },
        USER: {
            ROOT: {
                RELATIVE: "user",
                ABSOLUTE: "/dashboard/user",
            },
            ADD_NEW: {
                RELATIVE: "user/new",
                ABSOLUTE: "/dashboard/user/new",
            },
            DETAILS: {
                RELATIVE: "user/:id",
                ABSOLUTE: "/dashboard/user/:id",
            },
            GET_BY_DATA: (id) => {
                return {
                    RELATIVE: `user/${id}`,
                    ABSOLUTE: `/dashboard/user/${id}`,
                }
            }
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
