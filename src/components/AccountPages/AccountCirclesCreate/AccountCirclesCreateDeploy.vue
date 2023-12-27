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
            <p id="circleContractChainHelp" class="help-text pt-3 mb-3">
              All transactions will be done on this chain.
            </p>
            <!-- Circle Payment Token -->
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
              <i v-if="circleInfo.circle_payment_token == this.defaultchain.nativeCurrency.address && circleInfo.circle_id" class="fa fa-lock ps-2" aria-hidden="true"></i>
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
              <p>CUSD</p>
              <i v-if="circleInfo.circle_round_days == 'PUSD-token-address' && circleInfo.circle_id" class="fa fa-lock ps-2" aria-hidden="true"></i>
            </button>
            <!-- To Do -->
            <button
              class="account-circles-deploy-button mt-2 d-none"
              :class="circleInfo.circle_payment_token == 'PUSD-token-address' ? (circleInfo.circle_id ? 'selected locked' : 'selected') : (circleInfo.circle_id ? 'd-none' : '')"
              @click="circleInfo.circle_payment_token = 'PUSD-token-address'"
            >
              <SvgPaymentToken
                :chainId="circleInfo.circle_chain_id"
                :paymentToken="'PUSD-token-address'"
                :tooltip="false"
                customClass="m-1"
              />
              <p>PCUSD</p>
              <i v-if="circleInfo.circle_round_days == 'PUSD-token-address' && circleInfo.circle_id" class="fa fa-lock ps-2" aria-hidden="true"></i>
            </button>
            <p id="circlePaymentTokenHelp" class="help-text pt-3 mb-3">
              This token is used to pay contributions and receive loans.
            </p>
          </template>

          <!-- Circle Round Days -->
          <template v-if="tabIndex == 2">
            <label for="circleRoundDays" class="input-label mt-2">
              Round Period
            </label>
            <button
              class="account-circles-deploy-button"
              :class="circleInfo.circle_round_days == 7 ? (circleInfo.circle_id ? 'selected locked' : 'selected') : (circleInfo.circle_id ? 'd-none' : '')"
              @click="circleInfo.circle_round_days = 7"
            >
              <p>Weekly (7 days)</p>
              <i v-if="circleInfo.circle_round_days == 7 && circleInfo.circle_id" class="fa fa-lock ps-2" aria-hidden="true"></i>
            </button>
            <button
              class="account-circles-deploy-button mt-2"
              :class="circleInfo.circle_round_days == 30 ? (circleInfo.circle_id ? 'selected locked' : 'selected') : (circleInfo.circle_id ? 'd-none' : '')"
              @click="circleInfo.circle_round_days = 30"
            >
              <p>Monthly (30 days)</p>
              <i v-if="circleInfo.circle_round_days == 30 && circleInfo.circle_id" class="fa fa-lock ps-2" aria-hidden="true"></i>
            </button>
            <p id="circleRoundDaysHelp" class="help-text pt-3 mb-3">
              Duration of each round in days.
            </p>
          </template>

          <!-- Payment Type -->
          <template v-if="tabIndex == 3">
            <label for="circlePaymentType" class="input-label mt-2">Payment Type</label>
            <button
              class="account-circles-deploy-button"
              :class="circleInfo.circle_payment_type == 'fixed_pay' ? (circleInfo.circle_id ? 'selected locked' : 'selected') : (circleInfo.circle_id ? 'd-none' : '')"
              @click="circleInfo.circle_payment_type = 'fixed_pay'"
            >
              <p>Fixed Payment</p>
              <i v-if="circleInfo.circle_payment_type == 'fixed_pay' && circleInfo.circle_id" class="fa fa-lock ps-2" aria-hidden="true"></i>
            </button>
            <button
              class="account-circles-deploy-button mt-2"
              :class="circleInfo.circle_payment_type == 'fixed_loan' ? (circleInfo.circle_id ? 'selected locked' : 'selected') : (circleInfo.circle_id ? 'd-none' : '')"
              @click="circleInfo.circle_payment_type = 'fixed_loan'"
            >
              <p>Fixed Loan</p>
              <i v-if="circleInfo.circle_payment_type == 'fixed_loan' && circleInfo.circle_id" class="fa fa-lock ps-2" aria-hidden="true"></i>
            </button>
            <p v-if="circleInfo.circle_payment_type == 'fixed_pay'" id="circleRoundDaysHelp" class="help-text pt-3 mb-3">
              In the fixed payment type, the loan amount will be based on the number of members and other rules.
            </p>
            <p v-if="circleInfo.circle_payment_type == 'fixed_loan'" id="circleRoundDaysHelp" class="help-text pt-3 mb-3">
              In the fixed loan type, the contribution amount will be based on the number of members and other rules.
            </p>
          </template>

          <!-- Circle Creator Earnings -->
          <!-- To Do -->
          <template v-if="tabIndex == 4">
            <div v-if="true">
              <label for="circleCreatorEarnings" class="input-label mt-2">
                Creator Earnings
                <span class="input-label-small">(Percent)</span>
              </label>
              <input
                ref="circle_creator_earnings"
                id="circleCreatorEarnings"
                type="number"
                placeholder="e.g. 0.5"
                min=0.00
                :max="maxCreatorEarnings"
                step="0.01"
                class="small-input mb-0"
                :class="hasError['circle_creator_earnings'] ? 'has-error' : ''"
                aria-describedby="circleCreatorEarningsHelp"
                v-model="circleInfo.circle_creator_earnings"
              />
              <p id="circleCreatorEarningsHelp" class="help-text pt-3 mb-3">
                {{ `Earnings of the circle creator, up to ${maxCreatorEarnings}%.` }}
              </p>
            </div>
          </template>
          
          <!-- Circle Service Charge -->
          <template v-if="tabIndex == 4">
            <label for="circleServiceCharge" class="input-label mt-2">
              Service Charge
              <span class="input-label-small">(Fixed Rate)</span>
            </label>
            <button
              class="account-circles-deploy-button selected locked"
            >
              <p>{{ `${circleInfo.circle_service_charge} (${circleInfo.circle_service_charge * 100}%)` }}</p>
              <i class="fa fa-lock ps-2" aria-hidden="true"></i>
            </button>
            <p id="circleServiceChargeHelp" class="help-text pt-3 mb-3">
              Piltonet service charge rate that is deducted from the loan amount.
            </p>
          </template>
          
          <!-- Review & Deploy -->
          <div class="row">
            <div class="col-12 col-md-6">
              <template v-if="tabIndex == 5">
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
                <!-- Circle Payment Token -->
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
                  class="account-circles-deploy-button mt-2"
                  :class="circleInfo.circle_payment_token == this.defaultchain.CUSD.address ? 'selected locked' : 'd-none'"
                >
                  <SvgPaymentToken
                    :chainId="circleInfo.circle_chain_id"
                    :paymentToken="this.defaultchain.CUSD.address"
                    :tooltip="false"
                    customClass="m-1"
                  />
                  <p>CUSD</p>
                </button>
              </template>

              <template v-if="tabIndex == 5">
                <label for="circleRoundDays" class="input-label mt-2">
                  Round Period
                </label>
                <button
                  class="account-circles-deploy-button"
                  :class="circleInfo.circle_round_days == 7 ? 'selected locked' : 'd-none'"
                >
                  <p>Weekly (7 days)</p>
                </button>
                <button
                  class="account-circles-deploy-button mt-2"
                  :class="circleInfo.circle_round_days == 30 ? 'selected locked' : 'd-none'"
                >
                  <p>Monthly (30 days)</p>
                </button>
              </template>
            </div>
            <div class="col-12 col-md-6">
              <template v-if="tabIndex == 5">
                <label for="circlePaymentType" class="input-label mt-2">Payment Type</label>
                <button
                  class="account-circles-deploy-button"
                  :class="circleInfo.circle_payment_type == 'fixed_pay' ? 'selected locked' : 'd-none'"
                >
                  <p>Fixed Payment</p>
                </button>
                <button
                  class="account-circles-deploy-button mt-2"
                  :class="circleInfo.circle_payment_type == 'fixed_loan' ? 'selected locked' : 'd-none'"
                >
                  <p>Fixed Loan</p>
                </button>
              </template>
    
              <template v-if="tabIndex == 5">
                <label for="circleServiceCharge" class="input-label mt-2">
                  Creator Earnings
                  <span class="input-label-small">(Percent)</span>
                </label>
                <button
                  class="account-circles-deploy-button selected locked"
                >
                  <p>{{ circleInfo.circle_creator_earnings }}</p>
                  <i class="fa fa-lock ps-2" aria-hidden="true"></i>
                </button>
              </template>
            
              <template v-if="tabIndex == 5">
                <label for="circleServiceCharge" class="input-label mt-2">
                  Service Charge
                  <span class="input-label-small">(Fixed Rate)</span>
                </label>
                <button
                  class="account-circles-deploy-button selected locked"
                >
                  <p>{{ `${circleInfo.circle_service_charge} (${circleInfo.circle_service_charge * 100}%)` }}</p>
                  <i class="fa fa-lock ps-2" aria-hidden="true"></i>
                </button>
              </template>
            </div>
          </div>
          
          <!-- Create & Deploy Button -->
          <template v-if="tabIndex == 5">
            <div v-if="circleInfo.circle_id">
              <!-- Contract Address -->
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
            <div v-else class="d-flex flex-row justify-content-start align-items-center">
              <input
                type="submit"
                value="Great! DEPLOY"
                @click="deployCircle"
              />
            </div>
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
            :class="tabIndex == 4 || tabIndex == 5 ? 'd-none' : ''"
          >
            <span class="m-0 p-0">Next</span>
          </div>
          <div
            type="button"
            @click="tabIndex = 5"
            class="main-btn green-bg ms-2"
            :class="tabIndex == 5 ? 'd-none' : ''"
          >
            <span class="m-0 p-0">Review & Deploy</span>
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
      maxCreatorEarnings: process.env.VUE_APP_CIRCLES_MAX_CREATOR_EARNINGS / 100,
      hasError: {
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
    }
  },
  methods: {
    ...mapMutations(['setConnectionStore', 'setProfileStore']),
    async setup() {
      if(this.circleInfoProps) {
        this.circleInfo = this.circleInfoProps;
        this.explorerLink = `${this.defaultchain.blockExplorerUrl}/address/${this.circleInfo.circle_id}`;
      } else {
        // New Circle
        this.circleInfo = {
          circle_id: null,
          circle_contract: process.env.VUE_APP_CIRCLE_CONTRACT,
          circle_chain_id: this.defaultchain.id,
          circle_payment_token: this.defaultchain.CUSD.address,
          circle_round_days: 7,
          circle_payment_type: 'fixed_pay',
          circle_service_charge: process.env.VUE_APP_CIRCLES_SERVICE_CHARGE_X10000 / 10000,
          circle_creator_earnings: 0
        }
      }
    },
    async deployCircle() {
      if(this.checkForm()) {
        const deployArgs = [[
          this.circleInfo.circle_payment_token,
          this.circleInfo.circle_round_days,
          this.circleInfo.circle_payment_type == 'fixed_pay' ? 0 : 1,
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
          if(element == 'circle_creator_earnings') {
            this.circleInfo[element] = this.circleInfo[element] < 0 ? 0 : parseInt(this.circleInfo[element] * 100) / 100;
            if(parseInt(this.circleInfo[element] * 100) > this.maxCreatorEarnings * 100) {
              this.$refs[element].focus();
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
