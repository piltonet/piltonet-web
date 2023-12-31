import { createWebHistory, createRouter } from 'vue-router';
import routes from '@/router/routes';
import store from '@/store';
import { nextTick } from 'vue';
import wallets from "@/wallets";

const router = createRouter({
	history: createWebHistory(),
	// scrollBehavior(to, from, savedPosition) {
	// 	if(savedPosition && from.fullPath == '/account/settings') {
	// 		return savedPosition
	// 	} else {
	// 		return { top: 0 }
	// 	}
	// },
	routes
});

router.beforeEach((to, from, next) => {
	if('meta' in to && 'auth' in to.meta && to.meta.auth) {
		const connectedAccount = store.getters.getConnectionStore;
		if(!connectedAccount?.is_connected) {
			return next({ name: 'HomePage' });
		} else {
			wallets[connectedAccount.connected_wallet].setWatchers(connectedAccount.connected_wallet);
		} 
		if(connectedAccount.expiration_date < new Date().getTime()) {
			wallets[connectedAccount.connected_wallet].disconnectWallet();
			return next({ name: 'HomePage' });
		}
		if('chain' in to.meta && to.meta.chain) {
			wallets[connectedAccount.connected_wallet].isDefaultNetwork().then((isDefaultNetwork) => {
				if(!isDefaultNetwork) {
					router.push("/");
				}
			})
		}
		if('main' in to.meta && to.meta.main && ['fresh', 'waiting'].includes(connectedAccount.account_status)) {
			return next({ name: 'AccountNew' });
		}
	}
	return next();
});

router.afterEach((to) => {
	nextTick(() => {
		document.title = to.meta.title || 'Piltonet | Web3 Lending Circles';
	})
});

export default router;
