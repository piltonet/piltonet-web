<template>
  <CropperModal ref="cropper_modal" />
  <div id="account-settings-profile">
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
		<div v-if="accountProfile" class="main-section">
      <h3>PROFILE SETTING</h3>
      <div class="account-settings-profile-form">
        
				<form @submit.prevent>
          <!-- Profile Image -->
					<label for="accountProfileImage" class="input-label">Profile Image</label>
					<label
						v-if="!accountProfile.account_image_url"
						class="label-profile-image"
						for="profileImage"
					>	
						<img alt="" src="@/assets/icons/upload-icon.svg" />
						<span id="span">Upload Image</span>
						<input
							id="profileImage"
							class="d-none"
							type="file"
							accept="image/*"
							@change="onProfileImageChange"
						/>
					</label>
					<p
						v-if="!accountProfile.account_image_url"
						id="profileImageHelp"
						class="help-text pt-2 mb-3"
					>
            Upload a profile image. The suggested aspect ratio is 1:1.
					</p>
					<div id="profileImagePreview">
						<div class="position-relative">
              <el-tooltip
                content="Remove"
                placement="top"
                :hide-after="0"
              >
                <button
                  v-if="accountProfile.account_image_url"
                  type="button" 
                  class="btn position-absolute top-0 start-0 p-0 m-0"
                  @click="profileImageRemove"
                >
                  <i class="fa fa-close text-muted" aria-hidden="true"></i>
                </button>
              </el-tooltip>
              <el-tooltip
                content="Crop"
                placement="top"
                :hide-after="0"
              >
                <button
                  v-if="accountProfile.account_image_url"
                  type="button"
                  class="btn position-absolute top-0 start-0 p-0 m-0 ms-4"
                  @click="profileImageCrop"
                >
                  <i class="fa fa-crop text-muted" aria-hidden="true"></i>
                </button>
              </el-tooltip>
							<img
								v-if="accountProfile.account_image_url"
								:src="accountProfile.account_image_url"
								class="profile-image"
							/>
						</div>
					</div>

          <!-- Full Name -->
          <label for="accountFullName" class="input-label mt-2">
            Full Name
          </label>
					<input
            ref="account_fullname"
						id="accountFullName"
						type="text"
						class="small-input"
            :class="hasError['account_fullname'] ? 'has-error' : ''"
						placeholder="Enter Your Full Name"
						aria-describedby="fullnameHelp"
						v-model="accountProfile.account_fullname"
					/>
					<!-- To Do -->
          <p v-if="false" id="fullnameHelp" class="help-text pt-2 mb-3">
            Full name is only visible to your trusted network.
					</p>
          
          <!-- Nickname -->
          <label for="accountNickname" class="input-label mt-2">
            Nickname
            <span class="input-label-small">(Required)</span>
          </label>
					<input disabled
            ref="account_nickname"
						id="accountNickname"
						type="text"
						class="small-input"
            :class="hasError['account_nickname'] ? 'has-error' : ''"
						placeholder="Enter A Nickname"
						aria-describedby="usernameHelp"
						v-model="accountProfile.account_nickname"
					/>
					<!-- To Do -->
          <p v-if="false" id="usernameHelp" class="help-text pt-2 mb-3">
						Nickname is public and it will appear on your profile.
					</p>
          
          <!-- Email -->
          <label for="accountEmail" class="input-label mt-2">
            Email
            <span class="input-label-small">(Required)</span>
          </label>
					<input disabled
            ref="account_email"
						id="accountEmail"
						type="text"
						class="small-input"
            :class="hasError['account_email'] ? 'has-error' : ''"
						placeholder="Enter Your Email"
						aria-describedby="emailHelp"
						v-model="accountProfile.account_email"
					/>
					<!-- To Do -->
          <p v-if="false" id="emailHelp" class="help-text pt-2 mb-3">
						Email is only visible to your trusted network.
					</p>

					<!-- Social -->
					<label for="accountSocial" class="input-label mt-2">Social</label>
          <!-- Social Twitter -->
          <div class="account-social-links" @click="$refs.account_social_twitter.focus()">
            <i class="fab fa-twitter fa-lg account-social-icons pe-2"></i>
            <span class="account-social-links-prefix d-none d-sm-flex">https://twitter.com/</span>
            <div class="w-100">
              <input
                ref="account_social_twitter"
                id="linkTwitter"
                type="text"
                placeholder="YourTwitter"
                class="account-social-links-input"
                v-model="accountProfile.account_social_twitter"
              />
            </div>
          </div>
          <!-- Social Instagram -->
          <div class="account-social-links" @click="$refs.account_social_instagram.focus()">
            <i class="fab fa-instagram fa-lg account-social-icons pe-2"></i>
            <span class="account-social-links-prefix d-none d-sm-flex">https://instagram.com/</span>
            <div class="w-100">
              <input
                ref="account_social_instagram"
                id="linkInstagram"
                type="text"
                placeholder="YourInstagram"
                class="account-social-links-input"
                v-model="accountProfile.account_social_instagram"
              />
            </div>
          </div>
          <!-- Social Telegram -->
          <div class="account-social-links" @click="$refs.account_social_telegram.focus()">
            <i class="fab fa-telegram fa-lg account-social-icons pe-2"></i>
            <span class="account-social-links-prefix d-none d-sm-flex">https://t.me/</span>
            <div class="w-100">
              <input
                ref="account_social_telegram"
                id="linkTelegram"
                type="text"
                placeholder="YourTelegram"
                class="account-social-links-input"
                v-model="accountProfile.account_social_telegram"
              />
            </div>
          </div>
          
					<!-- Token Bound Account -->
          <div class="my-3">
            <label for="accountAddress" class="input-label mt-2">Token Bound Account</label>
            <input disabled
              id="accountAddress"
              type="text"
              class="big-input mb-0"
              v-model="accountProfile.account_tba_address"
            />
          </div>
          
					<!-- Save Button -->
					<input
						type="submit"
						value="SAVE CHANGES"
						v-on:click="saveSettings"
					/>
        </form>
      </div>
      <form action=""></form>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { api } from "@/services";
