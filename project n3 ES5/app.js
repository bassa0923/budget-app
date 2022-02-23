//  BUDGET CONTROLLER
let budgetController = (function() {

      let Expense = function(id, description, value){
          this.id = id;
          this.description = description;
          this.value = value;
          this.percentage = -1;
      };

      Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0){
          this.percentage = Math.round((this.value / totalIncome) * 100);

        } else {
          this.percentage = -1;
        }


      };
      Expense.prototype.getPercentage = function(){
        return this.percentage;
      };
    
      let Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

      let calculateTotal = function(type){
        let sum = 0;
        data.allItems[type].forEach(function(curr){
          sum += curr.value;
        });
        data.totals[type] = sum;

      };
      let data = {
        allItems: {
          expenses: [],
          income: []
        },
        totals: {
          expenses: 0,
          income: 0
          
        },
        budget: 0,
        percentage: -1
      };

    return {
      addItem: function(type, des, val){
        let newItem, ID;

         // ID = last ID + 1

         // Create new ID
      if (data.allItems[type].length > 0 ){
          ID = data.allItems[type][data.allItems[type].length - 1].id + 1;  
      }  else {
          ID = 0;  
        }

        // Create new item based on exp or inc type
        if (type === 'expenses'){
        newItem = new Expense(ID, des, val);
      }  else if (type === 'income'){
        newItem = new Income(ID, des, val);
      }
        // push it into data structure
        data.allItems[type].push(newItem);

         // return the new element
        return newItem;

      },

      deleteItem: function(type, id) {
        let index, ids;
          
        ids = data.allItems[type].map(function(current){
          return current.id; 

        });
        
        index = ids.indexOf(id);

        if (index !== -1){
          data.allItems[type].splice(index, 1);
        }

      },
        calculateBudget: function() {

          // calculate total inc and exp
          calculateTotal('income');
          calculateTotal('expenses');

          // calculate the budget: inc-exp
          data.budget = data.totals.income - data.totals.expenses;

          

          // calculate the percentage of income we spent
          if (data.totals.income > 0) {
    data.percentage = Math.round((data.totals.expenses / data.totals.income)* 100)
  } else {
    data.percentage = -1;
  }

        },

        calculatePercentages: function() {

          data.allItems.expenses.forEach(function(cur){
            cur.calcPercentage(data.totals.income);
          });
      },
        

        getPercentages: function() {
          let allPercentage;
          allPercentage = data.allItems.expenses.map(function(curr){
            return curr.getPercentage();
          });
        return allPercentage;
        },


        getBudget: function() {
          return {
          budget: data.budget,
          totalInc: data.totals.income,
          totalExp: data.totals.expenses,
          percentage: data.percentage
          };

        },

        testing: function(){
          console.log(data);
        }
    };

})();

