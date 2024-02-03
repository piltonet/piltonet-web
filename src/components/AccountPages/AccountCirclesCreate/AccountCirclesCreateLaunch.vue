<template>
  <div v-if="circleInfoProps" id="account-circles-whitelist" class="row">
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
    <div class="main-section row">
      <h3>CIRCLE OVERVIEW</h3>
      <!-- Circle Name -->
      <div class="d-flex flex-row justify-content-start align-items-center mb-2">
        <span class="top-text">
          {{ circleInfoProps.circle_name }}
        </span>
      </div>

      <div class="col-12 col-lg-6">
        <!-- Circle Size -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-3">
          <span class="note-text">Circle Size:</span>
          <span class="top-text small ps-2">
            {{ circleInfoProps.circle_size }}
          </span>
          <span class="top-text small ps-1">people</span>
        </div>
        
        <!-- Round Payments -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-3">
          <span class="note-text">Round Payments:</span>
          <span class="top-text small ps-2">
            {{ utils.formatPrice(circleInfoProps.circle_round_payments) }}
          </span>
          <SvgPaymentToken
            :chainId="circleInfoProps.circle_chain_id"
            :paymentToken="circleInfoProps.circle_payment_token"
            customClass="ms-1"
          />
        </div>

        <!-- Round Period -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-3">
          <span class="note-text">
            Round Period:
          </span>
          <span class="top-text small ps-2">
            {{ circleInfoProps.circle_round_days }}
          </span>
          <span class="top-text small ps-1">days</span>
        </div>
        
        <!-- Winner Selection Method -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-3">
          <span class="note-text">Winner Selection Method:</span>
          <span class="top-text small ps-2">
            {{ circleInfoProps.circle_winners_order == 'random' ? 'Random' : 
              circleInfoProps.circle_winners_order == 'fixed' ? 'FCFS' :
              circleInfoProps.circle_winners_order == 'bidding' ? 'Bidding' : ''
            }}
          </span>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <!-- Loan Amount -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-3">
          <!-- <span class="note-text">Average Winner Loan:</span> -->
          <span class="note-text">Gross Loan Amount:</span>
          <span class="top-text small ps-2">
            {{ utils.formatPrice(grossLoan) }}
          </span>
          <SvgPaymentToken
            :chainId="circleInfoProps.circle_chain_id"
            :paymentToken="circleInfoProps.circle_payment_token"
            customClass="ms-1"
          />
        </div>

        <!-- Patience Benefit -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-3">
          <span class="note-text">Patience Benefit:</span>
          <span class="top-text small ps-2">
            {{ circleInfoProps.circle_patience_benefit }}
          </span>
          <span class="top-text small ps-1">%</span>
        </div>
        
        <!-- Total Fee -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-3">
          <span class="note-text">Total Fee:</span>
          <span class="top-text small ps-2">
            {{ utils.formatPrice(totalFee) }}
          </span>
          <span class="top-text small ps-1">%</span>
        </div>
        
        <!-- Start Date -->
        <div v-if="circleInfoProps.circle_start_date"
          class="d-flex flex-row justify-content-start align-items-center mt-3"
        >
          <span class="note-text">Start Date:</span>
          <span class="top-text small ps-2">
            {{ utils.formatDate(circleInfoProps.circle_start_date, 'DD Month YYYY') }}
          </span>
        </div>
      </div>
    </div>

    <!-- LAUNCH CIRCLE -->
    <div v-if="circleInfoProps.circle_status == 'deployed'" class="main-section">
      <h3>LAUNCH CIRCLE</h3>
      <!-- Circle Start Date -->
      <div>
        <label for="circleStartDate" class="input-label">Start Date</label>
        <button class="account-circles-setup-button date-button" @click="selectedDate = startDate || minStartDate; showCalendarModal = true">
          <p>{{ utils.formatDate(startDate, 'DD Month YYYY') || 'Not Set' }}</p>
        </button>
        <p id="circleStartDateHelp" class="help-text mt-1">
          The start date should be a minimum of two days from now.
        </p>
      </div>

      <!-- Circle Launch Button -->
      <div
        type="button"
        @click="confirmLaunch"
        class="launch-button mt-5"
      >
        <span class="m-0 p-0">LAUNCH</span>
      </div>
    </div>

    <!-- LAUNCHED CIRCLE -->
    <div v-else-if="circleInfoProps.circle_status == 'launched'" class="main-section">
      <h3>LAUNCH CIRCLE</h3>
      <div class="d-flex flex-row justify-content-start align-items-center mb-2">
        <span class="note-text">
          Launched At:
        </span>
        <span class="top-text small ps-2">
          {{ utils.formatDate(circleInfoProps.circle_launched_at, 'DD Month YYYY', 'HH:MM') }}
        </span>
      </div>
    </div>

    <!-- Calendar Modal -->
    <div v-if="showCalendarModal" class="col-12">
      <el-dialog title="" v-model="showCalendarModal" class="modal-body calendar-modal text-center">
        <v-date-picker v-model="selectedDate" :min-date='minStartDate' />
        <template #footer>
          <span class="dialog-footer">
            <el-button
              @click="startDate = selectedDate; showCalendarModal = false"
              class="calendar-button mt-4 px-5"
            >
              Ok
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>

  </div>

  <NotFound v-else />

  <MessageModal
    ref="message_modal"
    @ok-clicked="launchCircle"
  />

