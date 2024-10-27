import PropTypes from "prop-types";

const Player = ({ player, onDelete }) => {
  return (
    <li className='flex justify-between items-center p-2 border-b border-green-300'>
      <span>{player}</span>
      <button className='btn btn-sm btn-outline btn-error' onClick={onDelete}>
        X
      </button>
    </li>
  );
};

Player.propTypes = {
  player: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Player;
