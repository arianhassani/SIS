import { useLocation } from 'react-router-dom';
import logo from '../assets/team_logos/file.png'; // Adjust the path to your logo as needed

const Navbar = () => {
  const location = useLocation();

  const getStepClass = (path) => {
    const steps = [
      { path: '/', name: 'Team Selection' },
      { path: '/injury-page', name: 'Injury' },
      { path: '/matchup-page', name: 'Match-Up' },
      { path: '/prediction-page', name: 'Prediction' },
    ];

    const currentIndex = steps.findIndex(
      (step) => step.path === location.pathname,
    );
    const stepIndex = steps.findIndex((step) => step.path === path);

    return stepIndex <= currentIndex ? 'step step-primary' : 'step';
  };

  return (
    <div
      className="bg-gray-200 shadow-lg rounded-lg mt-4 mx-auto"
      style={{ maxWidth: '90%', padding: '0 1.5rem' }}
    >
      <div className="navbar">
        <div className="flex-1">
          {/* Link for the logo and app name */}
          <span className="flex items-center text-xl font-bold">
            <img src={logo} alt="Logo" className=" h-32 mr-2" />
          </span>
        </div>
        <div className="flex-none">
          {/* Steps navigation */}
          <ul className="steps">
            <li className={getStepClass('/')}>
              <span className="text-black">Team Selection</span>
            </li>
            <li className={getStepClass('/injury-page')}>
              <span className="text-black">Injury</span>
            </li>
            <li className={getStepClass('/matchup-page')}>
              <span className="text-black">Match-Up</span>
            </li>
            <li className={getStepClass('/prediction-page')}>
              <span className="text-black">Prediction</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
