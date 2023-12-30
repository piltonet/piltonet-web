<template>
  <el-dialog 
    id="withdraw-modal"
    v-model="showModal"
    title="Withdraw"
    class="withdraw-dialog pt-3"
    :style="''"
  >
    <div class="d-flex flex-column justify-content-center align-items-start p-2">
      
      <!-- Withdraw Token -->
      <div class="d-flex flex-column justify-content-center align-items-start">
        <label for="circleRoundDays" class="input-label">
          1. Asset you want to withdraw
        </label>
        <div class="d-flex flex-row justify-content-center align-items-center">
          <button
            class="withdraw-button"
            :class="withdrawalToken == 'VIC' ? 'selected' : ''"
            @click="withdrawalToken = 'VIC'; withdrawalAmount = '';"
          >
            <SvgPaymentToken
              :chainId="this.defaultchain.id"
              :paymentToken="this.defaultchain.nativeCurrency.address"
              :tooltip="false"
              customClass="m-1 me-2"
            />
            <p>VIC</p>
          </button>
          <button
            class="withdraw-button ms-2"
            :class="withdrawalToken == 'CUSD' ? 'selected' : ''"
            @click="withdrawalToken = 'CUSD'; withdrawalAmount = '';"
          >
            <SvgPaymentToken
              :chainId="this.defaultchain.id"
              :paymentToken="this.defaultchain.CUSD.address"
              :tooltip="false"
              customClass="m-1 me-2"
            />
            <p>CUSD</p>
          </button>
        </div>
      </div>
      
      <!-- Withdraw Amount -->
      <div class="d-flex flex-column justify-content-center align-items-start mt-4">
        <label for="withdrawalAmount" class="input-label">
          2. Withdrawal amount
          <span class="input-label-small">(Required)</span>
        </label>
        <div class="d-flex flex-column justify-content-center align-items-start">
          <input
            ref="withdrawal_amount"
            id="withdrawalAmount"
            type="number"
            class="small-input mb-0"
            :class="hasError['withdrawal_amount'] ? 'has-error' : ''"
            placeholder="Enter Amount"
            v-model="withdrawalAmount"
          />
          <div
            type="button"
            @click="totalBalance"
            class="front-btn small-text no-border blue-btn mt-2"
          >
            <span class="m-0 p-0">Total Balance</span>
          </div>
        </div>
      </div>
      
      <!-- Withdraw Address -->
      <div class="d-flex flex-column justify-content-center align-items-start w-100 mt-4">
        <label for="withdrawalAddress" class="input-label">
          3. Withdrawal address
          <span class="input-label-small">(Required)</span>
        </label>
        <input
          ref="withdrawal_address"
          id="withdrawalAddress"
          type="text"
          class="middle-input mb-0"
          :class="hasError['withdrawal_address'] ? 'has-error' : ''"
          placeholder="Enter Address"
          v-model="withdrawalAddress"
        />
      </div>

    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="success" class="footer-btn px-4 mt-2" @click="confirmWithdrawal">Confirm</el-button>
        <el-button type="danger" class="footer-btn px-4 mt-2" @click="closeModal">Cancel</el-button>
      </span>
    </template>

  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { ethers } from 'ethers'
import abi from "@/services/abi";
import wallets from "@/wallets";

export default {
  name: "WithdrawModal",
  data() {
    return {
      withdrawalToken: "CUSD",
      withdrawalAmount: "",
      withdrawalAddress: "",
      totalAssetBalance: {},
      showModal: false,
      hasError: {
        withdrawal_amount: false,
        withdrawal_address: false,
      },
      copyAddressTooltip: "Copy Address"
    };
  },
  computed: {
    ...mapGetters(['getConnectionStore', 'getProfileStore']),
    connectedAccount() {
      return this.getConnectionStore;
    },
    accountProfile() {
      return this.getProfileStore;
    }
  },
  methods: {
    async setTopUp(totalAssetBalance) {
      this.totalAssetBalance = totalAssetBalance;
      this.showModal = true;
    },
    async totalBalance() {
      console.log(this.totalAssetBalance);
      this.withdrawalAmount = this.totalAssetBalance[this.withdrawalToken] || 0;
    },
    async confirmWithdrawal() {
      const provider = new ethers.BrowserProvider(wallets[this.connectedAccount.connected_wallet].getProvider() || window.ethereum);
      const signer = await provider.getSigner();
      const contract = abi.setAbi(
        this.accountProfile.account_tba_address, // sender tba address
        "ERC6551Account",
        signer
      );
      // execute ERC1155Contracts addContact
      let abiResponse = await contract.interaction("executeFunction", [
        "VRC25PCUSD", // contract name
        "transfer", // function name
        ["function transfer(address recipient, uint256 amount)"], // function ABI
        [ethers.getAddress(this.accountProfile.account_tba_address), ethers.toBigInt(100000)], // function args
        0 // value
      ]);
      if(!abiResponse.done) {
        this.notif({
          title: "OOPS!",
          message: abiResponse.message,
          dangerouslyUseHTMLString: true,
          type: abiResponse.message_type,
          duration: 3000,
        });
      }
    },
    closeModal() {
      this.showModal = false;
    },
    async copyAccount(id) {
      navigator.clipboard.writeText(this.withdrawAddress);
      document.getElementById(id).innerHTML = '<i class="fa fa-check mt-1" style="color: lightgreen;"></i>'
      this.copyAddressTooltip = "Copied To Clipboard";
      setTimeout(() => {
          this.copyAddressTooltip = "Copy Address";
          document.getElementById(id).innerHTML = '<i class="far fa-copy mt-1"></i>';
        }, 2000);
    }
  },
};
</script>
    
<style lang="scss" scoped>
#withdraw-modal {
  z-index: 9000;
}
.withdraw-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: rgba(var(--ptn-color-rgb), 0.3);
  background: var(--ptn-second-bg);
  border: 1px solid rgba(var(--ptn-color-rgb), 0.3);
  border-radius: 8px;
  width: 200px;
  height: 40px;
  margin: 5px 0 0;
  padding-left: 10px;
}
.withdraw-button.selected {
  color: var(--ptn-second-blue);
  border: 1px solid var(--ptn-second-blue);
  cursor: default;
}
.withdraw-button.locked {
  color: rgba(var(--ptn-second-blue-rgb), 0.7) !important;
  border: 1px solid rgba(var(--ptn-second-blue-rgb), 0.7) !important;
}
.withdraw-button.disabled {
  color: rgba(var(--ptn-color-rgb), 0.1);
  border: 1px solid rgba(var(--ptn-color-rgb), 0.1);
  cursor: default;
}
.withdraw-address {
  font-size: 18px;
  line-height: 20px;
  font-weight: normal;
  color: rgba(var(--ptn-color-rgb), 0.8);
  border: 2px solid var(--ptn-second-blue);
  border-radius: 8px;
  padding: 7px 15px;
}
.footer-btn {
  min-width: 120px;
  height: 32px;
}
</style>
