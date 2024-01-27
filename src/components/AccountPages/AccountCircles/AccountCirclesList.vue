<template>
  <div id="account-circles-list">
    
    <!-- Whitelisted -->
    <template v-if="accountCirclesProps.whitelisted?.length > 0">
      <div class="d-flex flex-row row">
        <div class="col-12 d-flex justify-content-center justify-content-md-start align-items-center mt-5 mb-3">
          <h2 class="account-circles-list-title">YOU ARE INVITED</h2>
        </div>
      </div>
      <div class="d-flex flex-row row">
        <div
          v-for="circle in accountCirclesProps.whitelisted || []"
          :key="circle.circle_id"
          :id="`circle-whitelisted-${index}`"
          class="col-12 col-md-6 col-lg-6 col-xl-4 col-xxl-4 p-2"
        >
          <AccountCirclesCardN
            :accountCircleProps="circle"
            accountRoleProps="whitelisted"
          />
        </div>
      </div>
  
      <div class="d-flex justify-content-center justify-content-md-start align-items-center mt-5">
        <div class="horizontal-line"></div>
      </div>
    </template>

    <!-- Joined -->
    <template v-if="accountCirclesProps.joined?.length > 0">
      <div class="d-flex flex-row row">
        <div class="col-12 d-flex justify-content-center justify-content-md-start align-items-center mt-5 mb-3">
          <h2 class="account-circles-list-title">YOU HAVE JOINED</h2>
        </div>
      </div>
      <div class="d-flex flex-row row">
        <div
          v-for="(circle, index) in accountCirclesProps.joined || []"
          :key="circle.circle_id"
          :id="`circle-joined-${index}`"
          class="col-12 col-md-6 col-lg-6 col-xl-4 col-xxl-4 p-2"
        >
          <AccountCirclesCardN
            :accountCircleProps="circle"
            accountRoleProps="joined"
          />
        </div>
      </div>
  
      <div class="d-flex justify-content-center justify-content-md-start align-items-center mt-5">
        <div class="horizontal-line"></div>
      </div>
    </template>

    <!-- Creating -->
    <div class="d-flex flex-row row">
      <div class="col-12 col-md-6 d-flex justify-content-center justify-content-md-start align-items-center mt-5 mb-3">
        <h2 class="account-circles-list-title">YOUR CIRCLES</h2>
      </div>
      <div class="col-12 col-md-6 d-flex justify-content-center justify-content-md-end align-items-center mt-4">
        <div
          type="button"
          @click="createNewCircleOnTestnet"
          class="account-circles-list-create-btn"
        >
        <span class="m-0 ps-1">CREATE NEW CIRCLE</span>
        </div>
      </div>
    </div>
    <div class="d-flex flex-row row">
      <div
        v-for="circle in accountCirclesProps.creating || []"
        :key="circle.circle_id"
        class="col-12 col-md-6 col-lg-4 col-xl-3"
      >
        <AccountCirclesCard
          :accountCircleProps="circle"
          accountRoleProps="creating"
        />
      </div>
    </div>

  </div>

  <MessageModal
    ref="message_modal"
    @ok-clicked="createNewCircle"
  />

</template>

<script>
import { mapGetters } from "vuex";
import AccountCirclesCard from "@/components/AccountPages/AccountCircles/AccountCirclesCard.vue";
import AccountCirclesCardN from "@/components/AccountPages/AccountCircles/AccountCirclesCardN.vue";

export default {
  name: "AccountCirclesList",
  components: {
    AccountCirclesCard,
    AccountCirclesCardN
  },
  props: {
    accountCirclesProps: Object,
  },
  computed: {
    ...mapGetters(['getProfileStore']),
    accountProfile() {
      return this.getProfileStore;
    }
  },
  mounted() {
    // console.log(this.accountCirclesProps);
  },
  methods: {
    createNewCircleOnTestnet() {
      // if(this.accountProfile.account_contacts_number < 2) {
      //   this.notif({
      //     title: "INVITE MORE FRIENDS",
      //     message: "You need at least two contacts to create your own circle.",
      //     dangerouslyUseHTMLString: true,
      //     type: "error",
      //     duration: 3000,
      //   })
      // } else {
        this.$refs.message_modal.setMessage({
          title: 'Beta Version',
          message: 'This is a test version of lending circles on Viction Testnet. In future updates, your information may be deleted without notice.',
          okBtn: 'I Like To Test',
          cancelBtn: null,
          customStyle: 'text-align: start !important; padding-left: 1rem !important;'
        });
      // }
    },
    createNewCircle() {
      this.$router.push({path: '/account/circles/create', query: {active_page: 'deploy'}});
    }
  }
};
</script>

<style lang="scss" scoped>
#account-circles-list {
  width: 96%;
  max-width: 1300px;
  min-height: calc(100vh - 240px);
  margin: 30px auto;
}
.account-circles-list-title {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 28px;
  font-weight: 400;
  line-height: 32px;
  text-align: center;
  color: var(--ptn-color);
  max-width: 900px;
  margin: 15px 10px;
  padding: 0;
}
.account-circles-list-create-btn {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 16px;
  line-height: 45px;
  text-align: center;
  color: var(--ptn-btn-bg);
  border: solid 2px var(--ptn-btn-bg);
  border-radius: 8px;
  cursor: pointer;
  width: 175px;
  height: auto;
  margin: 15px;
}
.horizontal-line {
  border-top: 1px solid rgba(var(--ptn-color-rgb), 0.3);
  width: calc(98% - 10px);
  margin: auto;
}
</style>
