<template>
  <div id="account-profile-header">
    <div class="d-flex flex-row justify-content-center align-items-start row">
      <!-- profile info -->
      <div class="col-12 col-md-5 mt-5">
        <div class="d-flex flex-column justify-content-center align-items-start pt-5 ps-2">
          <AvatarImage
            :imageSrc="accountProfile?.account_image_url"
            :name="accountProfile?.account_fullname || accountProfile?.account_nickname"
            :size="150"
            :rounded="false"
            :border="accountProfile?.account_image_url ? false : true"
          />

          <div v-if="accountProfile?.account_fullname" class="account-fullname mt-3">
            {{ accountProfile?.account_fullname }}
            <el-tooltip
              content="Edit Profile"
              placement="top"
              :hide-after="0"
            >
              <a role="button" @click="$router.push('/account/settings?active_page=profile')">
                <i class="fa fa-pencil account-edit-icon ms-1" aria-hidden="true"></i>
              </a>
            </el-tooltip> 
          </div>
          <div v-else class="mt-3 mb-1">
            <div
              type="button"
              @click="$router.push('/account/settings?active_page=profile')"
              class="main-btn orange-bg"
            >
              <span class="m-0 p-0">Enhance Your Profile NFT</span>
            </div>
          </div>

          <span class="account-data mt-2">{{ accountProfile?.account_nickname ? `@${accountProfile?.account_nickname}` : '' }}</span>
          
          <!-- account social -->
          <div class="d-flex flex-row justify-content-center align-items-center gap-2 mt-3">
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

          <!-- TBA Address -->
          <div class="d-flex flex-row justify-content-start align-items-center w-100 mt-3">
            <span class="account-midtext pe-2">Account Address
              <!-- TokenID Info -->
              <el-tooltip
                content="Each profile registered in Piltonet is a<br/>
                Token Bound Account (ERC-6551) to which all contacts and circles are connected.<br/>
                It embeds more technical capabilities into the platform and increases the security of your connected wallet."
                raw-content="true"
                placement="right"
                :hide-after="0"
              >
                <span>
                  <i class="fa fa-info-circle account-info-icon" aria-hidden="true"></i>
                </span>
              </el-tooltip>
            </span>
            <div class="d-flex flex-row justify-content-start align-items-center">
              <span class="account-midtext pe-2">{{ utils.truncate(accountProfile?.account_tba_address, 14) }}</span>
              <span>
                <el-tooltip
                  :content="this.copyAddressTooltip"
                  placement="top"
                  :hide-after="0"
                >
                  <a id="copy-account" role="button" @click="copyAccount('copy-account')">
                    <i class="far fa-copy account-info-icon mt-1"></i>
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
                    <i class="fa fa-external-link account-info-icon" aria-hidden="true"></i>
                  </a>
                </el-tooltip>
              </span>
            </div>
          </div>
          <!-- profile contact -->
          <div class="d-flex flex-row justify-content-start align-items-center w-100 mt-3">
            <span class="account-midtext pe-2">Profile Contract
              <!-- TokenID Info -->
              <el-tooltip
                content="ERC721 Profile Contract"
                placement="top"
                :hide-after="0"
              >
                <span>
                  <i class="fa fa-info-circle account-info-icon" aria-hidden="true"></i>
                </span>
              </el-tooltip>
            </span>
            <span class="account-midtext pe-2">{{ utils.truncate(accountProfile?.profiles_contract_address, 12) }}</span>
            <span>
              <!-- Explore Icon -->
              <el-tooltip
                content="View Profile Contract in Explorer"
                placement="top"
                :hide-after="0"
              >
                <a
                  v-if="explorerProfile"
                  :href="explorerProfile"
                  target="_blank"
                >
                  <i class="fa fa-external-link account-info-icon" aria-hidden="true"></i>
                </a>
              </el-tooltip>
            </span>
          </div>
          <!-- profile TokenID -->
          <div class="d-flex flex-row justify-content-start align-items-center w-100 mt-1">
            <span class="account-midtext pe-2">TokenID
              <!-- TokenID Info -->
              <el-tooltip
                content="The Profile NFT Token ID"
                placement="top"
                :hide-after="0"
              >
                <span>
                  <i class="fa fa-info-circle account-info-icon" aria-hidden="true"></i>
                </span>
              </el-tooltip>
            </span>
            <div class="d-flex flex-row justify-content-center align-items-center gap-2">
              <span class="account-midtext">
                #{{ accountProfile?.account_token_id }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Token Bound Account -->
      <div class="col-12 col-md-7">
        <div class="d-flex flex-column justify-content-end align-items-start w-100 profile-header-top pt-2 pt-md-4 ps-2">
          
          <!-- To Do -->
          <!-- Badges -->
          <template v-if="connectedAccount.account_address == '0x5d974bff1da2ad1325ba5c7c6bf9ee09f0915557'">
            <div class="d-flex flex-row justify-content-center align-items-start row w-100">
              <span class="account-title text-start">Your Badges</span>
  
              <div class="col-2 text-start mt-3">
                <div class="d-flex flex-column justify-content-center align-items-center badge">
                  <img src="@/assets/images/kyc-badge-l1.png" height="100" />
                  <span class="badge-text">KYC - L1</span>
                </div>
                <div class="d-none d-flex flex-column justify-content-center align-items-center mt-2 badge-title minted">
                  <span class="m-0 p-0">
                    <i class="fa fa-check" aria-hidden="true"></i>
                    Minted
                  </span>
                </div>
              </div>
              <div class="col-2 text-start mt-3">
                <div class="d-flex flex-column justify-content-center align-items-center badge claim">
                  <img src="@/assets/images/kyc-badge-l2.png" height="100" class="p-2" />
                  <span class="badge-text claim">KYC - L2</span>
                </div>
                <div class="d-none d-flex flex-column justify-content-center align-items-center mt-2 badge-title claim">
                  <span class="m-0 p-0">
                    <!-- <i class="fa fa-check" aria-hidden="true"></i> -->
                    Claim
                  </span>
                </div>
              </div>
              <div class="col-8"></div>
            </div>
            <div class="horizontal-line mt-3"></div>
          </template>
          <template v-else>
            <div class="badges-div"></div>
          </template>

          <!-- Total Assets -->
          <div class="d-flex flex-column justify-content-center align-items-start w-100 mt-4">
            <span class="account-title">Total Assets
              <span v-if="vic2usdRatio > 0" class="account-smalltext mt-3">{{ `≈ ${utils.fixedNumber(totalBalance, 2, 2)}` }} $</span>
            </span>
            
            <div class="d-flex flex-row justify-content-center align-items-center row w-100 mt-2">
              <div class="col-3 d-flex flex-row justify-content-start align-items-center">
                <span class="account-balance">{{ utils.fixedNumber(vicBalance, 4, 4) }}</span>
                <div class="d-flex flex-row justify-content-center align-items-center pt-1 ps-2">
                  <SvgPaymentToken
                    :chainId="this.defaultchain.chainId"
                    :paymentToken="this.defaultchain.nativeCurrency.address"
                    :tooltip="false"
                    customClass="pe-1"
                  />
                  <p>{{ defaultchain.nativeCurrency.symbol }}</p>
                </div>
              </div>
              <div class="col-9"></div>
            </div>
            
            <div class="d-flex flex-row justify-content-center align-items-center row w-100 mt-2">
              <div class="col-12 col-lg-3 d-flex flex-row justify-content-start align-items-center">
                <span class="account-balance">{{ utils.fixedNumber(cusdBalance, 2, 2) }}</span>
                <div class="d-flex flex-row justify-content-center align-items-center pt-1 ps-2">
                  <SvgPaymentToken
                    :chainId="this.defaultchain.chainId"
                    :paymentToken="this.defaultchain.CUSD.address"
                    :tooltip="false"
                    customClass="pe-1"
                  />
                  <p>{{ defaultchain.CUSD.symbol }}</p>
                </div>
              </div>
              <!-- Top-up & Withdraw -->
              <div class="col-12 col-lg-9 d-flex flex-row justify-content-start align-items-center mt-2 mt-lg-0">
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
                  <div
                    type="button"
                    @click="faucetCUSD"
                    class="main-btn gray-bg ms-2"
                  >
                    <span class="m-0 p-0">Faucet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Total Funded Debt -->
          <div class="d-flex flex-column justify-content-center align-items-start w-100 mt-3">
            <span class="account-title">Total Debt</span>
            
            <!-- To Do -->
            <div class="d-flex flex-row justify-content-center align-items-center row w-100 mt-2">
              <div class="col-12 col-md-3 d-flex flex-row justify-content-start align-items-center">
                <span class="account-balance">{{ utils.fixedNumber(totalDebt, 2, 2) }}</span>
                <div class="d-flex flex-row justify-content-center align-items-center pt-1 ps-2">
                  <SvgPaymentToken
                    :chainId="this.defaultchain.chainId"
                    :paymentToken="'USD-token-address'"
                    :tooltip="false"
                    customClass=""
                  />
                  <p>USD</p>
                </div>
              </div>
              <div class="col-12 col-md-9 d-flex flex-row justify-content-start align-items-center mt-2 mt-md-0">
                <!-- Pay Off Debt -->
                <div class="d-flex flex-row justify-content-center align-items-center">
                  <div
                    type="button"
                    @click="payOffDebt"
                    class="main-btn blue-bg disabled"
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
            <i class="far fa-circle-dot me-2" aria-hidden="true"></i>
            Your Circles
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
    @get-balance="getBalance"
  />

  <MessageModal
    ref="message_modal"
    @ok-clicked="testnetFaucet"
  />

