<template>
  <div id="account-contacts-contact-list">
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
    <div v-if="accountContactsProps.waiting_friends && accountContactsProps.waiting_friends.length > 0" class="main-section">
      <h3>FRIEND REQUESTS</h3>
      <!-- Waiting Friends Contacts -->
      <div v-for="(accountContact, index) in accountContactsProps.waiting_friends"
        :key="accountContact.contact_id"
        class="d-flex flex-column justify-content-center align-items-startr"
        :class="index > 0 ? 'mt-4' : ''"
      >
        <div class="d-flex flex-row justify-content-start align-items-center">
          <img
            v-if="accountContact.account_image_url"
            :src="accountContact.account_image_url"
            alt=""
            class="account-image-small"
          />
          <AvatarImage
            v-if="!accountContact?.account_image_url"
            :name="accountContact?.account_fullname || accountContact?.account_nickname"
            :size="40"
            :border="false"
            :rounded="true"
            class="account-image-small"
          />
          <p class="top-text small ms-2">
            <span>
              {{ accountContact.account_fullname || accountContact.account_nickname }}
            </span>
            <span class="note-text d-none d-sm-inline-block ps-2">
              {{ `friend request on ${utils.formatDate(accountContact.created_at, 'DD Month YYYY')}` }}
            </span>
          </p>
        </div>
        <div class="d-flex flex-column justify-content-start align-items-start mt-2">
          <p class="info-text">
            {{ `${accountContact.account_fullname || accountContact.account_nickname} has requested to be added to your trusted contacts.` }}
          </p>
        </div>
        <div class="d-flex flex-column justify-content-start align-items-start mt-2">
          <div class="d-flex flex-column justify-content-center align-items-start">
            <p class="main-text small">
              {{ `Would you like to confirm this request and add ${accountContact.account_fullname || accountContact.account_nickname} to your contact list? ` }}
            </p>
          </div>
          <div class="d-flex flex-row justify-content-start align-items-center mt-2">
            <div
              type="button"
              @click="acceptWaitingContact(accountContact.contact_id, accountContact.account_tba_address)"
              class="front-btn green-btn"
            >
              <span class="m-0 p-0">Yes, for sure.</span>
            </div>
            <div
              type="button"
              @click="rejectWaitingContact(accountContact.contact_id)"
              class="front-btn blue-btn ms-3"
            >
              <span class="m-0 p-0">Maybe Later!</span>
            </div>
            <div
              type="button"
              @click="reportWaitingContact(accountContact.contact_id)"
              class="front-btn red-btn ms-3"
            >
              <span class="m-0 p-0">Spam</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main-section">
      <h3>CONTACT LIST</h3>
      <!-- Connected Contacts -->
      <div v-if="accountContactsProps.connected">
        <div v-for="(accountContact, index) in accountContactsProps.connected"
          :key="accountContact.contact_id"
          class="d-flex flex-row justify-content-start align-items-center"
          :class="index > 0 ? 'mt-2' : ''"
        >
          <p class="account-contacts-contact-list-check me-0">
            <i class="fa fa-check" aria-hidden="true"></i>
          </p>
          <p class="account-contacts-contact-list-check">
            <i class="fa fa-check" aria-hidden="true"></i>
          </p>
          <img
            v-if="accountContact.account_image_url"
            :src="accountContact.account_image_url"
            alt=""
            class="account-image-small"
          />
          <AvatarImage
            v-if="!accountContact?.account_image_url"
            :name="accountContact?.account_fullname || accountContact?.account_nickname"
            :size="40"
            :border="false"
            :rounded="true"
            class="account-image-small"
          />
          <p class="top-text small ms-2">
            <span>
              {{ accountContact.account_fullname || accountContact.account_nickname }}
            </span>
            <span class="note-text d-none d-sm-inline-block ps-2">
              {{ `your contact since ${utils.formatDate(accountContact.updated_at, 'Month YYYY')}` }}
            </span>
          </p>
        </div>
      </div>
      <!-- Waiting Contacts -->
      <div v-if="accountContactsProps.waiting">
        <p class="note-text mt-3">
          <i class="fa fa-spinner fa-pulse me-1" aria-hidden="true"></i>
          Waiting for the friends' confirmation
        </p>
        <div v-for="(accountContact) in accountContactsProps.waiting"
          :key="accountContact.contact_id"
          class="d-flex flex-row justify-content-start align-items-center mt-2"
        >
          <p class="account-contacts-contact-list-check me-0">
            <i class="fa fa-check" aria-hidden="true"></i>
          </p>
          <p class="account-contacts-contact-list-check gray-btn">
            <i class="fa fa-check" aria-hidden="true"></i>
          </p>
          <img
            v-if="accountContact.account_image_url"
            :src="accountContact.account_image_url"
            alt=""
            class="account-image-small"
          />
          <AvatarImage
            v-if="!accountContact?.account_image_url"
            :name="accountContact?.account_fullname || accountContact?.account_nickname"
            :size="40"
            :border="false"
            :rounded="true"
            class="account-image-small"
          />
          <p class="top-text small ms-2">
            <span>
              {{ accountContact.account_fullname || accountContact.account_nickname }}
            </span>
            <span class="note-text d-none d-sm-inline-block ps-2">
              {{ `waiting from ${utils.formatDate(accountContact.created_at, 'DD Month YYYY')}` }}
            </span>
          </p>
        </div>
      </div>
      <div v-if="!accountContactsProps.connected && !accountContactsProps.waiting">
        <p class="note-text">Your contact list is empty.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { abi, api } from "@/services";
