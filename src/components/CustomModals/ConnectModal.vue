<template>
  <div v-if="connectedAccount?.is_connected" id="connected">
    <el-dialog :title="connectionStatus == 'connected' ? '🟢' : '🟡'" v-model="showModal" class="connected-dialog">
      <div class="mb-4">
        <h5 class="fw-bold">
          <img
            v-if="walletName == 'metamask'"
            src="@/assets/icons/metamask-logo.svg"
            height="45"
            class="me-2"
          />
          <img
            v-else-if="walletName == 'coin98'"
            src="@/assets/icons/coin98-logo.svg"
            height="45"
            class="me-2"
          />
          <img
            v-else-if="walletName == 'coinbase'"
            src="@/assets/icons/coinbase-logo.svg"
            height="45"
            class="me-2"
          />
          <img
            v-else-if="walletName == 'walletconnect'"
            src="@/assets/icons/walletconnect-logo.svg"
            width="45"
            class="me-2"
          />
          <img
            v-else
            src="@/assets/icons/wallet-icon.svg"
            height="45"
            class="me-2"
          />
          <span class="connected-text">{{ `${walletName.toUpperCase() || 'WALLET'} CONNECTED` }}</span>
        </h5>
      </div>
      <p class="mb-2 mt-4">
        Current Account: <strong>{{ utils.truncate(connectedAccount?.account_address, 12) || 'Undefined' }}</strong>
        <el-tooltip
          :content="this.copyAddressTooltip"
          placement="top"
          :hide-after="0"
        >
          <a id="copy-account" role="button" @click="copyAccount('copy-account')">
            <i class="far fa-copy ms-2"></i>
          </a>
        </el-tooltip>
      </p>
      <p class="mb-3 mt-0">
        Current Network: <strong>{{ `${currentChain?.chainName || 'Undefined'} ${currentChain ? `(${currentChain.nativeCurrency.symbol})` : ''}` }}</strong>
      </p>
      <p v-if="connectionStatus == 'wrong-network'" class="mb-2">
        <i class="fa fa-triangle-exclamation fa-xl pe-1"></i>
        Select
        <strong>{{ this.defaultchain.chainName }}</strong>
        network in wallet.
      </p>
      <template #footer>
        <span class="dialog-footer">
          <el-button v-if="connectionStatus == 'connected'" type="success" @click="showModal = false">Great Let's Go</el-button>
          <el-button v-if="connectionStatus == 'wrong-network'" type="warning" @click="switchNetworkToDefault">Switch Network</el-button>
          <el-button type="danger" @click="onDisconnectButtonClick">Logout</el-button>
        </span>
      </template>
    </el-dialog>
  </div>

  <div v-else id="disconnect">
    <el-dialog v-model="showModal" class="disconnect-dialog">
      <p class="text-center mb-3">Connect your wallet to get started.</p>
      
      <div
        role="button"
        @click="connectWallet('metamask')"
        class="d-flex flex-row justify-content-center align-items-center wallet-button mx-auto my-2"
      >
        <div class="col-4 text-end pe-3">
          <img src="@/assets/icons/metamask-logo.svg" width="40" />
        </div>
        <div class="col-8 text-start wallet-text ps-3">MetaMask Wallet</div>
      </div>
      
      <div
        role="button"
        @click="connectWallet('coin98')"
        class="d-flex flex-row justify-content-center align-items-center wallet-button mx-auto my-2"
      >
        <div class="col-4 text-end pe-3">
          <img src="@/assets/icons/coin98-logo.svg" width="40" />
        </div>
        <div class="col-8 text-start wallet-text ps-3">Coin98 Wallet</div>
      </div>

      <div
        role="button"
        @click="connectWallet('coinbase')"
        class="d-flex flex-row justify-content-center align-items-center wallet-button mx-auto my-2"
      >
        <div class="col-4 text-end pe-3">
          <img src="@/assets/icons/coinbase-logo.svg" width="40" />
        </div>
        <div class="col-8 text-start wallet-text ps-3">Coinbase Wallet</div>
      </div>

      <!-- <div
        role="button"
        @click="connectWalletConnect"
        class="d-flex flex-row justify-content-center align-items-center wallet-button mx-auto my-2"
      >
        <div class="col-4 text-end pe-3">
          <img src="@/assets/icons/walletconnect-logo.svg" width="40" />
        </div>
        <div class="col-8 text-start wallet-text ps-3">WalletConnect</div>
      </div> -->

      <template #footer>
        <p class="text-center">Select your active account on <strong>{{ defaultchain.chainName }}</strong></p>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import networks from "@/configs/networks.js";
