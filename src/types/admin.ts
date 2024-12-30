export type SummaryUserActivities = {
  email: string;
  total_messages: number;
};
export type RequestsInWeek = {
  date: string;
  total_messages: number;
};

export type BarCharProp = {
  onItemClick:(index:number) => void,
  requests : RequestsInWeek[]
}
export type TableProp = {
  data: SummaryUserActivities[]
}