// UI CONTROLLER
let UIController = (function() {

    let DOMstring = {
      inputType: '.add__type',
      descriptionType: '.add__description',
      valueType: '.add__value',
      inputButton: '.add__btn',
      incomeContainer: '.income__list',
      expensesContainer: '.expenses__list',
      budgetLabel: '.budget__value',
      incomeLabel: '.budget__income--value',
      expensesLabel: '.budget__expenses--value',
      persentageLabel: '.budget__expenses--percentage',
      container: '.container',
      expensesPercLabel: '.item__percentage',
      dateLabel: '.budget__title--month'

    };

    let formatNumber = function(num, type) {
      let numSplit, int, dec;

      num = Math.abs(num);
      num = num.toFixed(2);

      numSplit = num.split('.');

      int = numSplit[0];
      if (int.length > 3) {
        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
      }

      dec = numSplit[1];

      return (type === 'expenses' ? '-' : '+') + ' ' + int + '.' + dec;

    };

    let nodeListForEach = function(list, callback){
      for ( i = 0; i < list.length; i++){
      callback(list[i], i);

      }

    };

    return {
      getInput: function() {
        return{
           type: document.querySelector(DOMstring.inputType).value, // either inc or exp
          description: document.querySelector(DOMstring.descriptionType).value,
          value: parseFloat(document.querySelector(DOMstring.valueType).value)
          };
      },

    addListItem: function(obj, type){
          let html, newHtml, element;

           // create html string with placeholder
          if (type === 'income'){
            element = DOMstring.incomeContainer;
            html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
          

          } else if (type === 'expenses'){
            element = DOMstring.expensesContainer;
            html = '<div class="item clearfix" id="expenses-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

          }


           // replace the placeholder with actual data

          newHtml = html.replace('%id%', obj.id);
          newHtml = newHtml.replace('%description%', obj.description);
          newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

           // insert html into the DOM

          document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    
      },
          deleteListItem: function(selectorID){
            let el;
            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);


          },

      clearFields: function() {
        let fields, fieldsArray;
        fields = document.querySelectorAll(DOMstring.descriptionType + ', ' + DOMstring.valueType);

      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(function(current, index, array){
            current.value = "";


      });

      fieldsArray[0].focus();
    
      },
      displayBudget: function(obj){
            let type;
            if (obj.budget > 0) { type = 'income'}
            else type = 'expenses';
    document.querySelector(DOMstring.budgetLabel).textContent = formatNumber(obj.budget, type);
    document.querySelector(DOMstring.incomeLabel).textContent = formatNumber(obj.totalInc, 'income');
    document.querySelector(DOMstring.expensesLabel).textContent = formatNumber(obj.totalExp, 'expenses');



    if (obj.percentage > 0) {
      document.querySelector(DOMstring.persentageLabel).textContent = obj.percentage + '%';
    } else {
      document.querySelector(DOMstring.persentageLabel).textContent = '---'
    }

      },

      displayPercentages: function(percentages) {

        let fields = document.querySelectorAll(DOMstring.expensesPercLabel);

        nodeListForEach(fields, function(current, index){

          if (percentages[index] > 0) {
            current.textContent = percentages[index] + '%';
          } else {
            current.textContent = '---'

          }

        });
  
      },
    
      displayMonth: function (){
        let now, year, month, months;

      now = new Date();
      
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octomber', 'November', 'December'];
      month = now.getMonth();

      year = now.getFullYear();
      document.querySelector(DOMstring.dateLabel).textContent = months[month] + ' ' + year;


      },

      changedType: function() {
    
      let fields = document.querySelectorAll(
      DOMstring.inputType + ',' +
      DOMstring.descriptionType + ',' +
      DOMstring.valueType);
        
      nodeListForEach(fields, function(cur){
            cur.classList.toggle('red-focus')
          });

          document.querySelector(DOMstring.inputButton).classList.toggle('red');




      },

      getDOMstrings: function() {
        return DOMstring;
      }
    };

})();

// GLOBAL APP CONTROLLER
let controller = (function(budgetCtrl, UICtrl){

  let setupEventlisteners = function(){
    let DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputButton).addEventListener('click', crtlAddItem);
    
    document.addEventListener('keypress', function(event){
        if (event.keyCode === 13 || event.which === 13) {
            crtlAddItem();
        }
    });
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
  };
  

  let updateBudget = function(){

    // 1. Calculate the budget
    budgetController.calculateBudget();

    // 2. Return the budget
    let budget = budgetController.getBudget();
    

    // 3. Display the budget on the UI
      UICtrl.displayBudget(budget);

  };


  let updatePercentages = function(){

    // 1. calculate persentages
        budgetController.calculatePercentages();

    // 2. read persentages from the budgetController
      let percentages = budgetController.getPercentages();
      
    // 3. update the UI with the new persentages
        UICtrl.displayPercentages(percentages);
  };

        let crtlAddItem = function() {
            let input, newItem;
        // 1. get the field input data
          input = UICtrl.getInput();

          if (input.description !== "" && !isNaN(input.value) && input.value > 0){ 
          
          
          // 2. add the item to budget controller
          newItem = budgetCtrl.addItem(input.type, input.description, input.value);
              
          // 3. add the item to the UI
            UICtrl.addListItem(newItem, input.type)
  
          // 4. clear the fields
          UICtrl.clearFields();

          // 5. calculate and update budget
          updateBudget();

          // 6. calculate and update persentages
          updatePercentages();
  

          }
    
        


    };

    let ctrlDeleteItem = function(event){
      let itemID, splitID, type, ID;
      itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
        splitID = itemID.split('-');
        type = splitID[0];
        ID = parseInt(splitID[1]);

        // 1. delete item from data structure
        budgetController.deleteItem(type, ID);

        // 2. delete item from UI
        UICtrl.deleteListItem(itemID);
        
        // 3. update and show the new budget
        updateBudget();

        // 4. calculate and update percentages
        updatePercentages();

          
    }

    };
  return {
    init: function(){
      
      console.log('Application has started.');
      UICtrl.displayMonth();
      
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1});

      setupEventlisteners();
        
    }
  }
  
})(budgetController,  UIController)


controller.init();
