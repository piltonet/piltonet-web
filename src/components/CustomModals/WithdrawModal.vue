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
        <div class="d-flex flex-row justify-content-center align-items-center row">
          <div class="col-12 col-md-6">
            <button
              class="withdraw-button"
              :class="withdrawalToken == 'VIC' ? 'selected' : ''"
              @click="withdrawalToken = 'VIC'; withdrawalAmount = '';"
            >
              <SvgPaymentToken
                :chainId="this.defaultchain.chainId"
                :paymentToken="this.defaultchain.nativeCurrency.address"
                :tooltip="false"
                customClass="pe-2"
              />
              <p>VIC</p>
            </button>
          </div>
          <div class="col-12 col-md-6">
            <button
              class="withdraw-button mt-2 mt-md-0 ms-md-2"
              :class="withdrawalToken == 'CUSD' ? 'selected' : ''"
              @click="withdrawalToken = 'CUSD'; withdrawalAmount = '';"
            >
              <SvgPaymentToken
                :chainId="this.defaultchain.chainId"
                :paymentToken="this.defaultchain.CUSD.address"
                :tooltip="false"
                customClass="pe-2"
              />
              <p>CUSD</p>
            </button>
          </div>
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
            ref="withdrawalAmount"
            id="withdrawal_amount"
            type="number"
            class="small-input mb-0"
            :class="hasError['withdrawalAmount'] ? 'has-error' : ''"
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
          ref="withdrawalAddress"
          id="withdrawal_address"
          type="text"
          class="middle-input mb-0"
          :class="hasError['withdrawalAddress'] ? 'has-error' : ''"
          placeholder="Enter Address"
          v-model="withdrawalAddress"
        />
        <div
          type="button"
          @click="sendToMainAccount"
          class="front-btn small-text no-border blue-btn mt-2"
        >
          <span class="m-0 p-0">Main Account</span>
        </div>
      </div>

    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="success" class="footer-btn px-4 mt-2" @click="confirmWithdrawal">Confirm</el-button>
        <el-button type="danger" class="footer-btn px-4 mt-2" @click="closeModal">Cancel</el-button>
      </span>
    </template>

  </el-dialog>

  <MessageModal
    ref="message_modal"
    @ok-clicked="exploreTx"
    @cancel-clicked="closeModal"
  />
  
</template>

<script>
import { mapGetters } from "vuex";
import abi from "@/services/abi";

export default {
  name: "WithdrawModal",
  data() {
    return {
      withdrawalToken: "CUSD",
      withdrawalAmount: "",
      withdrawalAddress: "",
      totalAssetBalance: {},
      txHash: "",
      showModal: false,
      openLoadings: [],
      hasError: {
        withdrawalAmount: false,
        withdrawalAddress: false,
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
    async setWithdrawal(totalAssetBalance) {
      this.totalAssetBalance = totalAssetBalance;
      this.showModal = true;
    },
    async totalBalance() {
      this.withdrawalAmount = this.totalAssetBalance[this.withdrawalToken] || 0;
    },
    async sendToMainAccount() {
      this.withdrawalAddress = this.connectedAccount.account_address;
    },
    async confirmWithdrawal() {
      if(this.checkForm()) {
        try {
          const contract = await abi.setAbi(
            this.accountProfile.account_tba_address, // sender tba address
            "ERC6551Account"
          );
          
          let abiResponse = {done: false};
          if(this.withdrawalToken == "VIC") {
            // execute
            abiResponse = await contract.interaction("transferVIC", [
              this.withdrawalAddress, // address
              this.withdrawalAmount // amount
            ]);
          } else {
            // execute VRC25PCUSD transfer
            abiResponse = await contract.interaction("transferCUSD", [
              this.withdrawalAddress, // address
              this.withdrawalAmount // amount
            ]);
          }
  
          if(abiResponse.done) {
            this.txHash = abiResponse.result.hash;
            this.$refs.message_modal.setMessage({
              title: "Withdrawal Successful",
              message: `Your withdrawal of ${this.withdrawalAmount} ${this.withdrawalToken} has been processed successfully.`,
              okBtn: 'Explore TX',
              cancelBtn: "Close",
              customStyle: 'width: 430px;'
            })
          }
        } catch(err) {
          this.notif({
            title: "OOPS!",
            message: "Something went wrong, please try again later.",
            dangerouslyUseHTMLString: true,
            type: "error",
            duration: 3000,
          })
          console.log(err);
        }
      }
    },
    checkForm() {
      try {
        Object.keys(this.hasError).forEach(element => {
          console.log(element, this[element]);
          if(this[element] == null || this[element].length <= 0) {
            this.$refs[element].focus();
            this.hasError[element] = true;
            this.notif({
              message: "Make sure all required fields are filled in correctly.",
              type: "error",
              duration: 3000,
              onClose: () => { this.hasError[element] = false }
            })
            throw false;
          }
          if(element == 'withdrawalAmount') {
            if(parseFloat(this[element]) > parseFloat(this.totalAssetBalance[this.withdrawalToken])) {
              this.$refs[element].focus();
              this.hasError[element] = true;
              this.notif({
                message: `The withdrawal amount should not be more than ${this.totalAssetBalance[this.withdrawalToken]} ${this.withdrawalToken}.`,
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 5000,
                onClose: () => { this.hasError[element] = false }
              })
              throw false;
            }
          }
        });
        return true;
      } catch(err) {
        console.log(err);
        return false;
      }
    },
    exploreTx() {
      let _explorerLink = `${this.defaultchain.blockExplorerUrl}/tx/${this.txHash}`;
      window.open(_explorerLink, "_blank");
      this.closeModal();
    },
    closeModal() {
      this.showModal = false;
      this.$emit('getBalance');
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
.footer-btn {
  min-width: 120px;
  height: 32px;
}
</style>
