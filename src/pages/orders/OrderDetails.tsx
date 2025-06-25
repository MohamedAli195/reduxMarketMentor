// import { useLocation, useParams } from "react-router-dom"
// import { fetchCustomer } from "./costumersFunct";
// import { useQuery } from "@tanstack/react-query";
// import ViewPackageForm from "components/viewpackageForm";
// import { useEffect } from "react";
// import i18n from "i18n";
// import { Typography } from "@mui/material";
// import { useTranslation } from "react-i18next";

// function customerDetails() {
//     const { id } = useParams();
//     const { t } = useTranslation();
//     const { data, error, isLoading, isError } = useQuery({
//         queryKey: ['packageDetail', id],
//         queryFn: () => fetchCustomer(id),
//     });

//     if (isLoading) return <p>Loading...</p>;
//     if (isError) return <p>Error: {error.message}</p>;



//     return (
//         <>
//         <Typography variant="h1" color="initial">
//         {t("packagPage")}
//         </Typography>
//         <ViewPackageForm initialData ={data?.data}/>
//         </>
//     );
// }

// export default customerDetails;
