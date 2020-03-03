import axios from "axios";
import { removeCookie } from "tiny-cookie";
import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Admin from "./views/admin/Admin.vue";
import Login from "./views/Login.vue";
import store from "./store";

Vue.use(Router);

async function checkSession(next) {
  try {
    await store.dispatch("session/loadSession");

    const {
      state: {
        session: { loggedIn },
      },
    } = store;

    if (!loggedIn) {
      removeCookie("jwt");
      next("/");
    }
    return next();
  } catch (e) {
    removeCookie("jwt");
    next("/");
  }
}

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      async beforeEnter(to, from, next) {
        try {
          await store.dispatch("session/loadSession");

          const {
            state: {
              session: { loggedIn },
            },
          } = store;

          if (!loggedIn) {
            removeCookie("jwt");
          }
          return next();
        } catch (e) {
          removeCookie("jwt");
        }
        next();
      },
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue"),
      async beforeEnter(to, from, next) {
        await checkSession(next);
        next();
      },
    },
    {
      path: "/admin",
      name: "admin",
      component: () =>
        import(/* webpackChunkName: "admin" */ "./views/admin/Admin.vue"),
      async beforeEnter(to, from, next) {
        await checkSession(next);

        const {
          state: {
            session: { isAdmin },
          },
        } = store;

        if (!isAdmin) {
          next({ path: "/" });
          return;
        }
        next();
      },
      redirect: { name: "adminObject", params: { object: "farmersMarket" } },
      children: [
        {
          component: Admin,
          path: ":object",
          name: "adminObject",
          children: [
            {
              component: Admin,
              path: ":id/:mode",
              name: "adminObjectEdit",
            },
            {
              component: Admin,
              path: ":mode",
              name: "adminObjectCreate",
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
  ],
});

export default router;

// TODO: Implement a NotFoundComponent (catch-all route) to show a 404 page
// see: https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations
