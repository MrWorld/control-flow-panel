export const taskStatusWithPercentage = {
  TO_DO: {
    name: "در انتظار شروع",
    color: "#0000FF", // Blue
    percentage: 0,
  },
  MANUFACTURING_PROGRESS: {
    name: "در حال ساخت",
    color: "#FFA500", // Orange
    percentage: 10,
  },
  QC_PROGRESS: {
    name: "پروسه کنترل کیفیت",
    color: "#800080", // Purple
    percentage: 50,
  },
  QA_PROGRESS: {
    name: "پروسه تضمین کیفیت",
    color: "#008080", // Teal
    percentage: 60,
  },
  PACKAGING: {
    name: "بسته بندی",
    color: "#FFB211", // Yellow
    percentage: 80,
  },
  PENDING_APPROVAL: {
    name: "در انتظار تایید نهایی",
    color: "#808080", // Gray
    percentage: 90,
  },
  DONE: {
    name: "تمام شده",
    color: "#008000", // Green
    percentage: 100,
  },
};

export const StationStatus = {
  OFFLINE: {
    name: "خاموش",
    color: "#ff000d", // Green
  },
  ACTIVE: {
    name: "فعال",
    color: "#008000", // Green
  },
  DEACTIVE: {
    name: "غیر فعال",
    color: "#FFA500", // Orange
  },
};
