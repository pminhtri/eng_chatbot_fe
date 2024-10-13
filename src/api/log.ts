import { SummaryUserActivities } from "../types/log"
import { axiosClient } from "../utils"

export const getSummaryUserActivies = async():Promise<SummaryUserActivities[]> => {
    const response = await axiosClient.get("/admin/activity-log")
    return response.data
}