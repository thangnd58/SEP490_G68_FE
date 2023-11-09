export function formatMoney(price: number) {
    if(price)
        return price.toLocaleString('vi-VI') + ' VND'
    return '0 VND'
}

export const formatMoneyNew = (money: number | undefined) => {
    if (money) {
      return (money * 1000).toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
    }
    return 0;
  }