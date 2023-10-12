import { defineStore } from 'pinia';
import { store } from '@/store';

interface WithdrawState {
  //待提现数量
  count: any;
}

export const withdrawStore = defineStore({
  id: 'app-withdraw',
  state: (): WithdrawState => ({
    count:null,
  }),
  getters: {
    getCount(): any {
      return this.count;
    },
  },
  actions: {
    setCount(count: any) {
        this.count = count;
    },
  },
});

// Need to be used outside the setup
export function withdrawWithOut() {
  return withdrawStore(store);
}
