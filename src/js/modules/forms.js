import checkNumInputs from "./checkNumInputs";


const forms = (state) => {
    const form = document.querySelectorAll('form'),
          inputs = document.querySelectorAll('input'),
          windows = document.querySelectorAll('[data-modal]'),
          btnCalc = document.querySelector('.popup_calc_button'),
          btnProfile = document.querySelector('.popup_calc_profile_button');

    checkNumInputs('input[name="user_phone"]');

    const message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро с Вами свяжемся...',
        failure: 'Что-то пошло не так...'
    };   

    const postData = async (url, data) => {
        document.querySelector('.status').textContent = message.loading;
        let res = await fetch(url, {
            method: "POST",
            body: data
        
        });
    
        return await res.text();
    };

    const clearInputs = () => {
        inputs.forEach(item => {
            item.value = '';
        });
    };
    
    form.forEach(item => {
        item.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            item.appendChild(statusMessage);            
        
            const formData = new FormData(item);
            if (item.getAttribute('data-calc') === "end") {
                for (let key in state) {
                    formData.append(key, state[key]); 
                }
            }

            postData('assets/server.php', formData)
                .then(res => {
                    console.log(res);
                    statusMessage.textContent = message.success;
                })
                .catch(() => statusMessage.textContent = message.failure)
                .finally(() => {
                    clearInputs();
                    for (let key in state) {
                        delete state[key];
                    }

                    inputs.forEach((input) =>{
                        input.value = '';
                        input.checked = false;
                    });
                    
                    setTimeout(() => {
                        statusMessage.remove();
                        windows.forEach(item => {
                            item.style.display = 'none';
                        });
                    }, 5000);
                });
        });
    });




};

export default forms;