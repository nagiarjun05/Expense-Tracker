const userEmail=document.getElementById("user-email");
const passWord=document.getElementById("password");
const login=document.getElementById("login");



login.addEventListener('click',(e)=>{
    const  email=userEmail.value;
    const  password=passWord.value;
    
    if (!email||!password){
        alert("All fields are mandatory!")
    }

    console.log(email);
    console.log(password);
});