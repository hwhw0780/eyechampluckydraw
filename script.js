let hasFlipped = false; // Track if the user has already picked a card
let userName = '';
let userPhone = '';
let cards; // Declare cards globally but initialize later

// Set the probabilities for each prize in percentages (must add up to 100)
const prizeProbabilities = [0, 0, 0.1, 15.9, 40, 31]; // Example: 1% for first, 3% for second, etc.

// Corresponding prizes for the images (you can map this to your images like '7.png', '8.png', etc.)
const prizes = [
    { imgSrc: '7.png', altText: 'iPhone 15 Pro Max' },  // 1% chance
    { imgSrc: '8.png', altText: 'Mac Book Pro' }, // 3% chance
    { imgSrc: '9.png', altText: '$1010 Voucher' },          // 10% chance
    { imgSrc: '10.png', altText: '$101,0 Voucher' },         // 15% chance
    { imgSrc: '11.png', altText: '$10,10 Voucher' },            // 20% chance
    { imgSrc: '12.png', altText: 'Thanks for playing' }   // 51% chance
];

function startGame() {
    userName = document.getElementById('name').value;
    userPhone = document.getElementById('phoneNumber').value;

    if (userName && userPhone) {
        document.getElementById('form-container').style.display = 'none';
        document.getElementById('cards-container').style.display = 'flex';

        // Now that the cards are visible, select them
        cards = document.querySelectorAll('.card'); // Get all card elements

        // Attach event listeners to the cards for flipping
        cards.forEach((card, index) => {
            card.addEventListener('click', () => confirmCardSelection(card, index + 1)); // Pass card index +1 for user-friendly numbering
        });
    } else {
        alert('Please enter both name and phone number.');
    }
}

// Confirmation dialog before flipping a card
function confirmCardSelection(card, cardNumber) {
    // Get the front image source (or any identifier) for the confirmation message
    const cardImage = card.querySelector('.card-front img').src.split('/').pop(); // Get the image file name

    const confirmation = confirm(`Are you sure you want to pick box ${cardNumber} (which is ${cardImage})?`);

    // Only proceed to flip the card if the user confirms
    if (confirmation) {
        flipCard(card); // If user confirms, flip the card
    }
}

function flipCard(card) {
    if (hasFlipped) return; // Stop if a card has already been flipped
    if (card.classList.contains('flipped')) return; // Prevent double flipping of the same card

    // Flip the selected card
    card.classList.add('flipped');
    card.classList.add('highlight'); // Highlight the selected card
    hasFlipped = true; // Mark that a card has been flipped

    // Determine the prize based on probabilities
    const prize = choosePrizeWithProbability();

    // Update the card's back image to show the correct prize image
    card.querySelector('.card-back img').src = prize.imgSrc;
    card.querySelector('.card-back img').alt = prize.altText;

    // Display the user's greeting message after the flip
    showGreeting(userName, userPhone, prize.altText);

    // After 3 seconds, flip all the other cards
    setTimeout(() => {
        flipAllCards();
    }, 3000);
}

// Weighted random selection of a prize
function choosePrizeWithProbability() {
    let cumulativeProbability = 0;
    const randomNum = Math.random() * 100; // Generate a random number between 0 and 100

    for (let i = 0; i < prizeProbabilities.length; i++) {
        cumulativeProbability += prizeProbabilities[i];
        if (randomNum <= cumulativeProbability) {
            return prizes[i]; // Return the selected prize
        }
    }
}

function flipAllCards() {
    cards.forEach(card => {
        // Flip cards if they aren't already flipped
        if (!card.classList.contains('flipped')) {
            card.classList.add('flipped');
        }
    });
}

function showGreeting(name, phone, prize) {
    const greetingMessage = `Congratulations, ${name} (${phone})! You have won: ${prize}`;
    document.getElementById('greetingMessage').textContent = greetingMessage;
    document.getElementById('greeting').style.display = 'block'; // Show the greeting
}