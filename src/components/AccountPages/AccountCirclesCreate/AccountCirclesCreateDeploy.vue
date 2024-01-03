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
      <h3 v-else>CREATE & DEPLOY</h3>
      <div class="account-circles-deploy-form">
        <form @submit.prevent>

          <!-- Circle Contract Chain -->
          <template v-if="tabIndex == 1">
            <label for="circleContractChain" class="input-label">Blockchain</label>
            <button class="account-circles-deploy-button selected locked">
              <SvgPaymentToken
                :chainId="circleInfo.circle_chain_id"
                :paymentToken="this.defaultchain.nativeCurrency.address"
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
              :class="circleInfo.circle_payment_token == this.defaultchain.nativeCurrency.address ? (circleInfo.circle_id ? 'selected locked' : 'selected') : (circleInfo.circle_id ? 'd-none' : '')"
              @click="circleInfo.circle_payment_token = this.defaultchain.nativeCurrency.address"
            >
              <SvgPaymentToken
                :chainId="circleInfo.circle_chain_id"
                :paymentToken="this.defaultchain.nativeCurrency.address"
                :tooltip="false"
                customClass="m-1"
              />
              <p>{{ defaultchain.nativeCurrency.symbol }}</p>
            </button>
            <button
              class="account-circles-deploy-button mt-2"
              :class="circleInfo.circle_payment_token == this.defaultchain.CUSD.address ? (circleInfo.circle_id ? 'selected locked' : 'selected') : (circleInfo.circle_id ? 'd-none' : '')"
              @click="circleInfo.circle_payment_token = this.defaultchain.CUSD.address"
            >
              <SvgPaymentToken
                :chainId="circleInfo.circle_chain_id"
                :paymentToken="this.defaultchain.CUSD.address"
                :tooltip="false"
                customClass="m-1"
              />
              <p>{{ this.defaultchain.CUSD.symbol }}</p>
            </button>
            <p id="circlePaymentTokenHelp" class="help-text pt-2 mb-3">
              This token is used to pay contributions and receive loans.
            </p>
          </template>

          <!-- Payment Type -->
          <template v-if="tabIndex == 2">
            <label for="circlePaymentType" class="input-label">Payment Type</label>
            <button
              class="account-circles-deploy-button"
              :class="circleInfo.circle_payment_type == 'fixed_pay' ? (circleInfo.circle_id ? 'selected locked' : 'selected') : (circleInfo.circle_id ? 'd-none' : '')"
              @click="circleInfo.circle_payment_type = 'fixed_pay'"
            >
              <p>Fixed Payment</p>
            </button>
            <button
              class="account-circles-deploy-button mt-2"
              :class="circleInfo.circle_payment_type == 'fixed_loan' ? (circleInfo.circle_id ? 'selected locked' : 'selected') : (circleInfo.circle_id ? 'd-none' : '')"
              @click="circleInfo.circle_payment_type = 'fixed_loan'"
            >
              <p>Fixed Loan</p>
            </button>
            <p v-if="circleInfo.circle_payment_type == 'fixed_pay'" id="circleRoundDaysHelp" class="help-text pt-2 mb-3">
              In the fixed payment type, the loan amount will be based on the number of members and other rules.
            </p>
            <p v-if="circleInfo.circle_payment_type == 'fixed_loan'" id="circleRoundDaysHelp" class="help-text pt-2 mb-3">
              In the fixed loan type, the contribution amount will be based on the number of members and other rules.
            </p>
          </template>

          <!-- Circle Round Days -->
          <template v-if="tabIndex == 3">
            <label for="circleRoundDays" class="input-label">
              Round Period
            </label>
            <button
              class="account-circles-deploy-button"
              :class="circleInfo.circle_round_days == 7 ? (circleInfo.circle_id ? 'selected locked' : 'selected') : (circleInfo.circle_id ? 'd-none' : '')"
              @click="circleInfo.circle_round_days = 7"
            >
              <p>Weekly (7 days)</p>
            </button>
            <button
              class="account-circles-deploy-button mt-2"
              :class="circleInfo.circle_round_days == 30 ? (circleInfo.circle_id ? 'selected locked' : 'selected') : (circleInfo.circle_id ? 'd-none' : '')"
              @click="circleInfo.circle_round_days = 30"
            >
              <p>Monthly (30 days)</p>
            </button>
            <p id="circleRoundDaysHelp" class="help-text pt-2 mb-3">
              Duration of each round in days.
            </p>
          </template>

          <!-- Order Of Winners -->
          <template v-if="tabIndex == 4">
            <label for="circleWinnersOrder" class="input-label">Order Of Winners</label>
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
                Fixed
              </p>
              <p class="help-text pt-1 px-1">Members select their position before starting the circle</p>
            </button>
            <button
              class="choosing-winners-button mb-2"
              :class="circleInfo.circle_winners_order == 'bidding' ? 'selected' : ''"
              @click="circleInfo.circle_winners_order = 'bidding'"
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
              <span class="input-label-small">(default 0%)</span>
            </label>
            <input
              :disabled="circleInfo.circle_joined_members"
              ref="circle_patience_benefit"
              id="circlePatienceBenefit"
              type="number"
              min=0.00
              :max="maxPatienceBenefit"
              step="0.01"
              placeholder="e.g. 10"
              class="small-input mb-0"
              :class="hasError['circle_patience_benefit'] ? 'has-error' : ''"
              aria-describedby="circlePatienceBenefitHelp"
              v-model="circleInfo.circle_patience_benefit"
            />
            <p id="circlePatienceBenefitHelp" class="help-text pt-2 mb-3">
              {{ `Benefit percentage for members who win later rounds, up to ${maxPatienceBenefit}%.` }}
            </p>
          </template>

          <!-- Circle Creator Earnings -->
          <template v-if="tabIndex == 5">
            <div v-if="true">
              <label for="circleCreatorEarnings" class="input-label mt-2">
                Creator Earnings
                <span class="input-label-small">(default 0%)</span>
              </label>
              <input
                ref="circle_creator_earnings"
                id="circleCreatorEarnings"
                type="number"
                min=0.00
                :max="maxCreatorEarnings"
                step="0.01"
                placeholder="e.g. 0.5"
                class="small-input mb-0"
                :class="hasError['circle_creator_earnings'] ? 'has-error' : ''"
                aria-describedby="circleCreatorEarningsHelp"
                v-model="circleInfo.circle_creator_earnings"
              />
              <p id="circleCreatorEarningsHelp" class="help-text pt-2 mb-3">
                {{ `Earnings of the circle creator, up to ${maxCreatorEarnings}%.` }}
              </p>
            </div>
          </template>
          
          <!-- Review & Deploy -->
          <div class="row">
            <div class="col-12 col-md-6">
              <!-- Blockchain -->
              <template v-if="tabIndex == 6">
                <label for="circleContractChain" class="input-label">Blockchain</label>
                <button class="account-circles-deploy-button selected locked">
                  <SvgPaymentToken
                    :chainId="circleInfo.circle_chain_id"
                    :paymentToken="this.defaultchain.nativeCurrency.address"
                    :tooltip="false"
                    customClass="m-1"
                  />
                  <p>{{ defaultchain.chainName }}</p>
                  <i class="fa fa-lock ps-2" aria-hidden="true"></i>
                </button>
              </template>
              
              <!-- Payment Token -->
              <template v-if="tabIndex == 6">
                <label for="circlePaymentToken" class="input-label mt-2">
                  Payment Token
                </label>
                <button
                  class="account-circles-deploy-button"
                  :class="circleInfo.circle_payment_token == this.defaultchain.nativeCurrency.address ? 'selected locked' : 'd-none'"
                >
                  <SvgPaymentToken
                    :chainId="circleInfo.circle_chain_id"
                    :paymentToken="this.defaultchain.nativeCurrency.address"
                    :tooltip="false"
                    customClass="m-1"
                  />
                  <p>{{ defaultchain.nativeCurrency.symbol }}</p>
                </button>
                <button
                  class="account-circles-deploy-button"
                  :class="circleInfo.circle_payment_token == this.defaultchain.CUSD.address ? 'selected locked' : 'd-none'"
                >
                  <SvgPaymentToken
                    :chainId="circleInfo.circle_chain_id"
                    :paymentToken="this.defaultchain.CUSD.address"
                    :tooltip="false"
                    customClass="m-1"
                  />
                  <p>{{ this.defaultchain.CUSD.symbol }}</p>
                </button>
              </template>

              <!-- Payment Type -->
              <template v-if="tabIndex == 6">
                <label for="circlePaymentType" class="input-label mt-2">Payment Type</label>
                <button
                  class="account-circles-deploy-button"
                  :class="circleInfo.circle_payment_type == 'fixed_pay' ? 'selected locked' : 'd-none'"
                >
                  <p>Fixed Payment</p>
                </button>
                <button
                  class="account-circles-deploy-button"
                  :class="circleInfo.circle_payment_type == 'fixed_loan' ? 'selected locked' : 'd-none'"
                >
                  <p>Fixed Loan</p>
                </button>
              </template>

              <!-- Round Period -->
              <template v-if="tabIndex == 6">
                <label for="circleRoundDays" class="input-label mt-2">Round Period</label>
                <button
                  class="account-circles-deploy-button"
                  :class="circleInfo.circle_round_days == 7 ? 'selected locked' : 'd-none'"
                >
                  <p>Weekly (7 days)</p>
                </button>
                <button
                  class="account-circles-deploy-button"
                  :class="circleInfo.circle_round_days == 30 ? 'selected locked' : 'd-none'"
                >
                  <p>Monthly (30 days)</p>
                </button>
              </template>
            </div>
            <div class="col-12 col-md-6">
              <!-- Order Of Winners -->
              <template v-if="tabIndex == 6">
                <label for="circlePaymentType" class="input-label">Order Of Winners</label>
                <button
                  class="account-circles-deploy-button"
                  :class="circleInfo.circle_winners_order == 'random' ? 'selected locked' : 'd-none'"
                >
                  <p>Random</p>
                </button>
                <button
                  class="account-circles-deploy-button"
                  :class="circleInfo.circle_winners_order == 'fixed' ? 'selected locked' : 'd-none'"
                >
                  <p>Fixed</p>
                </button>
                <button
                  class="account-circles-deploy-button"
                  :class="circleInfo.circle_winners_order == 'bidding' ? 'selected locked' : 'd-none'"
                >
                  <p>Bidding</p>
                </button>
              </template>

              <!-- Patience Benefit -->
              <template v-if="tabIndex == 6">
                <label for="circleServiceCharge" class="input-label mt-2">Patience Benefit</label>
                <button
                  class="account-circles-deploy-button selected locked"
                >
                  <p>{{ circleInfo.circle_patience_benefit }}%</p>
                </button>
              </template>
            
              <!-- Creator Earnings -->
              <template v-if="tabIndex == 6">
                <label for="circleServiceCharge" class="input-label mt-2">Creator Earnings</label>
                <button
                  class="account-circles-deploy-button selected locked"
                >
                  <p>{{ circleInfo.circle_creator_earnings }}%</p>
                </button>
              </template>
            
              <!-- Service Charge -->
              <template v-if="tabIndex == 6">
                <label for="circleServiceCharge" class="input-label mt-2">
                  Service Charge
                  <span class="input-label-small">(Fixed Rate)</span>
                </label>
                <button
                  class="account-circles-deploy-button selected locked"
                >
                  <p>{{ `${circleInfo.circle_service_charge / 100} (${circleInfo.circle_service_charge}%)` }}</p>
                  <i class="fa fa-lock ps-2" aria-hidden="true"></i>
                </button>
                <p id="circleServiceChargeHelp" class="help-text pt-1">
                  Service charge rate that is deducted from the loan amount.
                </p>
              </template>
            </div>
          </div>
          
          <!-- Contract Address -->
          <template v-if="tabIndex == 6">
            <div v-if="circleInfo.circle_id">
              <label for="contractAddress" class="input-label mt-2">Contract Address</label>
              <div class="row">
                <button
                  class="account-circles-deploy-button selected locked"
                >
                  <p>{{ utils.truncate(circleInfo.circle_id, 17) }}</p>
                </button>
                <div class="col-12 col-sm-3">
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
                  </div>
                </div>
              </div>
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
            class="main-btn blue-bg middle-text"
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
            @click="tabIndex = tabIndex < 6 ? tabIndex + 1 : 6"
            class="main-btn blue-bg middle-text"
            :class="tabIndex == 6 ? 'd-none' : ''"
          >
            <span class="m-0 p-0">Next</span>
          </div>
          <div
            type="button"
            @click="tabIndex = 6"
            class="main-btn darkblue-bg d-none ms-2"
            :class="tabIndex == 6 ? '' : 'd-md-flex'"
          >
            <span class="m-0 p-0">Review & Deploy</span>
          </div>
          <div
            type="button"
            @click="deployCircle"
            class="main-btn green-bg ms-2"
            :class="tabIndex == 6 ? '' : 'd-none'"
          >
            <span class="m-0 p-0">DEPLOY CIRCLE</span>
          </div>
        </div>
      </div>
      
    </div>
  </div>

  <NotFound v-else />

