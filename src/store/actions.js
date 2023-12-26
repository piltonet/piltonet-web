import api from "@/services/api";
import abi from "@/services/abi";

const actions = {
  async fetchAccount({ commit }) {
    let apiResponse = await api.get_account();
    if(apiResponse.data.done) {
			commit('setConnectionStoreByKey', {
				account_status: apiResponse.data.result[0].account_status,
				main_account_address: apiResponse.data.result[0].main_account_address
			});
      return apiResponse.data.result[0];
    } else {
      commit('setProfileStore', null);
			commit('setConnectionStore', {is_connected: false});
      return null;
    }
  },

  async fetchProfile({ commit }) {
    let apiResponse = await api.get_account_profile();
    if(apiResponse.data.done) {
      commit('setProfileStore', apiResponse.data.result[0]);
      return apiResponse.data.result[0];
    } else {
      commit('setProfileStore', null);
			commit('setConnectionStore', {is_connected: false});
      return null;
    }
  },
  
  async fetchProfileBalance({ commit }, params) {
    console.log(params.account_tba_address);
    const contract = abi.setAbi(
      params.account_tba_address,
      "ERC6551Account",
      params.signer
    );
    // execute ERC1155Contracts addContact
    let abiResponse = await contract.interaction("balance");
    console.log(abiResponse);
    
    
    if(abiResponse.done) {
      commit('setProfileBalanceStore', 213);
    } else {
      commit('setProfileBalanceStore', null);
    }
  },

  async logoutAccount({ commit }) {
    commit('setProfileStore', null);
    commit('setConnectionStore', {is_connected: false});
  },

}

export default actions;
