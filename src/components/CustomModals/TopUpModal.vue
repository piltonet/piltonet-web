<template>
  <el-dialog 
    id="topup-modal"
    v-model="showModal"
    title="Top-up Your Profile Account"
    class="topup-dialog pt-3"
    :style="''"
  >
    <div class="d-flex flex-column justify-content-center align-items-start p-2">
      
      <!-- Top-up Token -->
      <div class="d-flex flex-column justify-content-center align-items-start">
        <label for="circleRoundDays" class="input-label">
          1. Select Coin/Token
        </label>
        <div class="d-flex flex-row justify-content-center align-items-center">
          <button
            class="topup-button"
            :class="topupToken == 'USDT' ? 'selected' : ''"
            @click="topupToken = 'USDT'; topupNetwork = 'ERC20'; topupAddress = '0x5ea04c1ba419d1ad1b26a515258b70bc8240db37'"
          >
            <SvgPaymentToken
              :chainId="this.defaultchain.id"
              :paymentToken="'USDT-token-address'"
              :tooltip="false"
              customClass="m-1 me-2"
            />
            <p>Tether (USDT)</p>
          </button>
          <button
            class="topup-button ms-2"
            :class="topupToken == 'CUSD' ? 'selected' : ''"
            @click="topupToken = 'CUSD'; topupNetwork = 'VRC20'; topupAddress = '0x94688d177029574FE9013006811261377FE52DD2'"
          >
            <SvgPaymentToken
              :chainId="this.defaultchain.id"
              :paymentToken="'CUSD-token-address'"
              :tooltip="false"
              customClass="m-1 me-2"
            />
            <p>CUSD</p>
          </button>
          <button
            class="topup-button ms-2"
            :class="topupToken == 'DAI' ? 'selected' : 'disabled'"
            @click="nothing"
          >
            <SvgPaymentToken
              :chainId="this.defaultchain.id"
              :paymentToken="'DAI-token-address'"
              :tooltip="false"
              customClass="m-1 me-2"
            />
            <p>DAI</p>
          </button>
        </div>
      </div>
      
      <!-- Top-up Network -->
      <div class="d-flex flex-column justify-content-center align-items-start mt-4">
        <label for="circleRoundDays" class="input-label">
          2. Select Network
        </label>
        <!-- USDT -->
        <div v-if="topupToken == 'USDT'" class="d-flex flex-row justify-content-center align-items-center">
          <button
            class="topup-button"
            :class="topupNetwork == 'ERC20' ? 'selected' : ''"
            @click="topupNetwork = 'ERC20'; topupAddress = '0x5ea04c1ba419d1ad1b26a515258b70bc8240db37'"
          >
            <p>ERC20 (Ethereum/ERC-20)</p>
          </button>
          <button
            class="topup-button ms-2"
            :class="topupNetwork == 'TRC20' ? 'selected' : ''"
            @click="topupNetwork = 'TRC20'; topupAddress = 'TMa5FhP2TKXqgbTR6K7LLe9pxD39uc5ozV'"
          >
            <p>TRC20 (TRON)</p>
          </button>
        </div>
        <!-- CUSD -->
        <div v-if="topupToken == 'CUSD'"  class="d-flex flex-row justify-content-center align-items-center">
          <button
            class="topup-button"
            :class="topupNetwork == 'VRC20' ? 'selected' : ''"
            @click="topupNetwork = 'VRC20'; topupAddress = '0x94688d177029574FE9013006811261377FE52DD2'"
          >
            <p>Viction</p>
          </button>
        </div>
      </div>
      
      <!-- Top-up Address -->
      <div class="d-flex flex-column justify-content-center align-items-center w-100 mt-5">
        <label for="circleRoundDays" class="input-label">
          Deposit To:
        </label>
        <div class="d-flex flex-row justify-content-center align-items-center gap-2 mt-4">
          <span class="topup-address">{{ this.topupAddress }}</span>
          <span>
            <el-tooltip
              :content="this.copyAddressTooltip"
              placement="top"
              :hide-after="0"
            >
              <a id="copy-address" role="button" @click="copyAccount('copy-address')">
                <i class="far fa-copy mt-1"></i>
              </a>
            </el-tooltip>
          </span>
        </div>
      </div>

    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="success" class="ok-btn px-4 mt-2" @click="closeModal">Ok</el-button>
      </span>
    </template>

  </el-dialog>
</template>

<script>
export default {
  name: "TopUpModal",
  data() {
    return {
      topupToken: "USDT",
      topupNetwork: "ERC20",
      topupAddress: "0x5ea04c1ba419d1ad1b26a515258b70bc8240db37",
      showModal: false,
      copyAddressTooltip: "Copy Address"
    };
  },
  methods: {
    async setTopUp() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async copyAccount(id) {
      navigator.clipboard.writeText(this.topupAddress);
      document.getElementById(id).innerHTML = '<i class="fa fa-check mt-1" style="color: lightgreen;"></i>'
      this.copyAddressTooltip = "Copied To Clipboard";
      setTimeout(() => {
          this.copyAddressTooltip = "Copy Address";
          document.getElementById(id).innerHTML = '<i class="far fa-copy mt-1"></i>';
        }, 2000);
    }
  },
};
</script>
    
<style lang="scss" scoped>
#topup-modal {
  z-index: 9000;
}
.topup-button {
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
.topup-button.selected {
  color: var(--ptn-second-blue);
  border: 1px solid var(--ptn-second-blue);
  cursor: default;
}
.topup-button.locked {
  color: rgba(var(--ptn-second-blue-rgb), 0.7) !important;
  border: 1px solid rgba(var(--ptn-second-blue-rgb), 0.7) !important;
}
.topup-button.disabled {
  color: rgba(var(--ptn-color-rgb), 0.1);
  border: 1px solid rgba(var(--ptn-color-rgb), 0.1);
  cursor: default;
}
.topup-address {
  font-size: 18px;
  line-height: 20px;
  font-weight: normal;
  color: rgba(var(--ptn-color-rgb), 0.8);
  border: 2px solid var(--ptn-second-blue);
  border-radius: 8px;
  padding: 7px 15px;
}
.ok-btn {
  min-width: 120px;
  height: 32px;
}
</style>
