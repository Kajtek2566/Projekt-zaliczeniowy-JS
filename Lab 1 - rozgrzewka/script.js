document.addEventListener('DOMContentLoaded', function() {
    var inputContainer = document.getElementById('input-container');
    var sumParagraph = document.getElementById('Sum');
    var addButton = document.getElementById('add-button');

    var inputs = document.querySelectorAll('.dynamic-input');
    inputs.forEach(function(input) {
        input.addEventListener('input', updateSum);
    });

    addButton.addEventListener('click', addNewInput);

    function updateSum() {
        var sum = 0;
        var inputs = document.querySelectorAll('.dynamic-input');
        inputs.forEach(function(input) {
            var value = parseFloat(input.value) || 0;
            sum += value;
        });
        sumParagraph.textContent = "Sum: " + sum;
    }

    function addNewInput() {
        var newInputWrapper = document.createElement('div');
        var newInput = document.createElement('input');
        var removeButton = document.createElement('button');

        newInput.type = 'number';
        newInput.className = 'dynamic-input';
        newInput.addEventListener('input', updateSum);

        removeButton.textContent = 'Usuń';
        removeButton.type = 'button';
        removeButton.addEventListener('click', function() {
            newInputWrapper.remove();
            updateSum();
        });

        newInputWrapper.appendChild(newInput);
        newInputWrapper.appendChild(removeButton);
        inputContainer.appendChild(newInputWrapper);
    }

    window.removeInput = function(button) {
        var inputWrapper = button.parentNode;
        inputWrapper.remove();
        updateSum();
    }
});
