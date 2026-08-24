export const STORAGE_KEYS = {
  BUSINESS_PROFILE: "zoro_gst_business_profile_v1",
  FIRST_RUN_DISMISSED: "zoro_gst_first_run_dismissed_v1",
  CURRENT_DRAFT: "zoro_gst_current_draft_v1",
  APP_SETTINGS: "zoro_gst_app_settings_v1",
} as const;

export const INDEXED_DB_CONFIG = {
  DB_NAME: "ZoroGstBillingDB",
  DB_VERSION: 1,
  STORES: {
    BILLS_HISTORY: "bills_history",
    PRESET_TEMPLATES: "preset_templates",
  },
  MAX_HISTORY_ITEMS: 10, // Strict FIFO 10-item cap as per PRD
} as const;
