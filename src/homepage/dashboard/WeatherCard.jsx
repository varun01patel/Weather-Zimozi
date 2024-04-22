import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  TextField,
  Grid,
  IconButton,
  InputAdornment,
  Box,
  Typography,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Lottie from "lottie-react";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WavesIcon from "@mui/icons-material/Waves";
import OpacityIcon from "@mui/icons-material/Opacity";
import GrainIcon from "@mui/icons-material/Grain";
import { useNavigate } from "react-router-dom";
// import autumn from "../../assets/autumn.png";
import Humidity from "../../assets/Humidity.json"
// import temperature from "../../assets/temperature.png";
import temp from "../../assets/temp.json"
// import pressure from "../../assets/pressure.png";
import pressure from "../../assets/presurre.json"

import windspeed from "../../assets/windspeed.json"
import windSpeed from "../../assets/windSpeed.png";
import { useDispatch } from "react-redux";
import { setLatLon } from "../../Redux/weatherSlice";

const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Mumbai");
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const [favoriteCities, setFavoriteCities] = useState(() => {
    const storedFavoriteCities = JSON.parse(
      localStorage.getItem("favoriteCities")
    );
    return storedFavoriteCities || [];
  });

  useEffect(() => {
    const storedFavoriteCities = JSON.parse(
      localStorage.getItem("favoriteCities")
    );
    if (storedFavoriteCities) {
      setFavoriteCities(storedFavoriteCities);
    }
  }, []);

  const fetchWeatherData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=253d73606e710cae6490d42d78ec7102`
      );
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
        extractLatLong();
      } else {
        console.error("Failed to fetch weather data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }, [city]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  useEffect(() => {
    localStorage.setItem("favoriteCities", JSON.stringify(favoriteCities));
  }, [favoriteCities]);

  const toggleFavorite = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) {
      if (!favoriteCities.includes(city)) {
        setIsFavorite(true);
        setFavoriteCities((prevCities) => {
          const newCities = [...prevCities, city];
          localStorage.setItem("favoriteCities", JSON.stringify(newCities));
          return newCities;
        });
      } else {
        alert("This city is already in your favorites!");
      }
    } else {
      const confirmed = window.confirm("Login to set Favorite City");
      if (confirmed) {
        navigate("/login");
      } else {
        console.log("User cancelled.");
      }
    }
  }, [city, favoriteCities, navigate]);

  function formatTime(timestamp) {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const formattedTime =
      (hours % 12) +
      ":" +
      minutes.substr(-2) +
      " " +
      (hours >= 12 ? "PM" : "AM");
    return formattedTime;
  }
  const kelvinToCelsius = (kelvin) => {
    return kelvin - 273.15;
  };

  const temperatureInKelvin = weatherData?.main?.temp;
  const temperatureInCelsius = kelvinToCelsius(temperatureInKelvin);

  const dispatch = useDispatch();

  const extractLatLong = () => {
    if (weatherData && weatherData.coord) {
      const { lat, lon } = weatherData.coord;
      dispatch(setLatLon({ lat, lon }));
    }
  };

  return (
    <Grid container>
      <Grid
        container
        spacing={2}
        margin={2}
        sx={{
          backgroundColor: "#FFFFFF",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            color={isFavorite ? "primary" : "secondary"}
            sx={{
              height: "54px",
              mt: "16px",
              width: "100%",
              mb: "-12px",
              bgcolor: isFavorite ? "#4caf50" : "#f44336",
              color: "white",
              "&:hover": {
                bgcolor: isFavorite ? "#388e3c" : "#c62828",
              },
            }}
            onClick={toggleFavorite}
          >
            {isFavorite ? "Added to Favorites" : "Add to Favorites"}
          </Button>
        </Grid>
        <Grid item xs={12} sm={9}>
          <TextField
            placeholder="Search"
            variant="outlined"
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => fetchWeatherData()}>
                    <SearchIcon color="primary" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#3f51b5",
                },
              },
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={5} sx={{ backgroundColor: '#f0f8ff' }}>
      <Grid item xs={12}>
  {weatherData && (
    <Card variant="outlined" sx={{ backgroundColor: "#f44336", borderRadius: '10px' }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Typography variant='h5' sx={{ color: '#FFFFFF', animation: 'upDown 2s ease-in-out infinite' }}>
          {(city).toLocaleUpperCase()}
        </Typography>
        <Box display={'flex'} justifyContent={"space-around"} gap={10} sx={{ marginBottom: 3, marginTop: 5 }}>
          <Box display="flex" alignItems="center" flexDirection={'column'}>
            <Typography variant='body1' sx={{ fontWeight: 'bold', display: 'flex', alignItems: "center", gap: '5px', color: '#FFFFFF', animation: 'upDown 1.5s ease-in-out infinite' }}>
              <WbSunnyIcon style={{ color: 'white' }} /> Sunrise
            </Typography>
            <Typography variant='body1' sx={{ color: '#FFFFFF', animation: 'upDown 1.5s ease-in-out infinite' }}>
              {formatTime(weatherData.sys.sunrise)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" flexDirection={'column'}>
            <Typography variant='body1' sx={{ fontWeight: 'bold', display: 'flex', alignItems: "center", gap: '5px', color: '#FFFFFF', animation: 'upDown 1.5s ease-in-out infinite' }}>
              <NightsStayIcon style={{ color: 'white' }} /> Sunset
            </Typography>
            <Typography variant='body1' sx={{ color: '#FFFFFF', animation: 'upDown 1.5s ease-in-out infinite' }}>
              {formatTime(weatherData.sys.sunset)}
            </Typography>
          </Box>
        </Box>
        <Grid item sx={{ textAlign: "center" }}>
          <Typography variant='h2' sx={{ marginBottom: 2, color: '#FFFFFF', animation: 'upDown 2s ease-in-out infinite' }}>
            {temperatureInCelsius.toFixed(2)}°C
          </Typography>
          <Typography variant='h6' sx={{ marginBottom: 4, color: '#FFFFFF', animation: 'upDown 1.5s ease-in-out infinite' }}>
            {weatherData.weather[0].description}
          </Typography>
        </Grid>
        <Grid item display={"flex"} justifyContent="center" gap={10}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant='body1' sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', color: '#FFFFFF', animation: 'upDown 1.5s ease-in-out infinite' }}>
              <ThermostatIcon style={{ color: 'white' }} /> Max Temp
            </Typography>
            <Typography variant='body2' sx={{ color: '#FFFFFF', animation: 'upDown 1.5s ease-in-out infinite' }}>
              {weatherData?.main.temp_max}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant='body1' sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', color: '#FFFFFF', animation: 'upDown 1.5s ease-in-out infinite' }}>
              <ThermostatIcon style={{ color: 'white' }} /> Min Temp
            </Typography>
            <Typography variant='body2' sx={{ color: '#FFFFFF', animation: 'upDown 1.5s ease-in-out infinite' }}>
              {weatherData.main.temp_min - 20}
            </Typography>
          </Box>
        </Grid>
      </CardContent>
    </Card>
  )}
</Grid>

  <Grid item xs={12} sm={6}>
    <Card variant="outlined" sx={{ backgroundColor: "#800000", display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '10px' }}>
      <CardContent>
        <Typography variant='h6' sx={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '5px' }}><WavesIcon color="#FFFFFF" /> Wind</Typography>
        <Typography variant='body2' sx={{ color: '#FFFFFF' }}>Today's Wind Speed</Typography>
        <Typography variant='h5' sx={{ color: '#FFFFFF' }}>{weatherData?.wind?.speed} km/h</Typography>
      </CardContent>
      <CardContent>
        <Box>
        <Lottie animationData={windspeed} style={{ width: '100px' }}/>
          {/* <img src={windSpeed} alt="" style={{ width: '100px' }} /> */}
        </Box>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={6}>
    <Card variant="outlined" sx={{ backgroundColor: "#4caf50", display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '10px' }}>
      <CardContent>
        <Typography variant='h6' sx={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '5px' }}><OpacityIcon color="#FFFFFF" /> Humidity</Typography>
        <Typography variant='body2' sx={{ color: '#FFFFFF' }}>Today's Humidity</Typography>
        <Typography variant='h5' sx={{ color: '#FFFFFF' }}>{weatherData?.main?.humidity}</Typography>
      </CardContent>
      <CardContent>
        <Box>
        <Lottie animationData={Humidity} style={{ width: '100px' }}/>
          {/* <img src={autumn} alt="" style={{ width: '100px' }} /> */}
        </Box>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={6}>
    <Card variant="outlined" sx={{ backgroundColor: "#f44336", display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '10px' }}>
      <CardContent>
        <Typography variant='h6' sx={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '5px' }}><GrainIcon color="#FFFFFF" /> Pressure</Typography>
        <Typography variant='body2' sx={{ color: '#FFFFFF' }}>Today's Pressure</Typography>
        <Typography variant='h5' sx={{ color: '#FFFFFF' }}>{weatherData?.main?.pressure}</Typography>
      </CardContent>
      <CardContent>
        <Box>
        <Lottie animationData={pressure} style={{ width: '100px' }}/>
          {/* <img src={pressure} alt="" style={{ width: '100px' }} /> */}
        </Box>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={6}>
    <Card variant="outlined" sx={{ backgroundColor: "#0000FF", display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '10px' }}>
      <CardContent>
        <Typography variant='h6' sx={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '5px' }}><ThermostatIcon color="primary" /> Temperature</Typography>
        <Typography variant='body2' sx={{ color: '#FFFFFF' }}>Today's Temperature</Typography>
        <Typography variant='h5' sx={{ color: '#FFFFFF' }}>{weatherData?.main?.temp} K</Typography>
      </CardContent>
      <CardContent>
        <Box>
        <Lottie animationData={temp} style={{ width: '100px' }}/>
          {/* <img src={temperature} alt="" style={{ width: '100px' }} /> */}
        </Box>
      </CardContent>
    </Card>
  </Grid>
</Grid>
    </Grid>
  );
};

export default WeatherCard;
