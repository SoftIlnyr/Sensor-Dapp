<template>
  <div>
<div>
<ol class="breadcrumb">
<li class="breadcrumb-item">
<a href="index.html">Sensor DApp</a>
</li>
<li class="breadcrumb-item active">Admin</li>
</ol>
  </div>
  <div class="row">
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

  <div class="row">
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
                     v-model="userForm.firstname"
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
  <div class="col-md-5">
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
</div>
</div>
</template>

<script>
import HelloMetamask from '@/components/hello-metamask'
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
      pending: false,
      userInfo: null,
      roleOptions: [
        {
          text: "Admin",
          value: "ADMIN"
        },
        {
          text: "Org Admin",
          value: "ORGADMIN"
        },
        {
          text: "Org User",
          value: "ORGUSER"
        }
      ]
    }
  },
  created() {
    console.log("admin")
  },
  methods: {
    addOrganization(event) {
      console.log('ADD ORGANIZATION WITH NAME ', this.orgname)
      let orgname = this.orgname
      this.pending = true
      this.$store.state.contractInstance().addOrganization(orgname, {
        gas: 300000,
        value: 1,
        from: this.$store.state.web3.coinbase
      }, (err,result) => {
        if (err) {
          console.log(err)
        } else {
          console.log('Add org: success')
          this.pending = false
        }
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
        value: 2,
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
        value: 1,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if (err) {
          console.log(err)
        } else {
          console.log("Create Org User: success")
          this.pending = false
        }
      })      
    },
    createFormUser(e) {
      if (this.$store.state.userInfo.role === 0) {
        console.log("add user admin")
        this.methods.addUser(e)
      } else if (this.$store.state.userInfo.role === 1) {
        console.log("add user orgadmin")
        this.methods.addOrgUser(e)
      }
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
          console.log("success")
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