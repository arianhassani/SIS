import axios from 'axios';

export const predictMatchOutcome = async (homeTeam, awayTeam, homeTeamLineup, awayTeamLineup) => {
  const response = await axios.post('http://127.0.0.1:5000/predict', {
    home: {
      teamId: homeTeam,
      playerIds: homeTeamLineup
    },
    away: {
      teamId: awayTeam,
      playerIds: awayTeamLineup
    },
  });
  return response.data;
};
