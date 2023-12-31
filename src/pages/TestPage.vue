<template>
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
        <button class="submit-btn" @click="onBtn1Click">BTN 1</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ElLoading } from "element-plus";
// import NavBar from '@/components/NavBar/NavBar.vue';
import { mapGetters } from "vuex";
import abi from "@/services/abi";
import { ethers } from "ethers";
import wallets from "@/wallets";

export default {
  name: "TestPage",

  components: {
    // NavBar
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

  async mounted() {},

  methods: {
    async setup() {},

    async onBtn1Click() {
      const provider = new ethers.BrowserProvider(wallets[this.connectedAccount.connected_wallet].getProvider() || window.ethereum);
      const signer = await provider.getSigner();
      const contract = abi.setAbi(
        "0x", // sender tba address
        "VRC25PCUSD",
        signer
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

        const provider = new ethers.BrowserProvider(
          wallets[this.connectedAccount.connected_wallet].getProvider() ||
            window.ethereum
        );
        const signer = await provider.getSigner();
        const contract = abi.setAbi(
          "0x8380A8c6578f4736EA5e1455CB31408ccDE30a9b", // sender tba address
          "ERC6551Account",
          signer
        );
        let abiResponse = await contract.interaction("execute", [
          "0x982F6b4C12eb5c48f0d8986841F11E856346135D", // ERC1155Contacts address
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