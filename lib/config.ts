import path from 'path';

export const DB_FILE = path.join(process.cwd(), "ppd.db");
export const PORT = 3000;
export const API_PATH = "api/v1";

export const FIELD_CHARACTER_LIMIT = 50;
export const TITLE_CHARACTER_LIMIT = FIELD_CHARACTER_LIMIT;

export const API_ASSOC_ARRAY_LIMIT: number | undefined = undefined;

export const colors = {
  burntSienna:            "#703e35",
  burntUmber:             "#463836",
  cerulean:               "#005598",
  cadmiumRedLight:        "#e32810",
  cadmiumRedMedium:       "#c6353a",
  cobaltBlue:             "#0832a0",
  pyrroleOrange:          "#ef3d00",
  rawUmber:               "#403836",
  primaryCyan:            "#003f82",
  primaryMagenta:         "#a91a31",
  primaryYellow:          "#ffd700",
  viridian2:              "#005955",
  cadmiumYellowDeep:      "#ffa500",
  cadmiumYellowMedium:    "#ffb800",
  cadmiumYellowLight:     "#fed900",
  hookersGreen:           "#344026",
  lemonYellow:            "#f3e000",
  vermillion:             "#f54500",
  venetianRed:            "#783026",
  ultramarineBlue:        "#1e1da0",
  alizarinCrimson:        "#860a1a",
  yellowOchre:            "#c19300",
  buff1:                  "#e8d6c8",
  buff2:                  "#e6d1a4",

  lcAlmostBlack:          "#080808",
  lcTeal:                 "#87ffd7",
  lcYellowPU:             "#ffff87",
  lcYellowPUD:            "#C4BE89",
  lcYellow:               "#ffe587",
  lcPPink:                "#d787d7",
  lcPPinkDsat:            "#af87af",
  lcPPinkPale:            "#d7afd7",
  lcLavender:             "#8787d7",
  lcPeriwinkle:           "#afafff",
  lcReadGrey:             "#afafd7",
  lcCobalt:               "#5f87af",
  lcDarkTeal:             "#5fafaf",
  lcSlyPurple:            "#875f5f",
  lcDeepSea:              "#008787",
  lcRedDsat:              "#d75f87",
  lcHotRed:               "#ff5f87",
  lcLightBlue:            "#afd7d7",
  lcPopBlue:              "#98dccf",
  lcSalmon:               "#ffaf87",
  lcWeirdPurp:            "#ae81ff",
  lcHotPink:              "#f92672",
};
