import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, Typography, CircularProgress , Grid , Box } from '@mui/material';
import { Air, AcUnit, LocalGasStation, Gesture, Whatshot, Cloud, FilterDrama, WbIncandescent } from '@mui/icons-material';

const PollutionCard = () => {
  const [pollutionData, setPollutionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const lat = useSelector(state => state.weather.lat) || 19.0760; // Default latitude for Mumbai
  const lon = useSelector(state => state.weather.lon) || 72.8777; // Default longitude for Mumbai
  


  useEffect(() => {
    const fetchPollutionData = async () => {
      try {
        const apiKey = '253d73606e710cae6490d42d78ec7102';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const data = await response.json();
        setPollutionData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pollution data:', error);
      }
    };

    fetchPollutionData();
  }, []);





  return (
    <div>
      <Card variant="outlined" style={{ width: '100%', height: '100%', marginTop: "15px" }}>
        <CardContent style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Typography variant='h5'>Air Quality Index: {loading ? <CircularProgress size={20} /> : pollutionData?.list[0]?.main?.aqi}</Typography>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
  <Box
    sx={{
      bgcolor: '#90EE90',
      color: 'black',
      p: '10px',
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }}
  >
    <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: '#90EE90' }} />
    <Typography>0-50 Good</Typography>
  </Box>
  <Box
    sx={{
      bgcolor: '#FFFF00',
      color: 'black',
      p: '10px',
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }}
  >
    <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: '#FFFF00' }} />
    <Typography>50-100 Moderate</Typography>
  </Box>
  <Box
    sx={{
      bgcolor: '#FFA500',
      color: 'black',
      p: '10px',
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }}
  >
    <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: '#FFA500' }} />
    <Typography>100-150 Sensitive Groups</Typography>
  </Box>
  <Box
    sx={{
      bgcolor: '#FF0000',
      color: 'white',
      p: '10px',
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }}
  >
    <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: '#FF0000' }} />
    <Typography>150-200 Unhealthy</Typography>
  </Box>
  <Box
    sx={{
      bgcolor: '#800080',
      color: 'white',
      p: '10px',
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }}
  >
    <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: '#800080' }} />
    <Typography>200-250 Very Unhealthy</Typography>
  </Box>
  <Box
    sx={{
      bgcolor: '#800000',
      color: 'white',
      p: '10px',
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }}
  >
    <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: '#800000' }} />
    <Typography>250-Infinite Hazardous</Typography>
  </Box>
</Box>
          </div>

          {['Co', 'Nh3', 'No', 'No2', 'O3', 'PM2.5', 'PM10', 'So2'].map((pollutant, index) => (
            <Card
              key={index}
              variant="outlined"
              style={{
                backgroundColor: 'rgb(236,243,248)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <CardContent style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant='h6'>{pollutant}</Typography>
                <Typography>{pollutionData?.list[0]?.components[pollutant.toLowerCase()] || "N/A"}</Typography>
                {getPollutantIcon(pollutant)}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

// Function to return the appropriate icon based on the pollutant
const getPollutantIcon = (pollutant) => {
  switch (pollutant) {
    case 'Co':
      return <Air />;
    case 'Nh3':
      return <AcUnit />;
    case 'No':
      return <LocalGasStation />;
    case 'No2':
      return <Gesture />;
    case 'O3':
      return <Whatshot />;
    case 'PM2.5':
      return <Cloud />;
    case 'PM10':
      return <FilterDrama />;
    case 'So2':
      return <WbIncandescent />;
    default:
      return null;
  }
};

export default PollutionCard;
