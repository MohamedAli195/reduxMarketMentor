import { useParams } from "react-router-dom"
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ViewAnalyticsForm from "components/analytics/ViewAnalyticsForm/ViewAgendaForm";
import { useGetAnalyticQuery } from "app/features/analytics/analyticsSlice";
function AnalyticsDetails() {
    const { id } = useParams();
    const { t } = useTranslation()
    const { data, error, isLoading, isError } = useGetAnalyticQuery(id)
    if (isLoading) return <p>Loading...</p>;
    // if (isError) return <p>Error: {error.message}</p>;
    return (
        <>
        <Typography variant="h1" color="initial">
        {t("analyticsPage")}
        </Typography>
        <ViewAnalyticsForm initialData ={data?.data}/>
        </>
    );
}

export default AnalyticsDetails;
