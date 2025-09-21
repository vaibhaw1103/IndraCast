/**
 * WeatherSync - Advanced Weather Dashboard
 * Modern weather app with ensemble forecasting, accessibility features, and hyperlocal observations
 */

class WeatherApp {
    constructor() {
        this.currentLocation = null;
        this.weatherData = {
            current: null,
            hourly: [],
            daily: [],
            alerts: [],
            airQuality: null
        };
        this.settings = { ...CONFIG.DEFAULTS };
        this.isLoading = false;
        this.refreshTimer = null;

        this.init();
    }

    /**
     * Initialize the weather application
     */
    async init() {
        console.log('Initializing WeatherSync...');

        // Load saved settings
        this.loadSettings();

        // Set up event listeners
        this.setupEventListeners();

        // Initialize dark mode
        this.initializeDarkMode();

        // Initialize local storage for observations
        await this.initializeStorage();

        // Load existing observations
        await this.loadObservations();

        // Try to get user's location and load weather data
        await this.initializeLocation();

        console.log('WeatherSync initialized successfully');
    }

    /**
     * Set up all event listeners for the application
     */
    setupEventListeners() {
        // Search functionality
        const searchForm = document.querySelector('.search-form');
        const locationBtn = document.querySelector('.location-btn');
        const refreshBtn = document.querySelector('.refresh-btn');

        if (searchForm) {
            searchForm.addEventListener('submit', (e) => this.handleLocationSearch(e));
        }

        if (locationBtn) {
            locationBtn.addEventListener('click', () => this.getCurrentLocation());
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshWeatherData());
        }

