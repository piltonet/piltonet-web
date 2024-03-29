<template>
  <div id="account-contacts-invite-code">
		<div class="d-flex flex-column justify-content-center align-items-start mx-auto py-4">
      <button
        type="button" 
        class="back-btn p-0"
        @click="$router.push('/account/profile')"
      >
        <i class="fa fa-arrow-left px-2" aria-hidden="true"></i>
        <span class="pe-2">Back</span>
      </button>
    </div>
    <div class="main-section">
      <h3>I HAVE AN INVITE CODE</h3>
      <div v-if="!inviteAccount" class="account-contacts-invite-code-form">
				<form @submit.prevent>
          <!-- Invite Code -->
					<label for="inviteCode" class="input-label">Enter The Code</label>
					<input
            ref="invite_code"
						id="inviteCode"
						type="text"
						class="smaller-input mb-0"
            :class="hasError['invite_code'] ? 'has-error' : ''"
            placeholder="e.g. AbC123"
						aria-describedby="fullnameHelp"
						v-model="inviteCode"
					/>
					<p id="fullnameHelp" class="help-text mb-3">
            Enter the invite code you received from a friend. The code is case-sensitive.
					</p>
          
					<!-- Save Button -->
					<input
						type="submit"
						value="FETCH THE CODE"
						@click="fetchInviteCode"
					/>

        </form>
      </div>
      <form action=""></form>
      
      <div v-if="inviteAccount" class="container-fluid d-flex flex-column justify-content-center align-items-center my-3">
        <img
          v-if="inviteAccount.account_image_url"
          :src="inviteAccount.account_image_url"
          alt=""
          class="account-contacts-invite-code-account-image"
        />
        <AvatarImage
          v-if="!inviteAccount?.account_image_url"
          :name="inviteAccount?.account_fullname || inviteAccount?.account_nickname"
          :size="130"
          :border="true"
          :rounded="false"
          class="account-contacts-invite-code-account-image p-0"
        />
        <p>
          <span class="account-contacts-invite-code-account account-fullname">
            {{ inviteAccount.account_fullname }}
          </span>
        </p>
        <p>
          <span class="account-contacts-invite-code-account">
            {{ `@${inviteAccount.account_nickname}` }}
          </span>
        </p>

        <!-- account social -->
        <div class="gap-2 my-2 d-flex flex-row justify-content-center align-items-center">
          <!-- account social twitter -->
          <span v-if="inviteAccount.account_social_twitter">
            <a
              :href="`https://twitter.com/${inviteAccount.account_social_twitter}`"
              target="_blank"
            >
              <i class="fab fa-twitter account-social-icons"></i>
            </a>
          </span>
          <!-- account social facebook -->
          <span v-if="inviteAccount.account_social_facebook">
            <a
              :href="`https://facebook.com/${inviteAccount.account_social_facebook}`"
              target="_blank"
            >
              <i class="fab fa-facebook-f account-social-icons"></i>
            </a>
          </span>
          <!-- account social instagram -->
          <span v-if="inviteAccount.account_social_instagram">
            <a
              :href="`https://instagram.com/${inviteAccount.account_social_instagram}`"
              target="_blank"
            >
              <i class="fab fa-instagram account-social-icons"></i>
            </a>
          </span>
          <!-- account social linkedin -->
          <span v-if="inviteAccount.account_social_linkedin">
            <a
              :href="`https://linkedin.com/${inviteAccount.account_social_linkedin}`"
              target="_blank"
            >
              <i class="fab fa-linkedin account-social-icons"></i>
            </a>
          </span>
          <!-- account social telegram -->
          <span v-if="inviteAccount.account_social_telegram">
            <a
              :href="`https://t.me/${inviteAccount.account_social_telegram}`"
              target="_blank"
            >
              <i class="fab fa-telegram account-social-icons"></i>
            </a>
          </span>
        </div>
      </div>
      
      <div v-if="inviteAccount" class="d-flex flex-column justify-content-center align-items-start my-2">
        <p class="main-text small">
          {{ `Would you like to add ${inviteAccount.account_fullname || inviteAccount.account_nickname} to your trusted contacts?` }}
        </p>
        <div class="row mt-2">
          <div
            type="button"
            @click="acceptInviteCode"
            class="front-btn green-btn"
          >
            <span class="m-0 p-0">Yes, for sure.</span>
          </div>
          <div
            type="button"
            @click="inviteAccount = null"
            class="front-btn red-btn ms-3"
          >
            <span class="m-0 p-0">Decline</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { abi, api } from "@/services";
import wallets from "@/wallets";

