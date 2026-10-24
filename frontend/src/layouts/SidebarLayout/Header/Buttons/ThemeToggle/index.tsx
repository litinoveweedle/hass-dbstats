import { useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
import LightModeTwoToneIcon from '@mui/icons-material/LightModeTwoTone';
import { ThemeContext } from 'src/theme/ThemeProvider';

function HeaderThemeToggle() {
  const { themeName, setThemeName } = useContext(ThemeContext);
  const isDark = themeName === 'PureDarkTheme';

  return (
    <Tooltip arrow title={isDark ? 'Light mode' : 'Dark mode'}>
      <IconButton
        color="primary"
        onClick={() => setThemeName(isDark ? 'PureLightTheme' : 'PureDarkTheme')}
      >
        {isDark ? <LightModeTwoToneIcon /> : <DarkModeTwoToneIcon />}
      </IconButton>
    </Tooltip>
  );
}

export default HeaderThemeToggle;