        // Theme and accessibility controls
        const darkModeToggle = document.querySelector('.dark-mode-toggle');
        const contrastToggle = document.querySelector('.contrast-toggle');
        const settingsBtn = document.querySelector('.settings-btn');

        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
        }

        if (contrastToggle) {
            contrastToggle.addEventListener('click', () => this.toggleHighContrast());
        }

        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }

        // Modal controls
        this.setupModalControls();

        // Observation form
        this.setupObservationForm();

        // Keyboard navigation
        this.setupKeyboardNavigation();

        // Handle reduced motion preference
        this.handleReducedMotion();
    }

    /**
     * Set up modal controls for settings and observations
     */
    setupModalControls() {
        // Settings modal
        const settingsModal = document.getElementById('settings-modal');
        const settingsClose = settingsModal?.querySelector('.modal-close');

        if (settingsClose) {
            settingsClose.addEventListener('click', () => this.closeModal('settings-modal'));
        }

        // Observation modal
        const observationModal = document.getElementById('observation-modal');
        const observationClose = observationModal?.querySelector('.modal-close');
        const addObservationBtn = document.querySelector('.add-observation-btn');
        const cancelObservation = document.getElementById('cancel-observation');

        if (observationClose) {
            observationClose.addEventListener('click', () => this.closeModal('observation-modal'));
        }

        if (addObservationBtn) {
            addObservationBtn.addEventListener('click', () => this.openObservationModal());
        }

        if (cancelObservation) {
            cancelObservation.addEventListener('click', () => this.closeModal('observation-modal'));
        }

        // Close modals on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal(e.target.id);
            }
        });

        // Close modals on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal-overlay[style*="block"]');
                if (openModal) {
                    this.closeModal(openModal.id);
                }
            }
        });
    }

    /**
     * Set up observation form functionality
     */
    setupObservationForm() {
        const observationForm = document.getElementById('observation-form');
        const intensitySlider = document.getElementById('obs-intensity');
        const intensityValue = document.getElementById('intensity-value');

        if (intensitySlider && intensityValue) {
            intensitySlider.addEventListener('input', (e) => {
                intensityValue.textContent = e.target.value;
            });
        }

        if (observationForm) {
            observationForm.addEventListener('submit', (e) => this.handleObservationSubmit(e));
        }
    }

    /**
     * Set up keyboard navigation for accessibility
     */
    setupKeyboardNavigation() {
        // Handle keyboard navigation for cards and interactive elements
        const cards = document.querySelectorAll('.weather-card');
        const buttons = document.querySelectorAll('button, [tabindex="0"]');

        // Make cards focusable and add keyboard interaction
        cards.forEach(card => {
            if (!card.hasAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
            }

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    // Allow cards to be "activated" with keyboard
                    card.click();
                }
            });
        });

        // Enhanced focus management
        document.addEventListener('keydown', (e) => {
            // Skip to main content
            if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
                const skipLink = document.querySelector('.skip-link');
                if (skipLink) {
                    skipLink.focus();
                }
            }
        });
    }

    /**
     * Handle reduced motion preferences
     */
    handleReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion || this.settings.REDUCE_MOTION) {
            document.body.classList.add('reduce-motion');
        }

        // Listen for changes in motion preference
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('reduce-motion');
            } else {
                document.body.classList.remove('reduce-motion');
            }
        });
    }

    /**
     * Initialize dark mode from saved settings
     */
    initializeDarkMode() {
        const savedTheme = localStorage.getItem('weather-app-theme') || 'light';
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            this.updateDarkModeIcon(true);
        }
    }

    /**
     * Toggle dark mode
     */
    toggleDarkMode() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const isDark = currentTheme === 'dark';
        
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('weather-app-theme', 'light');
            this.updateDarkModeIcon(false);
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('weather-app-theme', 'dark');
            this.updateDarkModeIcon(true);
        }
    }

    /**
     * Update dark mode icon
     */
    updateDarkModeIcon(isDark) {
        const darkModeToggle = document.querySelector('.dark-mode-toggle span');
        if (darkModeToggle) {
            darkModeToggle.textContent = isDark ? '☀️' : '🌙';
        }
    }

    /**
     * Toggle high contrast mode
     */
    toggleHighContrast() {
        document.body.classList.toggle('high-contrast');
        this.settings.HIGH_CONTRAST = document.body.classList.contains('high-contrast');
        this.saveSettings();
    }

    /**
     * Initialize local storage for hyperlocal observations
     */
    async initializeStorage() {
        // Check if IndexedDB is available
        if ('indexedDB' in window) {
            try {
                // We'll implement IndexedDB storage for observations
                this.dbName = 'WeatherObservations';
                this.dbVersion = 1;

                console.log('IndexedDB storage initialized');
            } catch (error) {
                console.warn('IndexedDB not available, falling back to localStorage');
                this.useLocalStorage = true;
            }
        } else {
            console.warn('IndexedDB not supported, using localStorage');
            this.useLocalStorage = true;
        }
    }

    /**
     * Initialize location detection and load initial weather data
     */
    async initializeLocation() {
        this.showLoading('Detecting your location...');

        try {
            // Try to get saved location first
            const savedLocation = this.getSavedLocation();

            if (savedLocation) {
                console.log('Using saved location:', savedLocation);
                this.currentLocation = savedLocation;
                await this.loadWeatherData();
            } else {
                // Try to get current location
                await this.getCurrentLocation();
            }
        } catch (error) {
            console.error('Error initializing location:', error);
            // Fallback to a default location (e.g., New York)
            this.currentLocation = {
                lat: 40.7128,
                lon: -74.0060,
                name: 'New York, NY',
                country: 'US'
            };
            await this.loadWeatherData();
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Get user's current location using Geolocation API
     */
    async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            this.showLoading('Getting your location...');

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        // Reverse geocode to get location name
                        const locationName = await this.reverseGeocode(latitude, longitude);

                        this.currentLocation = {
                            lat: latitude,
                            lon: longitude,
                            name: locationName.name,
                            country: locationName.country
                        };

                        this.saveLocation(this.currentLocation);
                        await this.loadWeatherData();
                        resolve(this.currentLocation);
                    } catch (error) {
                        console.error('Error getting location name:', error);
                        reject(error);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    let message = 'Unable to get your location';

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message = 'Location access denied by user';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message = 'Location information unavailable';
                            break;
                        case error.TIMEOUT:
                            message = 'Location request timed out';
                            break;
                    }

                    this.showError(message);
                    reject(new Error(message));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        });
    }

    /**
     * Reverse geocode coordinates to get location name
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @returns {Object} Location information
     */
    async reverseGeocode(lat, lon) {
        try {
            // Use OpenWeatherMap geocoding API
            const url = `${CONFIG.ENDPOINTS.OPENWEATHERMAP.GEOCODING}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${CONFIG.API_KEYS.OPENWEATHERMAP}`;

            const response = await this.fetchWithTimeout(url);
            const data = await response.json();

            if (data && data.length > 0) {
                const location = data[0];
                return {
                    name: `${location.name}${location.state ? ', ' + location.state : ''}`,
                    country: location.country
                };
            }

            throw new Error('No location found');
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return {
                name: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
                country: 'Unknown'
            };
        }
    }

    /**
     * Handle location search form submission
     * @param {Event} e - Form submit event
     */
    async handleLocationSearch(e) {
        e.preventDefault();

        const searchInput = document.getElementById('location-search');
        const query = searchInput.value.trim();

        if (!query) return;

        this.showLoading(`Searching for "${query}"...`);

        try {
            const locations = await this.searchLocations(query);

            if (locations.length === 0) {
                this.showError('Location not found. Please try a different search.');
                return;
            }

            // Use the first result
            const location = locations[0];
            this.currentLocation = {
                lat: location.lat,
                lon: location.lon,
                name: location.name,
                country: location.country
            };

            this.saveLocation(this.currentLocation);
            await this.loadWeatherData();

            // Clear search input
            searchInput.value = '';

        } catch (error) {
            console.error('Location search error:', error);
            this.showError('Error searching for location. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Search for locations by name
     * @param {string} query - Search query
     * @returns {Array} Array of location results
     */
    async searchLocations(query) {
        try {
            // Use OpenWeatherMap geocoding API
            const url = `${CONFIG.ENDPOINTS.OPENWEATHERMAP.GEOCODING}?q=${encodeURIComponent(query)}&limit=5&appid=${CONFIG.API_KEYS.OPENWEATHERMAP}`;

            const response = await this.fetchWithTimeout(url);
            const data = await response.json();

            return data.map(location => ({
                lat: location.lat,
                lon: location.lon,
                name: `${location.name}${location.state ? ', ' + location.state : ''}`,
                country: location.country
            }));
        } catch (error) {
            console.error('Location search error:', error);
            throw error;
        }
    }

    /**
     * Load weather data from multiple APIs for ensemble forecasting
     */
    async loadWeatherData() {
        if (!this.currentLocation) {
            console.error('No location available for weather data');
            return;
        }

        this.showLoading('Loading weather data...');

        try {
            // Update location display
            this.updateLocationDisplay();

            // Fetch data from multiple APIs in parallel for ensemble forecasting
            const promises = [
                this.fetchOpenWeatherMapData(),
                this.fetchWeatherbitData(),
                this.fetchOpenMeteoData(),
                this.fetchAirQualityData(),
                this.fetchGovernmentAlerts()
            ];

            const results = await Promise.allSettled(promises);

            // Process ensemble weather data
            this.processEnsembleData(results);

            // Update UI with new data
            this.updateWeatherDisplay();
            this.updateForecastDisplay();
            this.updateAirQualityDisplay();
            this.updateHealthTips();
            this.updateAlertsDisplay();

            // Update last updated time
            this.updateLastUpdated();

            // Save timestamp for last update
            localStorage.setItem('weather-app-last-update', Date.now().toString());

            // Set up auto-refresh if enabled
            this.setupAutoRefresh();

            console.log('Weather data loaded successfully');

        } catch (error) {
            console.error('Error loading weather data:', error);
            this.showError('Error loading weather data. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Fetch weather data from OpenWeatherMap API
     */
    async fetchOpenWeatherMapData() {
        const { lat, lon } = this.currentLocation;

        try {
            // Fetch current weather and forecast
            const currentUrl = `${CONFIG.ENDPOINTS.OPENWEATHERMAP.CURRENT}?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEYS.OPENWEATHERMAP}&units=metric`;
            const forecastUrl = `${CONFIG.ENDPOINTS.OPENWEATHERMAP.FORECAST}?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEYS.OPENWEATHERMAP}&units=metric`;

            const [currentResponse, forecastResponse] = await Promise.all([
                this.fetchWithTimeout(currentUrl),
                this.fetchWithTimeout(forecastUrl)
            ]);

            const currentData = await currentResponse.json();
            const forecastData = await forecastResponse.json();

            return {
                source: 'openweathermap',
                current: currentData,
                forecast: forecastData
            };
        } catch (error) {
            console.error('OpenWeatherMap API error:', error);
            throw error;
        }
    }

    /**
     * Fetch weather data from Weatherbit API
     */
    async fetchWeatherbitData() {
        const { lat, lon } = this.currentLocation;

        try {
            const currentUrl = `${CONFIG.ENDPOINTS.WEATHERBIT.CURRENT}?lat=${lat}&lon=${lon}&key=${CONFIG.API_KEYS.WEATHERBIT}`;
            const dailyUrl = `${CONFIG.ENDPOINTS.WEATHERBIT.FORECAST_DAILY}?lat=${lat}&lon=${lon}&key=${CONFIG.API_KEYS.WEATHERBIT}&days=7`;
            const hourlyUrl = `${CONFIG.ENDPOINTS.WEATHERBIT.FORECAST_HOURLY}?lat=${lat}&lon=${lon}&key=${CONFIG.API_KEYS.WEATHERBIT}&hours=24`;

            const [currentResponse, dailyResponse, hourlyResponse] = await Promise.all([
                this.fetchWithTimeout(currentUrl),
                this.fetchWithTimeout(dailyUrl),
                this.fetchWithTimeout(hourlyUrl)
            ]);

            const currentData = await currentResponse.json();
            const dailyData = await dailyResponse.json();
            const hourlyData = await hourlyResponse.json();

            return {
                source: 'weatherbit',
                current: currentData.data[0],
                daily: dailyData.data,
                hourly: hourlyData.data
            };
        } catch (error) {
            console.error('Weatherbit API error:', error);
            throw error;
        }
    }

    /**
     * Fetch weather data from Open-Meteo API (free, no API key required)
     */
    async fetchOpenMeteoData() {
        const { lat, lon } = this.currentLocation;

        try {
            const url = `${CONFIG.ENDPOINTS.OPEN_METEO.FORECAST}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto`;

            const response = await this.fetchWithTimeout(url);
            const data = await response.json();

            return {
                source: 'open-meteo',
                data: data
            };
        } catch (error) {
            console.error('Open-Meteo API error:', error);
            throw error;
        }
    }

    /**
     * Fetch air quality data
     */
    async fetchAirQualityData() {
        const { lat, lon } = this.currentLocation;

        try {
            // Try OpenWeatherMap air pollution API first
            const owmUrl = `${CONFIG.ENDPOINTS.OPENWEATHERMAP.AIR_POLLUTION}?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEYS.OPENWEATHERMAP}`;
            const response = await this.fetchWithTimeout(owmUrl);
            const data = await response.json();

            return {
                source: 'openweathermap',
                data: data.list[0]
            };
        } catch (error) {
            console.error('Air quality API error:', error);

            // Fallback to Open-Meteo air quality
            try {
                const openMeteoUrl = `${CONFIG.ENDPOINTS.OPEN_METEO.AIR_QUALITY}?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;
                const response = await this.fetchWithTimeout(openMeteoUrl);
                const data = await response.json();

                return {
                    source: 'open-meteo',
                    data: data.current
                };
            } catch (fallbackError) {
                console.error('Air quality fallback error:', fallbackError);
                throw fallbackError;
            }
        }
    }

    /**
     * Fetch government weather alerts
     */
    async fetchGovernmentAlerts() {
        const { lat, lon, country } = this.currentLocation;

        try {
            if (country === 'US') {
                // Use NOAA API for US alerts
                const url = `${CONFIG.ENDPOINTS.NOAA.ALERTS}?point=${lat},${lon}`;
                console.log('Fetching NOAA alerts from:', url);
                const response = await this.fetchWithTimeout(url);

                if (!response.ok) {
                    throw new Error(`NOAA API responded with ${response.status}`);
                }

                const data = await response.json();
                console.log('NOAA alerts response:', data);

                return {
                    source: 'noaa',
                    alerts: data.features || []
                };
            } else {
                // For demonstration, create sample alerts for non-US locations
                const demoAlerts = this.createDemoAlerts(lat, lon, country);
                return {
                    source: 'demo',
                    alerts: demoAlerts
                };
            }
        } catch (error) {
            console.error('Government alerts error:', error);

            // Return empty alerts when service is unavailable
            return {
                source: 'error',
                alerts: []
            };
        }
    }

    /**
     * Create demo alerts for non-US locations
     */
    createDemoAlerts(lat, lon, country) {
        // Only show alerts if there are actual weather conditions that warrant them
        // For now, return empty array to show "No active weather alerts"
        return [];
    }

    /**
     * Process ensemble weather data from multiple sources
     * @param {Array} results - Array of API results
     */
    processEnsembleData(results) {
        const [owmResult, weatherbitResult, openMeteoResult, aqResult, alertsResult] = results;

        // Process current weather with ensemble averaging
        const currentWeatherSources = [];

        if (owmResult.status === 'fulfilled') {
            currentWeatherSources.push(this.normalizeOpenWeatherMapData(owmResult.value.current));
        }

        if (weatherbitResult.status === 'fulfilled') {
            currentWeatherSources.push(this.normalizeWeatherbitData(weatherbitResult.value.current));
        }

        if (openMeteoResult.status === 'fulfilled') {
            currentWeatherSources.push(this.normalizeOpenMeteoData(openMeteoResult.value.data));
        }

        // Create ensemble forecast by averaging available data
        this.weatherData.current = this.createEnsembleWeather(currentWeatherSources);

        // Process forecasts
        this.processEnsembleForecasts(results);

        // Process air quality
        if (aqResult.status === 'fulfilled') {
            this.weatherData.airQuality = aqResult.value;
        }

        // Process alerts
        if (alertsResult.status === 'fulfilled') {
            this.weatherData.alerts = alertsResult.value.alerts;
        }
    }

    /**
     * Create ensemble weather data by averaging multiple sources
     * @param {Array} sources - Array of normalized weather data
     * @returns {Object} Ensemble weather data
     */
    createEnsembleWeather(sources) {
        if (sources.length === 0) return null;
        if (sources.length === 1) return sources[0];

        const ensemble = {
            temperature: 0,
            feelsLike: 0,
            humidity: 0,
            pressure: 0,
            windSpeed: 0,
            windDirection: 0,
            visibility: 0,
            uvIndex: 0,
            cloudCover: 0,
            precipitationChance: 0,
            description: sources[0].description,
            icon: sources[0].icon,
            sources: sources.map(s => s.source)
        };

        // Average numerical values
        const numSources = sources.length;
        sources.forEach(source => {
            ensemble.temperature += source.temperature || 0;
            ensemble.feelsLike += source.feelsLike || 0;
            ensemble.humidity += source.humidity || 0;
            ensemble.pressure += source.pressure || 0;
            ensemble.windSpeed += source.windSpeed || 0;
            ensemble.windDirection += source.windDirection || 0;
            ensemble.visibility += source.visibility || 0;
            ensemble.uvIndex += source.uvIndex || 0;
            ensemble.cloudCover += source.cloudCover || 0;
            ensemble.precipitationChance += source.precipitationChance || 0;
        });

        // Calculate averages
        Object.keys(ensemble).forEach(key => {
            if (typeof ensemble[key] === 'number' && key !== 'sources') {
                ensemble[key] = Math.round((ensemble[key] / numSources) * 10) / 10;
            }
        });

        return ensemble;
    }

    /**
     * Normalize OpenWeatherMap data to common format
     * @param {Object} data - Raw OpenWeatherMap data
     * @returns {Object} Normalized weather data
     */
    normalizeOpenWeatherMapData(data) {
        return {
            source: 'OpenWeatherMap',
            temperature: data.main.temp,
            feelsLike: data.main.feels_like,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            windSpeed: data.wind.speed * 3.6, // Convert m/s to km/h
            windDirection: data.wind.deg,
            visibility: data.visibility / 1000, // Convert m to km
            uvIndex: 0, // Not available in current weather API
            cloudCover: data.clouds.all,
            precipitationChance: 0, // Not available in current weather API
            description: data.weather[0].description,
            icon: this.getWeatherIcon(data.weather[0].id),
            timestamp: data.dt
        };
    }

    /**
     * Normalize Weatherbit data to common format
     * @param {Object} data - Raw Weatherbit data
     * @returns {Object} Normalized weather data
     */
    normalizeWeatherbitData(data) {
        return {
            source: 'Weatherbit',
            temperature: data.temp,
            feelsLike: data.app_temp,
            humidity: data.rh,
            pressure: data.pres,
            windSpeed: data.wind_spd * 3.6, // Convert m/s to km/h
            windDirection: data.wind_dir,
            visibility: data.vis,
            uvIndex: data.uv || 0,
            cloudCover: data.clouds,
            precipitationChance: 0, // Not available in current weather
            description: data.weather.description,
            icon: this.getWeatherIcon(data.weather.code),
            timestamp: Date.now() / 1000
        };
    }

    /**
     * Normalize Open-Meteo data to common format
     * @param {Object} data - Raw Open-Meteo data
     * @returns {Object} Normalized weather data
     */
    normalizeOpenMeteoData(data) {
        const current = data.current;
        return {
            source: 'Open-Meteo',
            temperature: current.temperature_2m,
            feelsLike: current.apparent_temperature,
            humidity: current.relative_humidity_2m,
            pressure: current.pressure_msl,
            windSpeed: current.wind_speed_10m,
            windDirection: current.wind_direction_10m,
            visibility: 10, // Default visibility
            uvIndex: 0, // Available in hourly data
            cloudCover: current.cloud_cover,
            precipitationChance: current.precipitation || 0,
            description: this.getOpenMeteoDescription(current.weather_code),
            icon: this.getOpenMeteoIcon(current.weather_code),
            timestamp: Date.now() / 1000
        };
    }

    /**
     * Get weather icon based on condition code
     * @param {number} code - Weather condition code
     * @returns {string} Weather icon emoji
     */
    getWeatherIcon(code) {
        return CONFIG.WEATHER_CONDITIONS[code]?.icon || '⛅';
    }

    /**
     * Get Open-Meteo weather description
     * @param {number} code - Weather code
     * @returns {string} Weather description
     */
    getOpenMeteoDescription(code) {
        const descriptions = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Light rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Light snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            95: 'Thunderstorm',
            96: 'Thunderstorm with light hail',
            99: 'Thunderstorm with heavy hail'
        };
        return descriptions[code] || 'Unknown';
    }

    /**
     * Get Open-Meteo weather icon
     * @param {number} code - Weather code
     * @returns {string} Weather icon emoji
     */
    getOpenMeteoIcon(code) {
        const icons = {
            0: '☀️',
            1: '🌤️',
            2: '⛅',
            3: '☁️',
            45: '🌫️',
            48: '🌫️',
            51: '🌦️',
            53: '🌦️',
            55: '🌦️',
            61: '🌧️',
            63: '🌧️',
            65: '🌧️',
            71: '🌨️',
            73: '🌨️',
            75: '❄️',
            95: '⛈️',
            96: '⛈️',
            99: '⛈️'
        };
        return icons[code] || '⛅';
    }

    /**
     * Process ensemble forecasts from multiple sources
     * @param {Array} results - Array of API results
     */
    processEnsembleForecasts(results) {
        // Process hourly and daily forecasts
        const [owmResult, weatherbitResult, openMeteoResult] = results;

        this.weatherData.hourly = [];
        this.weatherData.daily = [];

        // Combine hourly forecasts
        if (weatherbitResult.status === 'fulfilled' && weatherbitResult.value.hourly) {
            this.weatherData.hourly = weatherbitResult.value.hourly.slice(0, 24);
        } else if (openMeteoResult.status === 'fulfilled') {
            this.weatherData.hourly = this.processOpenMeteoHourly(openMeteoResult.value.data);
        }

        // Combine daily forecasts
        if (weatherbitResult.status === 'fulfilled' && weatherbitResult.value.daily) {
            this.weatherData.daily = weatherbitResult.value.daily.slice(0, 7);
        } else if (openMeteoResult.status === 'fulfilled') {
            this.weatherData.daily = this.processOpenMeteoDaily(openMeteoResult.value.data);
        }
    }

    /**
     * Process Open-Meteo hourly data
     * @param {Object} data - Open-Meteo forecast data
     * @returns {Array} Processed hourly data
     */
    processOpenMeteoHourly(data) {
        const hourly = data.hourly;
        const processed = [];

        for (let i = 0; i < Math.min(24, hourly.time.length); i++) {
            processed.push({
                time: hourly.time[i],
                temp: hourly.temperature_2m[i],
                feels_like: hourly.apparent_temperature[i],
                humidity: hourly.relative_humidity_2m[i],
                precipitation_prob: hourly.precipitation_probability[i],
                weather_code: hourly.weather_code[i],
                wind_speed: hourly.wind_speed_10m[i],
                uv_index: hourly.uv_index[i]
            });
        }

        return processed;
    }

    /**
     * Process Open-Meteo daily data
     * @param {Object} data - Open-Meteo forecast data
     * @returns {Array} Processed daily data
     */
    processOpenMeteoDaily(data) {
        const daily = data.daily;
        const processed = [];

        for (let i = 0; i < Math.min(7, daily.time.length); i++) {
            processed.push({
                date: daily.time[i],
                max_temp: daily.temperature_2m_max[i],
                min_temp: daily.temperature_2m_min[i],
                weather_code: daily.weather_code[i],
                precipitation_sum: daily.precipitation_sum[i],
                wind_speed_max: daily.wind_speed_10m_max[i],
                uv_index_max: daily.uv_index_max[i],
                precipitation_probability_max: daily.precipitation_probability_max[i]
            });
        }

        return processed;
    }

    /**
     * Update the current weather display
     */
    updateWeatherDisplay() {
        const weather = this.weatherData.current;
        if (!weather) return;

        // Update temperature
        const tempElement = document.getElementById('current-temp');
        const feelsLikeElement = document.getElementById('feels-like');

        if (tempElement) {
            tempElement.textContent = `${Math.round(weather.temperature)}°${this.settings.TEMPERATURE_UNIT === 'fahrenheit' ? 'F' : 'C'}`;
        }

        if (feelsLikeElement) {
            feelsLikeElement.textContent = `Feels like ${Math.round(weather.feelsLike)}°${this.settings.TEMPERATURE_UNIT === 'fahrenheit' ? 'F' : 'C'}`;
        }

        // Update weather icon and description
        const iconElement = document.getElementById('weather-icon');
        const descElement = document.getElementById('weather-description');

        if (iconElement) {
            iconElement.textContent = weather.icon;
        }

        if (descElement) {
            descElement.textContent = weather.description.charAt(0).toUpperCase() + weather.description.slice(1);
        }

        // Update weather details
        this.updateElement('humidity', `${weather.humidity}%`);
        this.updateElement('wind', `${Math.round(weather.windSpeed)} ${this.getWindUnit()}`);
        this.updateElement('uv-index', weather.uvIndex || '--');
        this.updateElement('pressure', `${Math.round(weather.pressure)} hPa`);
        this.updateElement('visibility', `${weather.visibility} km`);
        this.updateElement('rain-chance', `${weather.precipitationChance}%`);
    }

    /**
     * Update the forecast displays (hourly and daily)
     */
    updateForecastDisplay() {
        this.updateHourlyForecast();
        this.updateDailyForecast();
    }

    /**
     * Update hourly forecast display
     */
    updateHourlyForecast() {
        const container = document.getElementById('hourly-items');
        if (!container || !this.weatherData.hourly) return;

        container.innerHTML = '';

        this.weatherData.hourly.forEach((hour, index) => {
            const hourElement = document.createElement('div');
            hourElement.className = 'hourly-item neumorphic-card';
            hourElement.setAttribute('tabindex', '0');
            hourElement.setAttribute('role', 'gridcell');

            // Fix time parsing for different API formats
            let time;
            if (hour.time) {
                // Open-Meteo format: "2023-09-21T14:00"
                time = new Date(hour.time);
            } else if (hour.dt) {
                // OpenWeatherMap format: Unix timestamp
                time = new Date(hour.dt * 1000);
            } else if (hour.datetime) {
                // Weatherbit format: "2023-09-21:14"
                time = new Date(hour.datetime);
            } else {
                // Fallback: current time + hours
                time = new Date(Date.now() + (index * 3600000));
            }

            // Validate time and provide fallback
            if (isNaN(time.getTime())) {
                time = new Date(Date.now() + (index * 3600000));
            }

            // Show proper time format (24-hour or 12-hour based on locale)
            const timeString = index === 0 ? 'Now' : time.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false // Use 24-hour format
            });

            const temp = hour.temp || hour.temperature || hour.temperature_2m || 0;
            const icon = this.getHourlyIcon(hour);
            const precipitation = hour.precipitation_prob || hour.precipitation_probability || hour.pop || 0;

            hourElement.innerHTML = `
                <div class="hourly-time">${timeString}</div>
                <div class="hourly-icon" aria-hidden="true">${icon}</div>
                <div class="hourly-temp">${Math.round(temp)}°</div>
                <div class="hourly-rain">${Math.round(precipitation)}%</div>
            `;

            container.appendChild(hourElement);
        });
    }

    /**
     * Update daily forecast display
     */
    updateDailyForecast() {
        const container = document.getElementById('daily-items');
        if (!container || !this.weatherData.daily) return;

        container.innerHTML = '';

        this.weatherData.daily.forEach((day, index) => {
            const dayElement = document.createElement('div');
            dayElement.className = 'daily-item neumorphic-card';
            dayElement.setAttribute('tabindex', '0');
            dayElement.setAttribute('role', 'gridcell');

            // Fix date parsing for different API formats
            let date;
            if (day.date) {
                // Open-Meteo format: "2023-09-21"
                date = new Date(day.date + 'T00:00:00');
            } else if (day.dt) {
                // OpenWeatherMap format: Unix timestamp
                date = new Date(day.dt * 1000);
            } else if (day.datetime) {
                // Weatherbit format: "2023-09-21"
                date = new Date(day.datetime + 'T00:00:00');
            } else {
                // Fallback: use current date + index
                date = new Date();
                date.setDate(date.getDate() + index);
            }

            // Validate date and provide fallback
            if (isNaN(date.getTime())) {
                date = new Date();
                date.setDate(date.getDate() + index);
            }

            // Show exact dates instead of day names
            const dayDisplay = index === 0 ? 'Today' : date.toLocaleDateString([], {
                month: 'short',
                day: 'numeric'
            });

            const maxTemp = day.max_temp || day.temp?.max || day.temperature_max || day.high_temp || 0;
            const minTemp = day.min_temp || day.temp?.min || day.temperature_min || day.low_temp || 0;
            const icon = this.getDailyIcon(day);
            const precipitation = day.precipitation_probability_max || day.pop || day.precip || 0;

            dayElement.innerHTML = `
                <div class="daily-day">${dayDisplay}</div>
                <div class="daily-icon" aria-hidden="true">${icon}</div>
                <div class="daily-temps">
                    <span class="daily-high">${Math.round(maxTemp)}°</span>
                    <span class="daily-low">${Math.round(minTemp)}°</span>
                </div>
                <div class="daily-rain">${Math.round(precipitation)}%</div>
            `;

            container.appendChild(dayElement);
        });
    }

    /**
     * Get icon for hourly forecast item
     * @param {Object} hour - Hourly forecast data
     * @returns {string} Weather icon
     */
    getHourlyIcon(hour) {
        if (hour.weather_code !== undefined) {
            return this.getOpenMeteoIcon(hour.weather_code);
        } else if (hour.weather && hour.weather.code) {
            return this.getWeatherIcon(hour.weather.code);
        }
        return '⛅';
    }

    /**
     * Get icon for daily forecast item
     * @param {Object} day - Daily forecast data
     * @returns {string} Weather icon
     */
    getDailyIcon(day) {
        if (day.weather_code !== undefined) {
            return this.getOpenMeteoIcon(day.weather_code);
        } else if (day.weather && day.weather.code) {
            return this.getWeatherIcon(day.weather.code);
        }
        return '⛅';
    }

    /**
     * Update air quality display
     */
    updateAirQualityDisplay() {
        const airQuality = this.weatherData.airQuality;
        if (!airQuality) return;

        let aqi, aqiLevel;

        if (airQuality.source === 'openweathermap') {
            aqi = airQuality.data.main.aqi;
            aqiLevel = CONFIG.AQI_LEVELS[aqi - 1]; // OpenWeatherMap uses 1-5 scale
        } else if (airQuality.source === 'open-meteo') {
            aqi = airQuality.data.us_aqi;
            aqiLevel = this.getAQILevel(aqi);
        }

        this.updateElement('aqi-value', aqi || '--');
        this.updateElement('aqi-label', aqiLevel?.label || 'Unknown');
        this.updateElement('aqi-advice', aqiLevel?.advice || 'Air quality data unavailable');

        // Update AQI card color
        const aqiCard = document.querySelector('.aqi-card');
        if (aqiCard && aqiLevel) {
            aqiCard.style.setProperty('--aqi-color', aqiLevel.color);
        }
    }

    /**
     * Get AQI level information based on value
     * @param {number} aqi - AQI value
     * @returns {Object} AQI level information
     */
    getAQILevel(aqi) {
        if (aqi <= 50) return { label: 'Good', color: '#00e400', advice: 'Air quality is great! Perfect for outdoor activities.' };
        if (aqi <= 100) return { label: 'Moderate', color: '#ffff00', advice: 'Air quality is acceptable for most people.' };
        if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: '#ff7e00', advice: 'Sensitive individuals should limit outdoor activities.' };
        if (aqi <= 200) return { label: 'Unhealthy', color: '#ff0000', advice: 'Everyone should limit outdoor activities.' };
        if (aqi <= 300) return { label: 'Very Unhealthy', color: '#8f3f97', advice: 'Avoid outdoor activities. Keep windows closed.' };
        return { label: 'Hazardous', color: '#7e0023', advice: 'Emergency conditions. Stay indoors.' };
    }

    /**
     * Update health and wellness tips based on current conditions
     */
    updateHealthTips() {
        const weather = this.weatherData.current;
        const airQuality = this.weatherData.airQuality;

        if (!weather) return;

        const tips = [];

        // UV Index tips
        const uvIndex = weather.uvIndex || 0;
        if (uvIndex >= 3) {
            tips.push(`☀️ UV Index is ${uvIndex}. Wear sunscreen and protective clothing.`);
        }

        // Temperature tips
        if (weather.temperature > 30) {
            tips.push('🌡️ High temperature! Stay hydrated and avoid prolonged sun exposure.');
        } else if (weather.temperature < 0) {
            tips.push('❄️ Freezing temperatures! Dress warmly and watch for icy conditions.');
        }

        // Humidity tips
        if (weather.humidity > 70) {
            tips.push('💧 High humidity may make it feel warmer. Stay cool and hydrated.');
        } else if (weather.humidity < 30) {
            tips.push('🏜️ Low humidity may cause dry skin. Use moisturizer and stay hydrated.');
        }

        // Air quality tips
        if (airQuality && airQuality.data) {
            const aqi = airQuality.source === 'openweathermap' ? airQuality.data.main.aqi : airQuality.data.us_aqi;
            if (aqi > 100) {
                tips.push('😷 Poor air quality. Consider wearing a mask outdoors.');
            }
        }

        // Wind tips
        if (weather.windSpeed > 25) {
            tips.push('💨 Strong winds. Secure loose objects and be cautious when driving.');
        }

        // Default tip if no specific conditions
        if (tips.length === 0) {
            tips.push('🌟 Great weather conditions! Perfect day for outdoor activities.');
        }

        const tipsContainer = document.getElementById('health-tips');
        if (tipsContainer) {
            tipsContainer.innerHTML = tips.map(tip => `<p class="health-tip">${tip}</p>`).join('');
        }
    }

    /**
     * Update government alerts display
     */
    updateAlertsDisplay() {
        const alerts = this.weatherData.alerts;
        const alertsBanner = document.getElementById('alerts-banner');
        const alertsMessages = document.getElementById('alert-messages');
        const alertsCardContent = document.getElementById('alerts-card-content');

        console.log('Updating alerts display:', alerts);

        // Update the alerts card (always visible)
        if (alertsCardContent) {
            if (!alerts || alerts.length === 0) {
                alertsCardContent.innerHTML = '<p class="no-alerts">No active weather alerts</p>';
            } else {
                alertsCardContent.innerHTML = '';
                alerts.forEach((alert, index) => {
                    const alertElement = document.createElement('div');
                    alertElement.className = 'alert-card-item';

                    const properties = alert.properties || alert;
                    const title = properties.headline || properties.event || properties.title || 'Weather Alert';
                    let description = properties.description || properties.instruction || properties.summary || 'Check local weather services for details.';

                    // Truncate long descriptions for card display
                    if (description.length > 150) {
                        description = description.substring(0, 150) + '...';
                    }

                    alertElement.innerHTML = `
                        <div class="alert-card-header">
                            <span class="alert-card-icon">⚠️</span>
                            <h3 class="alert-card-title">${title}</h3>
                        </div>
                        <p class="alert-card-description">${description}</p>
                        ${properties.severity ? `<span class="alert-card-severity severity-${properties.severity.toLowerCase()}">${properties.severity}</span>` : ''}
                    `;

                    alertsCardContent.appendChild(alertElement);
                });
            }
        }

        // Update the banner alerts (for critical alerts)
        if (!alerts || alerts.length === 0) {
            if (alertsBanner) {
                alertsBanner.style.display = 'none';
            }
            return;
        }

        // Only show banner for severe alerts
        const severeAlerts = alerts.filter(alert => {
            const severity = alert.properties?.severity?.toLowerCase();
            return severity === 'severe' || severity === 'extreme' || severity === 'critical';
        });

        if (severeAlerts.length > 0 && alertsBanner && alertsMessages) {
            alertsMessages.innerHTML = '';

            severeAlerts.forEach((alert, index) => {
                const alertElement = document.createElement('div');
                alertElement.className = 'alert-item';

                const properties = alert.properties || alert;
                const title = properties.headline || properties.event || properties.title || 'Weather Alert';
                let description = properties.description || properties.instruction || properties.summary || 'Check local weather services for details.';

                // Truncate long descriptions
                if (description.length > 200) {
                    description = description.substring(0, 200) + '...';
                }

                alertElement.innerHTML = `
                    <h3 class="alert-headline">${title}</h3>
                    <p class="alert-description">${description}</p>
                    ${properties.severity ? `<span class="alert-severity">Severity: ${properties.severity}</span>` : ''}
                `;

                alertsMessages.appendChild(alertElement);
            });

            alertsBanner.style.display = 'block';

            // Set up alert close button (remove existing listeners first)
            const closeBtn = alertsBanner.querySelector('.alert-close');
            if (closeBtn) {
                closeBtn.replaceWith(closeBtn.cloneNode(true));
                const newCloseBtn = alertsBanner.querySelector('.alert-close');
                newCloseBtn.addEventListener('click', () => {
                    alertsBanner.style.display = 'none';
                });
            }
        } else if (alertsBanner) {
            alertsBanner.style.display = 'none';
        }
    }

    /**
     * Update location display
     */
    updateLocationDisplay() {
        const locationElement = document.getElementById('current-location');
        if (locationElement && this.currentLocation) {
            locationElement.textContent = this.currentLocation.name;
        }
    }

    /**
     * Update last updated timestamp
     */
    updateLastUpdated() {
        const lastUpdatedElement = document.getElementById('last-updated');
        if (lastUpdatedElement) {
            const now = new Date();
            lastUpdatedElement.textContent = `Last updated: ${now.toLocaleTimeString()}`;
        }
    }

    /**
     * Set up auto-refresh timer
     */
    setupAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }

        if (this.settings.AUTO_REFRESH) {
            this.refreshTimer = setInterval(() => {
                this.refreshWeatherData();
            }, CONFIG.DEFAULTS.REFRESH_INTERVAL);
        }
    }

    /**
     * Refresh weather data manually
     */
    async refreshWeatherData() {
        if (this.isLoading) return;

        console.log('Refreshing weather data...');
        await this.loadWeatherData();

        // Show brief refresh confirmation
        this.showToast('Weather data refreshed');
    }

    /**
     * Handle observation form submission
     * @param {Event} e - Form submit event
     */
    async handleObservationSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const observation = {
            id: Date.now(),
            type: document.getElementById('obs-type').value,
            description: document.getElementById('obs-description').value,
            intensity: parseInt(document.getElementById('obs-intensity').value),
            location: this.currentLocation?.name || 'Unknown',
            timestamp: new Date().toISOString(),
            coordinates: this.currentLocation ? {
                lat: this.currentLocation.lat,
                lon: this.currentLocation.lon
            } : null
        };

        try {
            await this.saveObservation(observation);
            this.closeModal('observation-modal');
            this.loadObservations();
            this.showToast('Observation added successfully');

            // Reset form
            e.target.reset();
            document.getElementById('intensity-value').textContent = '3';
        } catch (error) {
            console.error('Error saving observation:', error);
            this.showError('Failed to save observation');
        }
    }

    /**
     * Save observation to local storage
     * @param {Object} observation - Observation data
     */
    async saveObservation(observation) {
        try {
            if (!this.useLocalStorage) {
                // Use IndexedDB
                await this.saveToIndexedDB(observation);
            } else {
                // Use localStorage as fallback
                const observations = this.getStoredObservations();
                observations.unshift(observation);

                // Limit stored observations
                if (observations.length > CONFIG.APP.MAX_OBSERVATIONS) {
                    observations.splice(CONFIG.APP.MAX_OBSERVATIONS);
                }

                localStorage.setItem('weather-observations', JSON.stringify(observations));
            }
        } catch (error) {
            console.error('Error saving observation:', error);
            throw error;
        }
    }

    /**
     * Load observations from storage and display them
     */
    async loadObservations() {
        try {
            const observations = await this.getStoredObservations();
            this.displayObservations(observations);
        } catch (error) {
            console.error('Error loading observations:', error);
        }
    }

    /**
     * Get stored observations
     * @returns {Array} Array of observations
     */
    getStoredObservations() {
        try {
            const stored = localStorage.getItem('weather-observations');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error reading observations:', error);
            return [];
        }
    }

    /**
     * Display observations in the UI
     * @param {Array} observations - Array of observations
     */
    displayObservations(observations) {
        const container = document.getElementById('observations-list');
        if (!container) return;

        if (observations.length === 0) {
            container.innerHTML = '<p class="no-observations">No local observations yet. Add one to get started!</p>';
            return;
        }

        container.innerHTML = observations.slice(0, 5).map(obs => `
            <div class="observation-item neumorphic-card">
                <div class="observation-header">
                    <span class="observation-type">${this.getObservationTypeIcon(obs.type)} ${obs.type}</span>
                    <span class="observation-time">${this.formatRelativeTime(obs.timestamp)}</span>
                </div>
                <p class="observation-description">${obs.description}</p>
                <div class="observation-meta">
                    <span class="observation-intensity">Intensity: ${'★'.repeat(obs.intensity)}${'☆'.repeat(5 - obs.intensity)}</span>
                </div>
            </div>
        `).join('');
    }

    /**
     * Get icon for observation type
     * @param {string} type - Observation type
     * @returns {string} Icon emoji
     */
    getObservationTypeIcon(type) {
        const icons = {
            rain: '🌧️',
            clouds: '☁️',
            wind: '💨',
            temperature: '🌡️',
            other: '📝'
        };
        return icons[type] || '📝';
    }

    /**
     * Format relative time for observations
     * @param {string} timestamp - ISO timestamp
     * @returns {string} Relative time string
     */
    formatRelativeTime(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffMs = now - time;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return time.toLocaleDateString();
    }

    /**
     * Open settings modal
     */
    openSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.style.display = 'flex';

            // Load current settings
            const tempUnit = document.getElementById('temp-unit');
            const windUnit = document.getElementById('wind-unit');
            const reduceMotion = document.getElementById('reduce-motion');
            const autoRefresh = document.getElementById('auto-refresh');

            if (tempUnit) tempUnit.value = this.settings.TEMPERATURE_UNIT;
            if (windUnit) windUnit.value = this.settings.WIND_UNIT;
            if (reduceMotion) reduceMotion.checked = this.settings.REDUCE_MOTION;
            if (autoRefresh) autoRefresh.checked = this.settings.AUTO_REFRESH;

            // Set up settings change handlers
            this.setupSettingsHandlers();

            // Focus first element
            const firstInput = modal.querySelector('select, input');
            if (firstInput) firstInput.focus();
        }
    }

    /**
     * Set up settings change handlers
     */
    setupSettingsHandlers() {
        const tempUnit = document.getElementById('temp-unit');
        const windUnit = document.getElementById('wind-unit');
        const reduceMotion = document.getElementById('reduce-motion');
        const autoRefresh = document.getElementById('auto-refresh');

        if (tempUnit) {
            tempUnit.addEventListener('change', (e) => {
                this.settings.TEMPERATURE_UNIT = e.target.value;
                this.updateWeatherDisplay();
                this.saveSettings();
            });
        }

        if (windUnit) {
            windUnit.addEventListener('change', (e) => {
                this.settings.WIND_UNIT = e.target.value;
                this.updateWeatherDisplay();
                this.saveSettings();
            });
        }

        if (reduceMotion) {
            reduceMotion.addEventListener('change', (e) => {
                this.settings.REDUCE_MOTION = e.target.checked;
                document.body.classList.toggle('reduce-motion', e.target.checked);
                this.saveSettings();
            });
        }

        if (autoRefresh) {
            autoRefresh.addEventListener('change', (e) => {
                this.settings.AUTO_REFRESH = e.target.checked;
                this.setupAutoRefresh();
                this.saveSettings();
            });
        }
    }

    /**
     * Open observation modal
     */
    openObservationModal() {
        const modal = document.getElementById('observation-modal');
        if (modal) {
            modal.style.display = 'flex';

            // Focus first input
            const firstInput = modal.querySelector('select');
            if (firstInput) firstInput.focus();
        }
    }

    /**
     * Close modal
     * @param {string} modalId - ID of modal to close
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Show loading overlay
     * @param {string} message - Loading message
     */
    showLoading(message = 'Loading...') {
        this.isLoading = true;
        const overlay = document.getElementById('loading-overlay');
        const text = overlay?.querySelector('.loading-text');

        if (overlay) {
            overlay.style.display = 'flex';
        }

        if (text) {
            text.textContent = message;
        }
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        this.isLoading = false;
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        this.showToast(message, 'error');
    }

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type ('success', 'error', 'info')
     */
    showToast(message, type = 'success') {
        // Create toast element if it doesn't exist
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.className = `toast toast-${type} toast-show`;

        // Auto-hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('toast-show');
        }, 3000);
    }

    /**
     * Update element text content safely
     * @param {string} id - Element ID
     * @param {string} content - New content
     */
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    /**
     * Get wind unit based on settings
     * @returns {string} Wind unit
     */
    getWindUnit() {
        const units = {
            kmh: 'km/h',
            mph: 'mph',
            ms: 'm/s'
        };
        return units[this.settings.WIND_UNIT] || 'km/h';
    }

    /**
     * Save current location to localStorage
     * @param {Object} location - Location data
     */
    saveLocation(location) {
        try {
            localStorage.setItem('weather-app-location', JSON.stringify(location));
        } catch (error) {
            console.error('Error saving location:', error);
        }
    }

    /**
     * Get saved location from localStorage
     * @returns {Object|null} Saved location or null
     */
    getSavedLocation() {
        try {
            const saved = localStorage.getItem('weather-app-location');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error reading saved location:', error);
            return null;
        }
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        try {
            localStorage.setItem('weather-app-settings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('weather-app-settings');
            if (saved) {
                this.settings = { ...CONFIG.DEFAULTS, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            this.settings = { ...CONFIG.DEFAULTS };
        }
    }

    /**
     * Fetch with timeout to prevent hanging requests
     * @param {string} url - URL to fetch
     * @param {number} timeout - Timeout in milliseconds
     * @returns {Promise} Fetch promise
     */
    fetchWithTimeout(url, timeout = 10000) {
        return Promise.race([
            fetch(url),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), timeout)
            )
        ]);
    }

    /**
     * Save observation to IndexedDB
     * @param {Object} observation - Observation data
     */
    async saveToIndexedDB(observation) {
        // IndexedDB implementation would go here
        // For now, fall back to localStorage
        return this.saveObservation(observation);
    }
}

// Initialize the weather app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing WeatherSync...');
    window.weatherApp = new WeatherApp();
});

// Handle page visibility changes to refresh data when user returns
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.weatherApp && !window.weatherApp.isLoading) {
        // Refresh data if user has been away for more than 5 minutes
        const lastUpdate = localStorage.getItem('weather-app-last-update');
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);

        if (!lastUpdate || parseInt(lastUpdate) < fiveMinutesAgo) {
            window.weatherApp.refreshWeatherData();
            localStorage.setItem('weather-app-last-update', Date.now().toString());
        }
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    if (window.weatherApp) {
        window.weatherApp.showToast('Connection restored', 'success');
        window.weatherApp.refreshWeatherData();
    }
});

window.addEventListener('offline', () => {
    if (window.weatherApp) {
        window.weatherApp.showToast('Connection lost - using cached data', 'info');
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherApp;
}
