const currencyFormat = val => {
  const reg =/(?=(?!\b)(\d{3})+$)/g;
  
  return val.toString().replace(reg,',');
}

export { currencyFormat };