# Copilot Instructions for GitHub Copilot for this project: Momentum Logistics Service

## About the Project

Momentum Logistics Service is a comprehensive logistics management system designed to streamline and optimize the
operations of logistics companies. The system provides features such as shipment tracking, inventory management, route
optimization, and real-time analytics.

## Technologies Used

- Backend: Node.js, Express.js
- Frontend: React.js, Next.js
- Database: PostgreSQL

## Coding Standards

- Follow JavaScript ES6+ standards.
- Use meaningful variable and function names.
- Write modular and reusable code.
- Include comments and documentation for complex logic.
- Adhere to RESTful API design principles for backend development.
- For local modules always use the alias `@/` to import them.

## Workflows

- For new features, make sure it's on a new branch and not `main` and name it according to the feature being
  implemented.
- Start by creating a detailed plan or outline of the feature.
- Break down the feature into smaller tasks or components.
- After Implement a feature, run typescript and eslint checks to ensure code quality.
- Update `changelog.md` with a summary of changes made. using the following format:
    ```
    ### [version code: 1.0.0] - YYYY-MM-DD - Short description of changes
    - Then list of changes:
    - Added: New feature or functionality
    - Changed: Updates to existing features
    - Fixed: Bug fixes
    - Removed: Deprecated features
    - **Some can be in big details**: Like this one 
        - Sub-detail of the change
  ```
- Always check if the server is running before deciding to start the server again.
- Always check if a component or module already exists before creating a new one, like a button, input field, etc.
- Follow the tailwind code standards for styling components.
- Use the `brand` colors defined in the tailwind config `(global.css)` for consistency.

## Code Style

- DO NOT use gradients for styles. (try to use solid colors from the brand colors defined in tailwind config)
- Use Tailwind CSS for styling components.
- Ensure responsiveness across different devices and screen sizes.
- Use Flexbox and Grid layouts for structuring components.
- Maintain consistent spacing, padding, and margins using Tailwind's utility classes.
- Use Tailwind's typography utilities for text styling.
- Avoid inline styles; prefer Tailwind classes for styling.
