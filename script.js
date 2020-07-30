import ExtendedTable from "./ExtendedTable.js";

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


    //Функция для кнопки добавленяи строки
    function showForm() {
        document.querySelector('#formElement').hidden = false; //Отображаем форму
        document.querySelector('#addRowButton').hidden = true; //Скрываем кнопку
    };


    //Функция для добавления в таблицу новой строки с формы
    function addRow() {

        if (someTable.createRow(form.id.value, form.name.value, form.age.value)) {
            //Если строка создана успешно - обнуляем форму, затем её скрываем
            form.reset();
            
            document.querySelector('#addRowButton').hidden = false;
            document.querySelector('#formElement').hidden = true;
        }

    };


    //Считываем данные с файла, создаём таблицу
    readTextFile("./small_data_persons.json", function (text) {
        someTable = new ExtendedTable("someTable", JSON.parse(text));

        //Получаем инпуты для формы, они есть в методах таблицы
        form.appendChild(someTable.getIdInput());
        form.appendChild(someTable.getNameInput());
        form.appendChild(someTable.getAgeInput());
        
        //Активизируем функционал добавления новой строки
        document.querySelector("#addRowButton").addEventListener("click", showForm);
        document.querySelector("#saveFormButton").addEventListener("click", addRow);
    });

}, false);
