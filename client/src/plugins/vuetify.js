import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/dist/vuetify.min.css";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi",
  },
  theme: {
    themes: {
      light: {
        primary: colors.brown.darken1,
        secondary: colors.lightBlue.darken2,
        tertiary: colors.deepOrange.lighten2,
        accent: colors.lime,
        info: colors.lightBlue,
        error: colors.red,
        success: colors.green,
        warning: colors.red,
      },
    },
    options: { customProperties: true },
  },
});
