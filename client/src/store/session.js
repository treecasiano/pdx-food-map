import sessionApi from "@/api/session";

export default {
  actions: {
    async loadSession({ commit }) {
      let session;
      try {
        session = await sessionApi.getSession();
      } catch (e) {
        console.error("session error", e);
        return;
      }
      commit("updateSession", session.data);
      return session.data;
    },
    async login(context, { password, username }) {
      await sessionApi.login({
        password,
        username,
      });
      await context.dispatch("loadSession");
    },
  },
  getters: {
    getSession: state => {
      return {
        isAdmin: state.isAdmin,
        loggedIn: state.loggedIn,
        user: state.user,
        username: state.username,
      };
    },
  },
  mutations: {
    logout(state) {
      state.loggedIn = false;
    },
    updateSession(state, session) {
      state.expires = session.expires;
      state.isAdmin = session.isAdmin;
      state.loggedIn = session.loggedIn;
      state.user = session.user;
      state.username = session.username;
    },
  },
  namespaced: true,
  state: {
    expires: null,
    isAdmin: false,
    loggedIn: false,
    user: {},
    username: "",
  },
};
