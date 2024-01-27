<template>
  
  <div v-if="accountCircleProps" id="account-circles-card">
    
    <!-- Creating - Deployed -->
    <div
      role="button"
      @click="accountCircleProps.circle_total_whitelisted < accountCircleProps.circle_size ?
        $router.push({path: '/account/circles/create', query: {active_page: 'whitelist', circle_id: accountCircleProps.circle_id}}) :
        $router.push({path: '/account/circles/create', query: {active_page: 'launch', circle_id: accountCircleProps.circle_id}})"
    >
      <div class="account-circles-card-main">
        <div class="d-flex flex-column justify-content-center align-items-center pt-3 pb-2">
          <p>
            <span class="account-circles-card-title-icon third-gray-btn">
              <p v-if="accountCircleProps.circle_status == 'deployed'" class="account-circles-card-title ms-1">
                <i class="fa fa-screwdriver-wrench pe-1" aria-hidden="true"></i>
                Deployed
              </p>
              <p v-if="accountCircleProps.circle_status == 'launched'" class="account-circles-card-title ms-1">
                <i class="fa fa-rocket pe-1" aria-hidden="true"></i>
                Launched
              </p>
            </span>
          </p>
        </div>
        
        <div class="d-flex flex-column justify-content-center align-items-start px-3">
          <!-- Circle Name -->
          <div class="d-flex flex-row justify-content-start align-items-center">
            <p class="account-circles-card-name">
              {{ accountCircleProps.circle_name }}
            </p>
          </div>

          <!-- Blockchain -->
          <!-- <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">Blockchain:</span>
            <span class="account-circles-card-creator-fullname ps-2">{{ defaultchain.chainName }}</span>
          </div> -->
          
          <!-- Payment Token -->
          <!-- <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">Payment Token:</span>
            <SvgPaymentToken
              :chainId="accountCircleProps.circle_chain_id"
              :paymentToken="accountCircleProps.circle_payment_token"
              :height="15"
              :tooltip="false"
              customClass="mx-1"
            />
            <span class="account-circles-card-creator-fullname">
              {{ accountCircleProps.circle_payment_token == this.defaultchain.CUSD.address ?
                this.defaultchain.CUSD.symbol : defaultchain.nativeCurrency.symbol }}
            </span>
          </div> -->
          
          <!-- Circle Size -->
          <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">Circle Size:</span>
            <p class="account-circles-card-text ps-2">
              {{ accountCircleProps.circle_size }}
              <span class="account-circles-card-unit">people</span>
            </p>
          </div>

          <!-- Round Duration -->
          <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <p class="account-circles-card-note">Round Duration:</p>
            <p class="account-circles-card-creator-fullname ps-2">{{ accountCircleProps.circle_round_days }}
              <span class="account-circles-card-unit">days</span>
            </p>
          </div>
          
          <!-- Round Payments -->
          <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <p class="account-circles-card-note">Round Payments:</p>
            <p class="account-circles-card-creator-fullname ps-2">
              {{ utils.formatPrice(accountCircleProps.circle_round_payments) }}
            </p>
            <SvgPaymentToken
              :chainId="accountCircleProps.circle_chain_id"
              :paymentToken="accountCircleProps.circle_payment_token"
              :height="15"
              :tooltip="true"
              customClass="mx-1"
            />
          </div>
          
          <!-- Circle Payment Type -->
          <!-- <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">Payment Type:</span>
            <span class="account-circles-card-creator-fullname ps-2">
              {{ accountCircleProps.circle_payment_type == 'fixed_pay' ? 'Fixed Payments' : 
               accountCircleProps.circle_payment_type == 'fixed_loan' ? 'Fixed Loan' : ''
              }}
            </span>
          </div> -->

          <!-- Winner Selection Method -->
          <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <p class="account-circles-card-note">Winner Selection:</p>
            <p v-if="accountCircleProps.circle_winners_order == 'random'" class="account-circles-card-creator-fullname ps-2">Random</p>
            <p v-if="accountCircleProps.circle_winners_order == 'fixed'" class="account-circles-card-creator-fullname ps-2">FCFS</p>
            <p v-if="accountCircleProps.circle_winners_order == 'bidding'" class="account-circles-card-creator-fullname ps-2">Bidding</p>
          </div>

          <!-- Patience Benefit -->
          <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <p class="account-circles-card-note">Patience Benefit</p>
            <p class="account-circles-card-creator-fullname ps-2">{{ utils.formatPrice(accountCircleProps.circle_patience_benefit) }}
              <span class="account-circles-card-unit">%</span>
            </p>
          </div>

          <!-- Creator Earnings -->
          <!-- <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <p class="account-circles-card-note">Creator Earnings</p>
            <p class="account-circles-card-creator-fullname ps-2">{{ utils.formatPrice(accountCircleProps.circle_creator_earnings) }}
              <span class="account-circles-card-unit">%</span>
            </p>
          </div> -->
          
          <!-- Circle Deploy/Start Date -->
          <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <p v-if="accountCircleProps.circle_status == 'deployed'" class="account-circles-card-note">Deployed At:
              <span class="account-circles-card-text ps-2">
                {{ utils.formatDate(accountCircleProps.circle_deployed_at, 'DD Month YYYY') }}
              </span>
            </p>
            <p v-if="accountCircleProps.circle_status == 'launched'" class="account-circles-card-note">Start Date:
              <span class="account-circles-card-text ps-2">
                {{ utils.formatDate(accountCircleProps.circle_start_date, 'DD Month YYYY') || 'Open' }}
              </span>
            </p>
          </div>
          
        </div>
      </div>
    </div>
    
    <!-- Creating - Launched -->
    <div v-if="false && accountRoleProps == 'creating' && accountCircleProps.circle_status == 'launched'"
      role="button"
      @click="accountCircleProps.circle_total_whitelisted < accountCircleProps.circle_size ?
        $router.push({path: '/account/circles/create', query: {active_page: 'whitelist', circle_id: accountCircleProps.circle_id}}) :
        $router.push({path: '/account/circles/create', query: {active_page: 'launch', circle_id: accountCircleProps.circle_id}})"
    >
      <div class="account-circles-card-main">
        <div class="d-flex flex-column justify-content-center align-items-center pt-3 pb-2">
          <!-- <p v-if="accountCircleProps.circle_status == 'setuped'">
            <span class="account-circles-card-title-icon third-gray-btn">
              <i class="fa fa-cog fa-spin" style="--fa-animation-duration: 7s;"></i>
              <span class="account-circles-card-title ms-1">
                You are creating
              </span>
            </span>
          </p> -->
          <p v-if="accountCircleProps.circle_status == 'launched'">
            <span class="account-circles-card-title-icon third-gray-btn">
              <i class="fa fa-rocket"></i>
              <span class="account-circles-card-title ms-1">
                Launched
              </span>
            </span>
          </p>
        </div>
        
        <div class="d-flex flex-column justify-content-center align-items-center">
          <!-- Circle Name -->
          <div>
            <p class="account-circles-card-name">
              {{ accountCircleProps.circle_name }}
            </p>
          </div>

          <!-- Circle Payment Type -->
          <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">Payment Type:</span>
            <span class="account-circles-card-creator-fullname ps-2">
              {{ accountCircleProps.circle_payment_type == 'fixed_pay' ? 'Fixed Payments' : 
               accountCircleProps.circle_payment_type == 'fixed_loan' ? 'Fixed Loan' : ''
              }}
            </span>
          </div>

          <!-- Circle Members -->
          <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">Participants:</span>
            <span class="account-circles-card-text ps-2">
              {{ accountCircleProps.circle_size }}
            </span>
            <span class="account-circles-card-unit ps-2">people</span>
          </div>

          <!-- Circle Round Payments & Loan Amount -->
          <div v-if="accountCircleProps.circle_payment_type == 'fixed_pay'">
            <div class="d-flex flex-row justify-content-start align-items-center pt-2">
              <span class="account-circles-card-note">Round Payments:</span>
              <span class="account-circles-card-text ps-2">
                {{ accountCircleProps.circle_round_payments }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
              <span class="account-circles-card-unit ps-1">(fixed)</span>
            </div>
            <div class="d-flex flex-row justify-content-start align-items-center pt-2">
              <span class="account-circles-card-note">Loan Amount:</span>
              <span class="account-circles-card-text ps-2">
                {{ accountCircleProps.circle_round_payments * accountCircleProps.circle_size }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
            </div>
          </div>
          <div v-if="accountCircleProps.circle_payment_type == 'fixed_loan'">
            <div class="d-flex flex-row justify-content-start align-items-center pt-2">
              <span class="account-circles-card-note">Round Payments:</span>
              <span class="account-circles-card-text ps-2">
                {{ Math.round(((accountCircleProps.circle_round_payments / accountCircleProps.circle_size) + Number.EPSILON) * 100) / 100 }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
            </div>
            <div class="d-flex flex-row justify-content-start align-items-center pt-2">
              <span class="account-circles-card-note">Loan Amount:</span>
              <span class="account-circles-card-text ps-2">
                {{ accountCircleProps.circle_round_payments }}
              </span>
              <SvgPaymentToken
                :chainId="accountCircleProps.circle_chain_id"
                :paymentToken="accountCircleProps.circle_payment_token"
                :height="13" customClass="ms-1"
              />
              <span class="account-circles-card-unit ps-1">(fixed)</span>
            </div>
          </div>
          
          <!-- Circle Start Date -->
          <div class="d-flex flex-row justify-content-start align-items-center pt-2">
            <span class="account-circles-card-note">Start Date:</span>
            <span class="account-circles-card-text ps-2">
              {{ utils.formatDate(accountCircleProps.circle_start_date, 'DD Month YYYY') || 'Open' }}
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
export default {
  name: "AccountCirclesCard",
	props: {
    accountCircleProps: Object,
    accountRoleProps: String
  },
  mounted() {
    // console.log(this.accountCircleProps);
  }
}
</script>

<style scoped>
.account-circles-card-main {
  background: var(--ptn-second-bg);
  border-radius: 16px;
  width: calc(100% - 20px);
  max-width: 300px;
  height: 300px;
  text-align: center;
  margin: 20px auto;
}
.account-circles-card-title {
  font-size: 20px;
  font-weight: 400;
}
.account-circles-card-title-icon {
  font-size: 25px;
}
.account-circles-card-note {
  font-size: 14px;
  font-weight: bold;
  color: rgba(var(--ptn-color-rgb), 0.7);
}
.account-circles-card-name {
  font-size: 20px;
  font-weight: bold;
  color: rgba(var(--ptn-blue-rgb), 0.9);
  max-width: 280px;
  overflow: hidden;
  white-space:nowrap;
}
.account-circles-card-creator-fullname {
  font-size: 16px;
  font-weight: bold;
  color: rgba(var(--ptn-blue-rgb), 0.9);
}
.account-circles-card-number {
  font-size: 20px;
  font-weight: bold;
  color: rgba(var(--ptn-blue-rgb), 0.9);
}
.account-circles-card-unit {
  font-size: 13px;
  font-weight: 400;
  color: rgba(var(--ptn-color-rgb), 0.5);
}
.account-circles-card-x {
  font-size: 20px;
  font-weight: bold;
  color: rgba(var(--ptn-color-rgb), 0.9);
  padding: 0 0 0 7px;
}
.account-circles-card-text {
  font-size: 16px;
  font-weight: bold;
  color: rgba(var(--ptn-blue-rgb), 0.9);
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
