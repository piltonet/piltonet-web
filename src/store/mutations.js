const mutation = {
	setStates(state, payload) {
		for (let key in payload) {
			state[key] = payload[key];
		}
	},
	setAcceptCookiesStore(state) {
		state.acceptCookies = true;
	},
	setDarkModeStore(state) {
		state.darkMode = !state.darkMode;
	},
	setConnectionStore(state, payload) {
		state.connection = payload;
	},
	setConnectionStoreByKey(state, payload) {
		const _state = state.connection;
		for (let key in payload) {
			_state[key] = payload[key];
		}
		state.connection = _state;
	},
	setProfileStore(state, payload) {
		state.profile = payload;
	},
	setProfileStoreByKey(state, payload) {
		const _state = state.profile;
		for (let key in payload) {
			_state[key] = payload[key];
		}
		state.profile = _state;
	},
	setProfileBalanceStore(state, payload) {
		state.profileBalance = payload;
	}
}

export default mutation;
