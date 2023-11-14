import usei18next from "../hooks/usei18next";

export function formatMoney(price: number) {
  if (price)
    return price.toLocaleString('vi-VI') + ' VND'
  return '0 VND'
}

export const formatMoneyNew = (money: number | undefined) => {
  if (money) {
    return (money * 1000).toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  }
  return 0;
}

export const getPreviousTimeRelative = (dateString: string, t: any) => {
  const inputDate = new Date(dateString);
  const timestamp = inputDate.getTime();
  const seconds = Math.floor(timestamp / 1000);
  const currentTimestamp = Math.floor(new Date().getTime() / 1000);
  const difference = currentTimestamp - seconds;

  let output = ``;
  if (difference < 60) {
    output = `${difference} ${t("helper.secondAgo")}`;
  } else if (difference < 3600) {
    output = `${Math.floor(difference / 60)} ${t("helper.minuteAgo")}`;
  } else if (difference < 86400) {
    output = `${Math.floor(difference / 3600)} ${t("helper.hourAgo")}`;
  } else if (difference < 2620800) {
    output = `${Math.floor(difference / 86400)} ${t("helper.dayAgo")}`;
  } else if (difference < 31449600) {
    output = `${Math.floor(difference / 2620800)} ${t("helper.monthAgo")}`;
  } else {
    output = `${Math.floor(difference / 31449600)} ${t("helper.yearAgo")}`;
  }

  return output;
};


export const getCountdownTime = (endDate: string, t: any) => {
  const christmasDate = new Date(endDate);

  const currentDate = new Date();

  const timeRemaining = christmasDate.getTime() - currentDate.getTime();

  // Calculate days, hours, minutes, and seconds
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  let output = '';

  if (days > 0) {
    return output = `${t("helper.dayRemaining", {day: days})}`;
  }

  if (hours > 0) {
    return output = `${t("helper.hourRemaining", {hour: hours})}`;
  }

  if (minutes > 0) {
    return output = `${t("helper.minuteRemaining", {minute: minutes})}`;
  }
};




