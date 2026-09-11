# BLINKNECK Codebase Guide
*A complete breakdown of how this project works, designed for learning from the ground up.*

---

## 1. The Big Picture: What Are We Building?
BLINKNECK is a landing page and mock API for a Web3 (crypto) product that allows users to create **Trustless Escrows** using **Solana Blinks**. 

A "Blink" (Blockchain Link) turns a complex blockchain transaction into a simple shareable link that people can click and sign directly inside Twitter/X or Discord. This website serves as the marketing front-door, explaining the product, showing visual mockups, and providing a working form to generate these links.

---

## 2. The Tech Stack: What & Why?
We deliberately chose a **Vanilla (Zero-Framework)** stack for the frontend, combined with a lightweight backend.

### Frontend: HTML5, CSS3, Vanilla JavaScript
* **What it is:** The raw languages of the web. No React, no Vue, no Tailwind, no bundlers (like Webpack or Vite).
* **Why we used it:** 
  - **Speed & Simplicity:** Without a heavy framework, the site loads instantly. 
  - **Direct Control:** We have pixel-perfect control over every animation (like the scrolling stats and the grid overlay).
  - **No Build Step:** You don't have to "compile" the frontend code. You save the file, refresh the browser, and see the changes immediately.

### Backend: Node.js & Express.js
* **What it is:** Node.js lets us run JavaScript on the server. Express is a minimal framework that makes setting up a web server incredibly easy.
* **Why we used it:** 
  - **Unified Language:** We write JavaScript on both the frontend and backend.
  - **Static Serving:** Express effortlessly serves our `public` folder to the browser.
  - **API Creation:** It allows us to easily create a `/api/escrow/create` endpoint to handle the form submission.

---

## 3. Directory Structure

Here is how the project is organized. It follows a classic, clean separation of concerns:

```text
BLinkNeckWebsite/
├── package.json         # Lists project dependencies (like Express)
├── server.js            # The backend brain (Node/Express server)
└── public/              # Everything sent to the user's browser
    ├── index.html       # The structure and content (The Skeleton)
    ├── css/
    │   └── styles.css   # The visual design (The Skin)
    ├── js/
    │   └── app.js       # The interactivity (The Muscles)
    └── assets/
        └── logo.png     # Images and media
```

---

## 4. Deep Dive: How the Frontend Works

### A. The HTML (`public/index.html`)
HTML provides the semantic skeleton. If you look at the file, you'll notice we use tags that describe their content:
* `<nav>` for the navigation bar.
* `<section>` for distinct parts of the page (Hero, Why Us, Security).
* `<footer>` for the bottom links.

**The "ID" and "Class" System:**
* `id="hero"`: IDs are unique. We use them as anchor targets so when you click a link like `<a href="#hero">`, the browser scrolls there.
* `class="btn-primary"`: Classes are reusable. We apply this to any button we want to look like our primary red button.

### B. The CSS (`public/css/styles.css`)
CSS paints the HTML. We used several modern techniques here:

**1. CSS Variables (`:root`)**
At the very top, you'll see variables like `--clr-red: #b91c1c;`. 
* *Why?* If we ever want to change the red to blue, we change it in *one* place, and the entire site updates instantly.

**2. Flexbox & CSS Grid**
* **Flexbox** (`display: flex;`) is used for 1-dimensional layouts (like the row of links in the navbar).
* **CSS Grid** (`display: grid;`) is used for 2-dimensional layouts (like the 3-column "Why Us" cards).

**3. Advanced Backgrounds & Masks**
In the `.hero-bg`, we use `radial-gradient` to create soft glowing lights behind the UI. We also use `-webkit-mask-image` on the grid overlay to make the sharp grid lines smoothly fade into darkness at the edges.

**4. Media Queries (`@media`)**
At the bottom of the file, we check the screen width. If the screen is under `900px` (a tablet/phone), we hide the desktop links and show the hamburger menu.

### C. The JavaScript (`public/js/app.js`)
JavaScript makes the page "alive". Let's break down the key features:

**1. The Utility Helpers**
```javascript
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
```
Instead of typing `document.querySelector('.my-class')` a hundred times, we created shorthand functions `$` (find one) and `$$` (find all).

**2. Scroll Spy (Active Links)**
We listen to the `window.addEventListener('scroll')` event. As the user scrolls, we check which `<section>` is currently on the screen. We then find the matching navigation link and add an `.active` CSS class to it, which turns the text red.

**3. Intersection Observer (Scroll Reveal & Stats)**
```javascript
const observer = new IntersectionObserver(...)
```
Instead of constantly checking scroll positions (which is slow), we use `IntersectionObserver`. It asks the browser: *"Tell me the exact millisecond this element enters the screen."*
* When a card enters the screen, we add a `.visible` class, and CSS smoothly fades it up.
* When the stats enter the screen, we trigger a math function that animates the numbers from 0 up to their target (like $2.4M).

**4. Handling the Form (`fetch`)**
When you submit the modal form:
1. We prevent the page from reloading (`e.preventDefault()`).
2. We grab the data from the inputs.
3. We use `fetch('/api/escrow/create', { method: 'POST', ... })` to silently send that data to our backend server.
4. We await the response, and show the user their new Blink link.

---

## 5. Deep Dive: How the Backend Works

### The Server (`server.js`)
This is a standard Express.js application. It does three main jobs:

**1. Serve Static Files**
```javascript
app.use(express.static(path.join(__dirname, 'public')));
```
This line tells Express: *"If a user asks for `styles.css` or `logo.png`, look inside the `public` folder and give it to them."*

**2. Parse Incoming Data**
```javascript
app.use(express.json());
```
When our frontend sends JSON data (from the escrow form), this line translates it into a JavaScript object (`req.body`) so the server can read it.

**3. API Endpoints**
```javascript
app.post('/api/escrow/create', (req, res) => { ... })
```
This is the "receiver" for our frontend form. When it gets the data, it:
1. Validates that an amount and recipient exist.
2. Uses Node's built-in `crypto` library to generate a random mock ID (`e7f23a...`).
3. Sends a JSON response (`res.json(escrow)`) back to the frontend containing the final shareable URL.

**4. SPA Fallback (Catch-All)**
```javascript
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```
Because this is a Single Page Application (SPA) structure, if a user somehow navigates to `localhost:3000/random-page`, the server just gives them `index.html` so the site doesn't break with a 404 error.
