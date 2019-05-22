const interestRate = 5;
class totalamountCalculation {
  static totalAmountdata(amount = null, tenor = null) {
    let installmentAmount, totalamounttoPay;
    const totalAmount = ((interestRate / 100) * amount) + amount;
    if (totalAmount % tenor !== 0) {
      const remainder = totalAmount % tenor;
      const remaining = tenor - remainder;
      totalamounttoPay = totalAmount + remaining;
    } else {
      totalamounttoPay = totalAmount;
    }
    installmentAmount = totalamounttoPay / tenor;
    return {
      tenor,
      installmentAmount,
      totalamounttoPay,
      interestRate
    };
  }
}
export default totalamountCalculation;
