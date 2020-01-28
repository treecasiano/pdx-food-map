import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/dist/vuetify.min.css";
import colors from "vuetify/lib/util/colors";
import "material-design-icons-iconfont/dist/material-design-icons.css";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "md",
  },
  theme: {
    options: { customProperties: true },
    themes: {
      light: {
        primary: colors.brown.base,
        secondary: colors.deepOrange.base,
        accent: colors.lime.base,
        info: colors.lightBlue.base,
        error: colors.red.base,
        success: colors.green.base,
        warning: colors.red.base,
      },
    },
  },
});
