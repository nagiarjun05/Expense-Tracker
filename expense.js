var addExp=document.getElementById("addExpense");
var amount=document.getElementById("amount");
var description=document.getElementById("description");
var category=document.getElementById("expenseCat");
var expenseList=document.getElementById("exp-list");


addExp.addEventListener('click',addExpense);

expenseList.addEventListener('click', removeExpense);

const getExpenses=function(){
    axios({
        method:'get',
        url:"http://localhost:4000/expenses/get-expenses"
    })
    .then(res=>{
        res.data.allExpenses.forEach(element => {
            // console.log(element)
            var li = document.createElement('li');
            li.className='expenseDet';
            li.innerHTML=`${element.amount}-${element.description}-${element.category}-`;
            
            li.value=`${element.id}`;
            var deleteExpense=document.createElement('button');
            deleteExpense.className='dlt';
            deleteExpense.textContent='Delete Expense';
            deleteExpense.style.border='solid 2px red';
    
            li.appendChild(deleteExpense);
            
            expenseList.appendChild(li);

            description.value="";
            amount.value="";
            category.value="";
        });
    }).catch(err=>console.log(err));
};

getExpenses();

function addExpense(e){
    e.preventDefault();
    axios({
        method:'post',
        url:`http://localhost:4000/expenses/add-expense`,
        data:{
            amount:`${amount.value} `,
            description:`${description.value} `,
            category:`${category.value} `
        }
    }).then(res=>{
        while(expenseList.hasChildNodes()){
            expenseList.removeChild(expenseList.lastChild);
        }
        getExpenses();
    }).catch(err=>console.log(err));
        
};

function removeExpense(e){
    e.preventDefault();
    if(e.target.classList.contains('dlt')){
        console.log("delete")
        axios({
            method:'delete',
            url:`http://localhost:4000/expenses/delete-expense/${e.target.parentElement.value}`,  
        })
        .then((res)=>{
            console.log(res)
            expenseList.removeChild(e.target.parentElement)
        })
        .catch(err=>console.log(err))
        
    }
}