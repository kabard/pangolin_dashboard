<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout
      justify-center
      wrap>
      <v-flex
        md12
        style="margin-bottom: 48px">
        <material-card
          color="green"
          flat
          full-width
          title="User Table"
          text="list of all Users">
          <v-spacer/>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details> -->
          </v-text-field>
          <v-dialog
            v-model="UserDialog"
            max-width="500px" >
            <template v-slot:activator="{ on }">
              <v-btn
                color="general"
                dark
                class="mb-2"
                v-on="on"
                @click="onUserDialogLoad">Add new</v-btn>
            </template>

            <v-card >
              <v-card-text >
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex
                      xs12
                      sm6
                      md6>
                      <v-text-field
                        v-model="userItem.username"
                        label="Name" />
                    </v-flex>
                    <v-flex
                      v-if="userItem.state=='edit'"
                      xs12
                      sm6
                      md6>
                      <v-switch
                        v-model="userItem.isPasswordChange"
                        :label="`change password?`"
                      />
                    </v-flex>
                    <v-flex
                      v-if="userItem.isPasswordChange && userItem.state == 'edit'"
                      xs12
                      sm6
                      md6>
                      <v-text-field
                        :append-icon="userItem.showPassword ? 'visibility' : 'visibility_off'"
                        :rules="[rules.required, rules.validRegex]"
                        :type="userItem.showPassword ? 'text' : 'password'"
                        v-model="userItem.newPassword"
                        :hint="validRegex"
                        name="input-10-2"
                        label="Change password here"
                        @click:append="userItem.showPassword = !userItem.showPassword"
                      />
                    </v-flex>
                    <v-flex
                      v-if="userItem.state !== 'edit'"
                      xs12
                      sm6
                      md6>
                      <v-text-field
                        :append-icon="userItem.showPassword ? 'visibility' : 'visibility_off'"
                        :rules="[rules.required, rules.validRegex]"
                        :type="userItem.showPassword ? 'text' : 'password'"
                        v-model="userItem.password"
                        :hint="validRegex"
                        name="input-10-2"
                        label="Enter password here"
                        @click:append="userItem.showPassword = !userItem.showPassword"
                      />
                    </v-flex>
                    <v-flex
                      xs12
                      sm6
                      md6>
                      <v-select
                        :items="RolesList"
                        v-model="userItem.SelectedRole"
                        label="Choose User Roles"/>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="blue darken-1"
                  flat
                  @click="closeUserDialog" >Cancel</v-btn>
                <v-btn
                  color="blue darken-1"
                  flat
                  @click="saveUser" >Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-data-table
            :headers="userHeaders"
            :items="userList">
            <template
              slot="headerCell"
              slot-scope="{ header }">
              <span
                class="subheading font-weight-light text--darken-3"
                v-text="header.text" />
            </template>
            <template
              slot="items"
              slot-scope="{ item }">
              <td
                v-for="(k, i) in userHeaders"
                :key="i">{{ item[k.value] }}</td>
              <td class="text-xs-right">
                <v-icon
                  medium
                  class="mr-2"
                  @click="getCredentialsByUserId(item)">mdi-arrow-down-drop-circle-outline</v-icon>
                <v-icon
                  medium
                  @click="editUserItem(item)">edit</v-icon>
                <v-icon
                  medium
                  @click="deleteUserItem(item)">delete</v-icon>
              </td>
            </template>
          </v-data-table>
        </material-card>
      </v-flex>
      <v-flex
        v-if="selectedUserItem._id"
        md12
        style="margin-bottom: 48px">
        <material-card
          :title="'Credential List: '+ selectedUserItem.username"
          color="blue"
          flat
          full-width
          text="list of Routes">
          <v-dialog
            v-model="RouteDialog"
            max-width="500px" >
            <template v-slot:activator="{ on }">
              <v-btn
                color="general"
                dark
                class="mb-2"
                v-on="on" >Add new</v-btn>
            </template>

            <v-card>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex
                      xs12
                      sm6
                      md4>
                      <v-select
                        :items="userList"
                        v-model="editCredentialItem.selectedUser"
                        label="User"
                        item-text="username"
                        item-value="_id"/>
                    </v-flex>
                    <v-flex
                      xs12
                      sm6
                      md6>
                      <v-select
                        :items="credentialType"
                        v-model="editCredentialItem.selectedCredentialType"
                        label="Type"/>
                    </v-flex>
                    <v-flex
                      xs12
                      sm12
                      md12>
                      <v-item-group
                        v-if="editCredentialItem.state === 'edit' && (editCredentialItem.credetnailUsedInProxy || []).length > 0 "
                        multiple>
                        <v-subheader>following proxy routes will be impacted on changing credentials</v-subheader>
                        <v-item
                          v-for="proxy in editCredentialItem.credetnailUsedInProxy"
                          :key="proxy._id"
                        >
                          <v-chip
                            slot-scope="{ active }"
                            :selected="active"
                          >
                            {{ proxy.name }}
                          </v-chip>
                        </v-item>
                      </v-item-group>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="blue darken-1"
                  flat
                  @click="closeCredentialDialog" >Cancel</v-btn>
                <v-btn
                  color="blue darken-1"
                  flat
                  @click="saveCredentailDialog" >Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-data-table
            :headers="RouteHeader"
            :items="credentialList">
            <template
              slot="headerCell"
              slot-scope="{ header }">
              <span
                class="subheading font-weight-light text--darken-3"
                v-text="header.text" />
            </template>
            <template
              slot="items"
              slot-scope="{ item }">

              <td
                v-for="(k, i) in RouteHeader"
                :key="i">{{ item[k.value] }}</td>
              <td class="text-xs-right">
                <v-icon
                  medium
                  class="mr-2"
                  @click="onEditCredentialItem(item)">edit</v-icon>
                <v-icon
                  medium
                  @click="deleteCredentialItem(item)">delete</v-icon>
              </td>
            </template>
          </v-data-table>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
