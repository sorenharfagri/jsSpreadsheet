import ExtendedTable from "./ExtendedTable.js";

//Отображаем данные с файла
document.addEventListener('DOMContentLoaded', function () {

    let someTable;
    let form = document.getElementsByName("addRowForm")[0];
    

    //Функция для получения данных с файла json
    function readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }

        rawFile.send(null);
    }


    //Отображаем форму для добавления строки
    function showForm() {
        document.querySelector('#formElement').hidden = false; //Отображаем форму
        document.querySelector('#addRowButton').hidden = true; //Отображаем кнопку добавления строки
    };


    //Функция для добавления в таблицу новой строки с формы
    function addRow() {

        //Если валидация успешна - создаём строку
        if (someTable.createRow(form.id.value, form.name.value, form.age.value)) {
            //Обнуляем значения формы
            form.reset();
            //Скрываем форму
            document.querySelector('#addRowButton').hidden = false;
            document.querySelector('#formElement').hidden = true;
        }

    };


    //Считываем данные с файла
    readTextFile("/small_data_persons.json", function (text) {
        someTable = new ExtendedTable("someTable", JSON.parse(text));

        form.appendChild(someTable.getIdInput());
        form.appendChild(someTable.getNameInput());
        form.appendChild(someTable.getAgeInput());

        document.querySelector("#addRowButton").addEventListener("click", showForm);
        document.querySelector("#saveFormButton").addEventListener("click", addRow);
    });

}, false);