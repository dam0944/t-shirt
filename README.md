# Hally T-Shirt Landing Page

A polished single-page fashion landing page for a t-shirt brand, built with plain HTML, CSS, and JavaScript. The experience uses GSAP-powered animations for a premium, interactive product showcase with colorway switching, drag gestures, and responsive layout behavior.

## Overview

This project presents a modern e-commerce-style hero section for a clothing collection. It includes:

- Animated product colorway switching
- Draggable garment interaction
- Keyboard and button navigation
- Responsive design for tablet and mobile screens
- Reduced-motion accessibility support
- Premium editorial styling using Google Fonts and layered UI treatments

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- GSAP (GreenSock Animation Platform)
- Google Fonts

## Project Structure

```text
project/
├── index.html        # Page layout and CDN script imports
├── style.css         # Theme, layout, and responsive styling
├── main.js           # Product data, interactions, and GSAP animation logic
├── picture/          # Product image assets
└── README.md         # Project documentation
```

## Features

### Product showcase
The landing page highlights a premium t-shirt collection with alternating color themes. Each item includes a name, a background color, and an associated product image.

### Animated transitions
The product card uses GSAP transitions to animate:

- Background color changes
- Product entrance and exit motion
- Shadow and tilt effects
- Idle floating motion for the clothing mockups

### Interaction controls
Users can:

- Switch colors with the dot navigation
- Move between products using previous/next buttons
- Use left/right arrow keys
- Drag the displayed garment to create a tactile motion effect
- Scroll or swipe to move between product options

### Accessibility
The app checks for reduced-motion preferences and disables some animation-heavy behavior when needed. Buttons and controls include accessible labels.

## Run Locally

Because this is a static front-end project, you can run it with a simple local web server:

```bash
cd /path/to/project
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

You can also open `index.html` directly in a browser, but using a local server is recommended for a more consistent experience.

## Customization

The product data lives in `main.js` in the `data` array. You can update the following for each item:

- `name`
- `image`
- `bg`
- `textMode`

Example:

```js
{ name: 'Bloom', image: 'picture/t-shirt-5.png', bg: '#9d1c52', textMode: 'light' }
```

Update the image paths or add more entries to expand the collection.

## Notes

- This project relies on CDN-hosted GSAP and Google Fonts.
- An internet connection is required for the scripts and fonts to load successfully.
- The design is intentionally stylized and is best suited as a concept landing page or mock storefront.

## License

This project is provided for educational/demo purposes and does not include a formal license unless otherwise specified by the author.
