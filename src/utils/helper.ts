export function formatMoney(price: number) {
    if(price)
        return price.toLocaleString('vi-VI') + ' VNĐ'
    return '0 VNĐ'
}