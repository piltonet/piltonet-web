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
      <h3>CIRCLE REVIEW</h3>
      <!-- Circle Name -->
      <div class="d-flex flex-row justify-content-start align-items-center mb-2">
        <span class="top-text">
          {{ circleInfoProps.circle_name }}
        </span>
      </div>
      <!-- Contract Address -->
      <div class="d-flex flex-row justify-content-start align-items-center mt-4">
        <span class="note-text">Contract Address:</span>
        <span class="top-text-small ps-2">
          {{ utils.truncate(circleInfoProps.circle_id, 17) }}
        </span>
        <div class="d-flex flex-row justify-content-start align-items-center h-100 third-gray-btn ps-1">
          <!-- Copy Icon -->
          <el-tooltip
            :content="this.copyAddressTooltip"
            placement="top"
            :hide-after="0"
          >
            <a
              id="copy-contract-address"
              role="button"
              @click="copyAddress('copy-contract-address', circleInfoProps.circle_id)"
              class="ms-2"
            >
              <i class="far fa-copy main-text-small" aria-hidden="true"></i>
            </a>
          </el-tooltip>
          <!-- Explore Icon -->
          <el-tooltip
            content="View in Explorer"
            placement="top"
            :hide-after="0"
          >
            <a
              v-if="explorerLink"
              :href="explorerLink"
              target="_blank"
              class="ms-2"
            >
              <i class="fa fa-external-link main-text-small" aria-hidden="true"></i>
            </a>
          </el-tooltip>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <!-- Round Period -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">
            Round Period:
          </span>
          <span v-if="circleInfoProps.circle_round_days == 7" class="top-text-small ps-2">
            Weekly<span class="main-text-small ps-2">(7 days)</span>
          </span>
          <span v-if="circleInfoProps.circle_round_days == 14" class="top-text-small ps-2">
            Biweekly<span class="main-text-small ps-2">(14 days)</span>
          </span>
          <span v-else-if="circleInfoProps.circle_round_days == 30" class="top-text-small ps-2">
            Monthly<span class="main-text-small ps-2">(30 days)</span>
          </span>
          <span v-else class="top-text-small ps-2">
            {{ circleInfoProps.circle_round_days }} days
          </span>
        </div>
        <!-- Payment Type -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">Payment Type:</span>
          <span class="top-text-small ps-2">
            {{ circleInfoProps.circle_payment_type == 'fixed_pay' ? 'Fixed Payments' : 
              circleInfoProps.circle_payment_type == 'fixed_loan' ? 'Fixed Loan' : ''
            }}
          </span>
        </div>
        <!-- Circle Size -->
        <div v-if="circleInfoProps.circle_min_members == circleInfoProps.circle_max_members"
          class="d-flex flex-row justify-content-start align-items-center mt-4"
        >
          <span class="note-text">Circle Size:</span>
          <span class="top-text-small ps-2">
            {{ circleInfoProps.circle_max_members }}
          </span>
          <span class="main-text-small ps-2">people</span>
        </div>
        <div v-else class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">Circle Size:</span>
          <span class="top-text-small ps-2">
            {{ circleInfoProps.circle_min_members }}
          </span>
          <span class="main-text-small ps-2">to</span>
          <span class="top-text-small ps-2">
            {{ circleInfoProps.circle_max_members }}
          </span>
          <span class="main-text-small ps-2">people</span>
        </div>
        <!-- Payments per Round & Loan Amount - fixed_pay -->
        <div v-if="circleInfoProps.circle_payment_type == 'fixed_pay'">
          <div class="d-flex flex-row justify-content-start align-items-center mt-4">
            <span v-if="circleInfoProps.circle_round_days == 7" class="note-text">Weekly Payments:</span>
            <span v-else-if="circleInfoProps.circle_round_days == 30" class="note-text">Round Payment:</span>
            <span v-else class="note-text">Payments per Round:</span>
            <span class="top-text-small ps-2">
              {{ circleInfoProps.circle_fixed_amount }}
            </span>
            <SvgPaymentToken
              :chainId="circleInfoProps.circle_chain_id"
              :paymentToken="circleInfoProps.circle_payment_token"
              customClass="ms-1"
            />
            <!-- <span class="main-text-small ps-2">(fixed)</span> -->
          </div>
          <div v-if="circleInfoProps.circle_min_members == circleInfoProps.circle_max_members"
            class="d-flex flex-row justify-content-start align-items-center mt-4"
          >
            <span class="note-text">Loan Amount:</span>
            <span class="top-text-small ps-2">
              {{ circleInfoProps.circle_fixed_amount * circleInfoProps.circle_max_members }}
            </span>
            <SvgPaymentToken
              :chainId="circleInfoProps.circle_chain_id"
              :paymentToken="circleInfoProps.circle_payment_token"
              customClass="ms-1"
            />
          </div>
          <div v-else class="d-flex flex-row justify-content-start align-items-center mt-4">
            <span class="note-text">Loan Amount:</span>
            <span class="top-text-small ps-2">
              {{ circleInfoProps.circle_fixed_amount * circleInfoProps.circle_min_members }}
            </span>
            <SvgPaymentToken
              :chainId="circleInfoProps.circle_chain_id"
              :paymentToken="circleInfoProps.circle_payment_token"
              customClass="ms-1"
            />
            <span class="main-text-small ps-2">to</span>
            <span class="top-text-small ps-2">
              {{ circleInfoProps.circle_fixed_amount * circleInfoProps.circle_max_members }}
            </span>
            <SvgPaymentToken
              :chainId="circleInfoProps.circle_chain_id"
              :paymentToken="circleInfoProps.circle_payment_token"
              customClass="ms-1"
            />
          </div>
        </div>
        <!-- Payments per Round & Loan Amount - fixed_loan -->
        <div v-if="circleInfoProps.circle_payment_type == 'fixed_loan'">
          <div v-if="circleInfoProps.circle_min_members == circleInfoProps.circle_max_members"
            class="d-flex flex-row justify-content-start align-items-center mt-4"
          >
            <span v-if="circleInfoProps.circle_round_days == 7" class="note-text">Weekly Payments:</span>
            <span v-else-if="circleInfoProps.circle_round_days == 30" class="note-text">Round Payment:</span>
            <span v-else class="note-text">Payments per Round:</span>
            <span class="top-text-small ps-2">
              {{ circleInfoProps.circle_fixed_amount / circleInfoProps.circle_max_members }}
            </span>
            <SvgPaymentToken
              :chainId="circleInfoProps.circle_chain_id"
              :paymentToken="circleInfoProps.circle_payment_token"
              customClass="ms-1"
            />
          </div>
          <div v-else class="d-flex flex-row justify-content-start align-items-center mt-4">
            <span v-if="circleInfoProps.circle_round_days == 7" class="note-text">Weekly Payments:</span>
            <span v-else-if="circleInfoProps.circle_round_days == 30" class="note-text">Round Payment:</span>
            <span v-else class="note-text">Payments per Round:</span>
            <span class="top-text-small ps-2">
              {{ Math.round(((circleInfoProps.circle_fixed_amount / circleInfoProps.circle_max_members) + Number.EPSILON) * 100) / 100 }}
            </span>
            <SvgPaymentToken
              :chainId="circleInfoProps.circle_chain_id"
              :paymentToken="circleInfoProps.circle_payment_token"
              customClass="ms-1"
            />
            <span class="main-text-small ps-2">to</span>
            <span class="top-text-small ps-2">
              {{ Math.round(((circleInfoProps.circle_fixed_amount / circleInfoProps.circle_min_members) + Number.EPSILON) * 100) / 100 }}
            </span>
            <SvgPaymentToken
              :chainId="circleInfoProps.circle_chain_id"
              :paymentToken="circleInfoProps.circle_payment_token"
              customClass="ms-1"
            />
          </div>
  
          <div class="d-flex flex-row justify-content-start align-items-center mt-4">
            <span class="note-text">Loan Amount:</span>
            <span class="top-text-small ps-2">
              {{ circleInfoProps.circle_fixed_amount }}
            </span>
            <SvgPaymentToken
              :chainId="circleInfoProps.circle_chain_id"
              :paymentToken="circleInfoProps.circle_payment_token"
              customClass="ms-1"
            />
            <!-- <span class="main-text-small ps-2">(fixed)</span> -->
          </div>
  
        </div>
        <!-- Start Date -->
        <div v-if="circleInfoProps.circle_start_date"
          class="d-flex flex-row justify-content-start align-items-center mt-4"
        >
          <span class="note-text">Start Date:</span>
          <span class="top-text-small ps-2">
            {{ utils.formatDate(circleInfoProps.circle_start_date, 'DD Month YYYY') }}
          </span>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <!-- Winner Selection Method -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">Winner Selection Method:</span>
          <span class="top-text-small ps-2">
            {{ circleInfoProps.circle_winners_order == 'random' ? 'Random' : 
              circleInfoProps.circle_winners_order == 'fixed' ? 'FCFS' :
              circleInfoProps.circle_winners_order == 'bidding' ? 'Bidding' : ''
            }}
          </span>
        </div>
        <!-- Round Winners Quantity -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">Round Winners Quantity:</span>
          <span class="top-text-small ps-2">
            {{ circleInfoProps.circle_winners_number }}
          </span>
          <span class="main-text-small ps-2">winner(s)</span>
        </div>
        <!-- Patience Benefit -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">Patience Benefit:</span>
          <span class="top-text-small ps-2">
            {{ circleInfoProps.circle_patience_benefit }}
          </span>
          <span class="main-text-small ps-1">%</span>
        </div>
        <!-- Creator Earnings -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">Creator Earnings:</span>
          <span class="top-text-small ps-2">
            {{ circleInfoProps.circle_creator_earnings }}
          </span>
          <span class="main-text-small ps-1">%</span>
        </div>
        <!-- Service Charge -->
        <div class="d-flex flex-row justify-content-start align-items-center mt-4">
          <span class="note-text">Service Charge:</span>
          <span class="top-text-small ps-2">
            {{ circleInfoProps.circle_service_charge }}
          </span>
          <span class="main-text-small ps-1">%</span>
        </div>
        
      </div>

    </div>

    <!-- LAUNCH CIRCLE -->
    <div v-if="circleInfoProps.circle_status == 'setuped'" class="main-section">
      <h3>LAUNCH CIRCLE</h3>
      <!-- Circle Start Date -->
      <div>
        <label for="circleStartDate" class="input-label">Start Date</label>
        <button class="account-circles-setup-button date-button" @click="showCalendarModal = true">
          <p>{{ utils.formatDate(startDate, 'DD Month YYYY') || 'Not Set' }}</p>
        </button>
        <p id="circleStartDateHelp" class="help-text">
          The start date must be after today and at least 12 hours away from now.
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
        <span class="top-text-small ps-2">
          {{ utils.formatDate(circleInfoProps.circle_launched_at, 'DD Month YYYY', 'HH:MM') }}
        </span>
      </div>
    </div>

    <!-- Calendar Modal -->
    <div v-if="showCalendarModal" class="col-12">
      <el-dialog title="" v-model="showCalendarModal" class="modal-body calendar-modal text-center">
        <v-date-picker v-model="startDate" :min-date='minStartDate' />
        <template #footer>
          <span class="dialog-footer">
            <el-button
              @click="showCalendarModal = false"
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
import { ElLoading } from 'element-plus';
import { mapGetters, mapMutations } from "vuex";
import { ethers } from 'ethers'
import api from "@/services/api";
import abi from "@/services/abi";
import wallets from "@/wallets";
import NotFound from '@/pages/NotFound.vue';

