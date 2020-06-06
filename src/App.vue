<template>
  <main>
    <transition mode="out-in">
      <router-view />
    </transition>
    <v-snackbar
      :color="'error'"
      :bottom="false"
      :top="true"
      :left="false"
      :right="false"
      v-model="snackbar"
    >
      <v-icon
        color="white"
        class="mr-3">mdi-bell-plus</v-icon>
      <div>{{ message }}</div>
      <v-icon
        size="16"
        @click="snackbar = false">mdi-close-circle</v-icon>
    </v-snackbar>
  </main>
</template>

<style lang="scss">
@import "@/styles/index.scss";

/* Remove in 1.2 */
.v-datatable thead th.column.sortable i {
  vertical-align: unset;
}
</style>
<script>
// checks to see if auth jwt token is valid or has expired, if it gets back 401 error log out
export default {
  data: () => ({
    snackbar: false,
    message: ''
  }),
  created: function () {
    this.$http.interceptors.response.use((response) => {
      console.log(response)
      return response
    }, (error) => {
      // if (error.response.data === 'Authentication Error') {
      //   console.log("You have been logged out of session, please refresh to login again!");
      // }
      this.message = error.response.data
      this.snackbar = true
      if (error.response.status === 401) {
        if (this.$store.getters.authorized) {
          this.$store.dispatch('refreshtoken')
        } else {
          return Promise.reject(error)
        }
      } else {
        return Promise.reject(error)
      }
    }
    )
  }
}
</script>