</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { abi, api } from "@/services";
import wallets from "@/wallets";
import NotFound from '@/pages/NotFound.vue';

export default {
  name: "AccountCirclesCreateLaunch",
  components: {
    NotFound
  },
  props: {
    circleInfoProps: Object,
    circleConstProps: Object
  },
  data() {
    return {
      totalFee: 0,
      grossLoan: 0,
      startDate: null,
      minStartDate: '',
      selectedDate: '',
      showCalendarModal: false,
      copyAddressTooltip: "Copy Address",
      explorerLink: null
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
  mounted() {
    this.setup();
    // console.log(this.circleInfoProps);
  },
  methods: {
    ...mapMutations(['setConnectionStore', 'setProfileStore']),
    async setup() {
      this.totalFee = parseFloat(this.circleInfoProps.circle_creator_earnings) + parseFloat(this.circleInfoProps.circle_service_charge);
      this.grossLoan = (parseFloat(this.circleInfoProps.circle_round_payments) * parseFloat(this.circleInfoProps.circle_size));
      // this.avgLoan = (parseFloat(this.circleInfoProps.circle_round_payments) * parseFloat(this.circleInfoProps.circle_size)) * (1 - (this.totalFee / 100));
      this.startDate = this.circleInfoProps.circle_start_date;
      const now = new Date();
      this.minStartDate = now;
      // this.minStartDate.setDate(now.getDate() + (now.getHours() < 12 ? 1 : 2 ))
      this.minStartDate.setDate(now.getDate() + 2);
      this.selectedDate = this.startDate || this.minStartDate;
      if(this.circleInfoProps) {
        this.explorerLink = `${this.defaultchain.blockExplorerUrl}/address/${this.circleInfoProps.circle_id}`;
      }
    },
    async confirmLaunch() {
      if(this.startDate) {
        this.$refs.message_modal.setMessage({
          message: 'Please verify that the information on your circle is correct.',
          okBtn: 'Verify Information',
          cancelBtn: "Let's Check Again!",
          customStyle: 'width: 430px;'
        })
      } else {
        this.notif({
          message: "The start date has not been specified.",
          dangerouslyUseHTMLString: true,
          type: "error",
          duration: 3000,
        })
      }
    },
    async launchCircle() {
      try {
        let abiResponse = null;
        if(this.circleInfoProps.circle_mode == 'fully_dec') {
          abiResponse = await this.launchFDCircle();
        } else {
          abiResponse = await this.launchSDCircle();
        }
        if(abiResponse.done) {
          let apiResponse = await api.post_account_circles_creator_launch(
            {
              circle_id: this.circleInfoProps.circle_id,
              start_date: this.startDate
            }
          );
          if(apiResponse.data.done) {
            this.notif({
              title: "SUCCESS!",
              message: apiResponse.data.message,
              dangerouslyUseHTMLString: true,
              type: apiResponse.data.message_type,
              duration: 3000,
              onClose: () => { this.$router.go() }
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
    async launchFDCircle() {
      const contract = await abi.setAbi(
        this.accountProfile.account_tba_address, // sender tba address
        "ERC6551Account"
      );

      // execute TLCC launchCircle
      return await contract.interaction("executeFunction", [
        "TLCC", // contract name
        "launchCircle", // function name
        ["function launchCircle(uint256 start_date)"], // function ABI
        [parseInt(this.startDate.getTime() / 1000)], // function args
        0, // value
        this.circleInfoProps.circle_id // Contract Address
      ]);
    },
    async launchSDCircle() {
      let personalSign = await this.personalSign();
      if(personalSign) {
        return {done: true};
      } else {
        return {done: false};
      }
    },
    async copyAddress(elementId, copyContent) {
      navigator.clipboard.writeText(copyContent);
      document.getElementById(elementId).innerHTML = '<i class="fa fa-check" style="color: lightgreen;" aria-hidden="true"></i>'
      this.copyAddressTooltip = "Copied To Clipboard";
      setTimeout(() => {
          this.copyAddressTooltip = "Copy Address";
          document.getElementById(elementId).innerHTML = '<i class="far fa-copy main-text small" aria-hidden="true"></i>';
        }, 2000);
    },
    async personalSign() {
      let personalSignResult = await wallets[this.connectedAccount.connected_wallet].personalSign(
        "This request requires your signature. It won't cost you anything." +
          `\nTimestamp: ${new Date().getTime()}`,
        this.connectedAccount.account_address,
				null
      );
      return personalSignResult;
    }
  }
}
</script>

<style lang="scss" scoped>
#account-circles-whitelist {
  width: 96%;
  max-width: 940px;
  min-height: calc(100vh - 240px);
}
.date-button {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: var(--ptn-second-blue);
  background: var(--ptn-second-bg);
  border: 1px solid rgba(var(--ptn-color-rgb), 0.3);
  border-radius: 8px;
  width: 95%;
  max-width: 150px;
  height: 40px;
  margin: 5px 0 0;
  padding-left: 10px;
}
.launch-button {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 16px;
  line-height: 45px;
  text-align: center;
  background: var(--ptn-btn-bg);
  color: var(--ptn-btn-color);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 200px;
  // height: 45px;
  margin: 25px 0 15px;
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
