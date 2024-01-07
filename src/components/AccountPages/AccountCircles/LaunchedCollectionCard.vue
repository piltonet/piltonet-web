<template>
  <div
    id="collection-card"
    role="button"
    @mouseover="mouseOver = true"
    @mouseleave="mouseOver = false"
    class="d-flex flex-column justify-content-start align-items-center collections-card p-2"
    :class="{'mouse-over': mouseOver}"
    @click="$router.push(`/launch/${collectionInfoProps.collection_id}`)"
  >
    <div v-if="collectionInfoProps && collectionInfoProps.collection_id" class="collections-container row">

      <div class="d-flex flex-row justify-content-center align-items-center collections-img-container">
        <img v-if="collectionInfoProps.collection_banner_url" class="collections-banner" :src="collectionInfoProps.collection_banner_url"/>
        <img v-else class="collections-banner" :style="`background-color: #${utils.randomColor(
          collectionInfoProps.collection_id.substring(10, 20) +
          collectionInfoProps.collection_name + 
          collectionInfoProps.collection_id.substring(20, 30)
        )};`" src="@/assets/images/blank-16@9x1000-t.svg"/>
        <img v-if="false" class="collections-banner overlay" src="@/assets/images/blank-16@9x1000-t.svg"/>
        <img v-if="collectionInfoProps.collection_logo_url"
          :src="collectionInfoProps.collection_logo_url"
          :alt="collectionInfoProps.collection_name"
          class="collections-logo"
        />
        <div v-if="!collectionInfoProps.collection_logo_url"
          class="collections-logo"
          :style="`background-color: #${utils.randomColor(collectionInfoProps.collection_id?.substring(10, 20) +
          collectionInfoProps.collection_name + 
          collectionInfoProps.collection_contract_address?.substring(20, 30)
        )};`"
      ></div>
      </div>

      <div class="d-flex flex-column justify-content-center align-items-start text-start mb-2 px-4">
        <div class="d-flex flex-row justify-content-start align-items-center text-start">
          <a :href="`/collection/${collectionInfoProps.collection_direct_link || collectionInfoProps.collection_id}`" target="_blank">
            <p class="collection-name">
              {{ collectionInfoProps.collection_name }}
            </p>
          </a>
          <img v-if="collectionInfoProps.collection_verified"
            src="@/assets/icons/verified-icon.svg"
            class="verified-icon ps-1"
          />
        </div>
        <pre class="collection-description">{{ collectionInfoProps.collection_description }}</pre>
      </div>

      <div class="d-flex flex-row justify-content-center align-items-end px-4">
        
        <div class="d-flex flex-row justify-content-start align-items-center w-100">
          <div class="d-flex flex-column justify-content-center align-items-center pe-3">
            <p class="trend-collections-value">{{ collectionInfoProps.launch_max_supply }}</p>
            <p class="trend-collections-key">ITEMS</p>
          </div>
          <div class="d-flex flex-column justify-content-center align-items-center pe-3">
            <p class="trend-collections-value">{{ collectionInfoProps.launch_total_supply }}</p>
            <p class="trend-collections-key">MINTED</p>
          </div>
          <div v-if="collectionInfoProps.collection_floor_price" class="d-flex flex-column justify-content-center align-items-center collection-floor-price">
            <div class="d-flex flex-row justify-content-end align-items-center">
              <p class="trend-collections-value">{{ utils.formatPrice(collectionInfoProps.collection_floor_price) }}</p>
              <img
                v-if="mintToken == 'lua'"
                src="@/assets/icons/luatoken-icon.svg"
                alt=""
                class="price-token-icon small ps-1"
              />
              <img
                v-else
                src="@/assets/icons/vic-icon.svg"
                alt=""
                class="price-token-icon small ps-1"
              />
            </div>
            <p class="trend-collections-key">FLOOR PRICE</p>
          </div>
        </div>

        <div class="d-flex flex-row justify-content-end align-items-end w-100">
          <div v-if="parseFloat(collectionInfoProps.collection_mint_price) > 0"
            class="d-flex flex-row justify-content-end align-items-center"
          >
            <p class="trend-collections-price">{{ collectionInfoProps.collection_mint_price }}</p>
            <img
              v-if="mintToken == 'lua'"
              src="@/assets/icons/luatoken-icon.svg"
              alt=""
              class="price-token-icon ps-1"
            />
            <img
              v-else
              src="@/assets/icons/vic-icon.svg"
              alt=""
              class="price-token-icon ps-1"
            />
          </div>
          <div v-else class="d-flex flex-row justify-content-end align-items-center">
            <p class="trend-collections-free">FREE TO MINT</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LaunchedCollectionCard",
  props: {
    collectionInfoProps: Object,
  },
  data() {
    return {
      mintToken: this.collectionInfoProps.contract_mint_token == process.env.VUE_APP_LUA_CONTRACT_ADDRESS ? 'lua' : 'vic',
      mouseOver: false
    }
  },
  mounted() {
    // console.log(this.collectionInfoProps);
  },
};
</script>

<style lang="scss" scoped>
#collection-card {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.collections-card {
  background-color: #FFFFFF;
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

.collection-name {
  font-family: "Roboto", Helvetica, Arial, sans-serif;
  font-size: 23px;
  font-weight: bold;
  line-height: 35px;
  color: rgba(0, 0, 0, 0.7);
  border-bottom: solid 1px transparent;
  width: 100%;
  overflow: hidden;
  text-wrap: nowrap;
}
.collection-name:hover {
  font-size: 25px;
  color: rgba(0, 0, 0, 0.9);
  // border-bottom-color: rgba(0, 0, 0, 0.7);
}
.verified-icon {
  width: 25px;
  height: 25px;
}

.trend-collections-key {
  font-family: "Hansief", Helvetica, Arial, sans-serif;
  font-size: 13px;
  font-weight: normal;
  letter-spacing: 1px;
  color: #888888;
  margin: 0;
  padding: 0;
}
.trend-collections-value {
  font-family: "Hansief", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: bold;
  line-height: 20px;
  margin: 0;
  padding: 0;
}
.trend-collections-price {
  font-family: "Hansief", Helvetica, Arial, sans-serif;
  font-size: 23px;
  font-weight: normal;
  letter-spacing: 0.7px;
  margin: 0;
  padding: 0;
}
.trend-collections-free {
  font-family: "Hansief", Helvetica, Arial, sans-serif;
  font-size: 20px;
  font-weight: normal;
  letter-spacing: 0.7px;
  margin: 0;
  padding: 0;
}
.collection-floor-price {
  min-width: 78px;
}

.collection-description {
	font-family: "Roboto", Helvetica, Arial, sans-serif;
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
  .trend-collections-free {
  font-size: 18px;
  letter-spacing: 0.5px;
}
}

/* Start Mini Mobile - None < 576px */
@media (max-width: 575px) {
}
</style>
