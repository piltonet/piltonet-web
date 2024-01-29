<template>
  <div v-if="circleInfoProps" id="account-circles-contacts" class="row">
    <div class="d-flex flex-column justify-content-center align-items-start mx-auto py-4">
      <button
        type="button" 
        class="back-btn p-0"
        @click="$router.push('/account/circles')"
      >
        <i class="fa fa-arrow-left px-2" aria-hidden="true"></i>
        <span class="pe-2">Back</span>
      </button>
    </div>
    <div class="main-section">
      <h3>CIRCLE WHITELIST</h3>
      <!-- Ciecle Whitelists -->
      <div v-if="circleInfoProps.whitelists">
        <div v-for="(whitelist, index) in circleInfoProps.whitelists"
          :key="whitelist.whitelist_account_address"
          class="d-flex flex-row justify-content-start align-items-center"
          :class="index > 0 ? 'mt-2' : ''"
        >
          <p class="account-circles-contacts-check me-0">
            <i class="fa fa-check" aria-hidden="true"></i>
          </p>
          <p
            class="account-circles-contacts-check"
            :class="whitelist.whitelist_is_joined ? '' : (whitelist.whitelist_is_rejected ? 'red-btn' : 'gray-btn')"
          >
            <i class="fa fa-check" aria-hidden="true"></i>
          </p>
          <img
            v-if="whitelist.account_image_url"
            :src="whitelist.account_image_url"
            alt=""
            class="account-image-small"
          />
          <AvatarImage
            v-if="!whitelist.account_image_url"
            :name="whitelist.account_fullname || whitelist.account_nickname"
            :size="40"
            :border="false"
            :rounded="true"
            class="account-image-small"
          />
          <!-- <JazzIcon
            v-if="!whitelist.account_image_url"
            :address="whitelist.whitelist_account_address"
            :diameter="40"
            :colors=jazzColors
            class="account-image-small"
          /> -->
          <p class="top-text small ms-2">
            <span :class="whitelist.whitelist_is_rejected ? 'text-decoration-line-through' : ''">
              {{ whitelist.account_tba_address == connectedAccount.account_tba_address ? 'You' : whitelist.account_fullname || whitelist.account_nickname }}
            </span>
            <span v-if="!whitelist.whitelist_is_joined && !whitelist.whitelist_is_rejected" class="note-text d-none d-sm-inline-block ps-2">
              {{ whitelist.account_tba_address == connectedAccount.account_tba_address ? 'whitelisted as the circle host.' : `whitelisted on ${utils.formatDate(whitelist.updated_at, 'DD Month YYYY')}` }}
              <!-- <i class="fa fa-spinner fa-pulse ms-1" aria-hidden="true"></i> -->
            </span>
            <span v-if="whitelist.whitelist_is_joined" class="note-text d-none d-sm-inline-block ps-2">
              {{ `accepted on ${utils.formatDate(whitelist.updated_at, 'DD Month YYYY')}` }}
            </span>
            <span v-if="whitelist.whitelist_is_rejected" class="note-text d-none d-sm-inline-block ps-2">
              {{ `rejected on ${utils.formatDate(whitelist.updated_at, 'DD Month YYYY')}` }}
            </span>
          </p>
          <div
            v-if="circleInfoProps.circle_status == 'deployed' && whitelist.account_tba_address != connectedAccount.account_tba_address"
            type="button"
            @click="removeFromWhitelist(whitelist.account_tba_address)"
            class="front-btn red-btn ms-3"
          >
            <span class="m-0 p-0">Remove</span>
          </div>
        </div>
        <div v-if="!circleInfoProps.whitelists || circleInfoProps.whitelists.length < minMembers">
          <p class="help-text mt-4">
            <i class="fa fa-asterisk me-1" aria-hidden="true"></i>
            {{ `You need to add at least ${minMembers - circleInfoProps.whitelists.length} more contact(s) to the whitelist before launch the circle.` }}
          </p>
        </div>
        <div v-else-if="circleInfoProps.whitelists.length <= circleInfoProps.circle_size">
          <p class="help-text mt-4">
            <i class="fa fa-asterisk me-1" aria-hidden="true"></i>
            {{ `${circleInfoProps.whitelists.length} out of the required ${circleInfoProps.circle_size}
              members have been added to the circle's whitelist.` }}
          </p>
        </div>
        <div v-else>
          <p class="help-text mt-4">
            <i class="fa fa-asterisk me-1" aria-hidden="true"></i>
            {{ `${circleInfoProps.whitelists.length} individuals have been included in the whitelist, exceeding the maximum limit of ${circleInfoProps.circle_size} circle members.` }}
          </p>
        </div>
      </div>
      <div v-else>
        <p class="note-text">The whitelist is empty.</p>
      </div>
    </div>
    <div class="main-section">
      <h3>AVAILABLE CONTACTS</h3>
      <!-- Available Contacts -->
      <div v-if="circleInfoProps.contacts && circleInfoProps.contacts.length > 0">
        <!-- Top Links -->
        <div class="d-flex flex-row justify-content-start align-items-center mb-4">
          <div
            type="button"
            @click="selectAllContacts()"
            class="front-btn blue-btn"
          >
            <span class="m-0 p-0">Select All</span>
          </div>
          <div
            type="button"
            @click="deselectAllContacts()"
            class="front-btn blue-btn ms-3"
          >
            <span class="m-0 p-0">Deselect All</span>
          </div>
        </div>
        <div v-for="(contact, index) in circleInfoProps.contacts"
          :key="contact.contact_id"
          class="d-flex flex-row justify-content-start align-items-center"
          :class="index > 0 ? 'mt-2' : ''"
        >
          <div
            :id="`select-contact-${contact.contact_id}`"
            type="button"
            @click="selectContact(`select-contact-${contact.contact_id}`, contact.account_tba_address)"
            class="check-btn me-3"
          >
            <i class="far fa-square" aria-hidden="true" style="color: rgba(var(--ptn-color-rgb), 0.9)"></i>
          </div>
          <img
            v-if="contact.account_image_url"
            :src="contact.account_image_url"
            alt=""
            class="account-image-small"
          />
          <AvatarImage
            v-if="!contact.account_image_url"
            :name="contact.account_fullname || contact.account_nickname"
            :size="40"
            :border="false"
            :rounded="true"
            class="account-image-small"
          />
          <!-- <JazzIcon
            v-if="!contact.account_image_url"
            :address="contact.account_tba_address"
            :diameter="40"
            :colors=jazzColors
            class="account-image-small"
          /> -->
          <p class="top-text small ms-2">
            <span>
              {{ contact.account_fullname || contact.account_nickname }}
            </span>
            <span class="note-text d-none d-sm-inline-block ps-2">
              {{ `your contact since ${utils.formatDate(contact.updated_at, 'Month YYYY')}` }}
            </span>
          </p>
          <div
            type="button"
            @click="inviteContact(contact.account_tba_address)"
            class="front-btn green-btn ms-3"
          >
            <span class="m-0 p-0">Whitelist</span>
          </div>
        </div>
        <div class="d-flex flex-column justify-content-center align-items-start mt-3">
          <div
            type="button"
            @click="inviteSelectedContacts"
            class="front-btn green-btn"
          >
            <span class="m-0 p-0">Whitelist Selected Contacts</span>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="note-text">The list of remaining contacts is empty.</p>
        <p class="main-text small mt-4">
          <i class="fa fa-asterisk pe-1" aria-hidden="true"></i>
          If you don't have enough contacts, click
          <span
            role="button"
            @click="$router.push('/account/contacts?active_page=inviteFriends')"
            class="front-btn blue-btn fw-bold"
          >
            here
          </span>
          and invite your friends.
        </p>
      </div>
    </div>

  </div>

  <NotFound v-else />

