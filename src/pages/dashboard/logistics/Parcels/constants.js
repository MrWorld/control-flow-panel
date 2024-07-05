export const parcelTabs = [
  {
    label: "Time line (asap)",
    value: "TIME_LINE_ASAP",
  },
  {
    label: "Time line (range)",
    value: "TIME_LINE_RANEG",
  },
  {
    label: "Kanban view",
    value: "KANBAN_VIEW",
  },
];

export const parcelKanbanColumns = {
  PROCESSING: {
    title: "processing",
    slug: "PROCESSING",
    parcels: [],
  },
  PREPARING: {
    title: "preparing",
    slug: "PREPARING",
    parcels: [],
  },
  READYFORDELIVERY: {
    title: "Ready for delivery",
    slug: "READYFORDELIVERY",
    parcels: [],
  },
  ON_THE_WAY: {
    title: "On The Way",
    slug: "ON_THE_WAY",
    parcels: [],
  },
  DELIVERED: {
    title: "Delivered",
    slug: "DELIVERED",
    parcels: [],
  },
  CANCELLED: {
    title: "Cancelled",
    slug: "CANCELLED",
    parcels: [],
  },
};

export const timeLinePeriod = {
  hoursBefore: 7,
  durationHours: 24,
};

export const parcelCardDimension = {
  width: 290,
  height: 130,
};

export const parcelStatusDict = {
  PROCESSING: "processing",
  PREPARING: "In Progress",
  READYFORDELIVERY: "Ready For Delivery",
  ON_THE_WAY: "On The Way ",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const parcelSelectorColors = {
  PROCESSING: "#7b8089",
  PREPARING: "#64d9ff",
  READYFORDELIVERY: "#fad800",
  ON_THE_WAY: "#ffaf3d",
  DELIVERED: "#00e200",
  CANCELLED: "#ff2A04",
};

export const parcelStatusOptions = ["option one"];
