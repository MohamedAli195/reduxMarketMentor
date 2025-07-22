import { useParams } from "react-router-dom"
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ViewAnalyticsForm from "components/analytics/ViewAnalyticsForm/ViewAgendaForm";
import { useGetAnalyticQuery } from "app/features/analytics/analyticsSlice";
import { useGetStartMenuQuery } from "app/features/StartMenu/StartMenuSlice";
import ViewStartMenuForm from "components/StartMenu/ViewStartMenuForm/ViewStartMenuForm";
function StartMenuDetails() {
    const { id } = useParams();
    const { t } = useTranslation()
    const { data, error, isLoading, isError } = useGetStartMenuQuery(id)
    if (isLoading) return <p>Loading...</p>;
    // if (isError) return <p>Error: {error.message}</p>;
    return (
        <>
        <Typography variant="h1" color="initial">
        {t("StartMenuPage")}
        </Typography>
        <ViewStartMenuForm initialData ={data?.data}/>
        </>
    );
}

export default StartMenuDetails;
