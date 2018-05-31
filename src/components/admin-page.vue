<template>
  <div>
    <hello-metamask/>
<div>
<ol class="breadcrumb">
<li class="breadcrumb-item">
<router-link to="/">Sensor DApp</router-link>
</li>
<li class="breadcrumb-item active">Admin</li>
</ol>
  </div>
  <div v-if="isOwner || isAdmin()" class="row">
    <div class="col-md-12">
      <div class="card mb-3">
        <div class="card-header"> 
          <h4>Add organization</h4>
        </div>
        <div class="card-body">
          <form @submit.prevent="addOrganization">
            <div class="form-group">
              <input class="form-control" v-model="orgname" placeholder="Org name">
            </div>
            <button type="submit" class="btn">Add</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <b-row>
    <div class="col-md-7">
    <div class="card mb-2">
      <div class="card-header">
        <h4>Add user</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="createFormUser"
              method="post">
            <div class="form-group">
              <input type="text"
                     v-model="userForm.address"
                     class="form-control"
                     placeholder="User Address">
            </div>
            <div class="form-group">
              <input type="text"
                     v-model="userForm.firstname"
                     class="form-control"
                     placeholder="Firstname">
            </div>
            <div class="form-group">
              <input type="text"
                     v-model="userForm.lastname"
                     class="form-control"
                     placeholder="Lastname">
            </div>
            <select class="form-control mb-3"
                    v-model="userForm.role">
              <option v-for="option in roleOptions"
                      v-bind:value="option.value">
                {{ option.text }}
              </option>
            </select>
          <button class="btn"
                  type="submit">Add</button>
        </form>
      </div>
    </div>
  </div>
  <div v-if="isOwner || isAdmin()" class="col-md-5">
    <div class="card mb-3">
      <div class="card-header">
        <h4>Bind user to organization</h4>
      </div>
      <div class="card-body">
        <form name="adduser" @submit.prevent="addUserToOrg" action="#" method="post">
          <div class="form-group">
            <input  name="uaddress" class="form-control" v-model="userForm.address" placeholder="User Address">
          </div>
          <div class="form-group">
            <input name="orgId" class="form-control" v-model="userForm.orgId" placeholder="Org Id">
          </div>
          <button class="btn" type="submit">Bind</button>
        </form>
      </div>
    </div>
  </div>