</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { ethers } from 'ethers';
import api from "@/services/api";
import abi from "@/services/abi";
import NotFound from '@/pages/NotFound.vue';
import wallets from "@/wallets";

export default {
  name: "AccountCirclesCreateDeploy",
  components: {
    NotFound
  },
  props: {
    circleInfoProps: Object
  },
  emits: ["setActivePage"],
  data() {
    return {
      tabIndex: 1,
      circleInfo: null,
      maxPatienceBenefit: process.env.VUE_APP_CIRCLES_MAX_PATIENCE_BENEFIT_X10000 / 100,
      maxCreatorEarnings: process.env.VUE_APP_CIRCLES_MAX_CREATOR_EARNINGS_X10000 / 100,
      hasError: {
        circle_creator_earnings: false,
        circle_patience_benefit: false
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
          circle_payment_type: 'fixed_pay',
          circle_round_days: 30,
          circle_winners_order: 'random',
          circle_patience_benefit: 0,
          circle_creator_earnings: 0,
          circle_service_charge: process.env.VUE_APP_CIRCLES_SERVICE_CHARGE_X10000 / 100,
          circle_service_address: process.env.VUE_APP_VICTION_SERVICE_ADMIN_ADDRESS
        }
      }
    },
    async deployCircle() {
      if(this.checkForm()) {
        const deployArgs = [[
          ethers.getAddress(this.accountProfile.account_tba_address),
          this.circleInfo.circle_payment_token,
          this.circleInfo.circle_payment_type == 'fixed_pay' ? 0 : 1,
          this.circleInfo.circle_round_days,
          this.circleInfo.circle_winners_order == 'random' ? 0 : this.circleInfo.circle_winners_order == 'fixed' ? 1 : 2,
          this.circleInfo.circle_patience_benefit * 100,
          this.circleInfo.circle_creator_earnings * 100
        ]];

        const provider = new ethers.BrowserProvider(wallets[this.connectedAccount.connected_wallet].getProvider() || window.ethereum);
        const signer = await provider.getSigner();
        const contract = abi.setAbi(
          "0x", // deploy new contract
          "DeployCustomContract",
          signer
        );
        // deploy TLCC
        let abiResponse = await contract.interaction('deployTLCC', deployArgs);
        if(!abiResponse.done) {
          this.notif({
            title: "OOPS!",
            message: abiResponse.message,
            dangerouslyUseHTMLString: true,
            type: abiResponse.message_type,
            duration: 3000,
          });
        } else {
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
              onClose: () => { this.$emit('setActivePage', 'setup', this.circleInfo.circle_id, true) }
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
    async deployCircleByService() {
      if(this.checkForm()) {
        const deployArgs = [[
          this.circleInfo.circle_payment_token,
          this.circleInfo.circle_round_days,
          this.circleInfo.circle_payment_type == 'fixed_pay' ? 0 : 1,
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
              onClose: () => { this.$emit('setActivePage', 'setup', this.circleInfo.circle_id, true) }
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
    checkForm() {
      try {
        Object.keys(this.hasError).forEach(element => {
          if(this.circleInfo[element] == null || this.circleInfo[element].length <= 0) {
            this.tabIndex = 5;
            if(this.$refs[element]) this.$refs[element].focus();
            this.hasError[element] = true;
            this.notif({
              message: "Make sure all required fields are filled in correctly.",
              type: "error",
              duration: 3000,
              onClose: () => { this.hasError[element] = false }
            })
            throw false;
          }
          if(element == 'circle_patience_benefit') {
            this.circleInfo[element] = this.circleInfo[element] < 0 ? 0 : parseInt(this.circleInfo[element] * 100) / 100;
            if(parseInt(this.circleInfo[element] * 100) > this.maxPatienceBenefit * 100) {
              this.tabIndex = 5;
              if(this.$refs[element]) this.$refs[element].focus();
              this.hasError[element] = true;
              this.notif({
                message: `The benefit of patience must be between 0% and ${this.maxPatienceBenefit}%.`,
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 5000,
                onClose: () => { this.hasError[element] = false }
              })
              throw false;
            }
          }
          if(element == 'circle_creator_earnings') {
            this.circleInfo[element] = this.circleInfo[element] < 0 ? 0 : parseInt(this.circleInfo[element] * 100) / 100;
            if(parseInt(this.circleInfo[element] * 100) > this.maxCreatorEarnings * 100) {
              this.tabIndex = 5;
              if(this.$refs[element]) this.$refs[element].focus();
              this.hasError[element] = true;
              this.notif({
                message: `The creator earnings should not be more than ${this.maxCreatorEarnings}%.`,
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
.date-button {
  color: var(--ptn-second-blue);
  width: 95%;
  max-width: 150px;
}
.front-icon {
  height: 40px;
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
