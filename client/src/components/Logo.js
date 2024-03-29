import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import '../App.css';

// ----------------------------------------------------------------------

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default function Logo({ urlLink = '/', disabledLink = false, sx }) {
  const theme = useTheme();

  const COMP1_LIGHT = theme.palette.comp1.light;

  const COMP1_MAIN = theme.palette.comp1.main;

  const COMP1_DARK = theme.palette.comp1.dark;
  const COMP1_DARKER = theme.palette.comp1.darker;

  const COMP3_LIGHT = theme.palette.comp3.light;

  const COMP3_MAIN = theme.palette.comp3.main;

  const COMP3_DARK = theme.palette.comp3.dark;

  const COMP2_LIGHT = theme.palette.comp2.light;

  const COMP2_MAIN = theme.palette.comp2.main;

  const COMP2_DARK = theme.palette.comp2.dark;

  const COMP4_LIGHT = theme.palette.comp4.light;

  const COMP4_MAIN = theme.palette.comp4.main;

  const COMP4_DARK = theme.palette.comp4.dark;

  const ERROR_LIGHT = theme.palette.error.light;

  const ERROR_MAIN = theme.palette.error.main;

  const ERROR_DARK = theme.palette.error.darker;

  const logo = (
    <Box sx={{ width: 50, height: 50, ...sx }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 300 300">
        <defs>
          <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
            <stop offset="0%" stopColor={ERROR_DARK} />
            <stop offset="100%" stopColor={COMP4_MAIN} />
          </linearGradient>
          <linearGradient id="BG2" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={COMP2_LIGHT} />
            <stop offset="100%" stopColor={ERROR_DARK} />
          </linearGradient>
        </defs>

        <g>
          <path
            fill="url(#BG1)"
            d="M229.3,132.8L229.3,132.8c-0.1-0.1-0.1-0.2-0.2-0.3l0,0l0,0c-9.1-9.2-19.7-11.6-30.1-10.4
            c-9.4,22.2-35.2,28.3-52.4,29.9c-0.1,0.1-0.1,0.2-0.1,0.2s-48.6,46.9-15.3,78.1c31.4,33.2,78.5-15.2,78.5-15.2
            S261.8,171.5,229.3,132.8z M217.6,152.4c-0.2,2.6-0.8,5.5-1.9,8.5c-1.1,3-2.8,6.1-4.9,9.1c-2.1,3-4.7,5.8-7.7,8.4
            c-1.5,1.3-3.1,2.5-4.7,3.7c-0.8,0.6-1.7,1.1-2.5,1.7c-0.9,0.5-1.8,1-2.7,1.6c-3.6,2-7.5,3.6-11.6,4.9l-2.7,0.7l-2.7,0.8l-0.7,0.2
            l-0.5,0.2l-1,0.3c-0.7,0.2-1.4,0.4-2.1,0.7c-0.7,0.3-1.4,0.6-2.1,0.8c-0.7,0.3-1.3,0.6-2,0.9l-1,0.5l-0.9,0.5
            c-0.6,0.4-1.2,0.6-1.8,1c-2.3,1.4-4.2,3.1-5.9,5c-0.4,0.5-0.8,1-1.2,1.4c-0.4,0.5-0.7,1-1.1,1.5c-0.2,0.3-0.4,0.5-0.6,0.8
            c-0.2,0.3-0.3,0.5-0.5,0.8c-0.3,0.5-0.6,1.1-1,1.6c-0.6,1.1-1.2,2.2-1.7,3.2c-0.5,1.1-1,2.1-1.4,3.1s-0.8,2-1.2,2.9
            c-0.3,0.9-0.7,1.8-0.9,2.5c-0.6,1.6-1,2.8-1.3,3.6s-0.5,1.3-0.5,1.3h-1c0,0,0-0.5,0-1.3c0-0.9,0-2.1,0.1-3.8
            c0.1-0.8,0.1-1.7,0.2-2.7c0.1-1,0.2-2,0.4-3.2c0.1-1.1,0.4-2.3,0.6-3.6c0.2-1.3,0.7-2.5,1-3.9c0.2-0.7,0.5-1.3,0.7-2
            c0.1-0.3,0.2-0.7,0.4-1c0.1-0.3,0.3-0.7,0.5-1c0.3-0.7,0.7-1.4,1-2.1c0.4-0.7,0.8-1.4,1.2-2.1c1.8-2.7,4-5.4,6.7-7.7
            c2.8-2.2,5.9-4.2,9.3-5.6c0.8-0.4,1.7-0.7,2.6-1.1c0.9-0.3,1.8-0.7,2.6-1l2.6-0.8l2.7-0.8c3.5-1.1,6.9-2.4,10.1-4
            c3.2-1.6,6.2-3.5,9-5.5c2.7-2,5.2-4.2,7.3-6.6c2.1-2.3,3.9-4.7,5.2-7c1.3-2.4,2.3-4.7,3-6.8s1-4,1.1-5.6c0.1-0.8,0.1-1.5,0.1-2.1
            s0-1.1,0-1.6c0-0.9-0.1-1.3-0.1-1.3l1-0.1c0,0,0.2,0.4,0.6,1.3c0.2,0.4,0.4,1,0.6,1.6c0.1,0.3,0.2,0.7,0.3,1.1
            c0.1,0.4,0.1,0.8,0.2,1.2C217.6,147.6,217.9,149.9,217.6,152.4z"
          />
          <path
            fill="url(#BG2)"
            d="M198.6,104L198.6,104c0,0,0-1,0-1.1V102l0,0c0.2-46-72.3-44.1-72.3-44.1S58.6,57,60,102.5
            c-1.4,45.6,66.3,45.1,66.3,45.1S194.1,152,198.6,104z M176.4,108.5c-2,1.7-4.4,3.3-7.4,4.7c-2.9,1.4-6.3,2.4-9.9,3
            c-3.6,0.6-7.5,0.8-11.4,0.6c-2-0.1-4-0.4-6-0.7c-1-0.2-2-0.4-3-0.6s-2-0.5-3-0.8c-4-1.1-7.9-2.7-11.7-4.6l-2.4-1.4l-2.4-1.3
            l-0.6-0.3l-0.5-0.2l-1-0.5c-0.7-0.3-1.2-0.7-1.9-0.9c-0.7-0.3-1.4-0.6-2.1-0.9s-1.4-0.5-2-0.7l-1-0.4l-1-0.2
            c-0.7-0.1-1.3-0.4-2-0.5c-2.6-0.6-5.2-0.7-7.7-0.6c-0.6,0-1.3,0.1-1.9,0.1c-0.6,0.1-1.2,0.2-1.9,0.3c-0.3,0.1-0.6,0.1-0.9,0.1
            c-0.3,0.1-0.6,0.2-0.9,0.2c-0.6,0.2-1.2,0.3-1.8,0.4c-1.2,0.4-2.4,0.7-3.5,1.1s-2.2,0.8-3.2,1.2c-1,0.4-2,0.8-2.9,1.2
            c-0.9,0.4-1.7,0.8-2.5,1.1c-1.5,0.7-2.7,1.2-3.5,1.6s-1.3,0.6-1.3,0.6l-0.7-0.7c0,0,0.3-0.3,1-0.9c0.6-0.6,1.5-1.5,2.8-2.6
            c0.6-0.5,1.3-1.1,2-1.8c0.8-0.6,1.6-1.3,2.5-2s1.9-1.4,3-2.1s2.3-1.3,3.5-2.1c0.6-0.3,1.3-0.6,2-0.9c0.3-0.2,0.7-0.3,1-0.5
            c0.3-0.1,0.7-0.3,1.1-0.4c0.7-0.3,1.5-0.5,2.2-0.8c0.8-0.2,1.5-0.4,2.3-0.6c3.2-0.7,6.7-1.1,10.2-0.7s7.1,1.2,10.6,2.6
            c0.9,0.3,1.7,0.7,2.6,1.1c0.8,0.4,1.8,0.7,2.5,1.2l2.5,1.3l2.4,1.3c3.2,1.7,6.6,3.1,10,4.3c3.4,1.1,6.9,1.9,10.3,2.4
            c3.4,0.5,6.7,0.7,9.8,0.5s6.1-0.6,8.7-1.3c2.6-0.7,4.9-1.7,6.9-2.7s3.5-2.2,4.8-3.2c0.6-0.5,1.2-1,1.6-1.4c0.4-0.4,0.8-0.8,1.1-1.1
            c0.6-0.6,0.9-1,0.9-1l0.7,0.6c0,0-0.2,0.5-0.5,1.3c-0.2,0.4-0.4,0.9-0.8,1.5c-0.2,0.3-0.3,0.7-0.6,1c-0.2,0.3-0.5,0.7-0.7,1
            C179.8,105.1,178.4,106.8,176.4,108.5z"
          />
        </g>
      </svg>
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <RouterLink to={urlLink} className="link-logo">
      <Box className="flex flex-row items-center py-5">
        {logo}{' '}
        <Typography component={'span'} className="ml-2 font-bold" sx={{ color: theme.palette.secondary.dark2 }}>
          CoffeeTrack
        </Typography>
      </Box>
    </RouterLink>
  );
}
