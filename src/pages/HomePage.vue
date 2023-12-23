<template>
  <div class="container-fluid m-0 p-0">
    <VictionHackathonModal/>
    <NavBar ref="nav_bar" />
    <JumboTron @connect-wallet="onConnectButtonClick" />
    <PiltonetSteps />
    <HowWorks />
    <WaitingList />
    <FooterBar />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar/NavBar.vue'
import JumboTron from '@/components/HomePage/JumboTron.vue'
import HowWorks from '@/components/HomePage/HowWorks.vue'
import PiltonetSteps from '@/components/HomePage/PiltonetSteps.vue'
import WaitingList from '@/components/HomePage/WaitingList.vue'
import FooterBar from '@/components/FooterBar/FooterBar.vue'
import VictionHackathonModal from "@/components/CustomModals/VictionHackathonModal.vue";

export default {
  name: 'HomePage',
  components: {
    NavBar,
    JumboTron,
    HowWorks,
    PiltonetSteps,
    WaitingList,
    FooterBar,
    VictionHackathonModal
  },
  methods: {
    async onConnectButtonClick() {
      await this.$refs.nav_bar.onConnectButtonClick();
    }
  }
}
</script>

<style scoped>
</style>

