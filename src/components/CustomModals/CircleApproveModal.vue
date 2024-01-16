<template>
  <el-dialog 
    id="circle-approve-modal"
    v-model="showModal"
    title="Circle Contract Approval"
    class="circle-approve-dialog pt-3"
    :style="''"
  >
    <div class="d-flex flex-column justify-content-center align-items-start p-2">
      
      <!-- Approve Token -->
      <div class="d-flex flex-row justify-content-start align-items-start">
        <div class="input-label text-start">
          The circle contract requires approval for CUSD.
          You can use a single transaction to approve all rounds of the circle.
        </div>
      </div>

      <!-- Approve Address -->
      <div class="d-flex flex-column justify-content-center align-items-start w-100 mt-4">
        <label for="circleAddress" class="input-label">
          Current Allowance
          <span class="input-label-small">(Circle Contract)</span>
        </label>
        <div class="d-flex flex-column justify-content-center align-items-start">
          <div class="d-flex flex-row justify-content-start align-items-center">
            <input
              disabled
              type="number"
              class="small-input mb-0"
              v-model="currentAllowance"
            />
            <SvgPaymentToken
              :chainId="this.defaultchain.chainId"
              :paymentToken="this.defaultchain.CUSD.address"
              :tooltip="false"
              customClass="m-1"
            />
            CUSD
          </div>
        </div>
      </div>
      
      <!-- Approve Amount -->
      <div class="d-flex flex-column justify-content-center align-items-start mt-4">
        <label for="approvalAmount" class="input-label">
          New Allowance Cap
          <span class="input-label-small">{{ `(a minimum of ${this.minAmount} CUSD is necessary)` }}</span>
        </label>
        <div class="d-flex flex-column justify-content-center align-items-start">
          <div class="d-flex flex-row justify-content-start align-items-center">
            <input
              ref="approvalAmount"
              id="approval_amount"
              type="number"
              class="small-input mb-0"
              :class="hasError['approvalAmount'] ? 'has-error' : ''"
              placeholder="Enter Amount"
              v-model="approvalAmount"
            />
            <SvgPaymentToken
              :chainId="this.defaultchain.chainId"
              :paymentToken="this.defaultchain.CUSD.address"
              :tooltip="false"
              customClass="m-1"
            />
            CUSD
          </div>
          <div
            type="button"
            @click="allRounds"
            class="front-btn small-text no-border blue-btn mt-2"
          >
            <span class="m-0 p-0">All Rounds</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="success" class="footer-btn px-4 mt-2" @click="confirmApprove">Approve</el-button>
        <el-button type="danger" class="footer-btn px-4 mt-2" @click="closeModal">Cancel</el-button>
      </span>
    </template>

  </el-dialog>

</template>

<script>
import { mapGetters } from "vuex";
import abi from "@/services/abi";

export default {
  name: "CircleApproveModal",
  data() {
    return {
      approvalToken: "CUSD",
      approvalAmount: 0,
      circleAddress: "",
      currentAllowance: 0,
      minAmount: 0,
      maxAmount: 0,
      showModal: false,
      openLoadings: [],
      hasError: {
        approvalAmount: false
      }
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
    async setApproval(circleAddress, minAmount, maxAmount) {
      this.circleAddress = circleAddress;
      this.currentAllowance = await this.getAllowance(circleAddress);
      this.minAmount = minAmount;
      this.approvalAmount = minAmount;
      this.maxAmount = maxAmount;
      this.showModal = true;
    },
    async allRounds() {
      this.approvalAmount = this.maxAmount;
    },
    async getAllowance(circleAddress) {
      const contract = await abi.setAbi(
        "0x", // sender tba address
        "VRC25PCUSD"
      );
      const owner = this.accountProfile.account_tba_address; // tba
      const spender = circleAddress;
      let abiResponse = await contract.interaction("allowance", [owner, spender]);
      return abiResponse.done ? abiResponse.result : 0; // return allowance amount
    },
    async confirmApprove() {
      if(this.checkForm()) {
        try {
          const contract = await abi.setAbi(
            this.accountProfile.account_tba_address, // sender tba address
            "ERC6551Account"
          );
          
          let abiResponse = await contract.interaction("executeFunction", [
            "VRC25PCUSD", // contract name
            "approve", // function name
            ["function approve(address spender, uint256 value)"], // function ABI
            [this.circleAddress, this.approvalAmount * 1e6], // function args
            0 // VIC amount
          ]);
          if(abiResponse.done) {
            this.closeModal();
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
          if(element == 'approvalAmount') {
            if(parseFloat(this[element]) < this.minAmount) {
              this[element] = this.minAmount
              this.$refs[element].focus();
              this.hasError[element] = true;
              this.notif({
                message: `The approved amount should not be less than ${this.minAmount} ${this.approvalToken}.`,
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 5000,
                onClose: () => { this.hasError[element] = false; }
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
    closeModal() {
      this.showModal = false;
      this.$emit('approveModalClosed');
    }
  },
};
</script>
    
<style lang="scss" scoped>
#circle-approve-modal {
  z-index: 9000;
}
.footer-btn {
  min-width: 120px;
  height: 32px;
}
</style>
