import axios from 'axios';

import {GOOGLE_MAPS_API_KEY} from '@env';

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
