'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'premium',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'premium',

};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'standard',

};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'basic',

};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function (movements,sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a,b)=> a - b ) :  movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'


    const html = `
 <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${mov}</div>
        </div>
`;
    containerMovements.insertAdjacentHTML('afterbegin', html)

  })
}


const createUsernames = function (accs) {

  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase().split(' ').map(function (word) {
        return word[0];
      }).join('');
  })


};
createUsernames(accounts);
const updateUI = function (acc) {
  displayMovements(acc.movements);
  // Display balance
  calDisplayBalance(acc);
  // Display Summary
  calcDisplaySummary(acc);
}

const calDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, curr) {
    return acc + curr;
  }, 0);
  labelBalance.textContent = `${acc.balance}€`;
}


const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(function (mov) {
    return mov > 0;
  }).reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelSumIn.textContent = `${incomes}€`;
  const out = acc.movements.filter(function (mov) {
    return mov < 0;
  }).reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;
  const interest = acc.movements.filter(function (mov) {
    return mov > 0;
  }).map(function (deposits) {
    return (deposits * acc.interestRate) / 100;
  }).filter(function (int, i, arr) {
    return int >= 1;
  })
    .reduce(function (acc, int) {
      return acc + int;
    })
  labelSumInterest.textContent = interest;
}


let currentAccount;
// event handler
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;

  });
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI 
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;
    // Display movements 


    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); 4
    updateUI(currentAccount);

  }
})

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  inputTransferAmount.value = inputTransferTo.value = '';
  if (amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username) {
    // transfer  handling
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // update UI
    updateUI(currentAccount);
  }

});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('hello');
  if (inputCloseUsername.value === currentAccount.username
    && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentAccount.username;
    });
    // console.log(index);
    // remove  user
    accounts.splice(index, 1);
    // hide ui
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';

})
btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if(amount > 0 && currentAccount.movements.some(function(mov){
   return mov >=amount/10;
  })){
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  };
  inputLoanAmount.value = '';

})
let sorted = false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements,!sorted);
  sorted = !sorted;
})


