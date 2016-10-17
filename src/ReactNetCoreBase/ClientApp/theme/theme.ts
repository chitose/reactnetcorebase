import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { white } from 'material-ui/styles/colors';
export interface Theme extends __MaterialUI.Styles.MuiTheme {
}

let theme = getMuiTheme(lightBaseTheme) as Theme;

// customization

theme.spacing = {
  iconSize: 24,

  desktopGutter: 24,
  desktopGutterMore: 32,
  desktopGutterLess: 16,
  desktopGutterMini: 8,
  desktopKeylineIncrement: 64,

  desktopDropDownMenuItemHeight: 32,
  desktopDropDownMenuFontSize: 15,

  desktopDrawerMenuItemHeight: 48,

  desktopSubheaderHeight: 48,

  desktopToolbarHeight: 56
};

theme.flatButton.fontSize = 14;
theme.flatButton.fontWeight = 600;

export default theme;