<template>
  
  <div v-if="loading" class="page-loading">
    Work In Progress ...
  </div>

  <div v-else-if="circleInfo" id="account-circles-invited">
    <div class="d-flex flex-column justify-content-center align-items-start mx-auto py-4">
      <button
        type="button" 
        class="back-btn p-0"
        @click="$router.push('/account/circles')"
      >
        <i class="fa fa-arrow-left px-2" aria-hidden="true"></i>
        <span class="pe-2">Back</span>
      </button>
    </div>

    <AccountCirclesDetails
      :circleInfoProps="circleInfo"
    />
    
    <AccountCirclesMembers
      :circleInfoProps="circleInfo"
    />
    
    <AccountCirclesRotations
      :circleInfoProps="circleInfo"
      :circleMembersProps="circleInfo.circle_members"
      :selectedRoundProps="selectVacantRound"
      @change-member-round="changeMemberRound"
    />
    
    <div class="main-section">
      <h3>JOIN THE CIRCLE</h3>
      <div class="d-flex flex-column justify-content-center align-items-start">
        <p class="top-text">
          Prior to joining the circle, please consider the following:
        </p>
      </div>
      <div class="d-flex flex-column justify-content-center align-items-start">
        <p class="main-text small mt-3">
          <i class="fa fa-asterisk blue-btn pe-1" aria-hidden="true"></i>
          The circle requires
          <span class="top-text small">{{ `${circleInfo.circle_size} members` }}</span>
          to commence. If this threshold is not met by the start date, the circle will be automatically disbanded, and all payments will be reimbursed.
        </p>
        <p v-if="circleInfo.circle_payment_type == 'fixed_pay'" class="main-text small mt-3">
          <i class="fa fa-asterisk blue-btn pe-1" aria-hidden="true"></i>
            To join the circle, a payment of
            <span class="top-text small">
            {{ `${paymentAmount} ${circleInfo.circle_payment_token == defaultchain.CUSD.address ?
              defaultchain.CUSD.symbol : defaultchain.nativeCurrency.symbol}` }}
            </span>
            is required.
        </p>
        <p v-if="circleInfo.circle_payment_type == 'fixed_loan'" class="main-text small mt-3">
          <span>
            <i class="fa fa-asterisk blue-btn pe-1" aria-hidden="true"></i>
              To join the circle, a payment of
              <span class="top-text small">
                {{ `${paymentAmount}
                ${circleInfo.circle_payment_token == defaultchain.CUSD.address ? defaultchain.CUSD.symbol : defaultchain.nativeCurrency.symbol}` }}
              </span>
              is required.
          </span>
        </p>
        <p v-if="circleInfo.circle_payment_token != defaultchain.nativeCurrency.address && allowance < paymentAmount" class="main-text small mt-3">
          <i class="fa fa-asterisk blue-btn pe-1" aria-hidden="true"></i>
            The circle contract requires approval before you can join. You can use a single transaction to approve all rounds of the circle.
        </p>
      </div>

      <div class="d-flex flex-column flex-sm-row justify-content-start align-items-start mt-4">
        <div class="d-flex flex-row justify-content-start align-items-center">
          <p class="main-text">Do you wish to join this circle?</p>
        </div>
        <div class="d-flex flex-row justify-content-start align-items-center">
          <div
            type="button"
            @click="wishToJoin"
            class="front-btn green-btn ms-0 ms-sm-3"
          >
            <span class="m-0 p-0">Yes, certainly.</span>
          </div>
          <div
            type="button"
            @click="rejectCircleInvite"
            class="front-btn red-btn ms-3"
          >
          <span class="m-0 p-0">No, thank you.</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <NotFound/>
  </div>

  <CircleApproveModal
    ref="circle_approve_modal"
    @approve-modal-closed="approveModalClosed"
  />
  <CircleJoinModal
    ref="circle_join_modal"
  />

  <MessageModal
    ref="message_modal"
  />

</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { abi, api } from "@/services";
import wallets from "@/wallets";
import AccountCirclesDetails from "@/components/AccountPages/AccountCircles/AccountCirclesDetails.vue";
import AccountCirclesMembers from "@/components/AccountPages/AccountCircles/AccountCirclesMembers.vue";
import AccountCirclesRotations from "@/components/AccountPages/AccountCircles/AccountCirclesRotations.vue";
import CircleApproveModal from '@/components/CustomModals/CircleApproveModal.vue';
import CircleJoinModal from '@/components/CustomModals/CircleJoinModal.vue';
import NotFound from '@/pages/NotFound.vue';

