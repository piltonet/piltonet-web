<template>
  <NavBar ref="nav_bar" />

  <div class="mt-3 mb-5">
    <div
      class="d-flex flex-column text-center justify-content-center align-items-center"
    >
      <div
        class="d-flex flex-column text-center justify-content-center align-items-center w-100"
      >
        <AvatarImage
          :name="'Farokh'"
          :size="130"
        />
        <input
          ref="contract_address"
          type="text"
          class="big-input text-center mt-5 mb-0"
          v-model="username"
        />
        <button class="submit-btn" @click="isContactAdded">BTN 1</button>
        <!-- <button class="submit-btn" @click="onBtn1Click">BTN 1</button> -->
        <button class="submit-btn" @click="onBtn2Click">BTN 2</button>
        <button class="submit-btn" @click="onBtn3Click">BTN 3</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ElLoading } from "element-plus";
import NavBar from '@/components/NavBar/NavBar.vue';
import { mapGetters } from "vuex";
import abi from "@/services/abi";
import { ethers } from "ethers";
// import wallets from "@/wallets";
// import { toRaw } from 'vue';

export default {
  name: "TestPage",

  components: {
    NavBar
  },

  data() {
    return {
      username: "piltonet",
      openLoadings: [],
    };
  },

  computed: {
    ...mapGetters(["getConnectionStore"]),
    connectedAccount() {
      return this.getConnectionStore;
    },
  },

  watch: {
    connectedAccount: async function () {
      await this.setup();
    },
  },

  async mounted() {
  },

  methods: {
    async setup() {},

    async isContactAdded() {
      const contract = await abi.setAbi(
        "0x",
        "ContactList"
      );
      // check if contact has already been added
      let abiResponse = await contract.interaction("balanceOf",
        // [ethers.getAddress(this.inviteAccount.account_tba_address), 1]
        ["0x97110cd968fb9cd5133ab4ea142f2e93501aA4d9", 2]
      );
      console.log(abiResponse);
    },

    async onBtn1Click() {
      const contract = await abi.setAbi(
        "0x", // sender tba address
        "VRC25PCUSD"
      );
      const spender = "0x94688d177029574FE9013006811261377FE52DD2";

      let abiResponse = await contract.interaction("approve", [spender, 50000000]);
      console.log(abiResponse);
    },
    
    async onBtn2Click() {
      const contract = await abi.setAbi(
        "0x", // sender tba address
        "VRC25PCUSD"
      );
      // const owner = "0x2B27F8c647872BC0f5E4C7cA8e3aEAEe19A28f3A";
      const owner = "0x046962DebEFf06Fa0C4730994968Aa3Ff38555b4"; // tba
      const spender = "0x94688d177029574FE9013006811261377FE52DD2";

      let abiResponse = await contract.interaction("allowance", [owner, spender]);
      console.log(abiResponse);
    },

    async onBtn3Click() {
      const owner = "0x046962DebEFf06Fa0C4730994968Aa3Ff38555b4"; // tba
      const spender = "0x94688d177029574FE9013006811261377FE52DD2";

      const contract = await abi.setAbi(
        owner, // sender tba address
        "ERC6551Account"
      );
      
      let abiResponse = await contract.interaction("executeFunction", [
        "VRC25PCUSD", // contract name
        "approve", // function name
        ["function approve(address spender, uint256 value)"], // function ABI
        [spender, 50 * 1e6], // function args
        0 // VIC amount
      ]);
      console.log(abiResponse);
    },
    
    async onBtn1Click_() {
      const contract = await abi.setAbi(
        "0x", // sender tba address
        "VRC25PCUSD"
      );
      // const TBA = "0x7A1887Ae460B3137DdEb7D9BbC2e8e7B673bE606";
      const recipient = "0x94688d177029574FE9013006811261377FE52DD2";

      // let abiResponse = await contract.interaction("balanceOf", [TBA]);
      let abiResponse = await contract.interaction("transfer", [recipient, 1000000]);
      console.log(abiResponse);
    },

    async _onBtn1Click() {
      let loadingId = await this.showLoading();
      try {
        let ABI = ["function addContact(address contactTBA)"];
        let iface = new ethers.Interface(ABI);
        let data = iface.encodeFunctionData("addContact", [
          ethers.getAddress("0x6844263e43370829BD325596F00bc3DE7e540995") // contact tba address
        ]);

        const contract = await abi.setAbi(
          "0x8380A8c6578f4736EA5e1455CB31408ccDE30a9b", // sender tba address
          "ERC6551Account"
        );
        let abiResponse = await contract.interaction("execute", [
          "0x982F6b4C12eb5c48f0d8986841F11E856346135D", // ContactList address
          0,
          data,
          0
        ]);
console.log(abiResponse);

        let result = "test";
        console.log("Result:", result);
      } catch (err) {
        console.log("Error:", err);
      }
      this.openLoadings[loadingId].close();
    },

    async showLoading() {
      const randomId = Date.now();
      this.openLoadings[randomId] = undefined;
      this.openLoadings[randomId] = new ElLoading.service({
        lock: true,
        text: "",
        fullscreen: true,
      });
      return randomId;
    },

    async copyPassword() {
      navigator.clipboard.writeText("Arnic@2504");
    },
  },
};
</script>

<style>

</style>