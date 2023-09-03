//updteData
//import axios from 'axios';

// type is either 'password' or 'data'
 const updateSettings =  async (data, type) => {
   
    try{
        const url = type === 'password' ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword' : 'http://127.0.0.1:3000/api/v1/users/updateMe';
        const res= await axios({
            method:'PATCH',
            url,
            data
        })
        if(res.data.status === 'success'){
            alert(`${type.toUpperCase()} updated successfully`);
            // window.setTimeout(()=>{
            //     location.assign('/me');
            // },1500)
            // console.log(res);
        }
}catch(err){
    alert('error',err.response.data.message);
}


}

document.querySelector('.form-user-data').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    updateSettings({name,email},'data');
  });


  document.querySelector('.form-user-password').addEventListener('submit', async e => {
    e.preventDefault();

    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    
    await updateSettings({passwordCurrent,password,passwordConfirm},'password');

    document.querySelector('.btn--save-password').textContent = 'save password';
    document.getElementById('password-current').value='';
    document.getElementById('password').value='';
    document.getElementById('password-confirm').value='';
  });