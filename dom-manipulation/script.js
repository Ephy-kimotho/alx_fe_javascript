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
      text: "The best way to predict the future is to invent it.",
      category: "Inspiration"
    },
    {
      text: "Life is 10% what happens to us and 90% how we react to it.",
      category: "Motivation"
    },
    {
      text: "Success usually comes to those who are too busy to be looking for it.",
      category: "Success"
    },
    {
      text: "Do not watch the clock. Do what it does. Keep going.",
      category: "Perseverance"
    },
    {
      text: "Your time is limited, don't waste it living someone else's life.",
      category: "Life"
    },
    {
      text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
      category: "Individuality"
    },
    {
      text: "Happiness is not something ready-made. It comes from your own actions.",
      category: "Happiness"
    },
    {
      text: "The only limit to our realization of tomorrow is our doubts of today.",
      category: "Potential"
    },
    {
      text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
      category: "Resilience"
    },
    {
      text: "In the end, we will remember not the words of our enemies, but the silence of our friends.",
      category: "Friendship"
    }
  ];
  


function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    const randomQoute = quotes[randomIndex].text
    qouteDiv.innerHTML = `<p>${randomQoute}</p>`
}


function createAddQuoteForm() {
    const text = newQouteText.value.trim()
    const category = newQouteCategory.value.trim()
    if (text === "" || category === "") {
        alert("Kindly enter a qoute and it's category")
    } else {
        quotes.push({ text, category })
    }
}