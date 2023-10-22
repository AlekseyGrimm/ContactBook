document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.querySelector('.overlay')    
    const savedGroups = JSON.parse(localStorage.getItem('groups')) || []
    const groupDropdown = document.querySelector('#group')
    const groupSidebar = document.querySelector('#group-sidebar')

    const displayGroupsAccordion = () => {
        const savedContacts = JSON.parse(localStorage.getItem('contacts')) || []
        const groupAccordion = document.querySelector('#group-accordion')
        groupAccordion.innerHTML = ''
    
        savedGroups.forEach((group) => {
            const card = document.createElement('div')
            card.className = 'card'
    
            // Заголовок карточки (кнопка аккордеона)
            const cardHeader = document.createElement('div')
            cardHeader.className = 'accordion-header'
            cardHeader.id = `heading-${group}`
    
            const button = document.createElement('button')
            button.className = 'accordion-button'
            button.setAttribute('data-bs-toggle', 'collapse')
            button.setAttribute('data-bs-target', `#collapse-${group}`)
            button.textContent = group
    
            cardHeader.appendChild(button)
            card.appendChild(cardHeader)
    
            // Содержимое карточки (панель аккордеона)
            const collapse = document.createElement('div')
            collapse.id = `collapse-${group}`
            collapse.className = 'collapse'
            collapse.setAttribute('data-bs-parent', '#group-accordion')
    
            const cardBody = document.createElement('div')
            cardBody.className = 'card-body'
    
            savedContacts.forEach((contact) => {
                if (contact.group === group) {
                    const contactDiv = document.createElement('div')
                    contactDiv.className = 'contactDiv'
                    contactDiv.textContent = `${contact.name}(${contact.number})`
    
                    const deleteButton = document.createElement('button')
                    // deleteButton.className = 'btn btn-danger'
                    deleteButton.innerHTML = '<i class="bi bi-trash"></i>'
                    deleteButton.addEventListener('click', () => deleteContact(contact))
    
                    contactDiv.appendChild(deleteButton)
                    cardBody.appendChild(contactDiv)
                }
            })
    
            collapse.appendChild(cardBody)
            card.appendChild(collapse)
    
            groupAccordion.appendChild(card)
        })
    }

    const deleteContact = (contact) => {
        const savedContacts = JSON.parse(localStorage.getItem('contacts')) || []
        const index = savedContacts.findIndex((c) => c.name === contact.name && c.number === contact.number)
    
        if (index !== -1) {
            savedContacts.splice(index, 1)
            localStorage.setItem('contacts', JSON.stringify(savedContacts))
            displayGroupsAccordion()
        }
    }

    const displayGroupSidebar = () => {
        const groupSidebar = document.querySelector('#group-sidebar')
        const groupSidebarBody = groupSidebar.querySelector('.sidebar-body')
    
        groupSidebarBody.innerHTML = ''
    
        if (savedGroups.length === 0) {
            const noGroupsText = document.createElement('p')
            noGroupsText.textContent = 'Нет доступных групп'
            groupSidebarBody.appendChild(noGroupsText)
        } else {
            savedGroups.forEach((group) => {
                const groupItem = document.createElement('div')
                groupItem.classList.add('sidebar-body-group')
                groupItem.textContent = group
                
                // Кнопка "Удалить" для каждой группы
                const deleteButton = document.createElement('button')
                deleteButton.setAttribute('type', 'button')
                deleteButton.setAttribute('class', 'btn-close')
                deleteButton.setAttribute('aria-label', 'Close')
                deleteButton.addEventListener('click', () => {
                    const index = savedGroups.indexOf(group)
                    if (index !== -1) {
                        savedGroups.splice(index, 1)
                        localStorage.setItem('groups', JSON.stringify(savedGroups))
                        displayGroupSidebar()
                        displayGroupsAccordion()
                    }
                })
    
                groupItem.appendChild(deleteButton)
                groupSidebarBody.appendChild(groupItem)
            })
        }
    }

    displayGroupsAccordion()   
   

    document.querySelector('#add-contact-btn').addEventListener('click', () => {
        document.querySelector('#sidebar').classList.add('show')
        overlay.classList.add('active')

        groupDropdown.innerHTML = ''
        if (savedGroups.length === 0) {
            const emptyOption = document.createElement('option')
            emptyOption.textContent = 'Добавьте группу'
            emptyOption.value = ''
            groupDropdown.appendChild(emptyOption)
        } else {
            savedGroups.forEach((group) => {
                const option = document.createElement('option')
                option.textContent = group
                option.value = group
                groupDropdown.appendChild(option)
            })
        }
    })

    document.querySelector('#close-contact').addEventListener('click', () => {
        document.querySelector('#sidebar').classList.remove('show')
        overlay.classList.remove('active')
    })

    document.querySelector('#groups-btn').addEventListener('click', () => {
        document.querySelector('#group-sidebar').classList.add('show')
        overlay.classList.add('active')
        displayGroupSidebar()
    })

    document.querySelector('#close-groups').addEventListener('click', () => {
        document.querySelector('#group-sidebar').classList.remove('show')
        overlay.classList.remove('active')
    })

    document.querySelector('#add-group').addEventListener('click', () => {
        const newGroupInput = document.createElement('input')
        newGroupInput.type = 'text'
        newGroupInput.className = 'form-control'
        newGroupInput.id = 'new-group'
        newGroupInput.placeholder = 'Введите название'
        newGroupInput.addEventListener('input', (e) => {
            e.preventDefault()
        })
    
        groupSidebar.querySelector('.sidebar-body').appendChild(newGroupInput)
    })
    
    document.querySelector('#save-groups').addEventListener('click', () => {
        const groupInputs = groupSidebar.querySelectorAll('input[type="text"]')
        const newGroups = []
    
        groupInputs.forEach((input) => {
            const newGroup = input.value.trim()
            if (newGroup) {
                newGroups.push(newGroup)
            }
        })
    
        if (newGroups.length > 0) {
            savedGroups.push(...newGroups)
            localStorage.setItem('groups', JSON.stringify(savedGroups))
            displayGroupSidebar()
        }
    
        groupInputs.forEach((input) => {
            input.value = ''
        })
        displayGroupsAccordion()
    })

    document.querySelector('#save-contact').addEventListener('click', () => {
        const nameInput = document.querySelector('#name')
        const numberInput = document.querySelector('#number')
        const groupInput = document.querySelector('#group')
    
        const name = nameInput.value.trim()
        const number = numberInput.value.trim()
        const group = groupInput.value
    
        // Проверяем, что обязательные поля заполнены
        if (name === '' || number === '') {
            // Можно вывести сообщение об ошибке
            alert('Заполните обязательные поля: ФИО и номер.')
            return
        }

        const contact = {
            name,
            number,
            group,
        }

        const savedContacts = JSON.parse(localStorage.getItem('contacts')) || []

        savedContacts.push(contact)

        localStorage.setItem('contacts', JSON.stringify(savedContacts))
        nameInput.value = ''
        numberInput.value = ''
        displayGroupsAccordion()
    })

})
