<template>
  <el-dialog 
    id="calculator-modal"
    v-model="showModal"
    title="Calculator"
    class="calculator-dialog"
    :style="''"
  >
    <div class="d-flex flex-column justify-content-center align-items-start p-2">
      <div class="row w-100">
        <div class="col-12 col-md-6">
          <!-- Circle Size -->
          <div class="d-flex flex-column justify-content-center align-items-start">
            <label for="circleSize" class="input-label">
              Circle Size
              <span class="input-label-small">(people)</span>
            </label>
            <div class="d-flex flex-column justify-content-center align-items-start">
              <input
                ref="circleSize"
                id="circleSize"
                type="number"
                :placeholder="`${minMembers} to ${maxMembers} people`"
                class="small-input mb-0"
                :class="hasError['circleSize'] ? 'has-error' : ''"
                :disabled="calculate"
                v-model="circleSize"
              />
            </div>
          </div>
          
          <!-- Round Duration -->
          <div class="d-flex flex-column justify-content-center align-items-start mt-2">
            <label for="roundPeriod" class="input-label">
              Round Duration
              <span class="input-label-small">(in days)</span>
            </label>
            <div class="d-flex flex-column justify-content-center align-items-start">
              <input
                ref="roundPeriod"
                id="roundPeriod"
                type="number"
                :placeholder="`e.g. 5 days`"
                class="small-input mb-0"
                :class="hasError['roundPeriod'] ? 'has-error' : ''"
                :disabled="calculate"
                v-model="roundPeriod"
              />
            </div>
          </div>

          <!-- Round Payments -->
          <div class="d-flex flex-column justify-content-center align-items-start mt-2">
            <label for="roundPayments" class="input-label">
              <div class="d-flex flex-row justify-content-center align-items-center">
                {{ this.circleInfo.circle_payment_type == 'fixed_pay' ? 'Round Payments' : 'Loan Amount' }}
                <span class="input-label-small ps-1">(</span>
                <SvgPaymentToken
                  :chainId="circleInfo.circle_chain_id"
                  :paymentToken="circleInfo.circle_payment_token"
                  :height="10"
                  :tooltip="true"
                  customClass="input-label-small me-1"
                />
                <span class="input-label-small">{{ `${tokenSymbol})` }}</span>
              </div>
            </label>
            <div class="d-flex flex-column justify-content-center align-items-start">
              <input
                ref="roundPayments"
                id="roundPayments"
                type="number"
                :placeholder="circleInfo.circle_payment_type == 'fixed_loan' ? 
                  `${minRoundPayment * (parseInt(circleSize) || minMembers)} to ${maxRoundPayment * (parseInt(circleSize) || minMembers)} ${tokenSymbol}` :
                  `${minRoundPayment} to ${maxRoundPayment} ${tokenSymbol}`"
                class="small-input mb-0"
                :class="hasError['roundPayments'] ? 'has-error' : ''"
                :disabled="calculate"
                v-model="roundPayments"
              />
            </div>
          </div>
          
          <!-- Patience Benefit -->
          <div class="d-flex flex-column justify-content-center align-items-start mt-2">
            <label for="patienceBenefit" class="input-label">
              Patience Benefit
              <span class="input-label-small">(%)</span>
            </label>
            <div class="d-flex flex-column justify-content-center align-items-start">
              <input
                ref="patienceBenefit"
                id="patienceBenefit"
                type="number"
                :placeholder="`up to ${maxPatienceBenefit}%`"
                class="small-input mb-0"
                :class="hasError['patienceBenefit'] ? 'has-error' : ''"
                :disabled="calculate"
                v-model="patienceBenefit"
              />
            </div>
          </div>
        </div>

        <!-- Calculation Result -->
        <div class="col-12 col-md-6 d-flex flex-column justify-content-center align-items-center">
          <template v-if="calculate">
            <div class="d-flex flex-column justify-content-center align-items-start w-100 mb-2">
              <span class="main-text">
                {{ this.circleInfo.circle_payment_type == 'fixed_loan' ? 'Total Amount Payable' : 'Loan Amount' }}
              </span>
              <span v-if="this.circleInfo.circle_payment_type == 'fixed_loan'" class="info-text tiny text-start">
                {{ `Total of all ${roundPeriod} payments made during the circle.` }}
              </span>
              <span v-else class="info-text tiny text-start">
                {{ `Loan amount awarded to the winner of each round.` }}
              </span>
            </div>
            <div v-for="(result, index) in calcResult"
              :key="index"
              class="d-flex flex-row justify-content-center align-items-center w-100"
            >
              <template v-if="index < 4 || index > calcResult.length - 5">
                <div class="d-flex flex-row justify-content-center align-items-center row w-100 calc-grid">
                  <div class="col-6 text-start mt-1">
                    <span class="main-text tiny">
                      {{ `Winner of round-${result.roundNo}` }}
                    </span>
                  </div>
                  <div class="col-6 d-flex flex-row justify-content-end align-items-center mt-1">
                    <span v-if="this.circleInfo.circle_payment_type == 'fixed_loan'" class="main-text tiny">
                      {{ parseFloat(result.totalPayments).toFixed(2) }}
                    </span>
                    <span v-else class="main-text tiny">
                      {{ parseFloat(result.loanAmount).toFixed(2) }}
                    </span>
                    <SvgPaymentToken
                      :chainId="circleInfo.circle_chain_id"
                      :paymentToken="circleInfo.circle_payment_token"
                      :height="14"
                      customClass="ps-1"
                    />
                  </div>
                </div>
              </template>
              <template v-else>
                <div v-if="index == 4" class="col-12 text-start">
                  <span class="main-text tiny">...</span>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button v-if="!calculate" type="success" class="footer-btn px-4 mt-2" @click="calcRounds">Calculate</el-button>
        <el-button v-if="calculate" type="warning" class="footer-btn px-4 mt-2" @click="clearModal">Clear</el-button>
        <el-button type="danger" class="footer-btn px-4 mt-2" @click="closeModal">Close</el-button>
      </span>
    </template>

  </el-dialog>

</template>

<script>
export default {
  name: "PatienceBenefitCalcModal",
  data() {
    return {
      circleInfo: null,
      circleSize: '',
      roundPayments: '',
      patienceBenefit: '',
      roundPeriod: '',
      paymentToken: null,
      tokenSymbol: '',
      minRoundPayment: 0,
      maxRoundPayment: 0,
      minMembers: 0,
      maxMembers: 0,
      maxPatienceBenefit: 0,
      calculate: false,
      calcResult: [],
      showModal: false,
      openLoadings: [],
      hasError: {
        circleSize: false,
        roundPeriod: false,
        roundPayments: false,
        patienceBenefit: false
      }
    };
  },
  methods: {
    async setCalculator(circleInfo, circleConst) {
      this.circleInfo = circleInfo;
      this.clearModal();
      
      if(this.circleInfo.circle_payment_type == 'fixed_loan') {
        this.minFixedAmount = this.minFixedAmount * this.minMembers;
        this.maxFixedAmount = this.maxFixedAmount * this.maxMembers;
      }

      this.paymentToken = circleConst['CIRCLES_PAYMENT_TOKENS'][this.utils.toString(this.circleInfo.circle_payment_token)];
      this.tokenSymbol = this.paymentToken['TOKEN_SYMBOL']
      const tokenDecimals = this.paymentToken['TOKEN_DECIMALS']
      this.minRoundPayment = this.paymentToken['MIN_ROUND_PAY'] / 10**tokenDecimals;
      this.maxRoundPayment = this.paymentToken['MAX_ROUND_PAY'] / 10**tokenDecimals;
      this.minMembers = circleConst['CIRCLES_MIN_MEMBERS'];
      this.maxMembers = circleConst['CIRCLES_MAX_MEMBERS'];
      this.maxPatienceBenefit = circleConst['CIRCLES_MAX_PATIENCE_BENEFIT_X10000'] / 100;
      
      this.showModal = true;
    },
    async calcRounds() {
      if(this.checkForm()) {
        if(this.circleInfo.circle_payment_type == 'fixed_pay') {
          this.calcResult = this.utils.calcLoanAmounts(this.circleSize, this.roundPeriod, this.roundPayments, this.patienceBenefit);
        } else {
          this.calcResult = this.utils.calcTotalPayments(this.circleSize, this.roundPeriod, this.roundPayments, this.patienceBenefit);
        }
        this.calculate = true;
      }
    },
    checkForm() {
      try {
        Object.keys(this.hasError).forEach(element => {
          if(this[element] == null || this[element].length <= 0) {
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
            this[element] = parseInt(this[element]);
            if(this[element] < this.minMembers || this[element] > this.maxMembers) {
              if(this.$refs[element]) this.$refs[element].focus();
              this.hasError[element] = true;
              this.notif({
                message: `The circle size should be between ${this.minMembers} and ${this.maxMembers} people.`,
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 5000,
                onClose: () => { this.hasError[element] = false }
              })
              throw false;
            }
          }
          if(element == 'roundPeriod') {
            this[element] = parseInt(this[element]);
            if(this[element] < 1) {
              if(this.$refs[element]) this.$refs[element].focus();
              this.hasError[element] = true;
              this.notif({
                message: `The round duration should be more than zero.`,
                dangerouslyUseHTMLString: true,
                type: "error",
                duration: 5000,
                onClose: () => { this.hasError[element] = false }
              })
              throw false;
            }
          }
          if(element == 'roundPayments') {
            this[element] = parseInt(this[element] * 100) / 100;
            if(this.circleInfo.circle_payment_type == 'fixed_pay') {
              if(this[element] < this.minRoundPayment || this[element] > this.maxRoundPayment) {
                if(this.$refs[element]) this.$refs[element].focus();
                this.hasError[element] = true;
                this.notif({
                  message: `The round payment should be between ${this.minRoundPayment} and ${this.maxRoundPayment} ${this.tokenSymbol}.`,
                  dangerouslyUseHTMLString: true,
                  type: "error",
                  duration: 5000,
                  onClose: () => { this.hasError[element] = false }
                })
                throw false;
              }
            } else {
              if(this[element] < this.minRoundPayment * this.circleSize || this[element] > this.maxRoundPayment * this.circleSize) {
                if(this.$refs[element]) this.$refs[element].focus();
                this.hasError[element] = true;
                this.notif({
                  message: `The loan amount should be between ${this.minRoundPayment * this.circleSize} and ${this.maxRoundPayment * this.circleSize} ${this.tokenSymbol}.`,
                  dangerouslyUseHTMLString: true,
                  type: "error",
                  duration: 5000,
                  onClose: () => { this.hasError[element] = false }
                })
                throw false;
              }
            }
          }
          if(element == 'patienceBenefit') {
            this[element] = parseInt(this[element]) < 0 ? 0 : parseInt(this[element] * 100) / 100;
            if(this[element] > this.maxPatienceBenefit) {
              if(this.$refs[element]) this.$refs[element].focus();
              this.hasError[element] = true;
              this.notif({
                message: `The patience benefit should be up to ${this.maxPatienceBenefit}%.`,
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
    clearModal() {
      this.circleSize = this.circleInfo?.circle_size || '';
      this.roundPeriod = this.circleInfo?.circle_round_days || '';
      this.roundPayments = this.circleInfo?.circle_round_payments || '';
      this.patienceBenefit = this.circleInfo?.circle_patience_benefit || '';
      this.calculate = false;
    },
    closeModal() {
      this.showModal = false;
    }
  },
};
</script>
    
<style lang="scss" scoped>
#calculator-modal {
  z-index: 9000;
}
.calculator-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
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
.calculator-button.selected {
  color: var(--ptn-second-blue);
  border: 1px solid var(--ptn-second-blue);
  cursor: default;
}
.calculator-button.locked {
  color: rgba(var(--ptn-second-blue-rgb), 0.7) !important;
  border: 1px solid rgba(var(--ptn-second-blue-rgb), 0.7) !important;
}
.calculator-button.disabled {
  color: rgba(var(--ptn-color-rgb), 0.1);
  border: 1px solid rgba(var(--ptn-color-rgb), 0.1);
  cursor: default;
}
.footer-btn {
  min-width: 120px;
  height: 32px;
}
.calc-grid {
  border-bottom: solid 1px rgba(var(--ptn-third-gray-rgb), 0.3);
}
</style>
