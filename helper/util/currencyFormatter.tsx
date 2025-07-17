const formatCurrency = (amount: number) => {
    const isNegative = amount < 0
    const absAmount = Math.abs(amount)
    return isNegative ? `-৳${absAmount.toLocaleString()}` : `+৳${absAmount.toLocaleString()}`
  }

  

export default formatCurrency