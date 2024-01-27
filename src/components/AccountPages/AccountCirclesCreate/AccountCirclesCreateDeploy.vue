<template>
  <div v-if="circleInfo" id="account-circles-deploy" class="row">
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
      <h3 v-if="circleInfo.circle_id">CIRCLE CONTRACT</h3>
      <h3 v-else>SETUP & DEPLOY</h3>
      <div class="account-circles-deploy-form">
        <form @submit.prevent>

          <!-- Circle Contract Chain -->
          <template v-if="tabIndex == 1">
            <label for="circleContractChain" class="input-label">Blockchain</label>
            <button class="account-circles-deploy-button selected locked">
              <SvgPaymentToken
                :chainId="circleInfo.circle_chain_id"
                :paymentToken="defaultchain.nativeCurrency.address"
                :tooltip="false"
                customClass="m-1"
              />
              <p>{{ defaultchain.chainName }}</p>
              <i class="fa fa-lock ps-2" aria-hidden="true"></i>
            </button>
            <p id="circleContractChainHelp" class="help-text pt-2 mb-3">
              All transactions will be done on this chain.
            </p>
          </template>

          <!-- Circle Payment Token -->
          <template v-if="tabIndex == 1">
            <label for="circlePaymentToken" class="input-label mt-2">
              Payment Token
            </label>
            <button
              class="account-circles-deploy-button"
              :class="circleInfo.circle_payment_token == defaultchain.nativeCurrency.address ? (circleInfo.circle_id ? 'selected locked' : 'selected') : (circleInfo.circle_id ? 'd-none' : '')"
              @click="circleInfo.circle_payment_token = defaultchain.nativeCurrency.address; setupConst();"
            >
              <SvgPaymentToken
                :chainId="circleInfo.circle_chain_id"
                :paymentToken="defaultchain.nativeCurrency.address"
                :tooltip="false"
                customClass="m-1"
              />
              <p>{{ defaultchain.nativeCurrency.symbol }}</p>
            </button>
            <button
              class="account-circles-deploy-button mt-2"
              :class="circleInfo.circle_payment_token == defaultchain.CUSD.address ? (circleInfo.circle_id ? 'selected locked' : 'selected') : (circleInfo.circle_id ? 'd-none' : '')"
              @click="circleInfo.circle_payment_token = defaultchain.CUSD.address; setupConst();"
            >
              <SvgPaymentToken
                :chainId="circleInfo.circle_chain_id"
                :paymentToken="defaultchain.CUSD.address"
                :tooltip="false"
                customClass="m-1"
              />
              <p>{{ defaultchain.CUSD.symbol }}</p>
            </button>
            <p id="circlePaymentTokenHelp" class="help-text pt-2 mb-3">
              This token is used to pay contributions and receive loans.
            </p>
          </template>

          <!-- Circle Name -->
          <template v-if="tabIndex == 2">
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

          <!-- Circle Size -->
          <template v-if="tabIndex == 2">
            <label for="circleSize" class="input-label mt-2">
              Circle Size
              <span class="input-label-small">(Required)</span>
            </label>
            <input
              ref="circle_size"
              id="circleSize"
              type="number"
              placeholder="e.g. 5"
              class="tiny-input mb-0"
              :class="hasError['circle_size'] ? 'has-error' : ''"
              aria-describedby="circleSizeHelp"
              v-model="circleInfo.circle_size"
            />
            <p id="circleSizeHelp" class="help-text pt-2 mb-3">
              {{ `Enter the number of circle members, between ${minMembers} and ${maxMembers} people.`}}
            </p>
          </template>

          <!-- Round Duration -->
          <template v-if="tabIndex == 30">
            <label for="circleRoundDays" class="input-label">
              Round Duration
            </label>
            <button
              class="account-circles-deploy-button"
              :class="circleInfo.circle_round_days == 7 ? (circleInfo.circle_id ? 'selected locked' : 'selected') : (circleInfo.circle_id ? 'd-none' : '')"
              @click="circleInfo.circle_round_days = 7"
            >
              <p>Weekly (7 days)</p>
            </button>
            <button
              class="account-circles-deploy-button"
              :class="circleInfo.circle_round_days == 14 ? (circleInfo.circle_id ? 'selected locked' : 'selected') : (circleInfo.circle_id ? 'd-none' : '')"
              @click="circleInfo.circle_round_days = 14"
            >
              <p>Biweekly (14 days)</p>
            </button>
            <button
              class="account-circles-deploy-button mt-2"
              :class="circleInfo.circle_round_days == 30 ? (circleInfo.circle_id ? 'selected locked' : 'selected') : (circleInfo.circle_id ? 'd-none' : '')"
              @click="circleInfo.circle_round_days = 30"
            >
              <p>Monthly (30 days)</p>
            </button>
            <p id="circleRoundDaysHelp" class="help-text pt-2 mb-3">
              Select the duration of each round, indicating the frequency as weekly, biweekly, or monthly.<br>
              The input specifies the duration of each round in days based on the selected frequency.
            </p>
          </template>
          
          <!-- Round Duration -->
          <template v-if="tabIndex == 3">
            <label for="circleRoundDays" class="input-label">
              Round Duration
              <span class="input-label-small">(Required)</span>
            </label>
            <input
              ref="circle_round_days"
              id="circleRoundDays"
              type="number"
              placeholder="e.g. 30"
              class="tiny-input mb-0"
              :class="hasError['circle_round_days'] ? 'has-error' : ''"
              aria-describedby="circleRoundDaysHelp"
              v-model="circleInfo.circle_round_days"
            />
            <p id="circleRoundDaysHelp" class="help-text pt-2 mb-3">
              Enter the duration of each round in days.
            </p>
          </template>

          <!-- Round Payments -->
          <template v-if="tabIndex == 3">
            <label for="circleRoundPayments" class="input-label mt-2">
              Round Payments
              <span class="input-label-small">(Required)</span>
            </label>
            <div class="d-flex flex-row justify-content-start align-items-center">
              <input
                ref="circle_round_payments"
                id="circleRoundPayments"
                type="number"
                step="any"
                :placeholder="`${minRoundPayment} to ${maxRoundPayment}`"
                class="smaller-input mb-0"
                :class="hasError['circle_round_payments'] ? 'has-error' : ''"
                aria-describedby="circleRoundPaymentsHelp"
                v-model="circleInfo.circle_round_payments"
              />
              <SvgPaymentToken
                :chainId="circleInfo.circle_chain_id"
                :paymentToken="circleInfo.circle_payment_token"
                :tooltip="false"
                :height="16"
                customClass="mt-1 ms-2 me-1"
              />
              <p class="info-text mt-1">{{ tokenSymbol }}</p>
            </div>

            <p id="circleRoundPaymentsHelp" class="help-text pt-2 mb-3">
              Enter the fixed amount that each participant will contribute in every round.
            </p>
          </template>

          <!-- Winner Selection Method -->
          <template v-if="tabIndex == 4">
            <label for="circleWinnersOrder" class="input-label">Winner Selection Method</label>
            <button
              class="choosing-winners-button mb-2"
              :class="circleInfo.circle_winners_order == 'random' ? 'selected' : ''"
              @click="circleInfo.circle_winners_order = 'random'"
            >
            <p class="pt-2">
                <i class="fa fa-dice fa-xl" aria-hidden="true"></i>
                Random
              </p>
              <p class="help-text pt-1 px-1">Winners are chosen in each round at random</p>
            </button>
            <button
              class="choosing-winners-button mb-2"
              :class="circleInfo.circle_winners_order == 'fixed' ? 'selected' : ''"
              @click="circleInfo.circle_winners_order = 'fixed'"
            >
              <p class="ps-2 pt-2">
                <i class="fa fa-calendar-check fa-xl" aria-hidden="true"></i>
                FCFS
              </p>
              <p class="help-text pt-1 px-1">Members choose their desired round when joining the circle</p>
            </button>
            <button
              class="choosing-winners-button mb-2"
              :class="circleInfo.circle_winners_order == 'bidding' ? 'selected' : ''"
              @click="circleInfo.circle_winners_order = 'bidding'; circleInfo.circle_patience_benefit = 0"
            >
              <p class="ps-2 pt-2">
                <i class="fa fa-gavel fa-xl" aria-hidden="true"></i>
                Bidding
              </p>
              <p class="help-text pt-1 px-1">Members bid for the loan and the lowest bidder wins</p>
            </button>
          </template>

          <!-- Benefit Of Patience -->
          <template v-if="tabIndex == 5">
            <label for="circlePatienceBenefit" class="input-label">
              Patience Benefit
              <span v-if="circleInfo.circle_winners_order == 'bidding'" class="input-label-small">(Not available in bidding mode)</span>
              <span v-else class="input-label-small">(Default 0%)</span>
            </label>
            <div class="d-flex flex-row justify-content-start align-items-center">
              <input
                :disabled="circleInfo.circle_winners_order == 'bidding'"
                ref="circle_patience_benefit"
                id="circlePatienceBenefit"
                type="number"
                min=0.00
                :max="maxPatienceBenefit"
                step="0.01"
                placeholder="e.g. 18"
                class="tiny-input mb-0"
                :class="hasError['circle_patience_benefit'] ? 'has-error' : ''"
                aria-describedby="circlePatienceBenefitHelp"
                v-model="circleInfo.circle_patience_benefit"
              />
              <div
                v-if="circleInfo.circle_winners_order != 'bidding'"
                type="button"
                @click="patienceBenefitCalc"
                class="main-btn gray-bg middle-text ms-3 mt-2"
              >
                <span class="m-0 p-0">Calculator</span>
              </div>
            </div>
            <p id="circlePatienceBenefitHelp" class="help-text pt-2 mb-3">
              {{ `Percentage of benefits for members who win in subsequent rounds, up to ${maxPatienceBenefit}%.` }}
            </p>
          </template>

          <!-- Circle Creator Earnings -->
          <template v-if="tabIndex == 5">
            <div v-if="true">
              <label for="circleCreatorEarnings" class="input-label mt-2">
                Creator Earnings
                <span class="input-label-small">(Default 0%)</span>
              </label>
              <input
                ref="circle_creator_earnings"
                id="circleCreatorEarnings"
                type="number"
                min=0.00
                :max="maxCreatorEarnings"
                step="0.01"
                placeholder="e.g. 0.5"
                class="tiny-input mb-0"
                :class="hasError['circle_creator_earnings'] ? 'has-error' : ''"
                aria-describedby="circleCreatorEarningsHelp"
                v-model="circleInfo.circle_creator_earnings"
              />
              <p id="circleCreatorEarningsHelp" class="help-text pt-2 mb-3">
                {{ `You can earn a share of up to ${maxCreatorEarnings}% from each loan.` }}
              </p>
            </div>
          </template>
          
          <!-- Review & Deploy -->
          <template v-if="tabIndex == 6">
            <div class="row">
              <div class="col-12 col-md-6">
                <!-- Blockchain -->
                <div class="d-flex flex-column justify-content-center align-items-start mt-2">
                  <p class="note-text small">Blockchain</p>
                  <div class="d-flex flex-row justify-content-start align-items-center">
                    <SvgPaymentToken
                      :chainId="defaultchain.id"
                      :paymentToken="defaultchain.nativeCurrency.address"
                      :tooltip="false"
                      customClass="mt-1 pe-1"
                    />
                    <p class="top-text small mt-1">{{ defaultchain.chainName }}</p>
                    <i class="fa fa-lock info-text darkblue-text ps-2" aria-hidden="true"></i>
                  </div>
                </div>

                <!-- Payment Token -->
                <div class="d-flex flex-column justify-content-center align-items-start mt-2">
                  <p class="note-text small">Payment Token</p>
                  <div class="d-flex flex-row justify-content-start align-items-center">
                    <SvgPaymentToken
                      :chainId="circleInfo.circle_chain_id"
                      :paymentToken="circleInfo.circle_payment_token"
                      :tooltip="false"
                      customClass="mt-1 pe-1"
                    />
                    <p class="top-text small mt-1">{{ tokenSymbol }}</p>
                  </div>
                </div>
                
                <!-- Circle Name -->
                <div class="d-flex flex-column justify-content-center align-items-start mt-2">
                  <p class="note-text small">Circle Name</p>
                  <p class="top-text small mt-1">{{ circleInfo.circle_name }}</p>
                </div>
  
                <!-- Circle Size -->
                <div class="d-flex flex-column justify-content-center align-items-start mt-2">
                  <p class="note-text small">Circle Size</p>
                  <p class="top-text small mt-1">{{ circleInfo.circle_size }}
                    <span class="main-text tiny">people</span>
                  </p>
                </div>
  
                <!-- Round Duration -->
                <div class="d-flex flex-column justify-content-center align-items-start mt-2">
                  <p class="note-text small">Round Duration</p>
                  <p v-if="circleInfo.circle_round_days == 1" class="top-text small mt-1">Daily
                    <span class="main-text tiny">{{ `(${circleInfo.circle_round_days} day)` }}</span>
                  </p>
                  <p v-else-if="circleInfo.circle_round_days == 7" class="top-text small mt-1">Weekly
                    <span class="main-text tiny">{{ `(${circleInfo.circle_round_days} days)` }}</span>
                  </p>
                  <p v-else-if="circleInfo.circle_round_days == 14" class="top-text small mt-1">Biweekly
                    <span class="main-text tiny">{{ `(${circleInfo.circle_round_days} days)` }}</span>
                  </p>
                  <p v-else-if="circleInfo.circle_round_days == 30" class="top-text small mt-1">Monthly
                    <span class="main-text tiny">{{ `(${circleInfo.circle_round_days} days)` }}</span>
                  </p>
                  <p v-else class="top-text small mt-1">{{ circleInfo.circle_round_days }}
                    <span class="main-text tiny">days</span>
                  </p>
                </div>
              </div>
  
              <div class="col-12 col-md-6">
                <!-- Round Payments -->
                <div class="d-flex flex-column justify-content-center align-items-start mt-2">
                  <p class="note-text small">Round Payments</p>
                  <p class="top-text small mt-1">{{ utils.formatPrice(circleInfo.circle_round_payments) }}
                    <span class="main-text tiny">{{ tokenSymbol }}</span>
                  </p>
                </div>
                
                <!-- Winner Selection Method -->
                <div class="d-flex flex-column justify-content-center align-items-start mt-2">
                  <p class="note-text small">Winner Selection Method</p>
                  <p v-if="circleInfo.circle_winners_order == 'random'" class="top-text small mt-1">Random</p>
                  <p v-if="circleInfo.circle_winners_order == 'fixed'" class="top-text small mt-1">FCFS</p>
                  <p v-if="circleInfo.circle_winners_order == 'bidding'" class="top-text small mt-1">Bidding</p>
                </div>

                <!-- Patience Benefit -->
                <div class="d-flex flex-column justify-content-center align-items-start mt-2">
                  <p class="note-text small">Patience Benefit</p>
                  <p class="top-text small mt-1">{{ utils.formatPrice(circleInfo.circle_patience_benefit) }}
                    <span class="main-text tiny">%</span>
                  </p>
                </div>
  
                <!-- Creator Earnings -->
                <div class="d-flex flex-column justify-content-center align-items-start mt-2">
                  <p class="note-text small">Creator Earnings</p>
                  <p class="top-text small mt-1">{{ utils.formatPrice(circleInfo.circle_creator_earnings) }}
                    <span class="main-text tiny">%</span>
                  </p>
                </div>
                
                <!-- Service Charge -->
                <div class="d-flex flex-column justify-content-center align-items-start mt-2">
                  <p class="note-text small">Service Charge</p>
                  <p class="top-text small mt-1">{{ circleInfo.circle_service_charge / 100 }}
                    <span class="main-text tiny">{{ `(${circleInfo.circle_service_charge}%)` }}</span>
                    <i class="fa fa-lock info-text darkblue-text ps-2" aria-hidden="true"></i>
                  </p>
                  <p class="note-text tiny">
                    Service charge rate that is deducted from the loan amount.
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Contract Address -->
            <div v-if="circleInfo.circle_id" class="d-flex flex-column justify-content-center align-items-start mt-3">
              <p class="note-text">Contract Address</p>
              <p class="top-text small mt-2">
                {{ utils.truncate(circleInfo.circle_id, 23) }}
                <span class="main-text tiny">
                  <!-- Copy Icon -->
                  <el-tooltip
                    :content="copyAddressTooltip"
                    placement="top"
                    :hide-after="0"
                  >
                    <a
                      id="copy-contract-address"
                      role="button"
                      @click="copyAddress('copy-contract-address', circleInfo.circle_id)"
                      class="ms-2"
                    >
                      <i class="far fa-copy" aria-hidden="true"></i>
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
                      <i class="fa fa-external-link" aria-hidden="true"></i>
                    </a>
                  </el-tooltip>
                </span>
              </p>
            </div>
          </template>
        </form>
      </div>
      <form action=""></form>

      <!-- Previous & Next -->
      <div v-if="!circleInfo.circle_id" class="d-flex flex-row justify-content-start align-items-center mt-4">
        <div class="d-flex flex-row justify-content-center align-items-center">
          <div
            type="button"
            @click="tabIndex = 1"
            class="main-btn blue-bg middle-text me-2"
            :class="tabIndex == 6 ? '' : 'd-none'"
          >
            <span class="m-0 p-0">Back to Edit</span>
          </div>
          <div
            type="button"
            @click="tabIndex = tabIndex > 1 ? tabIndex - 1 : 1"
            class="main-btn blue-bg middle-text me-2"
            :class="tabIndex == 1 || tabIndex == 6 ? 'd-none' : ''"
          >
            <span class="m-0 p-0">Previous</span>
          </div>
          <div
            type="button"
            @click="tabIndex = tabIndex < 5 ? tabIndex + 1 : 5"
            class="main-btn blue-bg middle-text"
            :class="tabIndex < 5 ? '' : 'd-none'"
          >
            <span class="m-0 p-0">Next</span>
          </div>
          <div
            type="button"
            @click="checkForm() ? tabIndex = 6 : ''"
            class="main-btn darkblue-bg"
            :class="tabIndex == 5 ? 'd-md-flex' : 'd-none'"
          >
            <span class="m-0 p-0">Review & Deploy</span>
          </div>
          <div
            type="button"
            @click="deployCircle"
            class="main-btn green-bg"
            :class="tabIndex == 6 ? '' : 'd-none'"
          >
            <span class="m-0 p-0">DEPLOY CIRCLE</span>
          </div>
        </div>
      </div>
      
    </div>
  </div>

  <NotFound v-else />

  <PatienceBenefitCalcModal
    ref="calc_modal"
    @get-balance="getBalance"
  />

