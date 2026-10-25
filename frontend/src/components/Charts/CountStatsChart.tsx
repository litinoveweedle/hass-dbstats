import type {FC} from "react";
import {useEffect} from "react";
import * as React from "react";
import Chart from "react-apexcharts";
import {Alert, useTheme} from "@mui/material";
import {SuspenseLoaderInline} from "../SuspenseLoader";
import type {ICountStats} from "@dbstats/shared/src/stats";
import type {ApexOptions} from "apexcharts";
import colors from "./colors";

type CountStatesChartProps = {
    title: string,
    api: () => Promise<Array<ICountStats>>,
}

function thousandFormatter(value: string): string {
    const num = typeof value === 'string' ? parseInt(value, 10) : value;
    if (num < 1000) {
        return num.toString();
    }
    return num.toLocaleString('en-us');
}

export const CountStatsChart: FC<CountStatesChartProps> = ({title, api}) => {

    const [loading, setLoading] = React.useState(true);
    const [data, setStats] = React.useState<Array<ICountStats> | null>(null);
    const theme = useTheme();
    const [errorMessageLoad, setErrorMessageLoad] = React.useState('');


    function loadStats() {

        const fetchData = async () => {
            setLoading(true);
            const result = await api();

            setStats(result);
            setLoading(false);
        }
        fetchData()
            // make sure to catch any error
            .catch((err) => setErrorMessageLoad(err.message));
    }

    useEffect(loadStats, []);
    useEffect(() => {
        loadStats();
    }, []);
    if (errorMessageLoad) {
        return (
            <Alert style={{marginTop: 25}} severity="error">{errorMessageLoad}</Alert>)
    }
    if (loading) {
        return <SuspenseLoaderInline success={false}></SuspenseLoaderInline>;
    }


    const state: { options: ApexOptions, series: ApexAxisChartSeries } = {
                options: {
                    colors: colors(data.length, theme.palette.background.paper),
                    legend: {
                        show: false,
                    },
                    title: {text: title, align: "center", style: {color: theme.palette.text.primary}},
                    theme: {mode: theme.palette.mode},
                    chart: {
                        background: 'transparent',
                        foreColor: theme.palette.text.primary,
                    },
                    grid: {borderColor: theme.palette.divider},
                    tooltip: {theme: theme.palette.mode},
                    plotOptions: {
                        bar: {
                            distributed: true,
                            borderRadius: 4,
                            borderRadiusApplication: 'end',
                            horizontal: true,
                        }
                    }, dataLabels: {
                        style: {fontSize: "14"},
                        //formatter: thousandFormatter,
                    },
                    yaxis: {
                        floating: false,
                        labels: {
                            maxWidth: 700,
                            align: 'right',
                            style: {
                                fontSize: "14",
                            },
                        },
                    },
                    xaxis: {
                        categories: data.map(item => item.type),
                        labels: {
                            formatter: thousandFormatter,
                            trim: false,
                            style: {
                                fontSize: "14",
                            },
                        },
                    }
                },
                series: [
                    {
                        name: "",
                        data: data.map(item => item.cnt)
                    }
                ]
            };

    return (
        <Chart style={{marginTop: 25}}
               options={state.options}
               series={state.series}
               type="bar"
               width="100%"
               height={state.series[0].data.length * 45}
        />
    );
}