export default {
  data: () => ({
    UserDialog: false,
    RouteDialog: false,
    search: '',
    userHeaders: [ ],
    userList: [],
    selectedRoute: {
      value: '',
      state: false
    },
    selectedUserItem: { },
    credentialList: [],
    RouteHeader: [],
    editedIndex: -1,
    userItem: {
      username: '',
      password: null,
      SelectedRole: '',
      showPassword: false
    },
    RolesList: [],
    credentialType: [],
    showCredentialBox: true,
    editCredentialItem: {
    },
    defaultItem: {
      name: '',
      remote_url: '',
      SelectedCredential: '',
      policyName: '',
      policyMatrix: '[]',
      dialogCredentialList: [],
      UserList: []
    },
    AllowedPolicyList: [],
    rules: {
      required: value => !!value || 'Required.',
      validRegex: value => {
        const validatergx = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
        return (validatergx.test(value) || 'At least 8 character with min one letter number and special character')
      }
    }
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },
  watch: {
    UserDialog (val) {
      val || this.closeUserDialog()
    },
    RouteDialog (val) {
      val || this.closeCredentialDialog()
    }
  },
  created () {
    this.$http.get('/users/query?field={}')
      .then(response => {
        this.userHeaders = Object.keys(response.data[0]).map(val => {
          return {
            sortable: false,
            text: (val.charAt(0).toUpperCase() + val.slice(1)).split('_').join(' '),
            value: val
          }
        })
        this.userHeaders.push({
          sortable: false,
          text: 'Action',
          value: 'action'
        })
        this.userList = response.data
      })
      .catch(error => console.log(error))

    this.$http.get(`/users/roles`).then(response => {
      this.RolesList = [...response.data]
    })
      .catch(error => console.log(error))
    this.$http.get(`/credentials/type`).then(response => {
      this.credentialType = [...response.data]
    }).catch(error => console.log(error))
  },
  methods: {

    /**
       * onUserDialogLoad();
       * load users if the proxy dialog is loaded
       */
    onUserDialogLoad () {
      // get the list of users
    },
    /**
       * editUserItem(item, triggerDialog);
       * when Item is selected from proxy list. load data to proxy dialog and trigger proxy load function
       */
    editUserItem (item) {
      console.log(item)
      this.userItem = {
        _id: item._id,
        SelectedRole: item.roles,
        username: item.username,
        state: 'edit'
      }
      this.UserDialog = true
    },
    /**
       * editCredentialItem(item, triggerDialog);
       * when Item is selected from Route list. load data to route dialog and trigger route dialog load function
       */
    onEditCredentialItem (item) {
      console.log(item)
      this.RouteDialog = true
      this.editCredentialItem = {
        _id: item._id,
        selectedCredentialType: item.type,
        selectedUser: this.selectedUserItem,
        state: 'edit'
      }
      this.$http.get(`/proxy/query?filter={"credential":"${item._id}"}`).then(response => {
        this.editCredentialItem.credetnailUsedInProxy = [...response.data]
      }).catch(error => console.log(error))
    },
    /**
       * getCredentialsByUserId( id, name);
       * load the route related to proxy selected.
       */
    getCredentialsByUserId (userItem) {
      this.selectedUserItem = userItem
      this.$http.get(`/credentials/query?filter={"userid":"${userItem._id}"}`).then(response => {
        this.credentialList = response.data
        this.RouteHeader = this._generateHeader(Object.keys(this.credentialList[0]))
        console.log(this.RouteHeader, this.credentialList)
      }).catch(error => console.log(error))
    },
    _generateHeader (listOfHeader) {
      const ignoreHeader = ['__v', 'userId', '_id', 'creation_date']
      const list = listOfHeader.map(element => {
        return {
          sortable: false,
          text: element,
          value: element
        }
      }).filter(elem => ignoreHeader.indexOf(elem.value) === -1)
      list.push({
        sortable: false,
        text: 'Action',
        value: 'Action'
      })
      return list
      },
      deleteCredentialItem (item) {
        this.$http.delete(`/credentials/delete/${item._id}`).then(response => {
          this.getCredentialsByUserId(this.selectedUserItem)
        }).catch(error => console.log(error))
      },
      saveUser () {
        let url = ''
        const data = {
          username: this.userItem.username,
          roles: this.userItem.SelectedRole
        }
        if (this.userItem.state === 'edit') {
          url = '/users/update/' + this.userItem._id
          if (this.userItem.isPasswordChange && this.userItem.newPassword && this.userItem.newPassword.length > 5) { data.password = this.userItem.newPassword }
        } else {
          url = 'users/create'
          data.password = this.userItem.password
        }
        const self = this
        this.$http.post(url, data).then(response => {
          this.userItem = Object.assign({}, this.defaultItem)
          // reLoad the user list
          this._reloadUser()
          self.UserDialog = false
        }).catch(error => {
          console.log(error)
        })
      },
      _reloadUser () {
        this.$http.get('/users/query?field={}')
        .then(response => {
            this.userHeaders = Object.keys(response.data[0]).map(val => {
                return {
                    sortable: false,
                    text: val,
                    value: val
                }
            })
            this.userList = response.data
        })
        .catch(error => console.log(error))
      },
      deleteUserItem (item) {
        this.$http.delete(`/users/delete/${item._id}`).then(response => {
          this.$http.get('/users/query?field={}')
            .then(response => {
                this.userList = [...response.data]
            })
        }).catch(error => console.log(error))
      },
    closeCredentialDialog () {
      this.RouteDialog = false
      this.editCredentialItem = {}
    },
    closeUserDialog () {
      this.UserDialog = false
      setTimeout(() => {
        this.userItem = Object.assign({}, this.defaultItem)
        this.showCredentialBox = false
        this.editedIndex = 1
        // this.userItem = {}
      }, 300)
    },
    saveCredentailDialog () {
      let url = ''
      const data = {
        type: this.editCredentialItem.selectedCredentialType
      }
      if (this.editCredentialItem.state === 'edit') {
        url = '/credentials/update/' + this.editCredentialItem._id
        data.userid = this.editCredentialItem.selectedUser._id
      } else {
        url = '/credentials/create'
        data.userid = this.editCredentialItem.selectedUser
      }
      this.$http.post(url, data).then(response => {
        this.editCredentialItem = {}
        // update list again
        this.getCredentialsByUserId(this.selectedUserItem)
        this.RouteDialog = false
      }).catch(error => console.log(error))
    }
  }
}
</script>