import CropperModal from "@/components/CustomModals/CropperModal.vue";
import wallets from "@/wallets";

export default {
  name: "AccountSettingsProfile",
  components: {
    CropperModal,
  },
  props: {
    connectedAccountProps: Object,
    accountProfileProps: Object,
  },
  data() {
    return {
      connectedAccount: this.connectedAccountProps,
      accountProfile: this.accountProfileProps,
      hasError: {
        // account_nickname: false,
        // account_email: false
      }
    }
  },
  watch: {
    connectedAccountProps: function () {
      this.connectedAccount = this.connectedAccountProps;
    },
    accountProfileProps: function () {
      this.accountProfile = this.accountProfileProps;
    }
  },
  methods: {
    ...mapMutations(['setConnectionStore', 'setConnectionStoreByKey', 'setProfileStore']),
    // Profile Image
    async onProfileImageChange(e) {
      const selectedProfileImage = e.target.files[0];
      this.accountProfile.account_image_url = URL.createObjectURL(selectedProfileImage);
      this.accountProfile.account_image_file = await this.convertBlobToBase64(selectedProfileImage);
    },
    profileImageCrop() {
      this.showCropperModal(
        "account-profile-image",
        this.accountProfile.account_image_url
      );
      window.addEventListener("account-profile-image-changed", (event) => {
        this.accountProfile.account_image_url = event.detail.imageURL;
        this.accountProfile.account_image_file = event.detail.imageURL;
      });
    },
    profileImageRemove() {
      this.accountProfile.account_image_file = null;
      this.accountProfile.account_image_url = null;
    },
    async showCropperModal(imageKind, imageURL) {
      await this.$refs.cropper_modal.setCropper(imageKind, imageURL);
    },
    async saveSettings() {
      if(this.checkForm()) {
        let personalSign = await this.personalSign();
        if(personalSign) {
          let apiResponse = await api.post_account_profile_update(this.accountProfile);
          if(apiResponse.data.done) {
            // this.setConnectionStoreByKey({
            //   account_status: 'main',
            //   main_account_address: this.accountProfile.account_address
            // });
            this.setProfileStore(apiResponse.data.result[0]);
            this.accountProfile.account_image_file = null;
            this.notif({
              title: "SUCCESS!",
              message: apiResponse.data.message,
              dangerouslyUseHTMLString: true,
              type: apiResponse.data.message_type,
              duration: 3000,
              onClose: () => { this.$router.push("/account/profile") }
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
          if(this.accountProfile[element] == null || this.accountProfile[element].length <= 0) {
            this.$refs[element].focus();
            this.hasError[element] = true;
            this.notif({
              message: "Make sure all required fields are filled in correctly.",
              type: "error",
              duration: 3000,
              onClose: () => { this.hasError[element] = false }
            })
            throw false;
          }
          if(element == 'account_nickname' && !(this.accountProfile[element].match(/^(?=.{4,25}$)(?![_])(?!.*[_]{2})[a-z][a-z0-9_]+(?![_])$/i))) {
            this.$refs[element].focus();
            this.hasError[element] = true;
            this.notif({
              message: "1. The username is between 4 and 25 characters." +
                "<br/>2. It must start with a letter." +
                "<br/>3. It can only contain letters, numbers, and the underscore character.",
              dangerouslyUseHTMLString: true,
              type: "error",
              duration: 5000,
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
    },
    async convertBlobToBase64(file) {
      try {
        let contentBuffer = await this.readFileAsync(file);
        return contentBuffer;
      } catch (err) {
        console.log(err);
      }
    },
    readFileAsync(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#account-settings-profile {
  width: 96%;
  min-height: calc(100vh - 240px);
}
.account-social-links {
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
	color: rgba(var(--ptn-third-gray-rgb), 0.6);
  width: 95%;
	max-width: 600px;
	height: 50px;
  border: 1px solid rgba(var(--ptn-color-rgb), 0.3);
  border-radius: 5px;
  margin: 5px 0 7px;
  padding-left: 10px;
  resize: vertical;
}
.account-social-links input[type="text"] {
  padding-left: 0;
  margin-top: 0;
  margin-bottom: 0;
}
.account-social-icons {
	color: var(--ptn-third-gray);
}
.account-social-links-prefix {
	white-space: nowrap;
}
.account-social-links-input {
	border: 0 !important;
  padding: 7px 0 !important;
}
.account-social-links-input:focus-visible {
  outline: none;
}
.label-profile-image {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  border: 1px solid rgba(var(--ptn-color-rgb), 0.3);
  border-radius: 8px;
  color: var(--ptn-third-gray);
  gap: 10px;
  cursor: pointer;
  margin: 5px 0 0;
  padding: 15px;
}
.profile-image {
  object-fit: unset;
  border-radius: 5px;
  height: 148px;
  width: 148px;
  margin-top: 26px;
	margin-bottom: 16px;
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
