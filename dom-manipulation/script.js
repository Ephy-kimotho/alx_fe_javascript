const qouteDiv = document.getElementById("quoteDisplay")
const newQouteBtn = document.getElementById("newQuote")

const newQouteText = document.getElementById("newQuoteText")
const newQouteCategory = document.getElementById("newQuoteCategory")
const addQouteBtn = document.getElementById("addQoute")

const downloadBtn = document.getElementById("download-btn")
const uploadFileInput = document.getElementById("upload-qoutes")



/*------------------------ EVENT LISTENERS ------------------------ */
newQouteBtn.addEventListener("click", showRandomQuote)
addQouteBtn.addEventListener("click", addQoute)
downloadBtn.addEventListener("click", downloadQoutes)
uploadFileInput.addEventListener("change", importJSONFile)

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
            alert("Quotes imported successfully")
        }

    } else {
        alert("Failed to import qoutes ! Invalid format")
    }
}