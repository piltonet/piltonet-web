<template>
  <template v-if="circleInfo">
    <el-dialog 
      id="circle-join-modal"
      v-model="showModal"
      title="Join The Circle"
      class="circle-join-dialog pt-3"
      :style="''"
    >
      <div class="d-flex flex-column justify-content-center align-items-start p-2">
        <p class="main-text small mt-3">
          <i class="fa fa-square-check green-btn pe-1"></i>
          Circle name:
          <span class="top-text-small">{{ circleInfo.circle_name }}</span>
        </p>
        <p class="main-text small mt-3">
          <i class="fa fa-square-check green-btn pe-1"></i>
          Circle Admin:
          <span class="top-text-small">@{{ circleInfo.circle_creator.account_nickname }}</span>
        </p>
        <p class="main-text small mt-3">
          <i class="fa fa-square-check green-btn pe-1"></i>
          Invited By:
          <span class="top-text-small">{{ circleInfo.circle_creator.account_fullname || circleInfo.circle_creator.account_nickname }}</span>
        </p>
        <p class="main-text small mt-3">
          <i class="fa fa-square-check green-btn pe-1"></i>
          First Payment:
          <span class="top-text-small">{{ `${paymentAmount} ${circleInfo.circle_payment_token == defaultchain.CUSD.address ?
              defaultchain.CUSD.symbol : defaultchain.nativeCurrency.symbol}` }}</span>
        </p>
        <!-- Confirm Text -->
        <div class="d-flex flex-row justify-content-start align-items-start mt-4 mb-3">
          <div class="input-label text-start">
            If you agree to all circle conditions, please confirm your join.
          </div>
        </div>
      </div>
  
      <template #footer>
        <span class="dialog-footer">
          <el-button type="success" class="footer-btn px-4 mt-2" @click="confirmJoin">Confirm</el-button>
          <el-button type="danger" class="footer-btn px-4 mt-2" @click="closeModal">Cancel</el-button>
        </span>
      </template>
  
    </el-dialog>
  </template>  
</template>

<script>
import { mapGetters } from "vuex";
import abi from "@/services/abi";
import api from "@/services/api";

export default {
  name: "CircleJoinModal",
  data() {
    return {
      circleInfo: null,
      paymentAmount: 0,
      selectedRound: 0,
      showModal: false,
      openLoadings: [],
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
    async setCircle(circleInfo, paymentAmount, selectedRound) {
      this.circleInfo = circleInfo;
      this.paymentAmount = paymentAmount;
      this.selectedRound = selectedRound;
      this.showModal = true;
    },
    async confirmJoin() {
      try {
        const contract = await abi.setAbi(
          this.accountProfile.account_tba_address, // sender tba address
          "ERC6551Account"
        );

        let abiResponse = {done: false};
        
        // execute TLCC joinCircle
        if(this.circleInfo.circle_payment_token == this.defaultchain.nativeCurrency.address) {
          abiResponse = await contract.interaction("executeFunction", [
            "TLCC", // contract name
            "joinCircle", // function name
            ["function joinCircle(uint8 selected_round)"], // function ABI
            [this.selectedRound], // function args
            this.paymentAmount, // VIC amount
            this.circleInfo.circle_id // Contract Address
          ]);
        } else {
          abiResponse = await contract.interaction("executeFunction", [
            "TLCC", // contract name
            "joinCircle", // function name
            ["function joinCircle(uint8 selected_round)"], // function ABI
            [this.selectedRound], // function args
            0, // VIC amount
            this.circleInfo.circle_id // Contract Address
          ]);
        }
console.log(abiResponse);
        
        if(abiResponse.done) {
          let apiResponse = await api.post_account_circles_invited_accept({
            circle_id: this.circleInfo.circle_id,
            member_selected_round: this.selectedRound
          });
          if(apiResponse.data.done) {
            this.notif({
              title: "SUCCESS!",
              message: apiResponse.data.message,
              dangerouslyUseHTMLString: true,
              type: apiResponse.data.message_type,
              duration: 3000,
              onClose: () => { this.$router.go(-1) }
            })
          } else {
            if(apiResponse.data.status_code == "401") {
              this.setConnectionStore({ is_connected: false });
              this.setProfileStore(null);
              this.$router.go();
            } else {
              this.notif({
                title: "OOPS!",
                message: apiResponse.data.message,
                dangerouslyUseHTMLString: true,
                type: apiResponse.data.message_type,
                duration: 3000,
                onClose: () => { this.$router.go() }
              })
            }
          }
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
    },
    closeModal() {
      this.showModal = false;
    }
  },
};
</script>
    
<style lang="scss" scoped>
#circle-join-modal {
  z-index: 9000;
}
.footer-btn {
  min-width: 120px;
  height: 32px;
}
</style>
