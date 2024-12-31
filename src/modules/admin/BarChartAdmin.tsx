import { BarChart } from "@mui/x-charts/BarChart";
import { DAY_IN_WEEK } from "../../constants";
import { BarCharProp } from "../../types/admin";
import { FC } from "react";

export const BarChartCustom:FC<BarCharProp> = (props)=>{
    return (
        <BarChart
            onItemClick={(_, column) => props.onItemClick(column.dataIndex)}
            dataset={props.requests}
            colors={["#E6D9FB"]}
            xAxis={[{ scaleType: "band", data: DAY_IN_WEEK }]}
            leftAxis={null}
            series={[{ dataKey: "requests" }]}
            borderRadius={10}
            width={700}
            height={400}
            barLabel={"value"}
        />
    )
}