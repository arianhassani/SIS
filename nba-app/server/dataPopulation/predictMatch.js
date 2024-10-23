import axios from 'axios';

export const predictMatchOutcome = async (teamA, teamB, lineupA, lineupB) => {
  const response = await axios.post('http://localhost:5000/predict', {
    teamA,
    teamB,
    lineupA,
    lineupB
  });
  return response.data;
};