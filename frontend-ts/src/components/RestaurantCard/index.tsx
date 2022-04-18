import {
    Avatar,
    Box,
    Card,
    CardHeader,
    CardMedia,
    IconButton,
    Typography,
} from '@mui/material'
import React from 'react'
import { red } from '@mui/material/colors'
import { MoreVert as MoreVertIcon } from '@mui/icons-material'
import { Photo2, Restaurant } from '../../utils/RestaurantInterface'

interface Props {
    restaurant: Restaurant
}

const RestaurantCard: React.FunctionComponent<Props> = ({ restaurant }) => {
    const photo = restaurant.photos[0]?.photo || null

    return (
        <Card style={{ height: '100%' }}>
            <CardHeader
                // avatar={
                //     <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                //         R
                //     </Avatar>
                // }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={restaurant.name}
                subheader={restaurant.location.address}
            />
            <CardMedia
                component="img"
                image={photo?.url || '/logo192.png'}
                alt={photo?.caption || 'default caption'}
            />
        </Card>
    )
}

export default RestaurantCard
