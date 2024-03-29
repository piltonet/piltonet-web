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
              Enter the circle name. Choose a unique and meaningful name for your circle.
            </p>
          </template>

          <!-- Number of Members -->
          <template v-if="tabIndex == 1">
            <div class="row">
              <div class="col-12 col-xl-5">
                <label for="circleMinMembers" class="input-label mt-2">
                  Circle Size
                  <span class="input-label-small">(Required)</span>
                </label>
                <input
                  :disabled="circleInfo.circle_joined_members"
                  ref="circle_size"
                  id="circleMinMembers"
                  type="number"
                  placeholder="e.g. 5"
                  class="tiny-input mb-0"
                  :class="hasError['circle_size'] ? 'has-error' : ''"
                  aria-describedby="circleMinMembersHelp"
                  v-model="circleInfo.circle_size"
                />
                <p id="circleMinMembersHelp" class="help-text pt-2 mb-3">
                  {{ `Enter the number of circle members, between ${minMembers} and ${maxMembers} people.`}}
                </p>
              </div>
              <!-- To Do -->
              <!-- <div v-if="circleInfo.circle_winners_order != 'fixed'" class="col-12 col-xl-7"> -->
              <div class="col-12 col-xl-7">
                <!-- Additional Members -->
                <label for="circleMaxMembers" class="input-label mt-2">
                  Additional Members Limit
                  <span class="input-label-small">(Default 0)</span>
                </label>
                <input
                  :disabled="circleInfo.circle_joined_members"
                  ref="circle_extra_members"
                  id="circleExtraMembers"
                  type="number"
                  placeholder="e.g. 0"
                  class="tiny-input mb-0"
                  :class="hasError['circle_extra_members'] ? 'has-error' : ''"
                  aria-describedby="circleMaxMembersHelp"
                  v-model="circle_extra_members"
                />
                <p id="circleExtraMembersHelp" class="help-text pt-2 mb-3">
                  Enter the number of extra members allowed, up to 20% of the circle size, rounded down.
                </p>
              </div>
            </div>
          </template>
          
          <!-- Fixed Pay -->
          <template v-if="tabIndex == 1">
            <label v-if="circleInfo.circle_payment_type == 'fixed_pay'" for="circleFixedAmount" class="input-label mt-2">
              Round Payments
              <span class="input-label-small">(Required)</span>
            </label>
            <label v-if="circleInfo.circle_payment_type == 'fixed_loan'" for="circleFixedAmount" class="input-label mt-2">
              Loan Amount
              <span class="input-label-small">(Required)</span>
            </label>
            <div class="d-flex flex-row justify-content-start align-items-center">
              <input
                :disabled="circleInfo.circle_joined_members"
                ref="circle_round_payments"
                id="circleFixedAmount"
                type="number"
                step="any"
                :placeholder="circleInfo.circle_payment_type == 'fixed_loan' ?
                  (!parseInt(circleInfo.circle_size) || parseInt(circleInfo.circle_size) < minMembers || parseInt(circleInfo.circle_size) > maxMembers ?
                  `e.g. ${minRoundPayment * 5}` :
                  `${minRoundPayment * parseInt(circleInfo.circle_size)} to ${maxRoundPayment * parseInt(circleInfo.circle_size)}`) :
                  `${minRoundPayment} to ${maxRoundPayment}`"
                class="smaller-input mb-0"
                :class="hasError['circle_round_payments'] ? 'has-error' : ''"
                aria-describedby="circleFixedAmountHelp"
                v-model="circleInfo.circle_round_payments"
              />
              <SvgPaymentToken
                :chainId="circleInfo.circle_chain_id"
                :paymentToken="circleInfo.circle_payment_token"
                :tooltip="false"
                :height="16"
                customClass="mt-1 ms-2 me-1"
              />
              <p v-if="circleInfo.circle_payment_type == 'fixed_pay'" class="info-text mt-1">{{ `${tokenSymbol} / ${circleRound}` }}</p>
              <p v-if="circleInfo.circle_payment_type == 'fixed_loan'" class="info-text mt-1">{{ tokenSymbol }}</p>
            </div>

            <p v-if="circleInfo.circle_payment_type == 'fixed_pay'" id="circleFixedAmountHelp" class="help-text pt-2 mb-3">
              Enter the fixed amount that each participant will contribute in every round.
            </p>
            <p v-if="circleInfo.circle_payment_type == 'fixed_loan'" id="circleFixedAmountHelp" class="help-text pt-2 mb-3">
              The fixed amount of loan that the winner receives.
            </p>
          </template>

          <!-- Round Winners Quantity -->
          <template v-if="tabIndex == 1">
            <label for="circleWinnersNumber" class="input-label mt-2">
              Round Winners
              <span class="input-label-small">(Default 1)</span>
            </label>
            <input
              :disabled="circleInfo.circle_joined_members"
              ref="circle_winners_number"
              id="circleWinnersNumber"
              type="number"
              placeholder="e.g. 1"
              min="1"
              :max="Math.max(parseInt(circleInfo.circle_size /  3), 1)"
              step="1"
              class="tiny-input mb-0"
              :class="hasError['circle_winners_number'] ? 'has-error' : ''"
              aria-describedby="circleWinnersNumberHelp"
              v-model="circleInfo.circle_winners_number"
            />
            <p id="circleWinnersNumberHelp" class="help-text pt-2 mb-3">
              Enter the number of winners chosen per round.
            </p>
          </template>

          <!-- Save Button -->
          <template v-if="tabIndex == 1">
            <input
              v-if="circleInfo.circle_status == 'deployed'"
              type="submit"
              value="SETUP"
              @click="updateCircle"
            />
            <input
              v-else-if="circleInfo.circle_status == 'setuped'"
              type="submit"
              value="UPDATE"
              @click="updateCircle"
            />
          </template>

        </form>
      </div>
      <form action=""></form>
    </div>
  </div>

  <NotFound v-else />

