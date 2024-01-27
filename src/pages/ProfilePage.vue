<template>
  <div v-if="profileInfo" class="container-fluid m-0 p-0">
    <div class="account-profile">
      <div class="container-fluid m-0 p-0">
        <ProfileHeader
          :profileInfoProps="profileInfo"
          :activeTabProps="activeTab"
          @profile-set-active-tab="setActiveTab"
        />
      </div>
    </div>
  </div>
  <NotFound v-else-if="!loading" />
</template>

<script>
import ProfileHeader from '@/components/ProfilePage/ProfileHeader.vue';
import NotFound from '@/pages/NotFound.vue';
import { api } from "@/services";

export default {
  name: 'ProfilePage',
  components: {
    ProfileHeader,
    NotFound
  },
  data() {
    return {
      profileInfo: null,
      activeTab: 'collected',
      loading: true
    }
  },
  created() {
    this.setup();
  },
  methods: {
    async setup() {
      this.loading = true;
      try {
        const profileIndex = this.$route.fullPath.split('/')[2];
        let apiResponse = await api.get_profile(`profile_index=${profileIndex}`);
        if(apiResponse.data.done && apiResponse.data.result?.length > 0) {
          this.profileInfo = apiResponse.data.result[0];
        } else {
          this.profileInfo = null;
        }
      } catch(err) {
        console.log(err);
        this.profileInfo = null;
      }
      this.loading = false;
    },
    async setActiveTab(activeTab) {
      this.activeTab = activeTab;
    }
  }
}
</script>

<style scoped>
</style>

