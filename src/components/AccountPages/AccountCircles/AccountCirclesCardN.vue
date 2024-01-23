<template>
  <div v-if="accountCircleProps" id="account-circles-card">
    <div
      role="button"
      @mouseover="mouseOver = true"
      @mouseleave="mouseOver = false"
      class="d-flex flex-column justify-content-start align-items-center collections-card px-3 py-3"
      :class="{'mouse-over': mouseOver}"
      @click="accountRoleProps == 'whitelisted' ?
        $router.push({path: '/account/circles/invited', query: {circle_id: accountCircleProps.circle_id}}) :
        $router.push({path: '/account/circles/joined', query: {circle_id: accountCircleProps.circle_id}})"
    >
      <div v-if="accountCircleProps && accountCircleProps.circle_id" class="collections-container row">
  
        <div class="d-flex flex-row justify-content-center align-items-center collections-img-container">
        </div>
  
        <div class="d-flex flex-column justify-content-center align-items-start text-start">
          <div class="d-flex flex-row justify-content-start align-items-start row w-100">
            <div class="col-6 text-start">
              <div v-if="accountRoleProps == 'joined'" class="trusted-circles-key green-btn pb-2">
                <!-- <i class="far fa-calendar" aria-hidden="true"></i> -->
                You have joined
              </div>
              <div v-else class="trusted-circles-key red-btn pb-2">
                <i class="far fa-envelope fa-shake" style="--fa-animation-duration: 2s;" aria-hidden="true"></i>
                You are invited
              </div>
              <p class="circle-name">{{ accountCircleProps.circle_name }}</p>
            </div>
            <div class="col-6 text-end">
              <p class="trusted-circles-info">START DATE</p>
              <p class="top-text-tiny">{{ utils.formatDate(accountCircleProps.circle_start_date, 'DD Month YYYY') || 'Open' }}</p>
            </div>
          </div>
        </div>
  
        <div class="d-flex flex-column justify-content-center align-items-start text-start mb-2">
          <div class="d-flex flex-row justify-content-start align-items-center">
            <AvatarImage
              :imageSrc="accountCircleProps.circle_creator.account_image_url"
              :name="accountCircleProps.circle_creator.account_fullname || accountCircleProps.circle_creator.account_nickname"
              :size="20"
              :border="false"
              :rounded="true"
              class="account-image-tiny"
            />
            <span class="top-text-tiny mx-1">
              {{ accountCircleProps.circle_creator.account_fullname || accountCircleProps.circle_creator.account_nickname }}
            </span>
            <span class="host-badge">HOST</span>
          </div>
        </div>
  
        <div class="d-flex flex-row justify-content-center align-items-end row w-100 mt-2">
          
          <div class="col-10 d-flex flex-row justify-content-start align-items-center">
            <div class="d-flex flex-column justify-content-center align-items-center pe-1">
              <div class="d-flex flex-row justify-content-end align-items-center">
                <p v-if="accountCircleProps.circle_payment_type == 'fixed_pay'" class="trusted-circles-value">
                  {{ utils.formatPrice(accountCircleProps.circle_fixed_amount) }}
                </p>
                <p v-if="accountCircleProps.circle_payment_type == 'fixed_loan'" class="trusted-circles-value">
                  {{ utils.formatPrice(accountCircleProps.circle_fixed_amount / accountCircleProps.circle_min_members) }}
                </p>
                <SvgPaymentToken
                  :chainId="accountCircleProps.circle_chain_id"
                  :paymentToken="accountCircleProps.circle_payment_token"
                  customClass="price-token-icon small"
                />
              </div>
              <p class="trusted-circles-key">PAYMENT</p>
            </div>
            <!-- <p class="trusted-circles-value pb-1 mb-3">x</p> -->
            <div class="d-flex flex-column justify-content-center align-items-center px-1">
              <div class="d-flex flex-row justify-content-end align-items-center">
                <p class="trusted-circles-value">{{ accountCircleProps.circle_min_members }}</p>
                <!-- <p class="trusted-circles-value">{{ accountCircleProps.circle_round_days }}</p> -->
                <!-- <p class="trusted-circles-info ps-1">(Monthly)</p> -->
              </div>
              <p class="trusted-circles-key">ROUNDS</p>
            </div>
            <!-- <p class="trusted-circles-value mb-3">=</p> -->
            <div class="d-flex flex-column justify-content-center align-items-center ps-1">
              <div class="d-flex flex-row justify-content-end align-items-center">
                <p v-if="accountCircleProps.circle_payment_type == 'fixed_pay'" class="trusted-circles-value big">
                  {{ utils.formatPrice(accountCircleProps.circle_min_members * accountCircleProps.circle_fixed_amount) }}
                </p>
                <p v-if="accountCircleProps.circle_payment_type == 'fixed_loan'" class="trusted-circles-value big">
                  {{ utils.formatPrice(accountCircleProps.circle_fixed_amount) }}
                </p>
                <SvgPaymentToken
                  :chainId="accountCircleProps.circle_chain_id"
                  :paymentToken="accountCircleProps.circle_payment_token"
                  :height="20"
                  customClass="price-token-icon"
                />
              </div>
              <p class="trusted-circles-key">LOAN AMOUNT</p>
            </div>
            
          </div>

          <div v-if="utils.diffDays(new Date(), new Date(accountCircleProps.circle_start_date)) > 1" class="col-2 text-end">
            <p class="top-text-big">{{ utils.diffDays(new Date(), new Date(accountCircleProps.circle_start_date)) }}</p>
            <p class="trusted-circles-info">DAYS LEFT</p>
          </div>
          <div v-else-if="utils.diffHours(new Date(), new Date(accountCircleProps.circle_start_date)) > 1" class="col-2 text-end">
            <p class="top-text-big">{{ utils.diffHours(new Date(), new Date(accountCircleProps.circle_start_date)) }}</p>
            <p class="trusted-circles-info">HOURS LEFT</p>
          </div>
          <div v-else class="col-2 text-end">
            <p class="top-text-big">{{ utils.diffMinutes(new Date(), new Date(accountCircleProps.circle_start_date)) }}</p>
            <p class="trusted-circles-info">MIN LEFT</p>
          </div>
          
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
export default {
  name: "AccountCirclesCardN",
  props: {
    accountCircleProps: Object,
    accountRoleProps: String
  },
  data() {
    return {
      mouseOver: false
    }
  },
  mounted() {
    // console.log(this.accountCircleProps);
  },
};
</script>

