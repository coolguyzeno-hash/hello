# Personal Website

A modern, responsive personal website built with vanilla HTML, CSS, and JavaScript. Clean design with smooth animations and mobile-first approach.

## Features

- **Responsive Design** - Looks great on all devices (mobile, tablet, desktop)
- **Modern CSS** - Uses CSS Grid, Flexbox, and custom properties
- **Smooth Animations** - Intersection Observer API for scroll animations
- **Mobile Navigation** - Hamburger menu for mobile devices
- **Smooth Scrolling** - Navigation with smooth scroll behavior
- **Performance Optimized** - Lightweight with no external dependencies
- **Accessibility** - Semantic HTML and keyboard navigation support

## Sections

- **Hero** - Introduction with call-to-action buttons
- **About** - Personal background and skills showcase
- **Projects** - Portfolio of featured work
- **Contact** - Contact information and links

## Technologies Used

- HTML5 (Semantic markup)
- CSS3 (Grid, Flexbox, Custom Properties, Animations)
- Vanilla JavaScript (ES6+)
- SVG (Custom illustrations)

## Getting Started

1. **Clone or download** this repository
2. **Customize** the content in `index.html`:
   - Replace "Your Name" with your actual name
   - Update the hero section with your title and description
   - Add your personal information in the about section
   - Replace project placeholders with your actual projects
   - Update contact information with your details
3. **Customize** colors and styling in `style.css` if desired
4. **Open** `index.html` in your browser or deploy to a web server

## Customization

### Personal Information
Update these sections in `index.html`:
- Hero title and subtitle
- About section text and skills
- Project cards with your actual projects
- Contact information and social links

### Colors and Styling
Modify CSS custom properties in `style.css`:
```css
:root {
    --primary-color: #6366f1;    /* Main brand color */
    --secondary-color: #10b981;  /* Accent color */
    --text-primary: #1f2937;     /* Main text color */
    /* ... other variables */
}
```

### Adding Projects
Each project card follows this structure:
```html
<div class="project-card">
    <div class="project-image">
        <!-- Add your project image or keep placeholder -->
    </div>
    <div class="project-content">
        <h3>Project Name</h3>
        <p>Project description...</p>
        <div class="project-tech">
            <span>Technology 1</span>
            <span>Technology 2</span>
        </div>
        <div class="project-links">
            <a href="#" class="btn btn-small">Live Demo</a>
            <a href="#" class="btn btn-small btn-outline">GitHub</a>
        </div>
    </div>
</div>
```

## Deployment

This website can be deployed to any static hosting service:

### GitHub Pages
1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Select source branch (usually `main`)
4. Your site will be available at `https://yourusername.github.io/repository-name`

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command to: (leave empty for static sites)
3. Set publish directory to: (leave empty or set to `/`)
4. Deploy

### Vercel
1. Import your project from GitHub
2. Configure build settings (usually auto-detected)
3. Deploy

## File Structure

```
├── index.html          # Main HTML file
├── style.css           # Stylesheet with all styling
├── script.js           # JavaScript for interactions
└── README.md           # This file
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Lightweight (~15KB total)
- No external dependencies
- Optimized CSS and JavaScript
- Mobile-first responsive design
- Smooth 60fps animations

## Contributing

Feel free to fork this project and make it your own! If you have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Note**: Remember to replace all placeholder content with your actual information before deploying your website!