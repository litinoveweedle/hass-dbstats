import { useContext } from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
import LightModeTwoToneIcon from '@mui/icons-material/LightModeTwoTone';
import { ThemeContext } from 'src/theme/ThemeProvider';

function ThemeToggle() {
  const { themeName, setThemeName } = useContext(ThemeContext);
  const theme = useTheme();
  const isDark = themeName === 'PureDarkTheme';

  return (
    <Tooltip arrow title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        aria-label="Toggle dark mode"
        onClick={() => setThemeName(isDark ? 'PureLightTheme' : 'PureDarkTheme')}
        sx={{
          position: 'fixed',
          top: theme.spacing(2),
          right: theme.spacing(2),
          zIndex: 1300,
          color: theme.palette.text.primary,
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[3],
          '&:hover': { background: theme.palette.background.paper }
        }}
      >
        {isDark ? <LightModeTwoToneIcon /> : <DarkModeTwoToneIcon />}
      </IconButton>
    </Tooltip>
  );
}

export default ThemeToggle;