<style lang="scss" scoped>
#account-circles-card {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.collections-card {
  background: var(--ptn-second-bg);
  border: 1px solid #CDD7E8;
  border-radius: 8px;
}
.collections-card.mouse-over {
  -webkit-box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
  -moz-box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
  // -webkit-transform: rotate(3deg);
  // -moz-transform: rotate(3deg);
  // -o-transform: rotate(3deg);
  // -ms-transform: rotate(3deg);
  // transform: rotate(3deg);
}

.collections-container {
  border: 0;
  border-radius: 8px;
  width: 100%;
}
.collections-img-container {
  position: relative;
  text-align: center;
  color: white;
  border: 0;
  border-radius: 8px;
  width: 100%;
  height: auto;
}

.collections-banner {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  object-fit: cover;
  aspect-ratio: 4/1;
  width: 100%;
  height: auto;
  max-height: 100%;
  margin-bottom: 10%;
}

.collections-banner.overlay {
  position: absolute;
  // background-color: rgba(35, 71, 179, 0.5);
  background-color: rgba(0, 0, 0, 0.5);
}

.collections-logo {
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translate(0, -20%);
  aspect-ratio: 1/1;
  width: 20%;
  height: auto;
  object-fit: cover;
  border: none;
  border-radius: 8px;
  margin-left: 5%;
  padding: 0;
}

.circle-name {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 23px;
  font-weight: bold;
  line-height: 35px;
  color: var(--ptn-color);
  border-bottom: solid 1px transparent;
  width: 100%;
  overflow: hidden;
  white-space:nowrap;
}
.verified-icon {
  width: 25px;
  height: 25px;
}

.trusted-circles-info {
  font-family: "Roboto", arial, sans-serif;
  font-size: 12px;
  font-weight: normal;
  color: var(--ptn-third-gray);
  margin: 0;
  padding: 0;
}
.trusted-circles-key {
  font-family: "Circular", arial, sans-serif;
  font-size: 13px;
  font-weight: normal;
  letter-spacing: 1px;
  color: rgba(var(--ptn-third-gray-rgb), 0.7);
  margin: 0;
  padding: 0;
}
.trusted-circles-value {
  font-family: "Circular", arial, sans-serif;
  font-size: 16px;
  font-weight: bold;
  line-height: 24px;
  color: rgba(var(--ptn-color-rgb), 0.7);
  margin: 0;
  padding: 0;
}
.trusted-circles-value.big {
  font-size: 25px;
  line-height: 24px;
  color: rgba(var(--ptn-color-rgb), 1);
}
.trusted-circles-price {
  font-family: "Circular", arial, sans-serif;
  font-size: 23px;
  font-weight: normal;
  letter-spacing: 0.7px;
  margin: 0;
  padding: 0;
}
.trusted-circles-free {
  font-family: "Circular", arial, sans-serif;
  font-size: 20px;
  font-weight: normal;
  letter-spacing: 0.7px;
  margin: 0;
  padding: 0;
}
.circle-floor-price {
  min-width: 78px;
}

.circle-description {
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  text-align: start;
	line-height: 14px;
  letter-spacing: 0.7px;
	height: 42px;
  width: 100%;
  margin: 3px 0 7px;
  padding: 0;
	overflow: hidden;
}

/* Start labtop - lg < 1200 */
@media (max-width: 1199px) {
}

/* Start Tablet - md < 992px */
@media (max-width: 991px) {
}

/* Start Mobile - sm < 768px */
@media (max-width: 767px) {
  .trusted-circles-free {
  font-size: 18px;
  letter-spacing: 0.5px;
}
}

/* Start Mini Mobile - None < 576px */
@media (max-width: 575px) {
}
</style>
