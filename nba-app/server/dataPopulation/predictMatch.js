import axios from 'axios';

export const predictMatchOutcome = async (homeTeam, awayTeam) => {
  const response = await axios.post('http://127.0.0.1:5000/predict', {
    home: {
      teamId: homeTeam
    },
    away: {
      teamId: awayTeam
    }
  });
  return response.data;
};