</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { abi, api } from "@/services";
import wallets from "@/wallets";
import NotFound from '@/pages/NotFound.vue';

// const { LendingCircleContract } = require('@/contracts');

export default {
  name: "AccountCirclesCreateWhitelist",
  components: {
    NotFound
  },
  props: {
    circleInfoProps: Object,
    circleConstProps: Object
  },
  data() {
    return {
      selectedContacts: {},
      contactAdrs: [],
      minMembers: 0
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
    circleInfoProps: function () {
      this.setup();
    },
    circleConstProps: function () {
      this.setupConst();
    }
  },
  methods: {
    ...mapMutations(['setConnectionStore', 'setProfileStore']),
    async setup() {
      for(let contact of this.circleInfoProps.contacts || []) {
        this.selectedContacts[contact.account_tba_address] = false;
      }
      this.setupConst();
    },
    async setupConst() {
      if(this.circleConstProps) {
        this.minMembers = this.circleConstProps['CIRCLES_MIN_MEMBERS'];
      }
    },
    async inviteContact(contactAdr) {
      this.contactAdrs = [contactAdr];
      this.addToWhitelist();
    },
    async inviteSelectedContacts() {
      this.contactAdrs = [];
      for(let contact of this.circleInfoProps.contacts) {
        if(this.selectedContacts[contact.account_tba_address]) {
          this.contactAdrs.push(contact.account_tba_address)
        }
      }
      if(this.contactAdrs.length == 0) {
        this.notif({
          message: "No contact has been selected.",
          dangerouslyUseHTMLString: true,
          type: "error",
          duration: 3000,
        })
        return;
      }
      this.addToWhitelist();
    },
    async addToWhitelist() {
      if(this.contactAdrs.length > 0) {
        try {
          let abiResponse = null;
          if(this.circleInfoProps.circle_mode == 'fully_dec') {
            abiResponse = await this.addToWhitelistFDCircle();
          } else {
            abiResponse = await this.addToWhitelistSDCircle();
          }
          if(abiResponse.done) {
            let apiResponse = await api.post_account_circles_creator_whitelists_add(
              {
                circle_id: this.circleInfoProps.circle_id,
                contact_adrs: JSON.stringify(this.contactAdrs)
              }
            );
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
        } catch(err) {
          this.notif({
            title: "OOPS!",
            message: "Something went wrong, please try again later.",
            dangerouslyUseHTMLString: true,
            type: "error",
            duration: 3000,
          })
          console.log(err);
        }
      }
    },
    async addToWhitelistFDCircle() {
      const contract = await abi.setAbi(
        this.accountProfile.account_tba_address, // sender tba address
        "ERC6551Account"
      );
      // execute TLCC addToWhitelist
      return await contract.interaction("executeFunction", [
        "TLCC", // contract name
        "addToWhitelist", // function name
        ["function addToWhitelist(address[] memory accounts)"], // function ABI
        [this.contactAdrs], // function args
        0, // value
        this.circleInfoProps.circle_id // Contract Address
      ]);
    },
    async addToWhitelistSDCircle() {
      let personalSign = await this.personalSign();
      if(personalSign) {
        return {done: true};
      } else {
        return {done: false};
      }
    },
    async removeFromWhitelist(whitelistedAdr) {
      console.log(whitelistedAdr);
      // try {
      //   const circleContractAddress = this.circleInfoProps.circle_id;
      //   const circleContract = await venomwallet.getDeployedContract(LendingCircleContract, circleContractAddress);
      //   const circleOwner = new Address(this.connectedAccount.account_tba_address);
      //   const transaction = await circleContract.methods.removeFromWhitelist({
      //     delistedAddress: [whitelistedAdr]
      //   }).send({
      //     from: circleOwner,
      //     amount: "0"
      //   });
      //   this.openLoadings[loadingId].close();

      //   // console.log('transaction:', transaction);
        
      //   if(transaction) {
      //     let apiResponse = await api.post_account_circles_creator_whitelists_remove(
      //       {
      //         circle_id: this.circleInfoProps.circle_id,
      //         contact_adrs: JSON.stringify([whitelistedAdr])
      //       }
      //     );
      //     if(apiResponse.data.done) {
      //       this.notif({
      //         title: "SUCCESS!",
      //         message: apiResponse.data.message,
      //         dangerouslyUseHTMLString: true,
      //         type: apiResponse.data.message_type,
      //         duration: 3000,
      //         onClose: () => { this.$router.go() }
      //       })
      //     } else {
      //       if(apiResponse.data.status_code == "401") {
      //         this.setConnectionStore({ is_connected: false });
      //         this.setProfileStore(null);
      //         this.$router.go();
      //       } else {
      //         this.notif({
      //           title: "OOPS!",
      //           message: apiResponse.data.message,
      //           dangerouslyUseHTMLString: true,
      //           type: apiResponse.data.message_type,
      //           duration: 3000,
      //         })
      //       }
      //     }
      //   } else {
      //     this.notif({
      //       title: "OOPS!",
      //       message: "Something went wrong, please try again later.",
      //       dangerouslyUseHTMLString: true,
      //       type: "error",
      //       duration: 3000,
      //     })
      //   }
      // } catch(err) {
      //   this.openLoadings[loadingId].close();
      //   this.notif({
      //     title: "OOPS!",
      //     message: "Something went wrong, please try again later.",
      //     dangerouslyUseHTMLString: true,
      //     type: "error",
      //     duration: 3000,
      //   })
      //   console.log(err);
      // }
    },
    async selectAllContacts() {
      for(let contact of this.circleInfoProps.contacts) {
        this.selectedContacts[contact.account_tba_address] = true;
        document.getElementById(`select-contact-${contact.contact_id}`).innerHTML = '<i class="far fa-check-square" aria-hidden="true" style="color: rgba(var(--ptn-color-rgb), 0.9)"></i>'
      }
    },
    async deselectAllContacts() {
      for(let contact of this.circleInfoProps.contacts) {
        this.selectedContacts[contact.account_tba_address] = false;
        document.getElementById(`select-contact-${contact.contact_id}`).innerHTML = '<i class="far fa-square" aria-hidden="true" style="color: rgba(var(--ptn-color-rgb), 0.9)"></i>'
      }
    },
    async selectContact(elementId, contactAdr) {
      this.selectedContacts[contactAdr] = !this.selectedContacts[contactAdr];
      if(this.selectedContacts[contactAdr]) {
        document.getElementById(elementId).innerHTML = '<i class="far fa-check-square" aria-hidden="true" style="color: rgba(var(--ptn-color-rgb), 0.9)"></i>'
      } else {
        document.getElementById(elementId).innerHTML = '<i class="far fa-square" aria-hidden="true" style="color: rgba(var(--ptn-color-rgb), 0.9)"></i>'
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
    }
  }
}
</script>

<style lang="scss" scoped>
#account-circles-contacts {
  width: 96%;
  max-width: 940px;
  min-height: calc(100vh - 240px);
}
.account-circles-contacts-check {
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
