import { RequestsInWeek, SummaryUserActivities } from "../types/log";
import { axiosClient } from "../utils";

export const getSummaryUserActivities = async (
  date: Date,
): Promise<SummaryUserActivities[]> => {
  const response = await axiosClient.get(`/admin/activity-log/${date}`);
  return response.data;
};
export const getRequestsInWeek = async (
  currentDate: Date,
): Promise<RequestsInWeek[]> => {
  const response = await axiosClient.get(
    `/admin/requests-week?currentDate=${currentDate}`,
  );
  return response.data;
};
