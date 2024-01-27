<template>
  <NavBar />

  <div v-if="loading" class="page-loading min-vh-100 d-inline-block">
    Work In Progress ...
  </div>

  <div v-else id="account-settings" class="row">
    <div class="col-2 col-md-4 col-xl-3">
      <AccountCirclesCreateSidebar
        :activePage = "activePage"
        :circleInfoProps="circleInfo"
        :circleConstProps="circleConst"
        @set-active-page="setActivePage"
      />
    </div>
    <div class="col-10 col-md-8 col-xl-9 mt-4 my-md-5">
      <AccountCirclesCreateDeploy v-if="activePage == 'deploy'"
        :circleInfoProps="circleInfo"
        :circleConstProps="circleConst"
        @set-active-page="setActivePage"
      />
      <AccountCirclesCreateWhitelist v-else-if="activePage == 'whitelist'"
        :circleInfoProps="circleInfo"
        :circleConstProps="circleConst"
      />
      <AccountCirclesCreateLaunch v-else-if="activePage == 'launch'"
        :circleInfoProps="circleInfo"
        :circleConstProps="circleConst"
      />
    </div>
  </div>

  <FooterBar />
</template>

<script>
import NavBar from '@/components/NavBar/NavBar.vue';
import AccountCirclesCreateSidebar from '@/components/AccountPages/AccountCirclesCreate/AccountCirclesCreateSidebar.vue';
import AccountCirclesCreateDeploy from '@/components/AccountPages/AccountCirclesCreate/AccountCirclesCreateDeploy.vue';
import AccountCirclesCreateWhitelist from '@/components/AccountPages/AccountCirclesCreate/AccountCirclesCreateWhitelist.vue';
import AccountCirclesCreateLaunch from '@/components/AccountPages/AccountCirclesCreate/AccountCirclesCreateLaunch.vue';
import FooterBar from '@/components/FooterBar/FooterBar.vue';
import { mapGetters } from "vuex";
import { abi, api } from "@/services";

export default {
  name: 'AccountCirclesCreate',
  components: {
    NavBar,
    AccountCirclesCreateSidebar,
    AccountCirclesCreateDeploy,
    AccountCirclesCreateWhitelist,
    AccountCirclesCreateLaunch,
    FooterBar
  },
  data() {
    return {
      receivablePages: ['deploy', 'whitelist', 'launch'],
      circleId: null,
      circleInfo: null,
      circleConst: null,
      activePage: 'deploy',
      loading: true
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
  beforeMount() {
    this.setActivePage('active_page' in this.$route.query ? this.$route.query.active_page : null, 'circle_id' in this.$route.query ? this.$route.query.circle_id : null);
  },
  mounted() {
    this.setup();
  },
  watch: {
    $route(to) {
      this.setActivePage('active_page' in to.query ? to.query.active_page : null, 'circle_id' in to.query ? to.query.circle_id : null);
    }
  },
  methods: {
    async setup() {
      this.loading = true;
      const contract = await abi.setAbi(
        "0x", // TLCC mock
        "TLCC"
      );
      let abiResponse = await contract.interaction('getTLCCConstants', []);
      if(abiResponse.done) {
        this.circleConst = abiResponse.result;
      } else {
        this.$router.push('/account/circles');
      }
      this.loading = false;
    },
    async setActivePage(active_page, circle_id, reload = false) {
      if(reload) this.loading = true;
      
      this.activePage = this.receivablePages.includes(active_page) ? active_page : this.receivablePages[0];
      this.circleId = circle_id;
      
      if(this.circleId && this.circleId.length >= 42) {
        let apiResponse = await api.get_account_circles_creator(`circle_id=${this.circleId}`);
        if(apiResponse && apiResponse.data.done) {
          this.circleInfo = apiResponse.data.result[0];
        }
      }

      if(!this.circleId) {
        this.$router.push({path: '/account/circles/create', query: {active_page: this.activePage}})
      } else {
        this.$router.push({path: '/account/circles/create', query: {active_page: this.activePage, circle_id: this.circleId}})
      }

      this.loading = false;
    }
  }
}
</script>
