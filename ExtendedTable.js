function ExtendedTable (tableId, tableData) {
    if (!tableId) return console.error(`Table id required!`)

    let table = document.querySelector(`#${tableId}`)
    if (!table) throw new Error (`Table with id: '${tableId}' not found!`);

    //Резерв для получения в скоуп tbody при инициализации таблицы
    let tbody;

    //Индекс отсортированного столбца
    //Используется для соритровки в обратном порядке, при повторной сортировке одного и того-же столбца
    let sortedColumnIndex;
    let self = this;
    

    this.getTableId = () => tableId

    //Проверка перед добавлением/редактированием id
    //Функция возвращает false/true в зависимости от успешности проверки
    //@id: number, unic
    let verifyId = function(id) {
        let validationStatus = true;

        //Проверка на повторяющийся id
        if (id) {
            let tableRows = Array.from(table.rows).slice(1)
            let columnIndex = document.querySelector("#columnId").cellIndex

            if (tableRows.find(row => row.cells[columnIndex].value == id)) {
                alert("Данный ID уже существует"); 
                validationStatus = false;
            }

        } else {
            alert("Значение поля ID не может быть пустым"); 
            validationStatus = false;
        }

        return validationStatus;
    }

    //@age: number, length < 1000
    let verifyAge = function(age) {
        let validationStatus = true;

        if (!age) {
            alert("Значение поля age не может быть пустым");
            validationStatus = false;
        } else if (parseInt(age) > 1000) {
            alert("Значение поля age не может превышать 1000");
            validationStatus = false;
        }

        return validationStatus;
    }

    //@name: string, length < 100
    let verifyName = function(name) {

        let validationStatus = true;

        //Удаляем сдвоенные пробелы
        name = name.replace(/\s{2,}/g, ' ').trim();

        if (!name) {
            alert("Значение поля name не может быть пустым");
            validationStatus = false;
        } else if (name.Length > 100) {
            alert("Значение поля name не может превышать 100 символов");
            validationStatus = false;
        }
        
        return validationStatus;
    }


    //Метод объединяет в себе все методы, необходимые для верификации добавления строки
    //В случае если одна из проверок не проходит - возвращает false, иначе - true
    this.verifyForm = (id, name, age) => verifyId(id) && verifyName(name) && verifyAge(age)

    //Функция для удаления строки
    //Принимает индекс строк
    this.deleteRow = function(index = 1) {

        if (index <= 0) return console.error("Not allowed to delete table headers");
        if (index >= table.rows.length) return console.error(`Row with index: '${index}' not found`)
        
        table.deleteRow(index);
    };

    //Функция для создания одной строки таблицы
    //@id: number, unic
    //@name: string, length < 100
    //@age: number, length < 1000
    this.createRow = function (id, name, age) {

        if (this.verifyForm(id, name, age)) {

            let row = document.createElement("TR");

            //Ячейка с id
            let td1 = document.createElement("TD");
            td1.setAttribute("id", "tdId");
            //У ячеек появляется свойство value для удобства сортировки
            td1.value = parseInt(id);

            let td1Text = document.createElement("P");
            td1Text.appendChild(document.createTextNode(id));
            td1Text.setAttribute("id", "labelId");
            td1.appendChild(td1Text);

            //Кнопка удаления строки 
            let deleteButton = document.createElement("INPUT"); //Кнопка удаления строки
            deleteButton.setAttribute("type", "button");
            deleteButton.setAttribute("value", "Удалить");
            deleteButton.addEventListener("click", function() {
                self.deleteRow(this.closest("tr").rowIndex);
            });

            //Кнопка редактирования строки
            let editButton = document.createElement("INPUT");
            editButton.setAttribute("type", "button");
            editButton.setAttribute("value", "Редактировать");
            editButton.setAttribute("id", "editButton");
            editButton.addEventListener("click", function() {
                editRow(this.closest("tr"));
            }, {once:true});

            td1.appendChild(deleteButton);
            td1.appendChild(editButton);

            //Ячейка с именем
            let td2 = document.createElement("TD");
            td2.setAttribute("id", "tdName");
            td2.value = name;

            let td2Text = document.createElement("P");
            td2Text.appendChild(document.createTextNode(name));
            td2Text.setAttribute("id", "labelName");
            td2.appendChild(td2Text);

            //Ячейка с возрастом
            let td3 = document.createElement("TD");
            td3.setAttribute("id", "tdAge");
            age.includes('.') ? td3.value = parseFloat(age).toFixed(4) : td3.value = parseInt(age);

            let td3Text = document.createElement("P");
            td3Text.appendChild(document.createTextNode(age));
            td3Text.setAttribute("id", "labelAge");
            td3.appendChild(td3Text);

            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);

            tbody.appendChild(row);

            //Если таблица на момент редактирования была отсортирована - повторно сортируем с полученными значениями
            if (sortedColumnIndex >= 0) sortData(sortedColumnIndex);

            return true;
        } else {
            return false;
        }
    }

    //Функция для инициализации таблицы
    //Создаёт thead, tbody, заголовки таблицы
    //Загружает в таблицу данные, если таковые были переданы
    
    let initTable = function () {

        //Создание thead и заголовков таблицы
        let thead = document.createElement("thead")
        let tr = document.createElement("tr") 

        let th1 = document.createElement("th")
        th1.setAttribute("id", "columnId")
        th1.innerText = "ID"
        th1.addEventListener("click", function() {
            self.sortColumn(this.cellIndex);
        })

        let th2 = document.createElement("th")
        th2.setAttribute("id", "columnName")
        th2.innerText = "Name"
        th2.addEventListener("click", function() {
            self.sortColumn(this.cellIndex);
        })

        let th3 = document.createElement("th")
        th3.setAttribute("id", "columnAge")
        th3.innerText = "Age"
        th3.addEventListener("click", function() {
            self.sortColumn(this.cellIndex)
        })

        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3); 

        thead.appendChild(tr) 
        document.querySelector(`#${tableId}`).appendChild(thead)

        tbody = document.createElement("tbody");
        document.querySelector(`#${tableId}`).appendChild(tbody)

        if (tableData) {
          try {
            tableData.forEach((person) => self.createRow(person.ID, person.Name, person.Age));
          } catch (error) {
            console.error(`Error with loading data: ${error}`)
          }
        }
    }

    initTable();

    //Метод для проверки инпута age, разрешает ввод цифр и одной точки
    this.checkAgeInput = function(elementRef) {

        var keyCodeEntered = (event.which) ? event.which : (window.event.keyCode) ? window.event.keyCode : -1;

        //Разрешаем ввод только цифр
        if ((keyCodeEntered >= 48) && (keyCodeEntered <= 57)) {
            return event.returnValue = true;

        } else if (keyCodeEntered == 46) {

            //В случае ввода точки
            //Проверяем её наличие в инпуте
            //В случае наличия отменяем ввод, тем самым ограничиваем значение инпута одной точкой
            if ((elementRef.value) && (elementRef.value.indexOf('.') >= 0)) {
                return event.returnValue = false;

            } else {
                return event.returnValue = true;
            }
        }

        return event.returnValue = false;
    }

    //Метод для проверки инпута имени
    //Позволяет вводить латинские/русские буквы, использовать пробел
    this.checkNameInput = function(event) {

        if (event.keyCode >= 65 && event.keyCode <= 90 ||
            event.keyCode >= 96 && event.keyCode <= 122 ||
            event.keyCode >= 1039 && event.keyCode <= 1104 ||
            event.keyCode >= 1072 && event.keyCode <= 1105 ||
            event.keyCode == 32) 
        {
            event.returnValue = true;
        } else {
            event.returnValue = false
        }

    }

    //Проверяем инпут id
    //Разрешаем вводить только цифры
    this.checkIdInput = function(event) {
        event.keyCode < 47 || event.keyCode > 57 ? event.returnValue = false : event.returnValue = true;
    }

    //Инпуты для добавления/редактирования строк таблицы
    //Включат в себя проверку на вводимое значение (checkIdInput)
    this.getIdInput = function() {
        let input = document.createElement("input");
        input.setAttribute("type", "number");
        input.setAttribute("name", "id")
        input.setAttribute("placeholder", "ID")
        input.setAttribute("min", "0")
        input.setAttribute("onpaste", "return false;")
        input.addEventListener("keypress", function(event) {
            self.checkIdInput(event)
        })

        return input;
    }

    this.getNameInput = function() {
        let input = document.createElement("input");
        input.setAttribute("type", "text")
        input.setAttribute("name", "name")
        input.setAttribute("placeholder", "Name")
        input.setAttribute("maxlength", "100")
        input.setAttribute("onpaste", "return false;")
        input.addEventListener("keypress",  function(event) {
            self.checkNameInput(event) 
        });

        return input;
    }

    this.getAgeInput = function() {
        let input = document.createElement("input");
        input.setAttribute("name", "age")
        input.setAttribute("placeholder", "Age")
        input.setAttribute("min", "0")
        input.setAttribute("max", "1000")
        input.setAttribute("onpaste", "return false;")
        input.addEventListener("keypress", function() {
            self.checkAgeInput(this)
        });

        return input;
    }
    

    //Функция для редактировании строки
    let editRow = function(row) {

        let ageValue = row.querySelector("#tdAge").value;
        console.log(typeof ageValue);

        //Получаем кнопку редактирования
        let editButton = row.querySelector("#editButton")

        //Временно меняем её функционал на кнопку "сохранить"
        editButton.setAttribute("value", "Сохранить");
        editButton.addEventListener("click", saveChanges);

        //Получаем текстовые элементы которые отвечают за значения ячеек строки
        let labelId = row.querySelector("#labelId");
        let labelName = row.querySelector("#labelName");
        let labelAge = row.querySelector("#labelAge");

        //Меняем эти элементы на инпуты
        let idInput = self.getIdInput();
        idInput.setAttribute("value", labelId.innerText);

        let nameInput = self.getNameInput();
        nameInput.setAttribute("value", labelName.innerText);

        let ageInput = self.getAgeInput();
        ageInput.setAttribute("value", labelAge.innerText);


        labelId.parentElement.replaceChild(idInput, labelId);
        labelName.parentElement.replaceChild(nameInput, labelName);
        labelAge.parentElement.replaceChild(ageInput, labelAge);

        //Функция для сохранения изменений, внесённых в инпуты
        function saveChanges() {

            let validatonStatus = true;
 
            //Проверяем значение инпута, если оно изменилось
            if (idInput.value != row.querySelector("#tdId").value) {
                if (!verifyId(idInput.value)) {
                    validatonStatus = false;
                }
            }

            if (nameInput.value != row.querySelector("#tdName").value) {
                if (!verifyName(nameInput.value)) {
                    validatonStatus = false;
                }
            }

            if (ageInput.value != row.querySelector("#tdAge").value) {
                if (!verifyAge(ageInput.value)) {
                    validatonStatus = false;
                }
            }
            
            if (validatonStatus) {

                //Устанавливаем значения текстовых элементов
                labelId.textContent = idInput.value;
                labelName.textContent = nameInput.value;
                labelAge.textContent = ageInput.value;

                //Не забываем обновить свойство value у ячеек
                row.querySelector("#tdId").value = parseInt(idInput.value);
                row.querySelector("#tdName").value = nameInput.value;
                row.querySelector("#tdAge").value = ageInput.value.includes('.') ? parseFloat(ageInput.value).toFixed(4) 
                : parseInt(ageInput.value);
                

                //Заменяем инпуты на прежние элементы, которые получили новые значения
                idInput.parentElement.replaceChild(labelId, idInput);
                nameInput.parentElement.replaceChild(labelName, nameInput);
                ageInput.parentElement.replaceChild(labelAge, ageInput);

                //Возвращаем кнопке редактировать прежнее состояние
                editButton.setAttribute("value", "Редактировать");
                editButton.removeEventListener("click", saveChanges, false);
                editButton.addEventListener("click", function() {
                    editRow(this.closest("tr"));
                }, {once:true})
    
                //Если таблица на момент редактирования была отсортирована - повторно сортируем с полученными значениями
                if (sortedColumnIndex >= 0) sortData(sortedColumnIndex);
            }
        }

    }

    //Добавить проверку ошибок
    //Внутрення функция для сортировки столбца
    //Получает индекс столбца - сортирует от большего к меньшему

    //Переписать обращение к таблице (dataTable)
    let sortData = function(columnIndex) {
        let tableRows = Array.from(table.rows).slice(1);

        tableRows.sort((rowA, rowB) => rowA.cells[columnIndex].value >= rowB.cells[columnIndex].value ? 1 : -1);
        table.tBodies[0].append(...tableRows);
    }

    //Публичная функция для сортировки данных
    //Принимает индекс столбца - с помощью функции sortData сортирует колонку от меньшего к большему
    //При повторных сортировках одного и того-же столбца - переворачивает его

    this.sortColumn = function (columnIndex) {
        if (columnIndex >= 0) {

            if (columnIndex > table.querySelector("thead").querySelectorAll("th").length - 1) {
                return console.error(`Column with index '${columnIndex}' not found`);
            }

            let dataType;
            let tableRows = Array.from(table.rows).slice(1);

            //Проверяем есть ли в колонке строка
            let rowWithData = tableRows.find(row => row.cells[columnIndex].value);

            if (rowWithData) {
                dataType = typeof rowWithData.cells[columnIndex].value;
            } else {
                return console.error("No data found in column");
            }

            //В случае если сортировка повторная - переворачиваем колонку
            if (columnIndex == sortedColumnIndex) {
                tableRows.reverse();
                table.tBodies[0].append(...tableRows);
            } else {
                //Запоминаем индекс массива, который был отсортирован
                sortedColumnIndex = columnIndex;
                sortData(columnIndex)
            }
        } else {
            console.error("Params required in 'table.sortColumn()' ")
        }
    }



}
export default ExtendedTable;
