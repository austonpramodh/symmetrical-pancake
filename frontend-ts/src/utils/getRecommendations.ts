import { getRestaurantsFromZomato } from './getRestaurantsZomato'
import { Restaurant } from './RestaurantInterface'

// Gets the user location //

const getUserLocation = () =>
    new Promise<{
        lat: string
        lon: string
    }>((resolve) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (location) => {
                    const lat = `${location.coords.latitude}`
                    const lon = `${location.coords.longitude}`
                    resolve({ lat, lon })
                },
                (error) => {
                    console.log(error)
                    resolve({ lat: '40.7417046', lon: '-74.1628354' })
                }
            )
        }
    })

/* eslint-disable consistent-return */
// const expressionRestaurantTypeMap = {
//     neutral: '',
//     angry: 'fast food, pizzerias, food truck',
//     surprised: '',
//     disgusted: '',
//     happy: 'cafés, fine dining, bars',
//     sad: 'fast casual, taquerias, wine bars',
//     fearful: '',
// }
const expressionRestaurantTypeMap = {
    neutral: 'fast food, pizzerias, food truck',
    angry: 'fast food, pizzerias, food truck',
    surprised: 'fast food, pizzerias, food truck',
    disgusted: 'fast food, pizzerias, food truck',
    happy: 'cafés, fine dining, bars',
    sad: 'fast food, pizzerias, food truck',
    fearful: 'fast food, pizzerias, food truck',
}

export const getRestaurantRecommendations = async (
    emotion: string
): Promise<Restaurant[]> => {
    const restaurantTypes =
        expressionRestaurantTypeMap[
            emotion as keyof typeof expressionRestaurantTypeMap
        ]

    // Get the location data from the user

    // Call the zomato api
    //  get the cuisuinne from the map
    if (restaurantTypes) {
        const locatonData = await getUserLocation()
        const { lat, lon } = locatonData
        const response = await getRestaurantsFromZomato(
            restaurantTypes,
            lat,
            lon
        )
        return response
    }
    return []
}
