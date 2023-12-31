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
          <AvatarIcon
            v-if="!accountProfile?.account_image_url"
            :name="accountProfile?.account_fullname || accountProfile?.account_nickname"
            :size="150"
            :rounded="false"
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
                    <i class="fa fa-external-link main-text-small" aria-hidden="true"></i>
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
              <span class="account-smalltext mt-3">~ {{ utils.fixedNumber(totalBalance, 2, 2) }} $</span>
            </span>
            
            <div class="d-flex flex-row justify-content-center align-items-center row w-100 mt-2">
              <div class="col-3 d-flex flex-row justify-content-start align-items-center">
                <span class="account-balance">{{ utils.fixedNumber(vicBalance, 4, 2) }}</span>
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
              <div class="col-9"></div>
            </div>
            
            <div class="d-flex flex-row justify-content-center align-items-center row w-100 mt-2">
              <div class="col-3 d-flex flex-row justify-content-start align-items-center">
                <span class="account-balance">{{ utils.fixedNumber(cusdBalance, 2, 2) }}</span>
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
              <!-- Top-up & Withdraw -->
              <div class="col-9 d-flex flex-row justify-content-start align-items-center">
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
                    @click="withdrawCUSD"
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
                <span class="account-balance">{{ totalDebt }}</span>
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
                    @click="payOffDebt"
                    class="main-btn gray-bg disabled"
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
      <div class="container-fluid d-flex flex-row p-0 mt-3">
        <div class="col-12 d-flex justify-content-center justify-content-lg-start">
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
        </div>
      </div>

    </div>
  </div>

  <TopUpModal
    ref="topup_modal"
  />
  
  <WithdrawModal
    ref="withdraw_modal"
  />

  <MessageModal
    ref="message_modal"
    @ok-clicked="testnetFaucet"
  />

</template>

<script>
import { mapGetters } from "vuex";
import { ethers } from 'ethers'
import abi from "@/services/abi";
import api from "@/services/api";
import wallets from "@/wallets";
import TopUpModal from "@/components/CustomModals/TopUpModal.vue";
import WithdrawModal from "@/components/CustomModals/WithdrawModal.vue";

export default {
  name: "AccountProfileHeader",
  components: {
    TopUpModal,
    WithdrawModal
  },
  props: {
    activeTabProps: String
  },
  data() {
    return {
      totalBalance: 0,
      vicBalance: 0,
      cusdBalance: 0,
      totalDebt: 0,
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
  created() {
    this.explorerLink = `${this.defaultchain.blockExplorerUrl}/address/${this.accountProfile.account_tba_address}`;
    this.getBalance();
  },
  mounted() {
    this.interval = setInterval(() => {
      this.getBalance()
    }, 2 * 60 * 1000) // 2 mins
  },
  unmounted() {
    clearInterval(this.interval);
  },
  methods: {
    async getBalance() {
      // To Do
      console.log('getBalance');
      const vic2usdRatio = 0.78;

      const provider = new ethers.BrowserProvider(wallets[this.connectedAccount.connected_wallet].getProvider() || window.ethereum);
      
      // get tokenbound-acount vicBalance
      provider.getBalance(this.accountProfile.account_tba_address).then((_vicBalance) => {
        if(this.vicBalance != _vicBalance) {
          console.log('_vicBalance', _vicBalance);
          this.vicBalance = _vicBalance;
          this.totalBalance = (this.vicBalance * vic2usdRatio) + this.cusdBalance;
        }
      }).catch((err) => {
        console.log('getSigner.err', err);
        clearInterval(this.interval);
      });

      provider.getSigner().then((signer) => {
        // get tokenbound-acount pcusdBalance
        const contract = abi.setAbi(
          "0x", // fixed as VRC25PCUSD address in sdk
          "VRC25PCUSD",
          signer
        );
        contract.interaction("balanceOf", [this.accountProfile.account_tba_address], false).then((abiResponse) => {
          if(abiResponse.done) {
            let _cusdBalance = parseInt(abiResponse.result.toString()) / 1e6;
            if(this.cusdBalance != _cusdBalance) {
              console.log('_cusdBalance', _cusdBalance);
              this.cusdBalance = _cusdBalance;
              this.totalBalance = (this.vicBalance * vic2usdRatio) + this.cusdBalance;
            }
          }
        });
      }).catch((err) => {
        console.log('getSigner.err', err);
        clearInterval(this.interval);
      });
      
      

    },
    async topUpCUSD() {
      // this.$refs.topup_modal.setTopUp();
      this.$refs.message_modal.setMessage({
        title: 'Top-up CUSD',
        message: 'You are using the testnet version. You can request 50 PCUSD to test the app.',
        okBtn: 'Claim Test Token',
        cancelBtn: "Close",
        customStyle: 'width: 430px;'
      });
    },
    async testnetFaucet() {
      let apiResponse = await api.post_account_testnet_faucet({account_tba_address: this.accountProfile.account_tba_address});
      if(apiResponse.data.done) {
        this.cusdBalance = apiResponse.data.result[0];
        const vic2usdRatio = 0.78;
        this.totalBalance = (this.vicBalance * vic2usdRatio) + this.cusdBalance;
        this.notif({
          title: "SUCCESS!",
          message: apiResponse.data.message,
          dangerouslyUseHTMLString: true,
          type: apiResponse.data.message_type,
          duration: 3000,
          onClose: () => {}
        })
      } else {
        if(apiResponse.data.status_code == "401") {
          this.setConnectionStore({ is_connected: false });
          this.setProfileStore(null);
          this.$router.go();
        } else {
          this.notif({
            // title: "OOPS!",
            message: apiResponse.data.message,
            dangerouslyUseHTMLString: true,
            type: apiResponse.data.message_type,
            duration: 3000,
          })
        }
      }
    },
    async withdrawCUSD() {
      let totalAssetBalance = {
        VIC: this.vicBalance,
        CUSD: this.cusdBalance,
      }
      this.$refs.withdraw_modal.setTopUp(totalAssetBalance);
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
