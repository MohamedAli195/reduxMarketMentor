import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";

// import { fetchCategory } from "./categoriesFunct";
import ViewCategoryForm from "components/Category/viewCategoriesForm/ViewCategoryForm";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { fetchOne } from "functions";

function CategoriesDetails() {
    const { id } = useParams();
    const { t } = useTranslation();
    const { data, error, isLoading, isError } = useQuery({
        queryKey: ['packageDetail', id],
        queryFn: () => fetchOne(id,'categories'),
    });

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error: {error.message}</p>;



    return (
        <>
        <Typography variant="h1" color="initial">
        {t("categorypage")}
        </Typography>
        <ViewCategoryForm initialData ={data?.data}/>
        </>
    );
}

export default CategoriesDetails;
