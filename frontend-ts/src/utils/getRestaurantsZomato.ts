import Axios from 'axios'
import { Restaurant } from './RestaurantInterface'

const zomatoGeoResourcesCache: Record<
    string,
    {
        cityType: string
        cityID: string
    }
> = {}

// Zomato Geo Location URL //
async function zomatoGeoResources(lat: string, lon: string) {
    const cacheKey = `georesources-${lat}-${lon}`
    if (zomatoGeoResourcesCache[cacheKey])
        return zomatoGeoResourcesCache[cacheKey]

    const searchURL = `https://developers.zomato.com/api/v2.1/geocode?lat=${lat}&lon=${lon}`
    try {
        const res = await Axios.get<{
            location: {
                entity_type: string
                entity_id: string
            }
        }>(searchURL, {
            headers: {
                'user-key': 'ebaf4ea1c48d3147925a8d04eff4eaf3',
            },
        })
        const cityType = res.data.location.entity_type
        const cityID = res.data.location.entity_id

        const data = {
            cityType,
            cityID,
        }

        zomatoGeoResourcesCache[cacheKey] = data
        return data
    } catch (error) {
        console.log(error)
    }
    return {
        cityType: 'subzone',
        cityID: '125050',
    }
}

const cachedData: Record<string, any> = {}

export const getRestaurantsFromZomato = async (
    cuisineBasedOnEmotion: string,
    lat: string,
    lon: string
): Promise<Restaurant[]> => {
    const resultAmount = 20
    const zomatoGeoResourcesData = await zomatoGeoResources(lat, lon)
    const { cityID, cityType } = zomatoGeoResourcesData

    const cacheKey = `${cuisineBasedOnEmotion}-${cityID}-${cityType}-${lat}-${lon}`

    // Limit the number of api calls, so zomato doesnt block us!!
    const cacheFound = cachedData[cacheKey]
    if (cacheFound) return cacheFound

    try {
        const response = await Axios.get<{
            restaurants: {
                restaurant: Restaurant
            }[]
        }>(
            `https://developers.zomato.com/api/v2.1/search?entity_id=${cityID}&entity_type=${cityType}&q=${cuisineBasedOnEmotion}&count=${resultAmount}&lat=${lat}&lon=${lon}`,
            {
                headers: {
                    'user-key': 'ebaf4ea1c48d3147925a8d04eff4eaf3',
                    Accept: 'application/json',
                },
            }
        )

        const { restaurants } = response.data
        const pureRestaurants = restaurants.map(({ restaurant }) => restaurant)
        cachedData[
            `${cuisineBasedOnEmotion}-${cityID}-${cityType}-${lat}-${lon}`
        ] = pureRestaurants

        console.log(pureRestaurants)
        return pureRestaurants
    } catch (error) {
        console.log(error)
    }

    return []
}
