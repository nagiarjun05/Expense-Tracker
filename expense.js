var addExp=document.getElementById("addExpense");
var amount=document.getElementById("amount");
var description=document.getElementById("description");
var category=document.getElementById("expenseCat");
var expenseList=document.getElementById("exp-list");


addExp.addEventListener('click',addExpense);

expenseList.addEventListener('click', removeExpense);

const getExpenses=function(){
    const token=localStorage.getItem('token');
    axios({
        method:'get',
        url:"http://localhost:4000/expenses/get-expenses",
        headers:{'Authorization':token}
    })
    .then(res=>{
        res.data.allExpenses.forEach(element => {
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

window.addEventListener('load', getExpenses())

// getExpenses();

function addExpense(e){
    e.preventDefault();
    const token=localStorage.getItem('token');
    axios({
        method:'post',
        url:`http://localhost:4000/expenses/add-expense`,
        data:{
            amount:`${amount.value} `,
            description:`${description.value} `,
            category:`${category.value} `
        },
        headers:{'Authorization':token}
    }).then(res=>{
        while(expenseList.hasChildNodes()){
            expenseList.removeChild(expenseList.lastChild);
        }
        getExpenses();
    }).catch(err=>console.log(err));
        
};

function removeExpense(e){
    e.preventDefault();
    const token=localStorage.getItem('token');
    if(e.target.classList.contains('dlt')){
        console.log("delete")
        axios({
            method:'delete',
            url:`http://localhost:4000/expenses/delete-expense/${e.target.parentElement.value}`,
            headers:{'Authorization':token}
        })
        .then((res)=>{
            console.log(res)
            expenseList.removeChild(e.target.parentElement)
        })
        .catch(err=>console.log(err))
        
    }
}


document.getElementById('purchase').onclick= async function (e){
    const token=localStorage.getItem('token');
    const response= await axios({
        method:'get',
        url:'http://localhost:4000/purchase/premiummembership',
        headers:{'Authorization':token}
    })

    var options={
        "key":response.data.key_id,
        "name":"Test Company",
        "order_id":response.data.order_id,
        "prefill":{
            "name":"Test User",
            "email":"test@xyz.com",
            "contact":"9875641234"
        },
        "theme":{
            "color":"#3399cc"
        },
        //success payment handler
        "handler":function(response){
            axios({
                method:'post',
                url:'http://localhost:4000/purchase/updatetransactionstatus',
                data:{
                    order_id:options.order_id,
                    payment_id:response.razorpay_payment_id
                },
                headers:{'Authorization':token}
            })
            .then(()=>{
                alert("You are a Premimum User now!")
            })
            .then(()=>{
                alert("Something went wrong!")
            })
        }
    }
    const rzp1=new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function(response){
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id)
    })
};


