let btnFilter = document.querySelectorAll('.filter button');
Array.from(btnFilter).forEach((btn) => {
    btn.addEventListener('click', (e) => {
        removeClassActive()
        e.currentTarget.classList.add('active')
    })
})

function removeClassActive() {
    Array.from(btnFilter).forEach(btn => btn.classList.remove('active'));
}

// let check = document.getElementById('checkbox')
// let task = document.getElementById("task-element")

// check.addEventListener('change', (e) => {
//     task.classList.toggle('is_completed')
// })
