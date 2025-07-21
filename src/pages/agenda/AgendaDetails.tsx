import { useParams } from "react-router-dom"
// import { fetchCategory } from "./categoriesFunct";
import ViewCategoryForm from "components/Category/viewCategoriesForm/ViewCategoryForm";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGetCategoryQuery } from "app/features/Categories/CategoriesSlice";
import ViewAgendaForm from "components/agenda/ViewAgendaForm/ViewAgendaForm";
import { useGetAgendaQuery } from "app/features/agenda/AgendaSlice";
function AgendaDetails() {
    const { id } = useParams();
    const { t } = useTranslation()
    const { data, error, isLoading, isError } = useGetAgendaQuery(id)
    if (isLoading) return <p>Loading...</p>;
    // if (isError) return <p>Error: {error.message}</p>;
    return (
        <>
        <Typography variant="h1" color="initial">
        {t("categorypage")}
        </Typography>
        <ViewAgendaForm initialData ={data?.data}/>
        </>
    );
}

export default AgendaDetails;
