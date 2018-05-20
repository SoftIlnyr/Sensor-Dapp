<template>
  <div>
  <div class="sensor container"> 
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
      userForm: {
        address: null, 
        firstname: null,
        lastname: null,
        role: null
      },
      organization: null,
      pending: false,
      userInfo: null
    }
  },
  methods: {
    addUser:function(e) {
      e.preventDefault()
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
    addOrgUser:function(e) {
      e.preventDefault()
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
          console.log("Create Org User: success")
          this.pending = false
        }
      })
      
    },
  },
  components: {
    'hello-metamask': HelloMetamask
  }
}
</script>