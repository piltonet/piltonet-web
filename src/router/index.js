import { createWebHistory, createRouter } from 'vue-router';
import app from '@/main'
import routes from '@/router/routes';
import store from '@/store';
import { notification } from '@/plugins'
import { nextTick } from 'vue';
import wallets from "@/wallets";

const Blockchain = () => {return app?.config.globalProperties.defaultchain || null};

const router = createRouter({
	history: createWebHistory(),
	scrollBehavior(to, from, savedPosition) {
		if(savedPosition && from.fullPath == '/account/settings') {
			return savedPosition
		} else {
			return { top: 0 }
		}
	},
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
			const activeNetwork = wallets[connectedAccount.connected_wallet].getActiveNetwork();
			if(activeNetwork != Blockchain()?.chainId) {
				notification({
					title: 'Wrong Network!',
					message: `Please select ${Blockchain()?.name} in Wallet.`,
					dangerouslyUseHTMLString: true,
					type: 'error',
					duration: 3000
				})
				return next({ name: from.name || 'HomePage' });
			}
		}
		if('main' in to.meta && to.meta.main && ['fresh', 'waiting'].includes(connectedAccount.account_status)) {
			return next({ name: 'AccountNew' });
		}
	}
	return next();
});

router.afterEach((to) => {
	nextTick(() => {
		document.title = to.meta.title || 'Tezuka.io';
	})
});

export default router;
