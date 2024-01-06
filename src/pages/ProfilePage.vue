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
      <div class="profile-nfts my-5 px-3">
        <div class="row">
          <!-- <div class="col-3">
            <ProfileSidebar />
          </div> -->
          <div class="col-12">
            <ProfileNfts
              :profileInfoProps="profileInfo"
              :activeTabProps="activeTab"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <NotFound v-else-if="!loading" />
</template>

<script>
// import ProfileSidebar from '@/components/ProfilePage/ProfileSidebar.vue';
import ProfileNfts from '@/components/ProfilePage/ProfileNfts.vue';
import ProfileHeader from '@/components/ProfilePage/ProfileHeader.vue';
import NotFound from '@/pages/NotFound.vue';
// import { mapActions, mapGetters } from "vuex";
import api from "@/services/api";

export default {
  name: 'ProfilePage',
  components: {
    // ProfileSidebar,
    ProfileNfts,
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
.profile-nfts {
  min-height: 500px;
  background-color: #f7f7f7;
}

/* Start Mini Mobile - None < 576px */
@media (max-width: 575px) {
}
</style>