// import metamask from "@/wallets/metamask.js";
// import coin98 from "@/wallets/coin98.js";
import wallets from "@/wallets";
// import walletconnect from "@/wallets/walletconnect.js";
import { mapGetters } from "vuex";

export default {
  name: "ConnectModal",
  data() {
    return {
      currentChain: undefined,
      walletName: "metamask",
      showModal: false,
      connectionStatus: "disconnect",
      copyAddressTooltip: "Copy Address"
    }
  },
  computed: {
    ...mapGetters(["getConnectionStore"]),
    connectedAccount() {
      return this.getConnectionStore;
    },
    // Wallet() {
    //   if(this.connectedAccount && this.connectedAccount.is_connected) {
    //     return this.connectedAccount.connected_wallet == 'metamask' ? metamask
    //     : (this.connectedAccount.connected_wallet == 'coin98' ? coin98 : metamask);
    //   } else {
    //     return undefined;
    //   }
    // }
  },
  watch: {
    connectedAccount: async function () {
      await this.setup();
    }
  },
  methods: {
    async setup() {
      this.walletName = this.connectedAccount?.connected_wallet ? this.connectedAccount.connected_wallet : 'metamask';
      const provider = wallets[this.walletName].getProvider();
      const chainId = await provider.request({ method: "eth_chainId" });
      this.connectionStatus = !provider ? 'disconnect' : (chainId == this.defaultchain.chainId ? 'connected' : 'wrong-network');
      this.currentChain = !provider ? undefined : (networks.find(n => (n.chainId == chainId)) || null);
    },

    async onConnectButtonClick() {
      await this.setup();
      this.showModal = true;
    },

    async connectWallet(walletName) {
      let connectedWallet = await wallets[walletName].connectWallet(walletName);
      this.showModal = !connectedWallet || false;
      if(connectedWallet) {
        this.$router.push("/account/profile");
      }
    },
    
    // async connectWalletConnect() {
    //   this.showModal = false;
    //   await walletconnect.connectWallet();
    // },

    async switchNetworkToDefault() {
      await wallets[this.connectedAccount.connected_wallet].switchNetworkToDefault();
      this.showModal = false;
    },
    async onDisconnectButtonClick() {
      this.showModal = false;
      await wallets[this.connectedAccount.connected_wallet].disconnectWallet();
    },

    async copyAccount(id) {
      navigator.clipboard.writeText(this.connectedAccount.account_address);
      document.getElementById(id).innerHTML = '<i class="fa fa-check ms-2" style="color: lightgreen;"></i>'
      this.copyAddressTooltip = "Copied To Clipboard";
      setTimeout(() => {
          this.copyAddressTooltip = "Copy Address";
          document.getElementById(id).innerHTML = '<i class="far fa-copy ms-2"></i>';
        }, 2000);
    }
  }
}
</script>

<style lang="scss" scoped>
.connected-text {
  border-bottom: solid 2px rgba(var(--ptn-blue-rgb), 0.5);
  padding-bottom: 3px;
}
.fa-triangle-exclamation {
  color: orange;
}

.wallet-button {
  background: var(--ptn-blue);
  color: var(--ptn-btn-color);
  border: 0 !important;
  border-radius: 4px;
  height: 60px;
}
// .wallet-button:hover {
//   font-size: 17.3px;
//   color: rgba(0, 0, 0, 0.9);
//   border: solid 1.5px rgba(0, 0, 0, 0.4);
// }

.wallet-text {
  font-size: 20px;
  line-height: 35px;
  border-left: solid 0.7px rgba(255, 255, 255, 0.9);
}

/* Start labtop - lg < 1200 */
@media (max-width: 1199px) {
}

/* Start Tablet - md < 992px */
@media (max-width: 991px) {
}

/* Start Mobile - sm < 768px */
@media (max-width: 767px) {
}

/* Start Mini Mobile - None < 576px */
@media (max-width: 575px) {
  .connected-text {
    font-size: 18px;
    letter-spacing: 0.5px;
  }
}
</style>
