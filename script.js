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
            const groupLi = document.createElement('div')
            const groupButton = document.createElement('button')
            groupButton.className = 'accordion-button'
            groupButton.textContent = group

            groupButton.addEventListener('click', () => {
                const panel = groupButton.nextElementSibling
                if (panel.style.display === 'block') {
                    panel.style.display = 'none'
                } else {
                    panel.style.display = 'block'
                }
            })

            const groupPanel = document.createElement('div')
            groupPanel.className = 'accordion-panel'
            groupPanel.style.display = 'none'

            const groupContactList = document.createElement('ul')
            groupContactList.className = 'group-contact-list'

            savedContacts.forEach((contact) => {
                if (contact.group === group) {
                    const contactLi = document.createElement('li')
                    contactLi.textContent = `${contact.name} (${contact.number})`

                    const deleteButton = document.createElement('button')
                    deleteButton.className = 'delete-contact-btn'
                    deleteButton.innerHTML = '<i class="bi bi-trash"></i>'
                    deleteButton.addEventListener('click', () => deleteContact(contact))

                    groupContactList.appendChild(contactLi)
                    contactLi.appendChild(deleteButton)
                }
            })

            groupPanel.appendChild(groupContactList)
            groupLi.appendChild(groupButton)
            groupLi.appendChild(groupPanel)
            groupAccordion.appendChild(groupLi)
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