export default {
  name: "AccountContactsInviteCode",
  data() {
    return {
      inviteCode: '',
      inviteAccount: null,
      hasError: {
        invite_code: false,
      }
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
  methods: {
    ...mapMutations(['setConnectionStore', 'setProfileStore']),
    async fetchInviteCode() {
      if(this.checkForm()) {
        let apiResponse = await api.get_account_contacts_fetch_invite_code(`invite_code=${this.inviteCode}`);
        if(apiResponse.data.done) {
          this.inviteAccount = apiResponse.data.result[0];
          // this.notif({
          //   title: "SUCCESS!",
          //   message: apiResponse.data.message,
          //   dangerouslyUseHTMLString: true,
          //   type: apiResponse.data.message_type,
          //   duration: 3000,
          // })
        } else {
          if(apiResponse.data.status_code == "401") {
            this.setConnectionStore({ is_connected: false });
            this.setProfileStore(null);
            this.$router.go();
          } else {
            this.notif({
              title: "OOPS!",
              message: apiResponse.data.message,
              dangerouslyUseHTMLString: true,
              type: apiResponse.data.message_type,
              duration: 3000,
            })
          }
        }
      }
    },
    async acceptInviteCode() {
      const contract = await abi.setAbi(
        this.accountProfile.account_tba_address, // sender tba address
        "ERC6551Account"
      );
      // execute ContactList addContact
      let abiResponse = await contract.interaction("executeFunction", [
        "ContactList", // contract name
        "addContact", // function name
        ["function addContact(address contactTBA)"], // function ABI
        [this.inviteAccount.account_tba_address], // function args
        0 // value
      ]);
      if(abiResponse.done) {
        let apiResponse = await api.post_account_contacts_accept_invite_code({invite_code: this.inviteAccount.account_invite_code});
        if(apiResponse.data.done) {
          this.notif({
            title: "SUCCESS!",
            message: apiResponse.data.message,
            dangerouslyUseHTMLString: true,
            type: apiResponse.data.message_type,
            duration: 3000,
            onClose: () => { this.$router.push("/account/contacts?active_page=contactList") }
          })
        } else {
          if(apiResponse.data.status_code == "401") {
            this.setConnectionStore({ is_connected: false });
            this.setProfileStore(null);
            this.$router.go();
          } else {
            this.notif({
              title: "OOPS!",
              message: apiResponse.data.message,
              dangerouslyUseHTMLString: true,
              type: apiResponse.data.message_type,
              duration: 3000,
            })
          }
        }
      }
    },
    // To Do
    // temporarily due to json-rpc error
    async acceptInviteCodeBySerice() {
      let personalSign = await this.personalSign();
      if(personalSign) {
        let apiResponse = await api.post_account_contacts_accept_invite_code_by_service({
          profile_tba: this.accountProfile.account_tba_address,
          contact_tba: this.inviteAccount.account_tba_address,
          invite_code: this.inviteAccount.account_invite_code
        });
        if(apiResponse.data.done) {
          this.notif({
            title: "SUCCESS!",
            message: apiResponse.data.message,
            dangerouslyUseHTMLString: true,
            type: apiResponse.data.message_type,
            duration: 3000,
            onClose: () => { this.$router.push("/account/contacts?active_page=contactList") }
          })
        } else {
          if(apiResponse.data.status_code == "401") {
            this.setConnectionStore({ is_connected: false });
            this.setProfileStore(null);
            this.$router.go();
          } else {
            this.notif({
              title: "OOPS!",
              message: apiResponse.data.message,
              dangerouslyUseHTMLString: true,
              type: apiResponse.data.message_type,
              duration: 3000,
            })
          }
        }
      }
    },
    async personalSign() {
      let personalSignResult = await wallets[this.connectedAccount.connected_wallet].personalSign(
        "This request requires your signature. It won't cost you anything." +
          `\nTimestamp: ${new Date().getTime()}`,
        this.connectedAccount.account_address,
				null
      );
      return personalSignResult;
    },
    checkForm() {
      try {
        Object.keys(this.hasError).forEach(element => {
          if(this.inviteCode == null || this.inviteCode.length != 6) {
            this.$refs[element].focus();
            this.hasError[element] = true;
            this.notif({
              message: "The invite code is not entered correctly.",
              type: "error",
              duration: 3000,
              onClose: () => { this.hasError[element] = false }
            })
            throw false;
          }
        });
        return true;
      } catch(err) {
        // console.log(err);
        return false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#account-contacts-invite-code {
  width: 96%;
  min-height: calc(100vh - 240px);
}
.account-contacts-invite-code-account-image {
  width: 130px;
  height: 130px;
  object-fit: cover;
  border: none;
  border-radius: 50%;
  margin-bottom: 10px;
}
.account-contacts-invite-code-account {
  font-size: 20px;
  // font-weight: Bold;
  line-height: 30px;
  // color: rgba(var(--ptn-second-blue-rgb), 0.9) !important;
}
.account-contacts-invite-code-account.account-fullname {
  font-size: 25px;
  font-weight: Bold;
  line-height: 35px;
  color: rgba(var(--ptn-second-blue-rgb), 0.9) !important;
}
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
