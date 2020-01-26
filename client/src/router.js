import axios from "axios";
import { removeCookie } from "tiny-cookie";
import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import store from "./store";

Vue.use(Router);

async function checkSession(next) {
  try {
    await store.dispatch("session/loadSession");

    const {
      state: {
        session: { loggedIn }
      }
    } = store;

    if (!loggedIn) {
      removeCookie("jwt");
      next("login");
    }
    return next();
  } catch (e) {
    removeCookie("jwt");
    next("login");
  }
}

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
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
            session: { isAdmin }
          }
        } = store;

        if (!isAdmin) {
          next({ path: "/" });
          return;
        }

        next();
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      async beforeEnter(to, from, next) {
        const {
          state: { loggedIn }
        } = store;

        // to handle the case in which the user is already logged in and manually enters /login route
        if (loggedIn) {
          next();
          return;
        }
        next();
      }
    }
  ]
});

axios.interceptors.response.use(null, e => {
  if (e.response.status === 401) {
    console.log("User is not authenticated. Redirecting to /login...");
    removeCookie("jwt");
    // store.commit("logout");
    router.push({ name: "login" });
  }
  throw e;
});

export default router;

// TODO: Implement a NotFoundComponent (catch-all route) to show a 404 page
// see: https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations
