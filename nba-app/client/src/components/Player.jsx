import PropTypes from 'prop-types';

const Player = ({ player, onDelete }) => {
  return (
    <li className="flex justify-between items-center p-2 border-b border-gray-200">
      <span>{player}</span>
      <button
        className="btn btn-sm btn-danger"
        onClick={onDelete}
      >
        Delete
      </button>
    </li>
  );
};

Player.propTypes = {
  player: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Player;