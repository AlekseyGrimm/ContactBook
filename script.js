document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.querySelector('.overlay')
    const savedGroups = JSON.parse(localStorage.getItem('groups')) || []      
    const groupDropdown = document.querySelector('#group')
    const groupSidebar = document.querySelector('#group-sidebar')
    const groupAccordion = document.querySelector('#group-accordion')

    const displayGroupsAccordion = () => {
        const savedContacts = JSON.parse(localStorage.getItem('contacts')) || []
        groupAccordion.innerHTML = ''
        savedGroups.forEach((group) => {
            const card = document.createElement('div')
            card.className = 'card'

            // Заголовок аккордеона
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

            // Содержимое аккордеона
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
                    contactDiv.innerHTML = `<div>
                                                <span>${contact.name}</span>                                                
                                            </div>`

                    const groupButtons = document.createElement('div')
                    groupButtons.className = 'groupButtons'
                    const deleteButton = document.createElement('div')
                    deleteButton.innerHTML = `<button type="button" class="btn btn-outline-secondary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                                                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
                                                    </svg>
                                                </button>`

                    const editButton = document.createElement('div')
                    editButton.innerHTML = `<span>${contact.number}</span>
                                            <button type="button" class="btn btn-outline-secondary">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"></path>
                                                </svg>
                                            </button>`

                    deleteButton.addEventListener('click', () => deleteContact(contact))
                    editButton.addEventListener('click', () => editContact(contact))

                    groupButtons.appendChild(editButton)
                    groupButtons.appendChild(deleteButton)

                    contactDiv.appendChild(groupButtons)
                    cardBody.appendChild(contactDiv)
                }
            })

            collapse.appendChild(cardBody)
            card.appendChild(collapse)

            groupAccordion.appendChild(card)
        })
    }


    const deleteContact = (contact) => {
        const savedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
        const index = savedContacts.findIndex((c) => c.name === contact.name && c.number === contact.number);
    
        if (index !== -1) {
            savedContacts.splice(index, 1)
            localStorage.setItem('contacts', JSON.stringify(savedContacts))
            displayGroupsAccordion()
        }
    }

    const editContact = (contactToEdit) => {
        const editContactModal = new bootstrap.Modal(document.getElementById('editContactModal'))
        editContactModal.show()

        // Заполнения модалки редактора контактов
        const nameInput = document.querySelector('#editName')
        const numberInput = document.querySelector('#editNumber')
        const groupInput = document.querySelector('#editGroup')

        nameInput.value = contactToEdit.name
        numberInput.value = contactToEdit.number
        groupInput.value = contactToEdit.group
        groupInput.innerHTML = ''
        savedGroups.forEach((group) => {
            const option = document.createElement('option')
            option.textContent = group
            option.value = group
            groupInput.appendChild(option)
        })

        // Обработчик события для кнопки "Сохранить изменения"
        document.querySelector('#saveContactChanges').addEventListener('click', () => {
            debugger
            const newName = nameInput.value.trim()
            const newNumber = numberInput.value.trim()
            const newGroup = groupInput.value
        
            if (newName !== '' && newNumber !== '') {
                contactToEdit.name = newName
                contactToEdit.number = newNumber
                contactToEdit.group = newGroup
        
                const savedContacts = JSON.parse(localStorage.getItem('contacts')) || []
                const contactIndex = savedContacts.findIndex(contact => contact.id === contactToEdit.id)
        
                if (contactIndex !== -1) {
                    savedContacts[contactIndex] = contactToEdit
                }
                localStorage.setItem('contacts', JSON.stringify(savedContacts))
                displayGroupsAccordion(savedContacts)
                editContactModal.hide()
            }
        })
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

                        const savedContacts = JSON.parse(localStorage.getItem('contacts')) || []
                        const updatedContacts = savedContacts.filter(contact => contact.group !== group)
                        localStorage.setItem('contacts', JSON.stringify(updatedContacts))
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
            // Можно добавить модальное окно
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
