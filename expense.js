var addExp=document.getElementById("addExpense");
var amount=document.getElementById("amount");
var description=document.getElementById("description");
var category=document.getElementById("expenseCat");
var expenseList=document.getElementById("exp-list");
const token=localStorage.getItem('token');

addExp.addEventListener('click',addExpense);

expenseList.addEventListener('click', removeExpense);

const getLeaderboard=function(){
    axios({
        method:'get',
        url:'http://localhost:4000/premium/get-leaderboard',
        headers:{'Authorization':token}    
    })
    .then((res)=>{
        document.getElementById('leaderboard').innerHTML='';
        res.data.forEach((element)=>{
            var li = document.createElement('li');
            li.className='leaderboard-item';
            if(element.total==undefined){
                li.innerHTML=`Name - ${element.name}   Total Expense Amount - 0`;
            }else{
                li.innerHTML=`Name - ${element.name}   Total Expense Amount - ${element.total}`;
            }
            document.getElementById('leaderboard').appendChild(li);    
        })
    })
    .catch((err)=>{
        console.log(err)
    })
}

const leaderboard=function(){
    if(document.getElementById('leaderboard').style.display='none'){
        document.getElementById('leaderboard').style.display='block';
    }
    const leaderboardList=document.getElementById('show-leaderboard')
    document.getElementById('show-leaderboard').style.display='block';
    
    leaderboardList.addEventListener('click',getLeaderboard)
}

const getExpenses=function(){
    axios({
        method:'get',
        url:"http://localhost:4000/expenses/get-expenses",
        headers:{'Authorization':token}
    })
    .then(res=>{
        // // console.log(res.data.premiumuser)
        if (res.data.premiumuser==true){
            document.body.className='dark';
            document.getElementById('purchase').style.display='none';
            const premium=document.createElement('span');
            premium.textContent='You are a Premium User';
            document.getElementById('msg').appendChild(premium);
            leaderboard();
        }
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


function addExpense(e){
    e.preventDefault();
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
        expenseList.innerHTML='';
        document.getElementById('msg').innerHTML='';
        getExpenses();
        if(document.getElementById('leaderboard').innerHTML){
            document.getElementById('leaderboard').innerHTML='';            
        }
    }).catch(err=>console.log(err));
        
};

function removeExpense(e){
    e.preventDefault();
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
    const response= await axios({
        method:'get',
        url:'http://localhost:4000/purchase/premiummembership',
        headers:{'Authorization':token}
    })

    var options={
        "key":response.data.key_id,
        "name":"Test Company",
        "order_id":response.data.order.id,
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
                url:'http://localhost:4000/purchase/updatetransaction',
                data:{
                    order_id:options.order_id,
                    payment_id:response.razorpay_payment_id
                },
                headers:{'Authorization':token}
            })
            .then((res)=>{
                localStorage.setItem('token',res.data.token)
                getExpenses();
                alert("You are a Premimum User now!")
            })
            .catch(()=>{
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