export default {
  name: 'AccountCirclesInvited',
  components: {
    AccountCirclesDetails,
    AccountCirclesMembers,
    AccountCirclesRotations,
    CircleApproveModal,
    CircleJoinModal,
    NotFound
  },
  props: {
    circleIdProps: String
  },
  data() {
    return {
      circleInfo: null,
      selectVacantRound: -1,
      paymentAmount: 0,
      loanAmount: 0,
      allowance: 0,
      openLoadings: [],
      loading: false
    }
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
  async mounted() {
    if(this.circleIdProps && this.circleIdProps.length >= 42) {
      this.setup()
    }
  },
  watch: {
    circleIdProps: function () {
      if(this.circleIdProps && this.circleIdProps.length >= 42) {
        this.setup()
      } else {
        this.circleInfo = null;
      }
    }
  },
  methods: {
    ...mapMutations(['setConnectionStore', 'setProfileStore']),
    async setup() {
      this.loading = true;
      let apiResponse = await api.get_account_circles_invited(`circle_id=${this.circleIdProps}`);
      this.loading = false;
      if(apiResponse && apiResponse.data.done) {  
        this.circleInfo = apiResponse.data.result[0];
        if(this.circleInfo.circle_payment_type == 'fixed_pay') {
          this.paymentAmount = this.circleInfo.circle_round_payments;
          this.loanAmount = this.circleInfo.circle_round_payments * this.circleInfo.circle_size;
        } else {
          this.paymentAmount = Math.round(((this.circleInfo.circle_round_payments / this.circleInfo.circle_size) + Number.EPSILON) * 100) / 100;
          this.loanAmount = this.circleInfo.circle_round_payments;
        }
        if(this.circleInfo.circle_payment_token != this.defaultchain.nativeCurrency.address) {
          this.allowance = await this.$refs.circle_approve_modal.getAllowance(this.circleIdProps);
        }
      } else {
        this.circleInfo = null;
      }
    },
    async changeMemberRound(newRound) {
      this.selectVacantRound = newRound;
    },
    
    async wishToJoin() {
      if(this.circleInfo.circle_winners_order == 'fixed' && this.selectVacantRound < 0) {
        this.scrollToElement('account-circles-rotations')
        return this.notif({
          message: "Choose your loan date from among the vacant months.",
          type: "error",
          duration: 3000
        })
      }

      if(this.circleInfo.circle_payment_token == this.defaultchain.nativeCurrency.address) {
        // get vic balance
        const vicBalance = await wallets[this.connectedAccount.connected_wallet].getBalance(this.accountProfile.account_tba_address);
        if(vicBalance < this.paymentAmount) {
          return this.$refs.message_modal.setMessage({
            message: `Your account balance is "${vicBalance} VIC", but you need "${this.paymentAmount} VIC" to join the circle.`,
            okBtn: null,
            cancelBtn: "Close",
            customStyle: 'width: 430px;'
          })
        }
      } else if(this.circleInfo.circle_payment_token == this.defaultchain.CUSD.address) {
        // get cusd balance
        let cusdBalance = 0;
        const contract = await abi.setAbi(
          "0x", // fixed as VRC25PCUSD address in sdk
          "VRC25PCUSD"
        );
        const abiResponse = await contract.interaction("balanceOf", [this.accountProfile.account_tba_address]);
        if(abiResponse.done) {
          cusdBalance = abiResponse.result;
        }
        if(cusdBalance < this.paymentAmount) {
          return this.$refs.message_modal.setMessage({
            message: `Your account balance is "${cusdBalance} CUSD", but you need "${this.paymentAmount} CUSD" to join the circle.`,
            okBtn: null,
            cancelBtn: "Close",
            customStyle: 'width: 430px;'
          })
        }
      }

      if(this.circleInfo.circle_payment_token != this.defaultchain.nativeCurrency.address && this.allowance < this.paymentAmount) {
        this.$refs.circle_approve_modal.setApproval(this.circleIdProps, this.paymentAmount, this.loanAmount);
      } else {
        this.$refs.circle_join_modal.setCircle(
          this.circleInfo,
          this.paymentAmount,
          this.circleInfo.circle_winners_order == 'fixed' ? this.selectVacantRound : 0
        );
      }
    },
    async approveModalClosed() {
      this.allowance = await this.$refs.circle_approve_modal.getAllowance(this.circleIdProps);
      if(this.allowance >= this.paymentAmount) {
        this.$refs.circle_join_modal.setCircle(
          this.circleInfo,
          this.paymentAmount,
          this.circleInfo.circle_winners_order == 'fixed' ? this.selectVacantRound : 0
        );
      }
    },
    async rejectCircleInvite() {
      let personalSign = await this.personalSign();
      if(personalSign) {
        let apiResponse = await api.post_account_circles_invited_reject({
          circle_id: this.circleInfo.circle_id
        });
        if(apiResponse.data.done) {
          this.notif({
            title: "SUCCESS!",
            message: apiResponse.data.message,
            dangerouslyUseHTMLString: true,
            type: apiResponse.data.message_type,
            duration: 3000,
            onClose: () => { this.$router.push("/account/circles") }
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
            })
          }
        }
      }
    },
    async personalSign() {
      let personalSignResult = await wallets[this.connectedAccount.connected_wallet].personalSign(
        "This request requires your signature. It won't cost you anything." +
          `\nTimestamp: ${new Date().getTime()}`,
        this.connectedAccount.account_address,
				null
      );
      return personalSignResult;
    },
    async scrollToElement(element) {
      if(document.getElementById(element)) {
        document.getElementById(element).scrollIntoView();
      } else {
        this.scrollToLaunchpad();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#account-circles-invited {
  width: 96%;
  max-width: 940px;
  min-height: calc(100vh - 240px);
  margin: auto;
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
}
</style>
