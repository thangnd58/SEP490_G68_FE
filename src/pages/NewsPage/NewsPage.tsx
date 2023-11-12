import { Box, Typography } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { News } from "../../utils/type";
import { useState, useEffect } from 'react'
import NewsManagementService from "../../services/NewsManagementService";
import { ROUTES } from "../../utils/Constant";
import useThemePage from "../../hooks/useThemePage";
import usei18next from "../../hooks/usei18next";

export const NewsPage = () => {
    const [listNews, setListNews] = useState<News[]>([])
    const { t } = usei18next();
    const { isMobile } = useThemePage();
    const navigate = useNavigate();
    useEffect(() => {
        NewsManagementService.getAllNews().then((data) => {
            //@ts-ignore
            setListNews(data)
        })
    }, [])

    return (
        <>
            {
                listNews && listNews.length > 0 &&
                <Box display={'flex'} flexDirection={'column'} gap={'8px'} p={'48px'} color={'text.primary'}>
                    
                </Box>
            }
        </>
    )
}