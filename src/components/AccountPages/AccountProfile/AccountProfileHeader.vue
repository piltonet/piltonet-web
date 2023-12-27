<template>
  <div id="account-profile-header">
    <div class="d-flex flex-row justify-content-center align-items-start row">
      <!-- profile info -->
      <div class="col-12 col-md-4">
        <div class="d-flex flex-column justify-content-center align-items-start pt-5">
          <img
            v-if="accountProfile?.account_image_url"
            :src="accountProfile?.account_image_url"
            alt=""
            class="account-image"
          />
          <JazzIcon
            v-if="!accountProfile?.account_image_url"
            :address="accountProfile?.account_address"
            :diameter="130"
            :colors=jazzColors
            class="account-image"
          />
          <span class="account-fullname mt-3 ms-2">
            {{ accountProfile?.account_fullname || '' }}
            <el-tooltip
              content="Edit Profile"
              placement="top"
              :hide-after="0"
            >
              <a role="button" @click="$router.push('/account/settings?active_page=profile')">
                <i class="fa fa-pencil account-edit-icon ms-1" aria-hidden="true"></i>
              </a>
            </el-tooltip> 
          </span>
          <span class="account-data mt-2 ms-2">{{ accountProfile?.account_nickname ? `@${accountProfile?.account_nickname}` : '' }}</span>
          
          <!-- profile Account -->
          <div class="d-flex flex-row justify-content-start align-items-center w-100 mt-3 ms-2">
            <span class="account-data pe-2">TBA:</span>
            <div class="d-flex flex-row justify-content-center align-items-center gap-2">
              <!-- <span class="account-address mt-3">Main Account: {{ accountProfile?.account_address ? utils.truncate(accountProfile?.account_address, 12) : '' }}</span> -->
              <span class="account-address">{{ utils.truncate(accountProfile?.account_tba_address, 14) }}</span>
              <span>
                <el-tooltip
                  :content="this.copyAddressTooltip"
                  placement="top"
                  :hide-after="0"
                >
                  <a id="copy-account" role="button" @click="copyAccount('copy-account')">
                    <i class="far fa-copy mt-1"></i>
                  </a>
                </el-tooltip>
              </span>
            </div>
          </div>

          <!-- account social -->
          <div class="d-flex flex-row justify-content-center align-items-center gap-2 mt-3 ms-2">
            <!-- account social twitter -->
            <span v-if="accountProfile?.account_social_twitter">
              <a
                :href="`https://twitter.com/${accountProfile?.account_social_twitter}`"
                target="_blank"
              >
                <i class="fab fa-twitter account-social-icons"></i>
              </a>
            </span>
            <!-- account social facebook -->
            <span v-if="accountProfile?.account_social_facebook">
              <a
                :href="`https://facebook.com/${accountProfile?.account_social_facebook}`"
                target="_blank"
              >
                <i class="fab fa-facebook-f account-social-icons"></i>
              </a>
            </span>
            <!-- account social instagram -->
            <span v-if="accountProfile?.account_social_instagram">
              <a
                :href="`https://instagram.com/${accountProfile?.account_social_instagram}`"
                target="_blank"
              >
                <i class="fab fa-instagram account-social-icons"></i>
              </a>
            </span>
            <!-- account social linkedin -->
            <span v-if="accountProfile?.account_social_linkedin">
              <a
                :href="`https://linkedin.com/${accountProfile?.account_social_linkedin}`"
                target="_blank"
              >
                <i class="fab fa-linkedin account-social-icons"></i>
              </a>
            </span>
            <!-- account social telegram -->
            <span v-if="accountProfile?.account_social_telegram">
              <a
                :href="`https://t.me/${accountProfile?.account_social_telegram}`"
                target="_blank"
              >
                <i class="fab fa-telegram account-social-icons"></i>
              </a>
            </span>
          </div>

        </div>
      </div>

      <!-- profile balance -->
      <div class="col-12 col-md-8">
        <div class="d-flex flex-column justify-content-end align-items-start w-100 profile-header-top pt-2 pt-md-4">
          <!-- Total Assets -->
          <div class="d-flex flex-column justify-content-center align-items-start w-100 mt-3">
            <span class="account-title mt-3">Total Assets
              <span class="account-smalltext mt-3">~ 24.63</span>
            </span>
            
            <div class="d-flex flex-row justify-content-center align-items-center row w-100 mt-2">
              <div class="col-3 d-flex flex-row justify-content-start align-items-center">
                <span class="account-balance">2.0130</span>
                <div class="d-flex flex-row justify-content-center align-items-center pt-1 ps-2">
                  <SvgPaymentToken
                    :chainId="this.defaultchain.id"
                    :paymentToken="this.defaultchain.nativeCurrency.address"
                    :tooltip="false"
                    customClass=""
                  />
                  <p>{{ defaultchain.nativeCurrency.symbol }}</p>
                </div>
              </div>
              <!-- To Do -->
              <div class="col-9 d-flex flex-row justify-content-start align-items-center">
                <!-- Deposit & Withdraw -->
                <div class="d-flex flex-row justify-content-center align-items-center d-none">
                  <div
                    type="button"
                    @click="getBalance"
                    class="main-btn"
                  >
                    <span class="m-0 p-0">Deposit</span>
                  </div>
                  <div
                    type="button"
                    @click="getBalance = null"
                    class="main-btn green-bg ms-2"
                  >
                    <span class="m-0 p-0">Withdraw</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="d-flex flex-row justify-content-center align-items-center row w-100 mt-2">
              <div class="col-3 d-flex flex-row justify-content-start align-items-center">
                <span class="account-balance">23.00</span>
                <div class="d-flex flex-row justify-content-center align-items-center pt-1 ps-2">
                  <SvgPaymentToken
                    :chainId="this.defaultchain.id"
                    :paymentToken="this.defaultchain.CUSD.address"
                    :tooltip="false"
                    customClass=""
                  />
                  <p>CUSD</p>
                </div>
              </div>
              <div class="col-9 d-flex flex-row justify-content-start align-items-center">
                <!-- Top-up & Withdraw -->
                <div class="d-flex flex-row justify-content-center align-items-center">
                  <div
                    type="button"
                    @click="topUpCUSD"
                    class="main-btn"
                  >
                    <span class="m-0 p-0">Top-up</span>
                  </div>
                  <div
                    type="button"
                    @click="getBalance = null"
                    class="main-btn green-bg ms-2"
                  >
                    <span class="m-0 p-0">Withdraw</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Total Funded Debt -->
          <div class="d-flex flex-column justify-content-center align-items-start w-100 mt-3">
            <span class="account-title mt-3">Total Debt</span>
            
            <!-- To Do -->
            <div class="d-flex flex-row justify-content-center align-items-center row w-100 mt-2">
              <div class="col-3 d-flex flex-row justify-content-start align-items-center">
                <span class="account-balance">0.00</span>
                <div class="d-flex flex-row justify-content-center align-items-center pt-1 ps-2">
                  <SvgPaymentToken
                    :chainId="this.defaultchain.id"
                    :paymentToken="'PUSD-token-address'"
                    :tooltip="false"
                    customClass=""
                  />
                  <p>USD</p>
                </div>
              </div>
              <div class="col-9 d-flex flex-row justify-content-start align-items-center">
                <!-- Pay Off Debt -->
                <div class="d-flex flex-row justify-content-center align-items-center">
                  <div
                    type="button"
                    @click="getBalance"
                    class="main-btn gray-bg"
                  >
                    <span class="m-0 p-0">Pay Off</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
      <div class="horizontal-line mt-3"></div>
      
      <!-- profile menu -->
      <!-- To Do -->
      <div class="container-fluid d-flex flex-row p-0 mt-3">
        <div v-if="false" class="col-6 d-flex justify-content-start">
          <!-- account circles -->
          <div
            type="button"
            @click="$emit('profileSetActiveTab', 'circles')"
            class="profile-menu d-flex flex-row justify-content-center align-items-center px-3 py-2"
            :class="activeTabProps === 'circles' ? 'active' : ''"
          >
            <i class="fa fa-circle me-1" aria-hidden="true"></i>
            CIRCLES
            <span class="ms-1">
              {{ accountProfile?.account_circles_number }}
            </span>
          </div>
          <!-- account contacts -->
          <div
            type="button"
            @click="$emit('profileSetActiveTab', 'contacts')"
            class="profile-menu last-right d-flex flex-row justify-content-center align-items-center px-3 py-2"
            :class="activeTabProps === 'contacts' ? 'active' : ''"
          >
            <i class="fa fa-user me-1" aria-hidden="true"></i>
            CONTACTS
            <span class="ms-1">
              {{ accountProfile?.account_contacts_number }}
            </span>
          </div>
        </div>
        <div v-if="true" class="col-12 d-flex justify-content-center justify-content-lg-start">
          <!-- account circles -->
          <div
            type="button"
            @click="$router.push('/account/circles')"
            class="profile-link d-flex flex-row justify-content-center align-items-center p-2 mx-2"
          >
            <i class="fa fa-circle me-2" aria-hidden="true"></i>
            Lending Circles
            <!-- To Do -->
            <span v-if="false" class="ms-1">
              {{ accountProfile?.account_circles_number }}
            </span>
          </div>
          <!-- account contacts -->
          <div
            type="button"
            @click="$router.push('/account/contacts')"
            class="profile-link last-right d-flex flex-row justify-content-center align-items-center p-2 mx-2"
          >
            <i class="fa fa-user me-2" aria-hidden="true"></i>
            Contact List
            <!-- To Do -->
            <span v-if="false" class="ms-1">
              {{ accountProfile?.account_contacts_number }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>

  <TopUpModal
    ref="topup_modal"
  />

</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { ethers } from 'ethers'
// import abi from "@/services/abi";
import wallets from "@/wallets";
import TopUpModal from "@/components/CustomModals/TopUpModal.vue";

export default {
  name: "AccountProfileHeader",
  components: {
    TopUpModal
  },
  props: {
    activeTabProps: String
  },
  data() {
    return {
      copyAddressTooltip: "Copy Address"
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
  methods: {
    ...mapActions(['fetchProfileBalance']),
    async getBalance() {
      const provider = new ethers.BrowserProvider(wallets[this.connectedAccount.connected_wallet].getProvider() || window.ethereum);
      
      const balance = await provider.getBalance(this.accountProfile.account_tba_address);
      console.log(balance);
      // const signer = await provider.getSigner();
      // const contract = abi.setAbi(
      //   this.accountProfile.account_tba_address,
      //   "ERC6551Account",
      //   signer
      // );
      // // execute ERC1155Contracts addContact
      // let abiResponse = await contract.interaction("balance", []);
      // console.log(abiResponse);

      // await this.fetchProfileBalance({
      //   account_tba_address: this.accountProfile?.account_tba_address,
      //   signer: signer
      // });
    },
    async topUpCUSD() {
      this.$refs.topup_modal.setTopUp();
    },
    async copyAccount(id) {
      navigator.clipboard.writeText(this.accountProfile?.account_tba_address);
      document.getElementById(id).innerHTML = '<i class="fa fa-check mt-1" style="color: lightgreen;"></i>'
      this.copyAddressTooltip = "Copied To Clipboard";
      setTimeout(() => {
          this.copyAddressTooltip = "Copy Address";
          document.getElementById(id).innerHTML = '<i class="far fa-copy mt-1"></i>';
        }, 2000);
    },
  }
}
</script>

<style lang="scss" scoped>
.profile-header-top {
  min-height: 330px;
}
.account-image {
  width: 130px;
  height: 130px;
  object-fit: cover;
  border: none;
  border-radius: 8px;
}
.account-fullname {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 23px;
  line-height: 30px;
  font-weight: bold;
  color: rgba(var(--ptn-color-rgb), 1);
}
.account-title {
  font-family: "RobotoB", arial, sans-serif;
  font-size: 22px;
  line-height: 30px;
  font-weight: bold;
  color: rgba(var(--ptn-second-blue-rgb), 0.8);
}
.account-data {
  font-size: 20px;
  line-height: 20px;
  font-weight: bold;
  color: rgba(var(--ptn-color-rgb), 0.8);
}
.account-smalltext {
  font-size: 13px;
  line-height: 20px;
  font-weight: bold;
  color: rgba(var(--ptn-color-rgb), 0.8);
}
.account-balance {
  font-family: "RobotoB", arial, sans-serif;
  font-size: 23px;
  line-height: 30px;
  font-weight: bold;
  color: rgba(var(--ptn-color-rgb), 0.8);
}
.account-address {
  font-size: 20px;
  line-height: 20px;
  font-weight: normal;
  color: rgba(var(--ptn-color-rgb), 0.8);
}
.account-edit-icon {
  font-size: 16px;
  font-weight: 400;
  color: var(--ptn-btn-bg);
}
.account-social-icons {
    font-size: 19px;
}
.profile-link {
  background: var(--ptn-bg);
  color: rgba(var(--ptn-color-rgb), 0.8);
}
.profile-link svg {
  color: rgba(var(--ptn-blue-rgb), 0.7);
}
.profile-link span {
  border-radius: 50%;
  background: rgba(var(--ptn-blue-rgb), 0.9);
  color: var(--ptn-color);
  width: 25px;
  height: 25px;
}
.profile-menu {
  background: var(--ptn-bg);
  color: rgba(var(--ptn-color-rgb), 0.5);
  border-top: solid 1px var(--ptn-gray);
  border-left: solid 1px var(--ptn-gray);
  border-bottom: solid 1px var(--ptn-gray);
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  margin-bottom: -1px;
  z-index: 1000;
}
.profile-menu svg {
  color: rgba(var(--ptn-blue-rgb), 0.3);
}

.profile-menu.last-right {
  border-right: solid 1px var(--ptn-gray);
}
.profile-menu.active {
  color: rgba(var(--ptn-color-rgb), 0.8);
  border-bottom: solid 1px var(--ptn-bg);
}
.profile-menu.active svg {
  color: var(--ptn-blue);
}

.horizontal-line {
  height: 1px;
  background-color: rgba(var(--ptn-color-rgb), 0.6);
  width: calc(100% - 10px);
  margin: auto;
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
