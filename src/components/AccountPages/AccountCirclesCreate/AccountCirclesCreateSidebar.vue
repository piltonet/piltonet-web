<template>
  <div v-if="circleInfoProps && circleConstProps" id="side-bar" class="p-0 mt-4">
    <div class="side-bar-main">
      <h3>
				<span class="d-none d-md-inline-block">CREATE CIRCLE</span>
			</h3>
      <h4>
        <i class="far fa-circle-dot blue-btn d-none d-md-inline-block me-2" aria-hidden="true"></i>
				<span class="d-none d-md-inline-block">
          {{ circleInfoProps.circle_name || 'New Circle' }}
        </span>
			</h4>
      <div class="side-bar-item mt-4">
        <div
          :type="activePage == 'deploy' ? '' : 'button'"
          @click="activePage != 'deploy' ? $router.push({path: '/account/circles/create', query: {active_page: 'deploy', circle_id: circleInfoProps.circle_id}}) : ''"
          class="side-bar-btn"
          :class="activePage == 'deploy' ? (circleInfoProps.circle_status == 'deployed' ? 'active done' : 'active done')
            : (circleInfoProps.circle_status == 'deployed' ? 'done' : 'done')"
        >
          <span class="side-bar-number d-md-none d-lg-inline-block p-0 mx-auto ms-lg-3 me-lg-1">1</span>
          <p class="d-none d-md-inline-block m-0 ps-2">Setup & Deploy</p>
        </div>
      </div>
      <div class="side-bar-item">
        <div
          :type="activePage == 'whitelist' ? '' : 'button'"
          @click="activePage != 'whitelist' ? $router.push({path: '/account/circles/create', query: {active_page: 'whitelist', circle_id: circleInfoProps.circle_id}}) : ''"
          class="side-bar-btn"
          :class="activePage == 'whitelist' ? 
            (!circleInfoProps.whitelists || circleInfoProps.whitelists.length < circleConstProps['CIRCLES_MIN_MEMBERS'] ? 'active'
            : circleInfoProps.whitelists.length < circleInfoProps.circle_size ? 'active doing' : 'active done')
            : (!circleInfoProps.whitelists || circleInfoProps.whitelists.length < circleConstProps['CIRCLES_MIN_MEMBERS'] ? ''
            : circleInfoProps.whitelists.length < circleInfoProps.circle_size ? 'doing' : 'done')"
        >
          <span class="side-bar-number d-md-none d-lg-inline-block p-0 mx-auto ms-lg-3 me-lg-1">2</span>
          <p class="d-none d-md-inline-block m-0 ps-2">Whitelist Contacts</p>
        </div>
      </div>
      <div class="side-bar-item">
        <div
          :type="activePage == 'launch' ? '' : !circleInfoProps.whitelists || circleInfoProps.whitelists.length < circleInfoProps.circle_size ? '' : 'button'"
          @click="activePage != 'launch' && circleInfoProps.whitelists && circleInfoProps.whitelists.length >= circleInfoProps.circle_size ?
            $router.push({path: '/account/circles/create', query: {active_page: 'launch', circle_id: circleInfoProps.circle_id}}) : ''"
          class="side-bar-btn"
          :class="activePage == 'launch' ? 
            !circleInfoProps.whitelists || circleInfoProps.whitelists.length < circleInfoProps.circle_size ? 'disable' : circleInfoProps.circle_status == 'deployed' ? 'active' : 'active done'
            : !circleInfoProps.whitelists || circleInfoProps.whitelists.length < circleInfoProps.circle_size ? 'disable' : circleInfoProps.circle_status == 'deployed' ? '' : 'done'"
        >
          <span class="side-bar-number d-md-none d-lg-inline-block p-0 mx-auto ms-lg-3 me-lg-1">3</span>
          <p class="d-none d-md-inline-block m-0 ps-2">Review & Launch</p>
        </div>
      </div>
    </div>
  </div>

  <div v-else id="side-bar" class="p-0 mt-4">
    <div class="side-bar-main">
      <h3>
				<span class="d-none d-md-inline-block">CREATE CIRCLE</span>
			</h3>
      <h4>
        <i class="far fa-circle-dot blue-btn d-none d-md-inline-block me-2" aria-hidden="true"></i>
				<span class="d-none d-md-inline-block">New Circle</span>
			</h4>
      <div class="side-bar-item mt-4">
        <div class="side-bar-btn active">
          <span class="side-bar-number d-md-none d-lg-inline-block p-0 mx-auto ms-lg-3 me-lg-1">1</span>
          <p class="d-none d-md-inline-block m-0 ps-2">Setup & Deploy</p>
        </div>
      </div>
      <div class="side-bar-item">
        <div class="side-bar-btn disable">
          <span class="side-bar-number d-md-none d-lg-inline-block p-0 mx-auto ms-lg-3 me-lg-1">2</span>
          <p class="d-none d-md-inline-block m-0 ps-2">Whitelist Contacts</p>
        </div>
      </div>
      <div class="side-bar-item">
        <div class="side-bar-btn disable">
          <span class="side-bar-number d-md-none d-lg-inline-block p-0 mx-auto ms-lg-3 me-lg-1">3</span>
          <p class="d-none d-md-inline-block m-0 ps-2">Review & Launch</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccountCirclesCreateSidebar",
  props: {
    activePage: String,
    circleInfoProps: Object,
    circleConstProps: Object
  },
  mounted() {
    // console.log(this.circleInfoProps);
  },
};
</script>