import wallets from "@/wallets";

export default {
  name: "AccountContactsList",
  props: {
    accountContactsProps: Object
  },
  data() {
    return {
      accountIsMain: false,
      shareLink: null,
      showShareLinkModal: false,
      copyLinkTooltip: "Copy Link",
      copyAddressTooltip: "Copy Address",
      networkExplorerUrl: `${this.defaultchain.blockExplorerUrl}/address`,
      hasError: {
        accept_waiting: false
      }
    };
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
    // console.log(this.accountContactsProps);
  },
  methods: {
    ...mapMutations(['setConnectionStore', 'setProfileStore']),
    async acceptWaitingContact(contactId, contactTBA) {
      const contract = await abi.setAbi(
        this.accountProfile.account_tba_address, // sender tba address
        "ERC6551Account"
      );
      // execute ContactList addContact
      let abiResponse = await contract.interaction("executeFunction", [
        "ContactList", // contract name
        "addContact", // function name
        ["function addContact(address contactTBA)"], // function ABI
        [contactTBA], // function args
        0 // value
      ]);
      if(abiResponse.done) {
        let apiResponse = await api.post_account_contacts_accept_waiting_contact({contact_id: contactId});
        if(apiResponse.data.done) {
          this.notif({
            title: "SUCCESS!",
            message: apiResponse.data.message,
            dangerouslyUseHTMLString: true,
            type: apiResponse.data.message_type,
            duration: 3000,
            onClose: () => { this.$router.go() }
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
    async acceptWaitingContactByService(contactId, contactTBA) {
      let personalSign = await this.personalSign();
      if(personalSign) {
        let apiResponse = await api.post_account_contacts_accept_waiting_contact_by_service({
          profile_tba: this.accountProfile.account_tba_address,
          contact_tba: contactTBA,
          contact_id: contactId
        });
        if(apiResponse.data.done) {
          this.notif({
            title: "SUCCESS!",
            message: apiResponse.data.message,
            dangerouslyUseHTMLString: true,
            type: apiResponse.data.message_type,
            duration: 3000,
            onClose: () => { this.$router.go() }
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
    async rejectWaitingContact(contactId) {
      let personalSign = await this.personalSign();
      if(personalSign) {
        let apiResponse = await api.post_account_contacts_reject_waiting_contact({contact_id: contactId});
        if(apiResponse.data.done) {
          this.notif({
            title: "SUCCESS!",
            message: apiResponse.data.message,
            dangerouslyUseHTMLString: true,
            type: apiResponse.data.message_type,
            duration: 3000,
            onClose: () => { this.$router.go() }
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
    async copyAddress(elementId, copyContent) {
      navigator.clipboard.writeText(copyContent);
      document.getElementById(elementId).innerHTML = '<i class="fa fa-check ms-2" style="color: lightgreen;" aria-hidden="true"></i>'
      this.copyAddressTooltip = "Copied To Clipboard";
      setTimeout(() => {
          this.copyAddressTooltip = "Copy Address";
          document.getElementById(elementId).innerHTML = '<i class="far fa-copy ms-2" aria-hidden="true" style="color: rgba(var(--ptn-color-rgb), 0.9)"></i>';
        }, 2000);
    },
  }
}
</script>

<style lang="scss" scoped>
#account-contacts-contact-list {
  width: 96%;
  min-height: calc(100vh - 240px);
}
.account-contacts-contact-list-check {
  color: var(--ptn-green);
  width: 10px;
  padding-top: 10px;
  margin-right: 15px;
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
