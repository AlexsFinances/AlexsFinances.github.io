/*
 * JavaScript functions for Finance Explorer tools.
 *
 * This script implements interactive calculators used on the Tools page:
 *   - Budget Builder
 *   - Compound Interest Calculator
 *   - Credit Card Payoff Simulator
 *   - Student Loan Calculator
 *
 * These calculations provide estimates for educational purposes only.
 */

// Budget Builder: uses the 50/30/20 rule. Displays recommended allocations
// and compares expenses to income.
function buildBudget() {
  const income = parseFloat(document.getElementById('income').value);
  const expenses = parseFloat(document.getElementById('expenses').value);
  const resultDiv = document.getElementById('budget-result');
  resultDiv.innerHTML = '';
  if (isNaN(income) || income <= 0) {
    resultDiv.textContent = 'Please enter a valid income.';
    return;
  }
  if (isNaN(expenses) || expenses < 0) {
    resultDiv.textContent = 'Please enter valid expense amounts.';
    return;
  }
  const needs = income * 0.5;
  const wants = income * 0.3;
  const savings = income * 0.2;
  const diff = income - expenses;
  const p = document.createElement('p');
  p.innerHTML = `Recommended Budget (50/30/20):<br>
    <strong>Needs:</strong> $${needs.toFixed(2)}<br>
    <strong>Wants:</strong> $${wants.toFixed(2)}<br>
    <strong>Savings:</strong> $${savings.toFixed(2)}<br>`;
  resultDiv.appendChild(p);
  const status = document.createElement('p');
  if (diff > 0) {
    status.textContent = `You have $${diff.toFixed(2)} left over after expenses. Consider putting extra toward savings or paying down debt.`;
    status.style.color = '#14a98b';
  } else if (diff === 0) {
    status.textContent = 'Your expenses equal your income. Look for ways to reduce spending or increase income.';
    status.style.color = '#e67e22';
  } else {
    status.textContent = `You are overspending by $${Math.abs(diff).toFixed(2)}. Try to cut expenses or increase your income.`;
    status.style.color = '#c0392b';
  }
  resultDiv.appendChild(status);
}

// Compound Interest Calculator
function calculateCompound() {
  const principal = parseFloat(document.getElementById('principal').value);
  const rate = parseFloat(document.getElementById('rate').value) / 100;
  const years = parseFloat(document.getElementById('years').value);
  const contrib = parseFloat(document.getElementById('contrib').value) || 0;
  const resultDiv = document.getElementById('compound-result');
  resultDiv.innerHTML = '';
  if (isNaN(principal) || principal < 0 || isNaN(rate) || rate < 0 || isNaN(years) || years < 0) {
    resultDiv.textContent = 'Please enter valid values.';
    return;
  }
  const n = 12; // monthly compounding
  const totalPeriods = years * n;
  const monthlyRate = rate / n;
  let futureValue = principal * Math.pow(1 + monthlyRate, totalPeriods);
  if (contrib > 0) {
    futureValue += contrib * ((Math.pow(1 + monthlyRate, totalPeriods) - 1) / monthlyRate);
  }
  const interestEarned = futureValue - (principal + contrib * totalPeriods);
  const p = document.createElement('p');
  p.innerHTML = `After <strong>${years}</strong> years you would have <strong>$${futureValue.toFixed(2)}</strong>.<br>
    Total interest earned: <strong>$${interestEarned.toFixed(2)}</strong>.`;
  resultDiv.appendChild(p);
}

// Credit Card Payoff Simulator
function simulateCredit() {
  const balance = parseFloat(document.getElementById('balance').value);
  const annualRate = parseFloat(document.getElementById('cc-rate').value) / 100;
  const minRate = parseFloat(document.getElementById('min-payment').value) / 100;
  const resultDiv = document.getElementById('credit-result');
  resultDiv.innerHTML = '';
  if (isNaN(balance) || balance <= 0 || isNaN(annualRate) || annualRate < 0 || isNaN(minRate) || minRate <= 0) {
    resultDiv.textContent = 'Please enter valid values.';
    return;
  }
  const monthlyRate = annualRate / 12;
  let currentBalance = balance;
  let totalPaid = 0;
  let months = 0;
  while (currentBalance > 0.01 && months < 600) {
    const minPayment = Math.max(currentBalance * minRate, 10);
    const interest = currentBalance * monthlyRate;
    const principalPaid = minPayment - interest;
    if (principalPaid <= 0) {
      resultDiv.textContent = 'At this rate your payment does not cover interest. Increase your payment rate.';
      return;
    }
    currentBalance -= principalPaid;
    totalPaid += minPayment;
    months++;
  }
  if (months >= 600) {
    resultDiv.textContent = 'At this minimum payment it would take more than 50 years to pay off the balance. Consider paying more each month.';
    return;
  }
  const p = document.createElement('p');
  const years = (months / 12).toFixed(1);
  const interestPaid = totalPaid - balance;
  p.innerHTML = `By paying the minimum, it will take about <strong>${months} months</strong> (~${years} years) to pay off your card.<br>
    Total paid: <strong>$${totalPaid.toFixed(2)}</strong>, of which <strong>$${interestPaid.toFixed(2)}</strong> is interest.`;
  resultDiv.appendChild(p);
}

// Student Loan Calculator
function calculateLoan() {
  const amount = parseFloat(document.getElementById('loan-amount').value);
  const annualRate = parseFloat(document.getElementById('loan-rate').value) / 100;
  const years = parseFloat(document.getElementById('loan-years').value);
  const resultDiv = document.getElementById('loan-result');
  resultDiv.innerHTML = '';
  if (isNaN(amount) || amount <= 0 || isNaN(annualRate) || annualRate < 0 || isNaN(years) || years <= 0) {
    resultDiv.textContent = 'Please enter valid loan values.';
    return;
  }
  const monthlyRate = annualRate / 12;
  const n = years * 12;
  if (annualRate === 0) {
    const payment = amount / n;
    const p = document.createElement('p');
    p.innerHTML = `Your monthly payment would be <strong>$${payment.toFixed(2)}</strong> with no interest.`;
    resultDiv.appendChild(p);
    return;
  }
  const factor = Math.pow(1 + monthlyRate, n);
  const payment = amount * monthlyRate * factor / (factor - 1);
  const totalPaid = payment * n;
  const interestPaid = totalPaid - amount;
  const pElem = document.createElement('p');
  pElem.innerHTML = `Monthly payment: <strong>$${payment.toFixed(2)}</strong><br>
    Total paid over ${years} years: <strong>$${totalPaid.toFixed(2)}</strong><br>
    Total interest paid: <strong>$${interestPaid.toFixed(2)}</strong>`;
  resultDiv.appendChild(pElem);
}