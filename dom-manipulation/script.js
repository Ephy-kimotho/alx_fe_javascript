const qouteDiv = document.getElementById("quoteDisplay")
const newQouteBtn = document.getElementById("newQuote")

const newQouteText = document.getElementById("newQuoteText")
const newQouteCategory = document.getElementById("newQuoteCategory")
const addQouteBtn = document.getElementById("addQoute")

const downloadBtn = document.getElementById("download-btn")
const uploadFileInput = document.getElementById("upload-qoutes")
const categoryFilter = document.getElementById("categoryFilter")

const notificationDiv = document.getElementById("notification")
/*------------------------ EVENT LISTENERS ------------------------ */
newQouteBtn.addEventListener("click", showRandomQuote)
addQouteBtn.addEventListener("click", addQoute)
downloadBtn.addEventListener("click", downloadQoutes)
uploadFileInput.addEventListener("change", importJSONFile)
categoryFilter.addEventListener("change", filterQuotes)

let quotes = JSON.parse(localStorage.getItem("qoutes")) || []

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    const randomQoute = quotes[randomIndex].text
    sessionStorage.setItem("lastViewedQoute", JSON.stringify(randomQoute))
    qouteDiv.textContent = randomQoute
}

function addQoute() {
    const text = newQouteText.value.trim()
    const category = newQouteCategory.value.trim()

    if (text === "" || category === "") {
        alert("Kindly enter a qoute and it's category")
    } else {
        quotes.push({ text, category })
        saveQoutes()
        getCategories()
        const p = document.createElement("p")
        p.textContent = text

        qouteDiv.innerHTML = ""
        qouteDiv.appendChild(p)
    }
}

function saveQoutes() {
    localStorage.setItem("qoutes", JSON.stringify(quotes))
}


function showLastViewedQoute() {
    const lastViewedQoute = JSON.parse(sessionStorage.getItem("lastViewedQoute"))
    if (lastViewedQoute) { qouteDiv.textContent = lastViewedQoute }
}

showLastViewedQoute()

function downloadQoutes(e) {
    const target = e.target
    const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    target.href = url
    target.download = "Qoutes.txt"

    setTimeout(() => {
        URL.revokeObjectURL(url)
    }, 1500)

}

function importJSONFile(e) {
    const file = e.target.files[0]
    if (file) {
        const fr = new FileReader()

        fr.readAsText(file)

        fr.onload = () => {
            const importedQoutes = JSON.parse(fr.result)
            quotes.push(...importedQoutes)
            saveQoutes()
            getCategories()
            alert("Quotes imported successfully")
        }

    } else {
        alert("Failed to import qoutes ! Invalid format")
    }
}

function getCategories() {
    const categories = quotes.reduce((values, qoute) => {
        if (!values.includes(qoute.category)) {
            values.push(qoute.category)
        }
        return values
    }, ["All"])
    populateCategories(categories)
}


function populateCategories(categories) {
    const options = categories.map(category => {
        return `<option value=${category}>${category}</option>`
    })
    categoryFilter.innerHTML = options.join("")
}

getCategories()
// Load the last selected category from local storage
const lastSelectedCategory = localStorage.getItem("selectedCategory")
if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
    filterQuotes({ target: { value: lastSelectedCategory } });
}

function filterQuotes(e) {
    const category = e.target.value
    localStorage.setItem("selectedCategory", category)

    if (category === "All") {
        showRandomQuote()
    } else {
        const filteredQuotes = quotes.filter(qoute => qoute.category === category)
        if (filterQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length)
            const randomQoute = filteredQuotes[randomIndex].text
            sessionStorage.setItem("lastViewedQoute", JSON.stringify(randomQoute))
            qouteDiv.textContent = randomQoute
        } else {
            qouteDiv.textContent = "No qoutes available for this category"
        }

    }
}

/* --------------- Syncing Data with Server and Implementing Conflict Resolution -------------- */
async function fetchQuotesFromServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts")
        const serverQoutes = await response.json()

        const transformedQoutes = serverQoutes.map(qoute => {
            return {
                text: qoute.title,
                category: "General"
            }
        })
        localStorage.setItem("serverQoutes", JSON.stringify(transformedQoutes))

    } catch (error) {
        showNotification("An error occured while getting qoutes", "error")
        console.error("Error fetching qoutes from server: ", error)
    }

}

fetchQuotesFromServer()

async function syncQuotes() {
    try {
        const serverQoutes = JSON.parse(localStorage.getItem("serverQoutes")) || []
        const localQoutes = JSON.parse(localStorage.getItem("qoutes")) || []

        const mergedQuotes = [...serverQoutes]
        /* 
            For each local quote, 
            check if it already exists in the mergedQuotes using the .some() method.
            If the quote does not exist in mergedQuotes, add it
        */
        let newQuotesAdded = false
        localQoutes.forEach(localQoute => {
            const exist = mergedQuotes.some(qoute => qoute.text === localQoute.text)
            // if true that means the current qoute does exist in the mergedQoutes array
            // if false then it does not exist in the current mergedQoutes array
            if (!exist) {
                mergedQuotes.push(localQoute)
                newQuotesAdded = true
            }
        })

        localStorage.setItem("qoutes", JSON.stringify(mergedQuotes))
        getCategories()

        if (newQuotesAdded) {
            showNotification("Quotes synced with server!", "success")
        } else {
            showNotification("Your qoutes up-to-date.", "success")
        }
    } catch (error) {
        showNotification("An error occured while syncing qoutes.", "error")
        console.error("Error syncing quotes: ", error);
    }
}

syncQuotes()

async function postQuotesToServer() {
    const localQoutes = JSON.parse(localStorage.getItem("qoutes")) || []
    try {

        if (localQoutes.length === 0) {
            showNotification("No qoutes to post", "info")
            return
        }

        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(localQoutes)
        })

        if (!response.ok) {
            throw new Error("Failed to post data to server")
        }

        const result = await response.json()
        console.log("Server result: ", result)

        showNotification("Quotes successfully posted to server.", "success")

    } catch (error) {
        showNotification("An error occurred while posting quotes to the server.", "error")
        console.error("Error posting quotes to server: ", error)
    }
}
postQuotesToServer()

function showNotification(message, type) {
    notificationDiv.textContent = message
    notificationDiv.classList.add("show", type)

    setTimeout(() => {
        notificationDiv.classList.remove("show", type)
    }, 5000)
}

/* --------- periodic server calls and syncing of qoutes ---------*/
setInterval(fetchQuotesFromServer, 600000)
setInterval(syncQuotes, 600000)