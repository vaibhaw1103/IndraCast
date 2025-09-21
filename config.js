// Weather App Configuration
// This file manages API keys and application settings

const CONFIG = {
    // API Keys - In production, these should be loaded securely
    API_KEYS: {
        OPENWEATHERMAP: 'ab0507c811b374496c0ff191113d11b2',
        WEATHERBIT: 'ff025bad1da445a6af3a9b93da5757c4',
        // Open-Meteo is free and doesn't require an API key
        OPEN_METEO: null,
        // NOAA and other government services
        NOAA: null // NOAA API is free
    },

    // API Endpoints
    ENDPOINTS: {
        OPENWEATHERMAP: {
            CURRENT: 'https://api.openweathermap.org/data/2.5/weather',
            FORECAST: 'https://api.openweathermap.org/data/2.5/forecast',
            ONECALL: 'https://api.openweathermap.org/data/3.0/onecall',
            GEOCODING: 'https://api.openweathermap.org/geo/1.0/direct',
            AIR_POLLUTION: 'https://api.openweathermap.org/data/2.5/air_pollution'
        },
        WEATHERBIT: {
            CURRENT: 'https://api.weatherbit.io/v2.0/current',
            FORECAST_DAILY: 'https://api.weatherbit.io/v2.0/forecast/daily',
            FORECAST_HOURLY: 'https://api.weatherbit.io/v2.0/forecast/hourly'
        },
        OPEN_METEO: {
            FORECAST: 'https://api.open-meteo.com/v1/forecast',
            GEOCODING: 'https://geocoding-api.open-meteo.com/v1/search',
            AIR_QUALITY: 'https://air-quality-api.open-meteo.com/v1/air-quality'
        },
        NOAA: {
            ALERTS: 'https://api.weather.gov/alerts/active',
            FORECAST: 'https://api.weather.gov/points'
        }
    },

    // Default settings
    DEFAULTS: {
        TEMPERATURE_UNIT: 'celsius',
        WIND_UNIT: 'kmh',
        PRESSURE_UNIT: 'hPa',
        AUTO_REFRESH: true,
        REFRESH_INTERVAL: 300000, // 5 minutes
        REDUCE_MOTION: false,
        THEME: 'auto', // 'light', 'dark', 'auto'
        HIGH_CONTRAST: false
    },

    // Weather condition mappings for better icons and descriptions
    WEATHER_CONDITIONS: {
        // OpenWeatherMap condition codes
        200: { icon: '⛈️', description: 'Thunderstorm with light rain' },
        201: { icon: '⛈️', description: 'Thunderstorm with rain' },
        202: { icon: '⛈️', description: 'Thunderstorm with heavy rain' },
        210: { icon: '🌩️', description: 'Light thunderstorm' },
        211: { icon: '⛈️', description: 'Thunderstorm' },
        212: { icon: '⛈️', description: 'Heavy thunderstorm' },
        221: { icon: '⛈️', description: 'Ragged thunderstorm' },
        230: { icon: '⛈️', description: 'Thunderstorm with light drizzle' },
        231: { icon: '⛈️', description: 'Thunderstorm with drizzle' },
        232: { icon: '⛈️', description: 'Thunderstorm with heavy drizzle' },
        
        300: { icon: '🌦️', description: 'Light intensity drizzle' },
        301: { icon: '🌦️', description: 'Drizzle' },
        302: { icon: '🌦️', description: 'Heavy intensity drizzle' },
        310: { icon: '🌦️', description: 'Light intensity drizzle rain' },
        311: { icon: '🌦️', description: 'Drizzle rain' },
        312: { icon: '🌦️', description: 'Heavy intensity drizzle rain' },
        313: { icon: '🌦️', description: 'Shower rain and drizzle' },
        314: { icon: '🌦️', description: 'Heavy shower rain and drizzle' },
        321: { icon: '🌦️', description: 'Shower drizzle' },
        
        500: { icon: '🌧️', description: 'Light rain' },
        501: { icon: '🌧️', description: 'Moderate rain' },
        502: { icon: '🌧️', description: 'Heavy intensity rain' },
        503: { icon: '🌧️', description: 'Very heavy rain' },
        504: { icon: '🌧️', description: 'Extreme rain' },
        511: { icon: '🌨️', description: 'Freezing rain' },
        520: { icon: '🌦️', description: 'Light intensity shower rain' },
        521: { icon: '🌦️', description: 'Shower rain' },
        522: { icon: '🌦️', description: 'Heavy intensity shower rain' },
        531: { icon: '🌦️', description: 'Ragged shower rain' },
        
        600: { icon: '🌨️', description: 'Light snow' },
        601: { icon: '🌨️', description: 'Snow' },
        602: { icon: '❄️', description: 'Heavy snow' },
        611: { icon: '🌨️', description: 'Sleet' },
        612: { icon: '🌨️', description: 'Light shower sleet' },
        613: { icon: '🌨️', description: 'Shower sleet' },
        615: { icon: '🌨️', description: 'Light rain and snow' },
        616: { icon: '🌨️', description: 'Rain and snow' },
        620: { icon: '🌨️', description: 'Light shower snow' },
        621: { icon: '🌨️', description: 'Shower snow' },
        622: { icon: '❄️', description: 'Heavy shower snow' },
        
        701: { icon: '🌫️', description: 'Mist' },
        711: { icon: '💨', description: 'Smoke' },
        721: { icon: '🌫️', description: 'Haze' },
        731: { icon: '💨', description: 'Sand/dust whirls' },
        741: { icon: '🌫️', description: 'Fog' },
        751: { icon: '💨', description: 'Sand' },
        761: { icon: '💨', description: 'Dust' },
        762: { icon: '🌋', description: 'Volcanic ash' },
        771: { icon: '💨', description: 'Squalls' },
        781: { icon: '🌪️', description: 'Tornado' },
        
        800: { icon: '☀️', description: 'Clear sky' },
        801: { icon: '🌤️', description: 'Few clouds' },
        802: { icon: '⛅', description: 'Scattered clouds' },
        803: { icon: '🌥️', description: 'Broken clouds' },
        804: { icon: '☁️', description: 'Overcast clouds' }
    },

    // Air Quality Index levels and health advice
    AQI_LEVELS: {
        0: { label: 'Good', color: '#00e400', advice: 'Air quality is great! Perfect for outdoor activities.' },
        1: { label: 'Fair', color: '#ffff00', advice: 'Air quality is acceptable for most people.' },
        2: { label: 'Moderate', color: '#ff7e00', advice: 'Sensitive individuals should consider limiting outdoor activities.' },
        3: { label: 'Poor', color: '#ff0000', advice: 'Everyone should limit outdoor activities.' },
        4: { label: 'Very Poor', color: '#8f3f97', advice: 'Avoid outdoor activities. Keep windows closed.' }
    },

    // UV Index levels and recommendations
    UV_LEVELS: {
        0: { level: 'Low', advice: 'No protection needed' },
        3: { level: 'Moderate', advice: 'Some protection required' },
        6: { level: 'High', advice: 'Protection essential' },
        8: { level: 'Very High', advice: 'Extra protection needed' },
        11: { level: 'Extreme', advice: 'Avoid sun exposure' }
    },

    // Application constants
    APP: {
        NAME: 'WeatherSync',
        VERSION: '1.0.0',
        CACHE_DURATION: 300000, // 5 minutes
        MAX_OBSERVATIONS: 50,
        ANIMATION_DURATION: 300,
        DEBOUNCE_DELAY: 500
    }
};

// Export configuration for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