</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { abi, api } from "@/services";
import NotFound from '@/pages/NotFound.vue';
import wallets from "@/wallets";
import PatienceBenefitCalcModal from "@/components/CustomModals/PatienceBenefitCalcModal.vue";

export default {
  name: "AccountCirclesCreateDeploy",
  components: {
    PatienceBenefitCalcModal,
    NotFound
  },
  props: {
    circleInfoProps: Object,
    circleConstProps: Object
  },
  emits: ["setActivePage"],
  data() {
    return {
      tabIndex: 1,
      circleInfo: null,
      paymentToken: null,
      tokenSymbol: '',
      tokenDecimals: 0,
      minMembers: 0,
      maxMembers: 0,
      minRoundPayment: 0,
      maxRoundPayment: 0,
      maxPatienceBenefit: 0,
      maxCreatorEarnings: 0,
      hasError: {
        circle_name: false,
        circle_size: false,
        circle_round_days: false,
        circle_round_payments: false,
        circle_patience_benefit: false,
        circle_creator_earnings: false
      },
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
      if(this.circleInfoProps) {
        this.circleInfo = this.circleInfoProps;
        this.explorerLink = `${this.defaultchain.blockExplorerUrl}/address/${this.circleInfo.circle_id}`;
        this.tabIndex = 6;
      } else {
        // New Circle
        this.circleInfo = {
          circle_id: null,
          circle_creator_tba: this.accountProfile.account_tba_address,
          circle_chain_id: this.defaultchain.id,
          circle_payment_token: this.defaultchain.CUSD.address,
          circle_payment_type: 'fixed_pay', // To Do
          circle_name: '',
          circle_size: '',
          circle_round_days: '',
          circle_round_payments: '',
          circle_winners_order: 'random',
          circle_winners_number: 1, // To Do
          circle_patience_benefit: 0,
          circle_creator_earnings: 0
        }
      }
      this.setupConst();
    },
    async setupConst() {
      if(this.circleConstProps) {
        this.paymentToken = this.circleConstProps['CIRCLES_PAYMENT_TOKENS'][this.utils.toString(this.circleInfo.circle_payment_token)];
        this.tokenSymbol = this.paymentToken['TOKEN_SYMBOL'];
        this.tokenDecimals = this.paymentToken['TOKEN_DECIMALS'];
        this.minRoundPayment = this.paymentToken['MIN_ROUND_PAY'] / 10**this.tokenDecimals;
        this.maxRoundPayment = this.paymentToken['MAX_ROUND_PAY'] / 10**this.tokenDecimals;
        this.minMembers = this.circleConstProps['CIRCLES_MIN_MEMBERS'];
        this.maxMembers = this.circleConstProps['CIRCLES_MAX_MEMBERS'];
        this.maxPatienceBenefit = this.circleConstProps['CIRCLES_MAX_PATIENCE_BENEFIT_X10000'] / 100;
        this.maxCreatorEarnings = this.circleConstProps['CIRCLES_MAX_CREATOR_EARNINGS_X10000'] / 100;
        this.circleInfo['circle_service_charge'] = this.circleConstProps['CIRCLES_SERVICE_CHARGE_X10000'] / 100;
        this.circleInfo['circle_service_address'] = this.circleConstProps['PILTONET_SERVICE_ADMIN'];
      }
    },
    async deployCircle() {
      if(this.checkForm()) {
        const deployArgs = [[
          this.accountProfile.account_tba_address,
          this.circleInfo.circle_payment_token,
          this.circleInfo.circle_name,
          parseInt(this.circleInfo.circle_size),
          parseInt(this.circleInfo.circle_round_days),
          (parseInt(this.circleInfo.circle_round_payments * 10**this.tokenDecimals)).toString(),
          this.circleInfo.circle_winners_order == 'random' ? 0 : this.circleInfo.circle_winners_order == 'fixed' ? 1 : 2,
          parseInt(this.circleInfo.circle_patience_benefit * 100),
          parseInt(this.circleInfo.circle_creator_earnings * 100)
        ]];

        const contract = await abi.setAbi(
          "0x", // deploy new contract
          "DeployCustomContract"
        );
        // deploy TLCC
        let abiResponse = await contract.interaction('deployTLCC', deployArgs);
        if(abiResponse.done) {
          this.circleInfo.circle_id = abiResponse.result.target;
          let apiResponse = await api.post_account_circles_creator_create(this.circleInfo);
          if(apiResponse.data.done) {
            this.circleInfo = apiResponse.data.result[0];
            this.notif({
              title: "SUCCESS!",
              message: apiResponse.data.message,
              dangerouslyUseHTMLString: true,
              type: apiResponse.data.message_type,
              duration: 3000,
              onClose: () => { this.$emit('setActivePage', 'whitelist', this.circleInfo.circle_id, true) }
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
      }
    },
    async deployCircleByService() {
      if(this.checkForm()) {
        const deployArgs = [[
          this.circleInfo.circle_payment_token,
          this.circleInfo.circle_round_days,
          this.circleInfo.circle_creator_earnings * 100
        ]];

        let personalSign = await this.personalSign();
        if(personalSign) {
          // this.circleInfo.circle_id = abiResponse.result.target;
          // let apiResponse = await api.post_account_circles_creator_create(this.circleInfo);
          let apiResponse = await api.post_account_circles_creator_create_by_service(deployArgs);
          if(apiResponse.data.done) {
            this.circleInfo = apiResponse.data.result[0];
            this.notif({
              title: "SUCCESS!",
              message: apiResponse.data.message,
              dangerouslyUseHTMLString: true,
              type: apiResponse.data.message_type,
              duration: 3000,
              onClose: () => { this.$emit('setActivePage', 'whitelist', this.circleInfo.circle_id, true) }
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
      }
    },
    async patienceBenefitCalc() {
      this.$refs.calc_modal.setCalculator(this.circleInfo, this.circleConstProps);
    },
    checkForm() {
      try {
        Object.keys(this.hasError).forEach(element => {
          if(element == 'circle_name') {
            if(this.circleInfo[element] == null || this.circleInfo[element].length <= 0) {
              this.tabIndex = 2;
              if(this.$refs[element]) this.$refs[element].focus();
              this.hasError[element] = true;
              this.notif({
                message: "Make sure all required fields are filled in correctly.",
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 3000,
                onClose: () => { this.hasError[element] = false }
              })
              throw false;
            }
          }
          if(element == 'circle_size') {
            this.circleInfo[element] = parseInt(this.circleInfo[element]);
            if(!this.circleInfo[element] || this.circleInfo[element] < this.minMembers || this.circleInfo[element] > this.maxMembers) {
              this.tabIndex = 2;
              if(this.$refs[element]) this.$refs[element].focus();
              this.hasError[element] = true;
              this.notif({
                message: `The circle size should be between ${this.minMembers} and ${this.maxMembers}.`,
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 3000,
                onClose: () => { this.hasError[element] = false }
              })
              throw false;
            }
          }
          if(element == 'circle_round_days') {
            this.circleInfo[element] = parseInt(this.circleInfo[element]);
            if(!this.circleInfo[element]) {
              this.tabIndex = 3;
              if(this.$refs[element]) this.$refs[element].focus();
              this.hasError[element] = true;
              this.notif({
                message: "The duration of the round should be a minimum of 1 day.",
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 3000,
                onClose: () => { this.hasError[element] = false }
              })
              throw false;
            }
          }
          if(element == 'circle_round_payments') {
            this.circleInfo[element] = isNaN(parseInt(this.circleInfo[element])) ? '' : parseInt(this.circleInfo[element] * 100) / 100;
            if(isNaN(parseInt(this.circleInfo[element])) || this.circleInfo[element] < this.minRoundPayment || this.circleInfo[element] > this.maxRoundPayment) {
              this.tabIndex = 3;
              if(this.$refs[element]) this.$refs[element].focus();
              this.hasError[element] = true;
              this.notif({
                message: `The round payments should be between ${this.minRoundPayment} and ${this.maxRoundPayment} ${this.tokenSymbol}.`,
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 3000,
                onClose: () => { this.hasError[element] = false }
              })
              throw false;
            }
          }
          if(element == 'circle_patience_benefit') {
            this.circleInfo[element] = parseInt(this.circleInfo[element] * 100) ? parseInt(this.circleInfo[element] * 100) / 100 : 0;
            if(this.circleInfo[element] < 0 || this.circleInfo[element] > this.maxPatienceBenefit) {
              this.tabIndex = 5;
              if(this.$refs[element]) this.$refs[element].focus();
              this.hasError[element] = true;
              this.notif({
                message: `The benefit of patience should be between 0% and ${this.maxPatienceBenefit}%.`,
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 3000,
                onClose: () => { this.hasError[element] = false }
              })
              throw false;
            }
          }
          if(element == 'circle_creator_earnings') {
            this.circleInfo[element] = parseInt(this.circleInfo[element] * 100) ? parseInt(this.circleInfo[element] * 100) / 100 : 0;
            if(this.circleInfo[element] < 0 || this.circleInfo[element] > this.maxCreatorEarnings) {
              this.tabIndex = 5;
              if(this.$refs[element]) this.$refs[element].focus();
              this.hasError[element] = true;
              this.notif({
                message: `The creator earnings should be between 0% and ${this.maxCreatorEarnings}%.`,
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 3000,
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
    async personalSign() {
      let personalSignResult = await wallets[this.connectedAccount.connected_wallet].personalSign(
        "This request requires your signature. It won't cost you anything." +
          `\nTimestamp: ${new Date().getTime()}`,
        this.connectedAccount.account_address,
				null
      );
      return personalSignResult;
    },
    async copyAddress(elementId, copyContent) {
      navigator.clipboard.writeText(copyContent);
      document.getElementById(elementId).innerHTML = '<i class="fa fa-check" style="color: lightgreen;" aria-hidden="true"></i>'
      this.copyAddressTooltip = "Copied To Clipboard";
      setTimeout(() => {
          this.copyAddressTooltip = "Copy Address";
          document.getElementById(elementId).innerHTML = '<i class="far fa-copy" aria-hidden="true"></i>';
        }, 2000);
    }
  }
}
</script>

<style lang="scss" scoped>
#account-circles-deploy {
  width: 96%;
  max-width: 940px;
  min-height: calc(100vh - 240px);
}
.account-circles-deploy-form {
  min-height: 320px;
}
.account-circles-deploy-button {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
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
.account-circles-deploy-button.selected {
  color: var(--ptn-second-blue);
  border: 1px solid var(--ptn-second-blue);
  cursor: default;
}
.account-circles-deploy-button.locked {
  color: rgba(var(--ptn-second-blue-rgb), 0.7) !important;
  border: 1px solid rgba(var(--ptn-second-blue-rgb), 0.7) !important;
}
.account-circles-deploy-review {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: rgba(var(--ptn-color-rgb), 0.9);
  border: none;
  margin: 5px 0 0;
  padding: 0;
}

.choosing-winners-button,
.account-circles-setup-button {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: rgba(var(--ptn-blue-rgb), 0.3);
  background: var(--ptn-second-bg);
  border: 1px solid rgba(var(--ptn-color-rgb), 0.3);
  border-radius: 8px;
  width: 200px;
  height: 40px;
  margin: 5px 0 0;
  padding-left: 10px;
}
.choosing-winners-button {
  width: 250px;
  height: 70px;
}
.account-circles-setup-button.selected {
  color: var(--ptn-second-blue);
  cursor: default;
}
.account-circles-setup-button.locked {
  color: rgba(var(--ptn-second-blue-rgb), 0.7) !important;
}
.choosing-winners-button.selected {
  color: var(--ptn-second-blue);
  border: 1px solid var(--ptn-second-blue);
  cursor: default;
}
.choosing-winners-button p {
  color: var(--ptn-third-gray);
}
.choosing-winners-button.selected p {
  color: var(--ptn-second-blue);
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
