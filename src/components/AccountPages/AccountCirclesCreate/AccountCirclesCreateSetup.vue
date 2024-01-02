<template>
  <div v-if="circleInfo" id="account-circles-setup" class="row">
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
    <div class="main-section">
      <h3>CIRCLE DETAILS</h3>
      <div class="account-circles-setup-form">
        <form @submit.prevent>

          <!-- Circle Name -->
          <template v-if="tabIndex == 1">
            <label for="circleName" class="input-label">
              Circle Name
              <span class="input-label-small">(Required)</span>
            </label>
            <input
              ref="circle_name"
              id="circleName"
              type="text"
              class="small-input mb-0"
              :class="hasError['circle_name'] ? 'has-error' : ''"
              placeholder="e.g. Work Friends"
              aria-describedby="circleNameHelp"
              v-model="circleInfo.circle_name"
            />
            <p id="circleNameHelp" class="help-text pt-2 mb-3">
              Name the circle whatever you want.
            </p>
          </template>
          
          <!-- Fixed Pay -->
          <template v-if="tabIndex == 2">
            <label v-if="circleInfo.circle_payment_type == 'fixed_pay'" for="circleFixedAmount" class="input-label mt-2">
              Monthly Payments
              <span class="input-label-small">(Required)</span>
            </label>
            <label v-if="circleInfo.circle_payment_type == 'fixed_loan'" for="circleFixedAmount" class="input-label mt-2">
              Loan Amount
              <span class="input-label-small">(Required)</span>
            </label>
            <input
              :disabled="circleInfo.circle_joined_members"
              ref="circle_fixed_amount"
              id="circleFixedAmount"
              type="number"
              :placeholder="`e.g. ${minFixedAmount}`"
              class="small-input mb-0"
              :class="hasError['circle_fixed_amount'] ? 'has-error' : ''"
              aria-describedby="circleFixedAmountHelp"
              v-model="circleInfo.circle_fixed_amount"
            />
            <p v-if="circleInfo.circle_payment_type == 'fixed_pay'" id="circleFixedAmountHelp" class="help-text pt-2 mb-3">
              {{ `Participants contribute the same monthly payment, ${minFixedAmount} to ${maxFixedAmount} ${paymentToken.symbol}.` }}
            </p>
            <p v-if="circleInfo.circle_payment_type == 'fixed_loan'" id="circleFixedAmountHelp" class="help-text pt-2 mb-3">
              {{ `The fixed amount of loan that the winner receives, ${minFixedAmount} to ${maxFixedAmount}  ${paymentToken.symbol}.` }}
            </p>
          </template>

          <!-- Min Members -->
          <template v-if="tabIndex == 3">
            <label for="circleMinMembers" class="input-label mt-2">
              Min. Members
              <span class="input-label-small">(Required)</span>
            </label>
            <input
              :disabled="circleInfo.circle_joined_members"
              ref="circle_min_members"
              id="circleMinMembers"
              type="number"
              placeholder="e.g. 5"
              class="small-input mb-0"
              :class="hasError['circle_min_members'] ? 'has-error' : ''"
              aria-describedby="circleMinMembersHelp"
              v-model="circleInfo.circle_min_members"
            />
            <p id="circleMinMembersHelp" class="help-text pt-2 mb-3">
              {{ `The minimum number of participants in the circle, ${minMembers} to ${maxMembers} people.` }}
            </p>
            
            <!-- Max Members -->
            <label for="circleMaxMembers" class="input-label mt-2">
              Max. Members
              <span class="input-label-small">(Required)</span>
            </label>
            <input
              :disabled="circleInfo.circle_joined_members"
              ref="circle_max_members"
              id="circleMaxMembers"
              type="number"
              placeholder="e.g. 5"
              class="small-input mb-0"
              :class="hasError['circle_max_members'] ? 'has-error' : ''"
              aria-describedby="circleMaxMembersHelp"
              v-model="circleInfo.circle_max_members"
            />
            <p id="circleMaxMembersHelp" class="help-text pt-2 mb-3">
              {{ `The maximum number of participants in the circle, ${Math.max(minMembers, circleInfo.circle_min_members)} to ${maxMembers} people.` }}
            </p>
          </template>
          
          <!-- Number Of Winners -->
          <template v-if="tabIndex == 4">
            <label for="circleWinnersNumber" class="input-label mt-2">
              Number Of Winners
              <span class="input-label-small">(Required)</span>
            </label>
            <input
              :disabled="circleInfo.circle_joined_members"
              ref="circle_winners_number"
              id="circleWinnersNumber"
              type="number"
              placeholder="e.g. 1"
              min="1"
              :max="Math.max(parseInt(circleInfo.circle_max_members /  3), 1)"
              step="1"
              class="small-input mb-0"
              :class="hasError['circle_winners_number'] ? 'has-error' : ''"
              aria-describedby="circleWinnersNumberHelp"
              v-model="circleInfo.circle_winners_number"
            />
            <p id="circleWinnersNumberHelp" class="help-text pt-2 mb-3">
              The number of winners are chosen per month, default 1 person.
            </p>
          </template>

          <!-- Save Button -->
          <template v-if="tabIndex == 5">
            <input
              v-if="circleInfo.circle_status == 'deployed'"
              type="submit"
              value="SETUP"
              @click="setupCircle"
            />
            <input
              v-else-if="circleInfo.circle_status == 'setuped'"
              type="submit"
              value="UPDATE"
              @click="setupCircle"
            />
          </template>

        </form>
      </div>
      <form action=""></form>

      <!-- Previous & Next -->
      <div class="d-flex flex-row justify-content-center align-items-center mt-4">
        <div class="d-flex flex-row justify-content-center align-items-center">
          <div
            type="button"
            @click="tabIndex = 1"
            class="main-btn blue-bg"
            :class="tabIndex == 5 ? '' : 'd-none'"
          >
            <span class="m-0 p-0">Back to Edit</span>
          </div>
          <div
            type="button"
            @click="tabIndex = tabIndex > 1 ? tabIndex - 1 : 1"
            class="main-btn blue-bg"
            :class="tabIndex == 1 || tabIndex == 5 ? 'd-none' : ''"
          >
            <span class="m-0 p-0">Previous</span>
          </div>
          <div
            type="button"
            @click="tabIndex = tabIndex < 5 ? tabIndex + 1 : 5"
            class="main-btn blue-bg ms-2"
            :class="tabIndex == 4 ? 'd-none' : ''"
          >
            <span class="m-0 p-0">Next</span>
          </div>
          <div
            type="button"
            @click="setupCircle"
            class="main-btn green-bg ms-2"
            :class="tabIndex == 4 ? '' : 'd-none'"
          >
            <span class="m-0 p-0">Setup</span>
          </div>
        </div>
      </div>

    </div>
  </div>

  <NotFound v-else />

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
  name: "AccountCirclesCreateSetup",
  components: {
    NotFound
  },
  props: {
    circleInfoProps: Object
  },
  data() {
    return {
      tabIndex: 1,
      circleInfo: this.circleInfoProps,
      paymentToken: '',
      minFixedAmount: parseInt(process.env.VUE_APP_CIRCLES_MIN_MONTHLY_PAYMENT_IN_VIC),
      maxFixedAmount: parseInt(process.env.VUE_APP_CIRCLES_MAX_MONTHLY_PAYMENT_IN_VIC),
      minMembers: parseInt(process.env.VUE_APP_CIRCLES_MIN_MEMBERS),
      maxMembers: parseInt(process.env.VUE_APP_CIRCLES_MAX_MEMBERS),
      hasError: {
        circle_name: false,
        circle_fixed_amount: false,
        circle_min_members: false,
        circle_max_members: false,
        circle_winners_number: false
      },
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
  created() {
    if(this.circleInfo.payment_token == this.defaultchain.nativeCurrency.address) {
      this.paymentToken = this.defaultchain.nativeCurrency;
    } else {
      this.paymentToken = this.defaultchain.CUSD;
    }
  },
  mounted() {
    this.setup();
  },
  watch: {
    circleInfoProps: function () {
      // if(this.circleInfo.circle_id != this.circleInfoProps.circle_id) this.setup();
    }
  },
  methods: {
    ...mapMutations(['setConnectionStore', 'setProfileStore']),
    setup() {
      this.circleInfo = this.circleInfoProps;
      if(this.circleInfo) {
        if(this.circleInfo.circle_payment_type == 'fixed_loan') {
          this.minFixedAmount = this.minFixedAmount * this.minMembers;
          this.maxFixedAmount = this.maxFixedAmount * this.maxMembers;
        }
        if(this.circleInfo.circle_status == 'deployed') {
          this.circleInfo['circle_name'] = '';
          this.circleInfo['circle_fixed_amount'] = '';
          this.circleInfo['circle_min_members'] = '';
          this.circleInfo['circle_max_members'] = '';
          this.circleInfo['circle_winners_number'] =1;
          this.circleInfo['circle_start_date'] = '';
        }
      }
    },
    async setupCircle() {
      if(this.checkForm()) {
        try {
          const provider = new ethers.BrowserProvider(wallets[this.connectedAccount.connected_wallet].getProvider() || window.ethereum);
          const signer = await provider.getSigner();
          const contract = abi.setAbi(
            this.circleInfo.circle_id, // TLCC address
            "TrustedLendingCircle",
            signer
          );
          // execute TrustedLendingCircle addContact
          let abiResponse = await contract.interaction("setupCircle", [
            this.circleInfo.circle_name,
            this.circleInfo.circle_fixed_amount * 100,
            this.circleInfo.circle_min_members,
            this.circleInfo.circle_max_members,
            this.circleInfo.circle_winners_number
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
            let apiResponse = await api.post_account_circles_creator_update(this.circleInfo);
            if(apiResponse.data.done) {
              this.notif({
                title: "SUCCESS!",
                message: apiResponse.data.message,
                dangerouslyUseHTMLString: true,
                type: apiResponse.data.message_type,
                duration: 3000,
                onClose: () => {
                  this.circleInfo.circle_status == 'deployed' ?
                  this.$router.push({path: '/account/circles/create', query: {active_page: 'whitelist', circle_id: this.circleInfo.circle_id}}) :
                  window.scrollTo(0,0);
                }
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
      }
    },
    checkForm() {
      try {
        Object.keys(this.hasError).forEach(element => {
          if(this.circleInfo[element] == null || this.circleInfo[element].length <= 0) {
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
          if(element == 'circle_fixed_amount' && (parseInt(this.circleInfo[element]) < this.minFixedAmount || parseInt(this.circleInfo[element]) > this.maxFixedAmount)) {
            this.$refs[element].focus();
            this.hasError[element] = true;
            this.notif({
              message: `The ${this.circleInfo.circle_payment_type == 'fixed_pay' ? 'monthly payments' : 'loan amount'} must be between ${this.minFixedAmount} and ${this.maxFixedAmount}.`,
              dangerouslyUseHTMLString: true,
              type: "error",
              duration: 5000,
              onClose: () => { this.hasError[element] = false }
            })
            throw false;
          }
          if(element == 'circle_min_members' && (parseInt(this.circleInfo[element]) < this.minMembers || parseInt(this.circleInfo[element]) > this.maxMembers)) {
            this.$refs[element].focus();
            this.hasError[element] = true;
            this.notif({
              message: `The minimum number of members must be between ${this.minMembers} and ${this.maxMembers}.`,
              dangerouslyUseHTMLString: true,
              type: "error",
              duration: 5000,
              onClose: () => { this.hasError[element] = false }
            })
            throw false;
          }
          if(element == 'circle_max_members' && (parseInt(this.circleInfo[element]) < parseInt(this.circleInfo['circle_min_members']) || parseInt(this.circleInfo[element]) > this.maxMembers)) {
            console.log(parseInt(this.circleInfo[element]));
            this.$refs[element].focus();
            this.hasError[element] = true;
            this.notif({
              message: `The maximum number of members must be between ${this.circleInfo['circle_min_members']} and ${this.maxMembers}.`,
              dangerouslyUseHTMLString: true,
              type: "error",
              duration: 5000,
              onClose: () => { this.hasError[element] = false }
            })
            throw false;
          }
          if(element == 'circle_winners_number' && (parseInt(this.circleInfo['circle_min_members'] / this.circleInfo[element]) < this.minMembers)) {
            this.$refs[element].focus();
            this.hasError[element] = true;
            this.notif({
              message: 'The number of monthly winners is high compared to the minimum number of participants.',
              dangerouslyUseHTMLString: true,
              type: "error",
              duration: 5000,
              onClose: () => { this.hasError[element] = false }
            })
            throw false;
          }
        });
        return true;
      } catch(err) {
        // console.log(err);
        return false;
      }
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
#account-circles-setup {
  width: 96%;
  max-width: 940px;
  min-height: calc(100vh - 240px);
}
.account-circles-setup-form {
  min-height: 320px;
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