<style lang="scss" scoped>
.side-bar-main {
  text-align: start;
  border: none;
  width: 96%;
  max-width: 940px;
  margin: 20px auto 0;
  padding: 50px 30px;
}
.side-bar-main h3 {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 28px;
  font-weight: 400;
  line-height: 30px;
  color: var(--ptn-third-gray);
  margin: 0;
  padding: 10px 0;
}
.side-bar-main h4 {
  font-family: "RobotoB2", arial, sans-serif;
  font-size: 23px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: 1px;
  overflow: hidden;
  white-space: nowrap;
  color: rgba(var(--ptn-color-rgb), 0.7);
  margin: 0;
  padding: 10px 0;
}
.side-bar-item {
  display: flex;
  flex-direction: row;
  border: none;
  height: 50px;
  margin: 10px 0;
  padding: 0;
}
.side-bar-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: rgba(var(--ptn-color-rgb), 0.7);
  border: none;
  border-radius: 8px;
  width: calc(100% - 10px);
  max-width: 230px;
  height: 50px;
  margin: 0;
  padding: 0;
}
.side-bar-btn p {
  font-size: 20px;
  overflow: hidden;
  white-space: nowrap;
}
.side-bar-btn.active {
  color: rgba(var(--ptn-color-rgb), 0.9);
  border: solid 2px rgba(var(--ptn-color-rgb), 0.9);
}
.side-bar-btn.active p {
  font-size: 21px;
}
.side-bar-btn.disable {
  color: rgba(var(--ptn-third-gray-rgb), 0.7);
}
.side-bar-btn.doing {
  // color: rgba(var(--ptn-second-blue-rgb), 0.7);
  color: rgba(var(--ptn-color-rgb), 0.7);
}
.side-bar-btn.done {
  font-size: 23px;
  color: rgba(var(--ptn-green-rgb), 0.6);
}
.side-bar-btn.active.doing {
  // color: var(--ptn-second-blue);
  // border: solid 2px var(--ptn-second-blue);
  color: rgba(var(--ptn-color-rgb), 0.9);
}
.side-bar-btn.active.done {
  color: rgba(var(--ptn-green-rgb), 0.9);
  border: solid 2px rgba(var(--ptn-green-rgb), 0.9);
}
.side-bar-number {
  font-size: 27px;
  font-weight: 400;
}

.side-bar-btn.active .side-bar-number {
  font-size: 30px;
}

@media (max-width: 1199px) {
}

@media (max-width: 991px) {
}

@media (max-width: 767px) {
  .side-bar-btn {
    width: 41px;
    height: 41px;
  }
}

@media (max-width: 575px) {
  .side-bar-main {
    padding: 50px 10px;
  }
}
</style>
