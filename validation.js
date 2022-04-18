const titleInput = document.querySelector("input#title");

titleInput.addEventListener('input', () => {
    titleInput.setCustomValidity('');
    titleInput.checkValidity();
})

titleInput.addEventListener('invalid', () => {
    if(titleInput.value === '') {
        titleInput.setCustomValidity('Please enter a book title.')
    } 
})

