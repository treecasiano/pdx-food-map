<template>
  <v-container fluid fill-height class="pdx-loginCard">
    <v-layout>
      <v-flex>
        <div data-cy="loginContainer">
          <v-toolbar
            color="primary darken-2"
            dark
            :flat="true"
            dense
            class="pl-2"
          >
            <v-icon>fas fa-user-circle</v-icon>&nbsp;&nbsp;
            <span>LOGIN</span>
            <v-spacer></v-spacer>
            <v-tooltip bottom max-width="200">
              <template v-slot:activator="{ on }">
                <v-icon small dark v-on="on">help</v-icon>
              </template>
              <span>
                Only authorized administrators can access the Admin Console.
              </span>
            </v-tooltip>
          </v-toolbar>
          <v-form>
            <v-card class="elevation-1">
              <v-card-text>
                <v-alert
                  data-cy="loginErrorAlert"
                  :value="error.showLoginError"
                  type="error"
                  class="red darken-2"
                  :dismissible="true"
                  >{{ error.loginErrorMessage }}</v-alert
                >
                <v-text-field
                  label="Username"
                  placeholder=" "
                  v-model="username"
                  :autofocus="true"
                  @keyup="submitForm"
                ></v-text-field>
                <v-text-field
                  label="Password"
                  placeholder=" "
                  type="password"
                  v-model="password"
                  @keyup="submitForm"
                ></v-text-field>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn
                  color="primary"
                  data-cy="loginButton"
                  outlined
                  @click="login()"
                  :disabled="disableLoginButton"
                  >{{ loginButtonText }}</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-form>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      disableLoginButton: false,
      error: {
        loginErrorMessage: "",
        showLoginError: false
      },
      loginButtonText: "Login",
      password: "",
      username: ""
    };
  },
  methods: {
    submitForm(e) {
      if (e.key === "Enter") {
        this.login();
      }
    },
    async login() {
      this.disableLoginButton = true;
      this.loginButtonText = "Logging in...";
      try {
        await this.$store.dispatch("session/login", {
          password: this.password,
          username: this.username
        });
        document.location = "/";
      } catch (e) {
        if (e.response.status === 400 || e.response.status === 401) {
          this.error.loginErrorMessage = "Invalid username or password.";
        }
        this.error.showLoginError = true;
        this.disableLoginButton = false;
        this.loginButtonText = "Login";
      }
    }
  }
};
</script>

<style>
.pdx-loginCard {
  margin: 0 auto;
  max-width: 500px;
  width: 75%;
}
</style>
