const qouteDiv = document.getElementById("quoteDisplay")
const newQouteBtn = document.getElementById("newQuote")

const newQouteText = document.getElementById("newQuoteText")
const newQouteCategory = document.getElementById("newQuoteCategory")
const addQouteBtn = document.getElementById("addQoute")


/*------------------------ EVENT LISTENERS ------------------------ */
newQouteBtn.addEventListener("click", showRandomQuote)
addQouteBtn.addEventListener("click", createAddQuoteForm)

const quotes = [
    {
        quote: "The best way to predict the future is to invent it.",
        category: "Inspiration"
    },
    {
        quote: "Life is 10% what happens to us and 90% how we react to it.",
        category: "Motivation"
    },
    {
        quote: "Success usually comes to those who are too busy to be looking for it.",
        category: "Success"
    },
    {
        quote: "Do not watch the clock. Do what it does. Keep going.",
        category: "Perseverance"
    },
    {
        quote: "Your time is limited, don't waste it living someone else's life.",
        category: "Life"
    },
    {
        quote: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
        category: "Individuality"
    },
    {
        quote: "Happiness is not something ready-made. It comes from your own actions.",
        category: "Happiness"
    },
    {
        quote: "The only limit to our realization of tomorrow is our doubts of today.",
        category: "Potential"
    },
    {
        quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        category: "Resilience"
    },
    {
        quote: "In the end, we will remember not the words of our enemies, but the silence of our friends.",
        category: "Friendship"
    }
];


function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    const randomQoute = quotes[randomIndex].quote
    qouteDiv.textContent = randomQoute
}


function createAddQuoteForm() {
    const qoute = newQouteText.value.trim()
    const category = newQouteCategory.value.trim()
    if (qoute === "" || category === "") {
        alert("Kindly enter a qoute and it's category")
    } else {
        quotes.push({ qoute, category })
    }
}