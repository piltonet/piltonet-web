<template>
  <div id="account-circles-members">
    <div class="main-section">
      <h3>JOINED MEMBERS</h3>
      <!-- Circle Members -->
      <div v-if="circleInfoProps.circle_total_members > 0">
        <div v-for="(member, index) in circleInfoProps.circle_members"
          :key="index"
          :class="'member_id' in member ? 'align-items-center row my-2 ms-2 ms-md-4' : 'd-none'"
        >
          <template v-if="member.main_account_address">
            <AvatarImage
              :imageSrc="member.account_image_url"
              :name="member.account_fullname || member.account_nickname"
              :size="40"
              :border="false"
              :rounded="true"
              :status="member.main_account_address == connectedAccount.account_address ? 'online' : false"
              class="account-image-small"
            />
            <p class="top-text small ms-2">
              <!-- To Do -->
              <span v-if="false">
                {{ member.main_account_address == connectedAccount.account_address ? (isCircleCreator ? 'You (HOST)' : (isCircleModerator ? 'You (moderator)' : 'You'))
                  : member.main_account_address == circleInfoProps.circle_creator_main ? `${member.account_fullname || member.account_nickname} (HOST)`
                  : member.member_is_moderator ? `${member.account_fullname || member.account_nickname} (moderator)` : member.account_fullname || member.account_nickname }}
              </span>
              <span>
                {{ member.account_fullname || member.account_nickname }}
              </span>
              <span class="note-text ps-2">
                {{ `joined on ${utils.formatDate(member.created_at, 'DD Month YYYY', 'HH:MM')}` }}
              </span>
            </p>
          </template>
        </div>
      </div>
      <div v-else>
        <span class="note-text">The member list is empty.</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'AccountCirclesMembers',
  props: {
    circleInfoProps: Object
  },
  data() {
    return {
      isCircleCreator: false,
      isCircleModerator: false
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
  mounted() {
    this.setup();
    // console.log(this.circleInfoProps);
  },
  watch: {
    circleIdProps: function () {
      this.setup();
    }
  },
  methods: {
    setup() {
      if(this.circleInfoProps.circle_creator_main == this.connectedAccount.account_address) {
        this.isCircleCreator = true;
        this.isCircleModerator = true;
      } else {
        this.isCircleCreator = false;
        this.isCircleModerator = false;
        this.circleInfoProps.circle_members.forEach(member => {
          if('main_account_address' in member && member.main_account_address == this.connectedAccount.account_address && member.member_is_moderator) {
            this.isCircleModerator = true;
          }
        });
      }

    }
  }
}
</script>

<style lang="scss" scoped>

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
