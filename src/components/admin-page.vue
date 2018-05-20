<template>
  <div>
  <div class="sensor container"> 
     <p>Add organization: <input v-model="orgname" placeholder="Type name here">
    <button v-on:click="addOrganization">Submit</button></p>

    <form name="adduser" @submit.prevent="addUser" action="#" method="post">
      <h2>Добавить пользователя</h2>
      <p><input name="uaddress" v-model="userForm.address" placeholder="uaddress"></p>
      <p><input name="firstname" v-model="userForm.firstname" placeholder="firstname"></p>
      <p><input name="lastname" v-model="userForm.lastname" placeholder="lastname"></p>
      <p><input name="role" v-model="userForm.role" placeholder="role"></p>
      <input type="submit" value="Add User">
    </form>

    <form name="adduser" @submit.prevent="addOrgUser" action="#" method="post">
      <h2>Добавить пользователя организации</h2>
      <p><input name="uaddress" v-model="userForm.address" placeholder="uaddress"></p>
      <p><input name="firstname" v-model="userForm.firstname" placeholder="firstname"></p>
      <p><input name="lastname" v-model="userForm.lastname" placeholder="lastname"></p>
      <p><input name="role" v-model="userForm.role" placeholder="role"></p>
      <input type="submit" value="Add User">
    </form>

    <form name="adduser" @submit.prevent="addUserToOrg" action="#" method="post">
      <h2>Привязать пользователя к организации</h2>
      <p><input name="uaddress" v-model="userForm.address" placeholder="uaddress"></p>
      <p><input name="firstname" v-model="userForm.orgId" placeholder="org Id"></p>
      <input type="submit" value="Add User">
    </form>
    <img v-if="pending" id="loader" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif">
  </p>
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
      userInfo: null
    }
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