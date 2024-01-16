<template>
  <div class="mt-3 mb-5">
    <div class="d-flex flex-column text-center justify-content-center align-items-center">

      <div class="d-flex flex-column text-center justify-content-center align-items-center w-100">
        <p>Twitter Username</p>
        <input
          ref="contract_address"
          type="text"
          class="big-input text-center mt-5 mb-0"
          v-model="username"
        />
        <button class="submit-btn" @click="onBtn1Click">
          BTN 1
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import { ElLoading } from 'element-plus';
// import NavBar from '@/components/NavBar/NavBar.vue';
import { mapGetters } from "vuex";

import particle from "@/wallets/particle";

export default {
  name: "TestPage",

  components: {
    // NavBar
  },

  data() {
    return {
      username: 'piltonet',
      openLoadings: []
    }
  },

  computed: {
    ...mapGetters(['getConnectionStore']),
    connectedAccount() {
      return this.getConnectionStore;
    }
  },

  watch: {
    connectedAccount: async function () {
      await this.setup();
    }
  },

  async mounted() {
  },

  methods: {
    async setup() {
    },
    
    async onBtn1Click() {
      try {
        particle.handleLogin('google');
      } catch (err) {
        console.log('Error:', err);
      }
    },
    async copyPassword() {
      navigator.clipboard.writeText("Arnic@2504");
    }
  }
};
</script>