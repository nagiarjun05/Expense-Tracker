const userEmail=document.getElementById("user-email");
const passWord=document.getElementById("password");
const login=document.getElementById("login");
const forgetPassword=getElementById("forget-password");

login.addEventListener('click',(e)=>{
    e.preventDefault();
    const  email=userEmail.value;
    const  password=passWord.value;
    
    if (!email||!password){
        alert("All fields are mandatory!")
    }

    axios({
        method:'post',
        url:`http://localhost:4000/users/login`,
        data:{
            email: email,
            password: password
        }
    })
    .then((res)=>{
        // console.log(res.data.token)
        alert(res.data.message)
        localStorage.setItem('token', res.data.token)
        window.location.href="./expense.html"
    })
    .catch((err)=>{
        console.log(err)
        // alert(err.DATA)
    })
});


// forgetPassword.addEventListener('click',()=>{

// })