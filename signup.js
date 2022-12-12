const userName=document.getElementById("user-name");
const userEmail=document.getElementById("user-email");
const password=document.getElementById("password");
const signup=document.getElementById("signup");

signup.addEventListener('click',(e)=>{
    if (!userName.value||!userEmail.value||!password.value){
        alert("All fields are mandatory!")
    }
    console.log(userName.value)
    console.log(userEmail.value)
    console.log(password.value)
});