// const { LendingCircleContract } = require('@/contracts');

export default {
  name: "AccountCirclesCreateLaunch",
  components: {
    NotFound
  },
  props: {
    circleInfoProps: Object
  },
  data() {
    return {
      showCalendarModal: false,
      startDate: null,
      minStartDate: '',
      copyAddressTooltip: "Copy Address",
      explorerLink: null,
      openLoadings: []
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
      this.startDate = this.circleInfoProps.circle_start_date;
      const now = new Date();
      this.minStartDate = now;
      this.minStartDate.setDate(now.getDate() + (now.getHours() < 12 ? 1 : 2 ))
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
      let loadingId = await this.showLoading();
      try {
        const provider = new ethers.BrowserProvider(wallets[this.connectedAccount.connected_wallet].getProvider() || window.ethereum);
        const signer = await provider.getSigner();
        const contract = abi.setAbi(
          this.accountProfile.account_tba_address, // sender tba address
          "ERC6551Account",
          signer
        );

        // execute TLCC launchCircle
        let abiResponse = await contract.interaction("executeFunction", [
          "TLCC", // contract name
          "launchCircle", // function name
          ["function launchCircle(uint256 start_date)"], // function ABI
          [this.startDate.getTime() / 1000], // function args
          0, // value
          ethers.getAddress(this.circleInfoProps.circle_id) // Contract Address
        ]);
        if(!abiResponse.done) {
          this.notif({
            title: "OOPS!",
            message: abiResponse.message,
            dangerouslyUseHTMLString: true,
            type: abiResponse.message_type,
            duration: 3000,
          });
        } else {
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
        this.openLoadings[loadingId].close();
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
    async copyAddress(elementId, copyContent) {
      navigator.clipboard.writeText(copyContent);
      document.getElementById(elementId).innerHTML = '<i class="fa fa-check" style="color: lightgreen;" aria-hidden="true"></i>'
      this.copyAddressTooltip = "Copied To Clipboard";
      setTimeout(() => {
          this.copyAddressTooltip = "Copy Address";
          document.getElementById(elementId).innerHTML = '<i class="far fa-copy main-text-small" aria-hidden="true"></i>';
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
    },
    async showLoading() {
      const randomId = Date.now();
      this.openLoadings[randomId] = undefined;
      this.openLoadings[randomId] = new ElLoading.service({
        lock: true,
        text: '',
        fullscreen: true,
      });
      return randomId;
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