</b-row>
    <b-row>
      <b-col md="7">
        <b-card class="my-1"
        header-tag="header">
          <h4 slot="header" class="my-1">Users</h4>
          <b-card-body>
            <b-row>
              <b-col md="6" class="my-2">
                <b-form-group horizontal label="Per page" class="mb-0">
                  <b-form-select :options="userTable.pageOptions" v-model="userTable.perPage" />
                </b-form-group>
              </b-col>
              <b-col md="6" class="my-2">
                <b-pagination :total-rows="userTable.totalRows" :per-page="userTable.perPage" v-model="userTable.currentPage" class="my-0" />
              </b-col>
            </b-row>
            <b-col md="12">
              <b-table small 
                striped 
                :items="users"
                :fields="userTable.fields"
                :perPage="userTable.perPage"
                :current-page="userTable.currentPage">
                <template slot='fullName' slot-scope='row' sortable="true">{{ row.item.firstName }} {{row.item.lastName}}
                </template>
                <template slot='role' slot-scope='row'>
                  {{roleOptions[row.item.role].text}}
                </template>
                <template slot='actions' slot-scope='row'>
                  <b-button size="sm" @click.stop="row.toggleDetails();" class="mr-2">
                   {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
                  </b-button>
                </template>
                <template slot='row-details' slot-scope='row'>
                  <ul>
                    <li><b>Address: </b>{{ row.item.address}}</li>
                    <li><b>Is Active: </b>{{ row.item.isActive}}</li>
                    <li v-if="row.item.organization"><b>Organization: </b> {{row.item.organization.name}} <b>ID: </b> {{row.item.organization.id}} </li>
                  </ul>

                </template>
              </b-table>
            </b-col>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col md="5">
        <b-card class="my-1"
        header-tag="header">
          <h4 slot="header" class="my-1">Organizations</h4>

          <b-card-body>
            <b-col md="12">
              <b-table small striped :items="organizations">

              </b-table>
            </b-col>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row> 
</div>
</template>

<script>
import HelloMetamask from '@/components/hello-metamask'

const contractUtils = require('@/util/contractUtils')
export default {
  name: "admin-page",
  data () {
    return {
      orgname: null,
      userForm: {
        address: null, 
        firstname: null,
        lastname: null,
        role: null,
        orgId: null
      },
      organization: null,
      state: this.$store.state,
      roleOptions: contractUtils.roleOptions,
      users: [],
      isOwner: false,
      organizations: [],
      userTable: {
        fields: [
          {
            key: 'fullName',
            label: 'Full Name'
          },
          {
            key: 'role',
            label: 'Role'
          },
          {
            key: 'actions',
            label: 'Actions'
          }
        ],
        pageOptions: [5, 10, 20],
        perPage: 5,
        currentPage: 1,
        totalRows: 0
      }
    }
  },
  watch: {
    users: {
      handler: function(val, oldVal) {
        this.userTable.totalRows = this.users.length
      },
      deep: true
    },
    state: {
      handler: function(val, oldVal) {
        contractUtils.getOwner().then(result => {
          this.isOwner = result === this.$store.state.userInfo.address
        })
      },
      deep: true
    },
  },
  beforeCreate() {
    let userInfo = this.$store.state.userInfo
    if (!userInfo || !userInfo.isActive) {
      console.log("Such user does not exist")
      this.$router.push("/")
    }
    if (userInfo.role > 1) {
      console.log("You have not rights to go there!")
      this.$router.push("/")
    }
  },
  created() {
    console.log("admin")
    contractUtils.getUsers().then(result => {
      this.users = result
    })
    contractUtils.getOrganizations().then(result => {
      console.log("orgs", result)
      this.organizations = result
    })
    contractUtils.getOwner().then(result => {
      this.isOwner = result === this.$store.state.userInfo.address
    })

  },
  methods: {
    isAdmin(e) {
      return this.$store.state.userInfo.role === 0
    },
    isOrgAdmin(e) {
      return this.$store.state.userInfo.role === 1
    },
    addOrganization(event) {
      console.log('ADD ORGANIZATION WITH NAME ', this.orgname)
      let orgname = this.orgname
      contractUtils.addOrganization(orgname).then(result => {
        console.log(result)
      })
    },
    addUser(e) {
      this.pending = true
      console.log("Add User")
      console.log(this.role)
      this.userForm.role = this.userForm.role.toUpperCase()
      this.$store.state.contractInstance().createUser(this.userForm.address, this.userForm.firstname, 
        this.userForm.lastname, this.userForm.role, {
        gas: 300000,
        value: 0,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if (err) {
          console.log(err)
        } else {
          console.log("Create User: success")
          this.pending = false
        }
      })      
    },
    addOrgUser(e) {
      this.pending = true
      console.log("Add Org User")
      console.log(this.role)
      this.userForm.role = this.userForm.role.toUpperCase()
      this.$store.state.contractInstance().createOrgUser(this.userForm.address, this.userForm.firstname, this.userForm.lastname, this.userForm.role, {
        gas: 300000,
        value: 0,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if (err) {
          console.log(err)
        } else {
          console.log("success")
        }
      })      
    },
    createFormUser(e) {
      contractUtils.getOwner().then(result => {
        let isOwner = result === this.$store.state.userInfo.address
        console.log(isOwner)
        if (isOwner || this.$store.state.userInfo.role === 0) {
          this.addUser(e)
        } else if (this.$store.state.userInfo.role === 1) {
          this.addOrgUser(e)
        }
      })
    },
    addUserToOrg(e) {
      this.pending = true
      this.$store.state.contractInstance().addUserToOrganization(this.userForm.address, this.userForm.orgId, {
        gas: 300000,
        price: 1,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if (err) {
          console.log(err)
          this.pending = false
        } else {
          this.pending = false
        }
      })
    }
  },
  components: {
    'hello-metamask': HelloMetamask
  }
}
</script>