</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { abi, api } from "@/services";
import NotFound from '@/pages/NotFound.vue';

// const { LendingCircleContract } = require('@/contracts');

export default {
  name: "AccountCirclesCreateSetup",
  components: {
    NotFound
  },
  props: {
    circleInfoProps: Object,
    circleConstProps: Object
  },
  data() {
    return {
      tabIndex: 1,
      circleInfo: this.circleInfoProps,
      circle_extra_members: 0,
      paymentToken: null,
      tokenSymbol: '',
      circleRound: '',
      minFixedAmount: 0,
      maxFixedAmount: 0,
      minRoundPayment: 0,
      maxRoundPayment: 0,
      minMembers: 0,
      maxMembers: 0,
      hasError: {
        circle_name: false,
        circle_size: false,
        circle_extra_members: false,
        circle_round_payments: false,
        circle_winners_number: false
      }
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
  },
  watch: {
    circleInfoProps: function () {
      this.setup();
    },
    circleConstProps: function () {
      this.setupConst();
    }
  },
  methods: {
    ...mapMutations(['setConnectionStore', 'setProfileStore']),
    async setup() {
      this.circleInfo = this.circleInfoProps;
      if(this.circleInfo) {
        // To Do
        this.circle_extra_members = parseInt(this.circleInfo.circle_max_members) - parseInt(this.circleInfo.circle_size);
        
        if(this.circleInfo.circle_round_days == 7) {
          this.circleRound = 'Weekly';
        } else if(this.circleInfo.circle_round_days == 14) {
          this.circleRound = 'Biweekly';
        } else if(this.circleInfo.circle_round_days == 30) {
          this.circleRound = 'Monthly';
        } else {
          this.circleRound = `${this.circleInfo.circle_round_days} days`;
        }
        if(this.circleInfo.circle_status == 'deployed') {
          this.circleInfo['circle_name'] = '';
          this.circleInfo['circle_round_payments'] = '';
          this.circleInfo['circle_size'] = '';
          this.circleInfo['circle_max_members'] = '';
          this.circleInfo['circle_winners_number'] = 1;
          this.circleInfo['circle_start_date'] = '';
        }
      }
      this.setupConst();
    },
    async setupConst() {
      if(this.circleConstProps) {
        this.paymentToken = this.circleConstProps['CIRCLES_PAYMENT_TOKENS'][this.utils.toString(this.circleInfo.circle_payment_token)];
        this.tokenSymbol = this.paymentToken['TOKEN_SYMBOL'];
        const tokenDecimals = this.paymentToken['TOKEN_DECIMALS'];
        this.minRoundPayment = this.paymentToken['MIN_ROUND_PAY'] / 10**tokenDecimals;
        this.maxRoundPayment = this.paymentToken['MAX_ROUND_PAY'] / 10**tokenDecimals;
        this.minMembers = this.circleConstProps['CIRCLES_MIN_MEMBERS'];
        this.maxMembers = this.circleConstProps['CIRCLES_MAX_MEMBERS'];
      }
    },
    async updateCircle() {
      if(this.checkForm()) {
        try {
          // To Do
          this.circleInfo.circle_max_members = (parseInt(this.circleInfo.circle_size) + this.circle_extra_members).toString();

          const tokenDecimals = this.paymentToken['TOKEN_DECIMALS'];
          const setupArgs = [
            this.circleInfo.circle_name,
            (parseInt(this.circleInfo.circle_round_payments * 10**tokenDecimals)).toString(),
            parseInt(this.circleInfo.circle_size),
            parseInt(this.circle_extra_members),
            parseInt(this.circleInfo.circle_winners_number)
          ];

          const contract = await abi.setAbi(
            this.accountProfile.account_tba_address, // sender tba address
            "ERC6551Account"
          );
          // execute TLCC updateCircle
          let abiResponse = await contract.interaction("executeFunction", [
            "TLCC", // contract name
            "updateCircle", // function name
            ["function updateCircle(string memory circle_name, string memory fixed_amount, uint8 min_members, uint8 max_members, uint8 winners_number)"], // function ABI
            setupArgs, // function args
            0, // value
            this.circleInfo.circle_id // Contract Address
          ]);
          if(abiResponse.done) {
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
      // To Do
      this.circleInfo['circle_extra_members'] = this.circle_extra_members;

      if(this.circleInfo.circle_payment_type == 'fixed_pay') {
        this.minFixedAmount = this.minRoundPayment;
        this.maxFixedAmount = this.maxRoundPayment;
      } else {
        this.minFixedAmount = this.minRoundPayment * parseInt(this.circleInfo.circle_size);
        this.maxFixedAmount = this.maxRoundPayment * parseInt(this.circleInfo.circle_size);
      }

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
          if(element == 'circle_size') {
            this.circleInfo[element] = parseInt(this.circleInfo[element]);
            if(this.circleInfo[element] < this.minMembers || this.circleInfo[element] > this.maxMembers) {
              this.$refs[element].focus();
              this.hasError[element] = true;
              this.notif({
                message: `The circle size should be between ${this.minMembers} and ${this.maxMembers}.`,
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 5000,
                onClose: () => { this.hasError[element] = false }
              })
              throw false;
            }
          }
          if(element == 'circle_extra_members') {
            this.circleInfo[element] = parseInt(this.circleInfo[element]);
            if(this.circleInfo[element] < 0 || this.circleInfo[element] > parseInt(this.circleInfo['circle_size'] * 0.2)) {
              this.$refs[element].focus();
              this.hasError[element] = true;
              this.notif({
                message: `The extra number of members should be up to 20% of the circle size, rounded down`,
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 5000,
                onClose: () => { this.hasError[element] = false }
              })
              throw false;
            }
          }
          if(element == 'circle_round_payments') {
            const tokenDecimals = this.paymentToken['TOKEN_DECIMALS'];
            this.circleInfo[element] = parseInt(this.circleInfo[element] * 10**2) / 10**2;
            if(parseInt(this.circleInfo[element] * 10**tokenDecimals) < this.minFixedAmount * 10**tokenDecimals
              || parseInt(this.circleInfo[element] * 10**tokenDecimals) > this.maxFixedAmount * 10**tokenDecimals) {
              this.$refs[element].focus();
              this.hasError[element] = true;
              this.notif({
                message: `The ${this.circleInfo.circle_payment_type == 'fixed_pay' ?  `round payments` : 'loan amount'} should be between ${this.minFixedAmount} and ${this.maxFixedAmount} ${this.tokenSymbol}.`,
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 5000,
                onClose: () => { this.hasError[element] = false }
              })
              throw false;
            }
          }
          if(element == 'circle_winners_number' && (parseInt(this.circleInfo['circle_size'] / this.circleInfo[element]) < this.minMembers)) {
            this.$refs[element].focus();
            this.hasError[element] = true;
            this.notif({
              message: 'The number of winners is high compared to the minimum number of participants.',
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