</template>

<script>
import { mapGetters } from "vuex";
import { abi, api } from "@/services";
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
      contract: null,
      totalBalance: 0,
      vicBalance: 0,
      cusdBalance: 0,
      vic2usdRatio: 0,
      totalDebt: 0,
      interval: null,
      copyAddressTooltip: "Copy Address",
      explorerProfile: null,
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
    this.explorerProfile = `${this.defaultchain.blockExplorerUrl}/address/${this.accountProfile.profiles_contract_address}`;
    this.explorerLink = `${this.defaultchain.blockExplorerUrl}/address/${this.accountProfile.account_tba_address}`;
    abi.setAbi(
      "0x", // fixed as VRC25PCUSD address in sdk
      "VRC25PCUSD"
    ).then((contract) => {
      this.contract = contract;
      this.getBalance();
      this.interval = setInterval(() => {
        this.getBalance()
      }, 30 * 1000) // 30 seconds
    });
  },
  mounted() {
    // this.interval = setInterval(() => {
    //   this.getBalance()
    // }, 2 * 60 * 1000) // 2 mins
  },
  unmounted() {
    clearInterval(this.interval);
  },
  methods: {
    async getBalance() {
      api.get_vic_price(false).then((apiResponse) => {
        if(apiResponse && apiResponse.data.done) {
          if(this.vic2usdRatio != apiResponse.data.result[0]) {
            this.vic2usdRatio = apiResponse.data.result[0];
            this.totalBalance = (this.vicBalance * this.vic2usdRatio) + this.cusdBalance;
          }
        } else {
          this.vic2usdRatio = 0;
          this.totalBalance = 0;
        }
      });

      // get tokenbound-acount vic balance
      wallets[this.connectedAccount.connected_wallet].getBalance(this.accountProfile.account_tba_address).then((balance) => {
        if(this.vicBalance != balance) {
          this.vicBalance = balance;
          this.totalBalance = (this.vicBalance * this.vic2usdRatio) + this.cusdBalance;
        }
      }).catch((err) => {
        console.log('wallet.getBalance.err', err);
        // clearInterval(this.interval);
      });

      // get tokenbound-acount cusd balance
      this.contract.interaction("balanceOf", [this.accountProfile.account_tba_address], false, false).then((abiResponse) => {
        if(abiResponse.done) {
          if(this.cusdBalance != abiResponse.result) {
            this.cusdBalance = abiResponse.result;
            this.totalBalance = (this.vicBalance * this.vic2usdRatio) + this.cusdBalance;
          }
        }
      }).catch((err) => {
        console.log('abi.getBalance.err', err);
        // clearInterval(this.interval);
      });
    },
    async topUpCUSD() {
      this.$refs.topup_modal.setTopUp();
    },
    async faucetCUSD() {
      this.$refs.message_modal.setMessage({
        title: 'Faucet',
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
        this.totalBalance = (this.vicBalance * this.vic2usdRatio) + this.cusdBalance;
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
      this.$refs.withdraw_modal.setWithdrawal(totalAssetBalance);
    },
    async copyAccount(id) {
      navigator.clipboard.writeText(this.accountProfile?.account_tba_address);
      document.getElementById(id).innerHTML = '<i class="fa fa-check mt-1" style="color: lightgreen;"></i>'
      this.copyAddressTooltip = "Copied To Clipboard";
      setTimeout(() => {
          this.copyAddressTooltip = "Copy Address";
          document.getElementById(id).innerHTML = '<i class="far fa-copy account-info-icon mt-1" style="color: var(--ptn-third-gray)"></i>';
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
.account-midtext {
  font-size: 17px;
  line-height: 20px;
  font-weight: normal;
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
.account-info-icon {
  font-size: 14px;
  font-weight: 400;
  color: var(--ptn-third-gray);
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
.badges-div {
  height: 200px;
}
.badge {
  background-color: var(--ptn-yellow);
  border-radius: 16px;
  width: 110px;
  height: 125px;
}
.badge.claim {
  background-color: var(--ptn-red) !important;
}
.badge-text {
  font-size: 15px;
  color: #000;
}
.badge-text.claim {
  color: #fff;
}
.badge-title {
  font-family: "Circular", arial, sans-serif;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 0.7px;
  background-color: var(--ptn-green);
  color: var(--ptn-btn-color);
  width: 90px;
  margin: 0 10px;
  height: 18px;
  border-radius: 2px;
}
.badge-title.minted {
  background-color: var(--ptn-green);
  color: var(--ptn-btn-color);
}
.badge-title.claim {
  background-color: var(--ptn-orange);
  color: var(--ptn-btn-color);
}

/* Start labtop - lg < 1200 */
@media (max-width: 1199px) {
}

/* Start Tablet - md < 992px */
@media (max-width: 991px) {
}

/* Start Mobile - sm < 768px */
@media (max-width: 767px) {
  .badges-div {
    height: 0;
  }
}

/* Start Mini Mobile - None < 576px */
@media (max-width: 575px) {
}
</style>
