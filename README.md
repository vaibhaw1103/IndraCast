# IndraCast - Advanced Weather Dashboard

![WeatherSync Logo](data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⛅</text></svg>)

A modern, accessible weather application with ensemble forecasting, hyperlocal observations, and government alerts. Built with vanilla HTML, CSS, and JavaScript using cutting-edge web technologies.

## 🌟 Features

### Core Weather Features
- **🌡️ Current Weather**: Temperature, feels-like, humidity, wind speed, UV index, pressure, visibility, rain chance, and cloud cover
- **⏰ Hourly Forecast**: Detailed 24-hour weather predictions
- **📅 7-Day Forecast**: Extended weather outlook with daily highs/lows
- **🌬️ Air Quality Monitoring**: Real-time AQI data with health recommendations

### Advanced Features
- **🎯 Ensemble Weather Forecasting**: Combines data from multiple APIs (OpenWeatherMap, Weatherbit, Open-Meteo) for improved accuracy
- **📍 Hyperlocal Observations**: User-submitted local weather observations stored in browser
- **🚨 Government Alerts**: Real-time weather alerts (NOAA for US, expandable for other regions)
- **💡 Health & Wellness Tips**: Personalized recommendations based on current conditions

### Modern UI/UX
- **🎨 Glassmorphism Design**: Translucent glass-like panels with backdrop blur
- **🔮 Neumorphism Elements**: Soft, pillowy buttons and inputs with inset/outset shadows
- **📐 Bento-Style Layout**: Clean, modular grid system inspired by modern design trends
- **✨ 3D Effects**: Subtle depth and shadow effects throughout the interface
- **🎭 Dark/Light Theme**: Automatic theme switching with smooth transitions

### Accessibility & Performance
- **♿ Full Accessibility**: WCAG 2.1 compliant with keyboard navigation, ARIA labels, and semantic markup
- **🎨 High Contrast Mode**: Enhanced visibility for users with visual impairments
- **🏃 Reduced Motion Support**: Respects user's motion preferences
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **⚡ Performance Optimized**: Efficient API usage with caching and ensemble data processing

## 🏗️ Architecture

### File Structure
```
weather/
├── index.html          # Main HTML structure with semantic markup
├── styles.css          # Comprehensive CSS with modern effects
├── script.js           # Core JavaScript functionality
├── config.js           # API configuration and constants
├── .env               # Environment variables (API keys)
└── README.md          # This documentation
```

### Technology Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **APIs**: OpenWeatherMap, Weatherbit, Open-Meteo, NOAA
- **Storage**: LocalStorage + IndexedDB (for observations)
- **Styling**: CSS Custom Properties, Flexbox, Grid, CSS Transforms & Animations

### Key Design Patterns
- **Ensemble Forecasting**: Averages data from multiple weather APIs for accuracy
- **Progressive Enhancement**: Graceful fallbacks for unsupported features
- **Accessibility First**: Built with screen readers and keyboard users in mind
- **Mobile First**: Responsive design starting from mobile and scaling up

## 🚀 Quick Start

### Prerequisites
- Modern web browser with ES6+ support
- Internet connection for API data
- Local web server (recommended for development)

### Installation

1. **Clone or download** the project files to your desired directory
2. **API Keys are included** in the `.env` file (for demo purposes)
3. **Serve the files** using a local web server:

#### Option 1: Using Python (Recommended)
```bash
# Navigate to the project directory
cd path/to/weather

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Option 2: Using Node.js
```bash
# Install a simple HTTP server globally
npm install -g http-server

# Navigate to project directory and serve
cd path/to/weather
http-server -p 8000
```

#### Option 3: Using PHP
```bash
# Navigate to project directory
cd path/to/weather

