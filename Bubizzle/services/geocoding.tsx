import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDxwbSv4YqUpyT9mj8bsLRbAOTHkf8vHLA';

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );

    const results = response.data.results;
    if (results && results.length > 0) {
      return results[0].formatted_address;
    }

    return 'Unknown location';
  } catch (error) {
    return 'Unknown location';
  }
};
