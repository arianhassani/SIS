import PropTypes from 'prop-types';

export const addPlayerFormPropTypes = {
  onAddPlayer: PropTypes.func.isRequired,
  availablePlayers: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};