# Start PHP built-in server
php -S localhost:8000
```

#### Option 4: Using Live Server (VS Code)
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

4. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

### First Run
1. **Grant location permission** when prompted for automatic location detection
2. **Or search manually** using the search bar in the header
3. **Explore features** like adding local observations and adjusting settings
4. **Toggle themes** and accessibility options as needed

## 🔧 Configuration

### API Keys
API keys are already configured in `config.js`. For production use, you should:

1. **Get your own API keys**:
   - [OpenWeatherMap](https://openweathermap.org/api) - Free tier available
   - [Weatherbit](https://www.weatherbit.io/api) - Free tier available
   - Open-Meteo - No API key required (free service)

2. **Update the keys** in `config.js`:
   ```javascript
   API_KEYS: {
       OPENWEATHERMAP: 'your-openweathermap-key',
       WEATHERBIT: 'your-weatherbit-key',
       OPEN_METEO: null, // No key required
       NOAA: null // No key required
   }
   ```

### Customization
The app is highly customizable through CSS custom properties in `styles.css`:

```css
:root {
    --accent-primary: #3498db;    /* Primary theme color */
    --accent-secondary: #2ecc71;  /* Secondary theme color */
    --radius-lg: 16px;            /* Border radius for cards */
    --space-lg: 1.5rem;           /* Spacing unit */
    /* ... many more variables */
}
```

## 📱 Usage Guide

### Basic Features
- **🌍 Location**: Click the location button (📍) or search for a city
- **🔄 Refresh**: Click the refresh button to update weather data
- **⚙️ Settings**: Access temperature units, motion preferences, and more
- **🌙 Theme**: Toggle between dark and light modes

### Adding Local Observations
1. Click "**+ Add Observation**" in the Local Observations card
2. Select observation type (rain, clouds, wind, temperature, other)
3. Add a description of what you're observing
4. Set intensity level (1-5 stars)
5. Submit to save locally in your browser

### Accessibility Features
- **Keyboard Navigation**: Tab through all interactive elements
- **Screen Reader Support**: Proper ARIA labels and semantic markup
- **High Contrast**: Toggle in header for better visibility
- **Reduced Motion**: Automatic detection or manual toggle in settings
- **Focus Indicators**: Clear visual focus for keyboard users

### Mobile Experience
- **Touch Friendly**: 44px minimum touch targets
- **Responsive Layout**: Adapts to all screen sizes
- **Swipe Scrolling**: Horizontal scroll for hourly forecast
- **Optimized Typography**: Readable text at all sizes

## 🧪 Testing

### Manual Testing Checklist
- [ ] **Location Detection**: GPS location works correctly
- [ ] **Search Functionality**: City search returns accurate results
- [ ] **Weather Display**: All weather data displays correctly
- [ ] **Forecast Accuracy**: Hourly and daily forecasts load
- [ ] **Air Quality**: AQI data and health advice appear
- [ ] **Government Alerts**: Alerts display for applicable regions
- [ ] **Observations**: Can add and view local observations
- [ ] **Theme Toggle**: Dark/light mode switches smoothly
- [ ] **Accessibility**: Keyboard navigation works throughout
- [ ] **Responsive Design**: Works on mobile, tablet, and desktop
- [ ] **Error Handling**: Graceful failure when APIs are unavailable

### Browser Compatibility
- ✅ **Chrome 90+** (Recommended)
- ✅ **Firefox 88+**
- ✅ **Safari 14+**
- ✅ **Edge 90+**
- ⚠️ **Internet Explorer**: Not supported (uses modern ES6+ features)

### Performance Testing
- **Lighthouse Score**: Aim for 90+ in all categories
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **API Response Time**: Handles slow/failed API responses gracefully
- **Memory Usage**: Efficient DOM manipulation and event handling

## 🔍 API Integration Details

### Ensemble Forecasting Logic
The app combines data from multiple weather services:

1. **Primary Source**: OpenWeatherMap (most comprehensive)
2. **Secondary Source**: Weatherbit (additional verification)
3. **Tertiary Source**: Open-Meteo (free backup service)
4. **Averaging Algorithm**: Numerical values are averaged, text descriptions use primary source

### Rate Limiting & Caching
- **API Limits**: Respects free tier limitations
- **Caching**: 5-minute cache to prevent excessive requests
- **Fallback Strategy**: Uses available data when some APIs fail
- **Error Handling**: Graceful degradation with user feedback

### Government Alerts Integration
- **US**: NOAA Weather Service API
- **Future**: Expandable to other national weather services
- **Real-time**: Alerts update automatically with weather data
- **Severity Levels**: Color-coded based on alert priority

## 🛡️ Security & Privacy

### Data Privacy
- **No User Tracking**: No analytics or tracking scripts
- **Local Storage Only**: Observations stored locally in browser
- **No Personal Data**: Only location coordinates sent to weather APIs
- **HTTPS Ready**: Works with HTTPS deployment

### API Security
- **Key Rotation**: Easy to update API keys
- **Rate Limiting**: Built-in protection against excessive requests
- **Error Sanitization**: API errors don't expose sensitive information
- **CORS Compliance**: Proper cross-origin request handling

## 🚀 Deployment

### Static Hosting (Recommended)
Perfect for services like:
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Free hosting for public repos
- **Firebase Hosting**: Google's static hosting service

### Traditional Web Hosting
1. Upload all files to your web server
2. Ensure server supports HTTPS (recommended)
3. Configure proper MIME types for CSS and JS files
4. Set up gzip compression for better performance

### CDN Deployment
For global performance:
1. Deploy to primary hosting service
2. Configure CDN (CloudFlare, AWS CloudFront, etc.)
3. Update API endpoints if needed for CORS
4. Test from multiple geographic locations

## 🔧 Troubleshooting

### Common Issues

**🚫 Location not detecting**
- Check browser permissions for geolocation
- Try manual search instead
- Ensure HTTPS if deployed (required for geolocation)

**📡 Weather data not loading**
- Check internet connection
- Verify API keys are correct
- Check browser console for error messages
- Try refreshing after a few minutes

**🎨 Styling issues**
- Clear browser cache
- Check if CSS file is loading correctly
- Verify CSS custom property support in browser

**📱 Mobile display problems**
- Check viewport meta tag is present
- Test in different browsers
- Verify responsive CSS media queries

### Debug Mode
Enable debug logging by opening browser console and running:
```javascript
window.weatherApp.settings.DEBUG = true;
```

### Performance Issues
If the app feels slow:
1. Check network tab for slow API responses
2. Reduce auto-refresh frequency in settings
3. Clear browser cache and stored data
4. Update to latest browser version

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style Guidelines
- **JavaScript**: ES6+ syntax, camelCase naming
- **CSS**: BEM methodology, custom properties for consistency
- **HTML**: Semantic markup, proper ARIA attributes
- **Comments**: Comprehensive JSDoc for functions

### Feature Requests
When suggesting features:
- Check existing issues first
- Provide detailed use case
- Consider accessibility implications
- Think about mobile compatibility

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Weather Data**: OpenWeatherMap, Weatherbit, Open-Meteo
- **Government Alerts**: NOAA Weather Service
- **Icons**: Native emoji for universal compatibility
- **Design Inspiration**: Modern glassmorphism and neumorphism trends
- **Accessibility Guidelines**: WCAG 2.1 standards

## 📞 Support

For questions, issues, or suggestions:
- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check this README for common solutions
- **Browser Console**: Check for error messages and debugging info

---

**WeatherSync** - Making weather data beautiful, accessible, and actionable for everyone. 🌈
