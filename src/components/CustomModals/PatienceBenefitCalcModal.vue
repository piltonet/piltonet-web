<template>
  <el-dialog 
    id="calculator-modal"
    v-model="showModal"
    title="Calculator"
    class="calculator-dialog pt-3"
    :style="''"
  >
    <div class="d-flex flex-column justify-content-center align-items-start p-2">
      <div class="row w-100">
        <div class="col-12 col-md-6">
          <!-- Circle Size -->
          <div class="d-flex flex-column justify-content-center align-items-start mt-2">
            <label for="circleSize" class="input-label">
              Circle Size
              <span class="input-label-small">(Member Counts)</span>
            </label>
            <div class="d-flex flex-column justify-content-center align-items-start">
              <input
                ref="circleSize"
                id="circle_size"
                type="number"
                class="small-input mb-0"
                :class="hasError['circleSize'] ? 'has-error' : ''"
                :disabled="calculate"
                v-model="circleSize"
              />
            </div>
          </div>
          
          <!-- Round Payment / Loan Amount -->
          <div class="d-flex flex-column justify-content-center align-items-start mt-4">
            <label for="circleSize" class="input-label">
              {{ this.circleInfo.circle_payment_type == 'fixed_pay' ? 'Round Payment' : 'Loan Amount' }}
              <span class="input-label-small">
                {{ this.circleInfo.circle_payment_type == 'fixed_pay' ? '(Fixed Payment)' : '(Fixed Loan)' }}
              </span>
            </label>
            <div class="d-flex flex-column justify-content-center align-items-start">
              <input
                ref="fixedAmount"
                id="fixed_amount"
                type="number"
                class="small-input mb-0"
                :class="hasError['fixedAmount'] ? 'has-error' : ''"
                :disabled="calculate"
                v-model="fixedAmount"
              />
            </div>
          </div>
          
          <!-- Patience Benefit -->
          <div class="d-flex flex-column justify-content-center align-items-start mt-4">
            <label for="circleSize" class="input-label">
              Patience Benefit
              <span class="input-label-small">(%)</span>
            </label>
            <div class="d-flex flex-column justify-content-center align-items-start">
              <input
                ref="patienceBenefit"
                id="patience_benefit"
                type="number"
                class="small-input mb-0"
                :class="hasError['patienceBenefit'] ? 'has-error' : ''"
                :disabled="calculate"
                v-model="patienceBenefit"
              />
            </div>
          </div>
        </div>
        <!-- Calculation Result -->
        <div class="col-12 col-md-6 d-flex flex-column justify-content-start align-items-center mt-4">
          <template v-if="calculate">
            <div class="d-flex flex-row justify-content-center align-items-center row w-100">
              <div class="col-6 text-start">
                Rounds
                <span class="info-text tiny">{{ `(${roundPeriod})` }}</span>
              </div>
              <div class="col-6 text-start">
                Loan Amount
              </div>
            </div>
            <div v-for="(row, index) in calcResult"
              :key="index"
              class="d-flex flex-row justify-content-center align-items-center row w-100"
            >
              <template v-if="index < 4 || index > calcResult.length - 4">
                <div class="col-6 text-start mt-1">
                  <span class="main-text tiny">
                    {{ `${row.round}` }}
                  </span>
                </div>
                <div class="col-6 d-flex flex-row justify-content-start align-items-center mt-1">
                  <span class="main-text tiny">
                    {{ parseFloat(row.loan).toFixed(2) }}
                  </span>
                  <SvgPaymentToken
                    :chainId="circleInfo.circle_chain_id"
                    :paymentToken="circleInfo.circle_payment_token"
                    :height="14" customClass="ps-1"
                  />
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
      circleSize: "",
      fixedAmount: "",
      patienceBenefit: "",
      roundPeriod: "",
      calculate: false,
      calcResult: [],
      showModal: false,
      openLoadings: [],
      hasError: {
        circleSize: false,
        fixedAmount: false,
        patienceBenefit: false
      }
    };
  },
  methods: {
    async setCalculator(circleInfo) {
      this.clearModal();
      this.circleInfo = circleInfo;
      this.showModal = true;
    },
    async calcRounds() {
      this.calcResult = [];
      if(this.circleInfo.circle_round_days == 7) {
        this.roundPeriod = 'Weekly';
      } else if(this.circleInfo.circle_round_days == 14) {
        this.roundPeriod = 'Biweekly';
      } else if(this.circleInfo.circle_round_days == 30) {
        this.roundPeriod = 'Monthly';
      } else {
        this.roundPeriod = `${this.circleInfo.circle_round_days} days`;
      }
      if(this.checkForm()) {
        for(let i=0; i < this.circleSize; i++) {
          this.calcResult.push({
            round: `Round-${i+1}`,
            loan: this.loanAmount(i),
          })
        }
        this.calculate = true;
      }
    },
    loanAmount(index) {
      const roundNo = index + 1;
      const totalRounds = parseInt(this.circleSize);
      const memberBenefit = ((roundNo - ((totalRounds + 1) / 2)) * ((this.patienceBenefit / 100) / 12)) * this.totalPayments();
      // return (this.totalPayments() + memberBenefit) * (1 - this.circleFee);
      return (this.totalPayments() + memberBenefit);
    },
    totalPayments() {
      if(this.circleInfo.circle_payment_type == 'fixed_pay') {
        return (this.circleSize * this.fixedAmount);
      }
      if(this.circleInfo.circle_payment_type == 'fixed_loan') {
        return this.fixedAmount;
      }
    },
    checkForm() {
      try {
        Object.keys(this.hasError).forEach(element => {
          console.log(element, this[element]);
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
        });
        return true;
      } catch(err) {
        console.log(err);
        return false;
      }
    },
    clearModal() {
      this.circleSize = "";
      this.fixedAmount = "";
      this.patienceBenefit = "";
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
</style>
