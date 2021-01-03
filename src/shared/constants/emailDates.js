const numberOfDaysToLookBack = 7;
export const LOOK_BACK_DATE = new Date(new Date() - (numberOfDaysToLookBack * 24 * 60 * 60 * 1000));
